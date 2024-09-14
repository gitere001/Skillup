import { promises as fs, readFile } from 'fs';
import path from 'path';
import User from '../modules/users.js';
import Course from '../modules/course.js';
import Lesson from '../modules/lesson.js';
import redisClient from '../storage/redis.js';
import { validate as isUuid } from 'uuid';

class FileController {
    static async getUser(req) {
        const token = req.header('X-Token');
        const key = `auth_${token}`;
        const userId = await redisClient.get(key);

        if (!userId) {
            return null;
        }

        const user = await User.findOne({ where: { id: userId } });
        if (!user) {
            return null;
        }
        return user;
    }

    static async createNewCourse(req, res) {
        const user = await FileController.getUser(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { topic, description, category } = req.body;

        const existingCourse = await Course.findOne({
            where: { expertId: user.id, topic, category, status: 'draft' }
        });
        if (existingCourse) {
            return res.status(409).json({ error: 'Course already exists' });
        }

        const newCourse = await Course.create({
            expertId: user.id,
            topic,
            description,
            category,
            coursePath: null,
            status: 'draft'
        });
        const folderPath = path.join(path.resolve(), 'courses', newCourse.id.toString());

        try {
            await fs.mkdir(folderPath, { recursive: true });
            newCourse.coursePath = folderPath;
            await newCourse.save();
            return res.status(201).json({ courseId: newCourse.id });
        } catch (err) {
            console.error('Error creating folder:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
    static async addLesson(req, res) {
        try {
            // Ensure the user is authenticated
            const user = await FileController.getUser(req);
            if (!user) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Extract fields and files
            const { title, description } = req.fields;
            const { courseId } = req.params;
            const files = req.files;

            // Convert title and description to strings if they're arrays
            const titleStr = Array.isArray(title) ? title[0] : title;
            const descriptionStr = Array.isArray(description) ? description[0] : description;

            // Find the course
            const course = await Course.findOne({ where: { id: courseId, expertId: user.id } });
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            // Create the lesson
            const newLesson = await Lesson.create({
                courseId,
                title: titleStr,
                description: descriptionStr || null,
                contentPath: null,
                videoPath: null
            });

            // Create lesson directory
            const lessonPath = path.join(path.resolve(), 'courses', courseId, newLesson.id.toString());
            await fs.mkdir(lessonPath, { recursive: true });

            // Handle content file if provided
            if (files.content) {
                const originalFilename = files.content[0].originalFilename;

                const filePath = files.content[0].filepath;
                const contentPath = path.join(lessonPath, originalFilename);
                await fs.rename(filePath, contentPath);
                newLesson.contentPath = path.join('courses', courseId, newLesson.id.toString(), originalFilename);

            }

            // Handle video file if provided
            if (files.video) {
                const videoPath = path.join(lessonPath, 'video.mp4');
                await fs.rename(files.video[0].filepath, videoPath);
                newLesson.videoPath = path.join('courses', courseId, newLesson.id.toString(), 'video.mp4');

            }

            // Save the updated lesson
            await newLesson.save();

            // Respond with the new lesson ID
            return res.status(201).json({ lessonId: newLesson.id });
        } catch (error) {
            console.error('Error creating lesson:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }


    static async getUserCourses(req, res) {
        const user = await FileController.getUser(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const courses = await Course.findAll({ where: { expertId: user.id } });
        return res.status(200).json({ courses });
    }
    static async deleteLesson(req, res) {
        const user = await FileController.getUser(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { courseId, lessonId } = req.params;

        // Find the course and check if it exists and is in draft status
        const course = await Course.findOne({ where: { id: courseId, expertId: user.id, status: 'draft' } });
        if (!course) {
            return res.status(404).json({ error: 'Course not found or not in draft status' });
        }

        if (!isUuid(lessonId)) {
            return res.status(400).json({ error: 'Invalid lesson ID' });
        }


        // Find the lesson to be deleted
        const lesson = await Lesson.findOne({ where: { id: lessonId, courseId } });
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        // Delete the lesson from the database
        await Lesson.destroy({ where: { id: lessonId } });

        // Delete the lesson files from the file system
        const lessonPath = path.join(path.resolve(), 'courses', courseId, lessonId.toString());
        try {
            await fs.rm(lessonPath, { recursive: true, force: true });
        } catch (err) {
            console.error('Error deleting lesson files:', err);
            return res.status(500).json({ error: 'Error deleting lesson files' });
        }

        return res.status(200).json({ message: 'Lesson deleted successfully' });
    }
    static async getLessonsByCourse(req, res) {
        const user = await FileController.getUser(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { courseId } = req.params;

        // Check if the course exists and belongs to the user
        const course = await Course.findOne({ where: { id: courseId, expertId: user.id } });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Fetch lessons associated with the course
        const lessons = await Lesson.findAll({
             where: { courseId },
             order: [['createdAt', 'ASC']]
            });

        if (!lessons.length) {
            return res.status(404).json({ error: 'No lessons found for this course' });
        }

        return res.status(200).json({ lessons });
    }
    static async updateLesson(req, res) {
        const user = await FileController.getUser(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { courseId, lessonId } = req.params;
        const { title, description, content } = req.fields;
        const files = req.files;

        // Check if the course exists and belongs to the user
        const course = await Course.findOne({ where: { id: courseId, expertId: user.id } });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Ensure the course is in 'draft' status
        if (course.status !== 'draft') {
            return res.status(403).json({ error: 'Lesson can only be updated while the course is in draft status.' });
        }

        // Check if the lesson exists
        const lesson = await Lesson.findOne({ where: { id: lessonId, courseId } });
        if (!lesson) {
            return res.status(404).json({ error: 'Lesson not found' });
        }

        const lessonPath = path.join(path.resolve(), 'courses', courseId, lessonId);

        // Update title and description if provided
        if (title) {
            lesson.title = title;
        }
        if (description !== undefined) {
            lesson.description = description;
        }

        // Update content if provided
        if (content) {
            const contentFilePath = path.join(lessonPath, 'content.md');
            await fs.writeFile(contentFilePath, content);
            lesson.contentPath = contentFilePath.replace(`${path.resolve()}/`, '');
        } else if (lesson.contentPath && content === null) {
            // Remove content if null is sent
            const contentFilePath = path.join(lessonPath, 'content.md');
            if (await fs.stat(contentFilePath).catch(() => false)) {
                await fs.unlink(contentFilePath);
            }
            lesson.contentPath = null;
        }

        // Update video if provided
        if (files && files.video) {
            const videoFilePath = path.join(lessonPath, 'video.mp4');
            if (lesson.videoPath && (await fs.stat(path.join(path.resolve(), lesson.videoPath)).catch(() => false))) {
                await fs.unlink(path.join(path.resolve(), lesson.videoPath)); // Remove old video file
            }
            await fs.rename(files.video.path, videoFilePath);
            lesson.videoPath = videoFilePath.replace(`${path.resolve()}/`, '');
        } else if (lesson.videoPath && files && files.video === null) {
            // Remove video if null is sent
            const videoFilePath = path.join(lessonPath, 'video.mp4');
            if (await fs.stat(videoFilePath).catch(() => false)) {
                await fs.unlink(videoFilePath);
            }
            lesson.videoPath = null;
        }

        // Save the updated lesson
        await lesson.save();

        return res.status(200).json({ message: 'Lesson updated successfully', lesson });
    }
    static async deleteCourse(req, res) {
        const user = await FileController.getUser(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { courseId } = req.params;
        const course = await Course.findOne({ where: { id: courseId, expertId: user.id } });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        if (course.status !== 'draft' && course.status !== 'rejected') {
            return res.status(403).json({ error: 'Course can only be deleted while it is in draft status or rejected.' });
        }

        await Course.destroy({ where: { id: courseId } });

        const coursePath = path.join(path.resolve(), 'courses', courseId.toString());
        try {
            await fs.rm(coursePath, { recursive: true, force: true });
            return res.status(200).json({ message: 'Course deleted successfully' });
        } catch (err) {
            console.error('Error deleting course folder:', err);
            return res.status(500).json({ error: 'Failed to delete course folder' });
        }

    }
}

export default FileController;
