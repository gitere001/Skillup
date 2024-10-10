import { promises as fs, readFile } from 'fs';
import path from 'path';
import User from '../modules/users.js';
import Expert from '../modules/expert.js';
import Course from '../modules/course.js';
import Lesson from '../modules/lesson.js';
import redisClient from '../storage/redis.js';
import { validate as isUuid } from 'uuid';
import welcomeNote from '../utils/customWelcome.js';
import ExpertPurchasedCourse from '../modules/expertPurchasedCourses.js';
import { areSimilar } from '../utils/similarityTest.js';
import { format } from 'date-fns';
import mammoth from 'mammoth';
import { extractFileContent } from '../utils/contentHandler.js';

class FileController {
    /**
     * Retrieves the user object from the request header token.
     * @param {Object} req - The request object containing headers.
     * @returns {Promise<Object|null>} - Returns a user object if found, otherwise null.
     */
    static async getUser(req) {
        let token;
        if (req.headers.cookie) {
            token = req.headers.cookie.split("=")[1];
        } else {
            token = req.headers['x-token']
        }
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
    /**
     * Retrieves the expert object from the request header token.
     * @param {Object} req - The request object containing headers.
     * @returns {Promise<Object|null>} - Returns an expert object if found, otherwise null.
     */
    static async getExpert(req) {
        let token;
        if (req.headers.cookie) {
            token = req.headers.cookie.split("=")[1];
        } else {
            token = req.headers['x-token']
        }

        const key = `auth_${token}`;
        const expertId = await redisClient.get(key);

        if (!expertId) {
            return null;
        }

        const expert = await Expert.findOne({ where: { id: expertId } });
        if (!expert) {
            return null;
        }
        return expert;
    }
    /**
     * Returns a welcome note for the authenticated expert.
     * @param {Object} req - The request object containing headers.
     * @param {Object} res - The response object.
     * @returns {Object} - JSON response with the welcome note or an error.
     */
    static async getWelcomeNote(req, res) {
		try {
			const expert = await FileController.getExpert(req);
			if (!expert) {
				return res.status(401).json({ error: 'Unauthorized' });
			}
			const response = await welcomeNote(expert)
			return res.status(200).json({ response });
        } catch (error) {
            console.error('Error fetching welcome note:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }


    /**
     * Creates a new course for the authenticated expert.
     * @param {Object} req - The request object containing headers and body.
     * @param {Object} res - The response object.
     * @returns {Object} - JSON response with the course ID or an error.
     */
    static async createNewCourse(req, res) {
        const expert = await FileController.getExpert(req);
        if (!expert) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { topic, description, category, price } = req.body;

        const existingCourses = await Course.findAll({
            where: {
                expertId: expert.id,
                status: 'draft'
            },
            attributes: ['topic']
         });
         const availableTopics = existingCourses.map(course => course.topic);
         const topicExists = availableTopics.some(t => areSimilar(t, topic));
        if (topicExists) {
            return res.status(409).json({ error: 'Course already exists' });
        }

        const newCourse = await Course.create({
            expertId: expert.id,
            topic,
            description,
            category,
            price,
            status: 'draft'
        });
        const folderPath = path.join(path.resolve(), 'courses', newCourse.id.toString());

        try {
            await fs.mkdir(folderPath, { recursive: true });
            return res.status(201).json({ message: 'success' });
        } catch (err) {
            console.error('Error creating folder:', err);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        /**
         * Creates a new lesson for a course.
         * @param {Object} req - The request object containing headers, body, and params.
         * @param {Object} res - The response object.
         * @returns {Object} - JSON response with the new lesson ID or an error.
         */
    static async getCourseById(req, res) {
    const expert = await FileController.getExpert(req);
    if (!expert) {
        return res.status(401).json({ error: 'Unauthorized' });
        }
        const courseId = req.params.courseId;
        const course = await Course.findOne({ where: { id: courseId, expertId: expert.id } });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        return res.status(200).json({ course });

    }
    static async addLesson(req, res) {
        try {
            // Ensure the user is authenticated
            const expert = await FileController.getExpert(req);
            if (!expert) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            // Extract fields and files
            const { title, description } = req.body;
            const { courseId } = req.params;
            const files = req.files;

            const course = await Course.findOne({ where: { id: courseId, expertId: expert.id } });
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }
            if (course.status !== 'draft' && course.status !== 'rejected') {
                return res.status(400).json({ error: 'Course is not in draft or rejected status' });
            }

            const availableTitles = await Lesson.findAll({ where: { courseId }, attributes: ['title'] });
            const titleExists = availableTitles.some(lesson => lesson.title.toLowerCase() === title.toLowerCase());
            if (titleExists) {
                return res.status(409).json({ error: 'Lesson already exists' });
            }

            // Create the lesson
            const newLesson = await Lesson.create({
                courseId,
                title,
                description: description || null,
                contentPath: null,
                videoPath: null
            });

            // Create lesson directory
            const lessonPath = path.join(path.resolve(), 'courses', courseId, newLesson.id.toString());
            await fs.mkdir(lessonPath, { recursive: true });

            // Handle content file if provided
            if (files.content && files.content.length > 0) {

                try {
                    const content = await extractFileContent(files.content[0]);
                    if (content.error) {
                        await newLesson.destroy();
                        return res.status(400).json({ error: content.error });
                    }
                    const consistentFilename = `lesson_${newLesson.id}_${Date.now()}.html`;
                    const contentPath = path.join(lessonPath, consistentFilename);


                    // Write the extracted content to a new HTML file
                    await fs.writeFile(contentPath, `<html><body>${content.content}</body></html>`);

                    // Update the lesson object with the new content path
                    newLesson.contentPath = path.join('courses', courseId, newLesson.id.toString(), consistentFilename);
                } catch (error) {
                    return res.status(400).json({ error: error.message });
                }
            }


            // Handle video file if provided
            if (files.video && files.video.length > 0) {
                const videoPath = path.join(lessonPath, 'video.mp4');
                await fs.rename(files.video[0].path, videoPath);
                newLesson.videoPath = path.join('courses', courseId, newLesson.id.toString(), 'video.mp4');
            }


            await newLesson.save();

            // Respond with the new lesson ID
            return res.status(201).json({ message: 'Lesson added successfully!' });
        } catch (error) {
            console.error('Error creating lesson:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }
        /**
         * Updates a lesson given the course ID and lesson ID.
         * Requires authentication, and the course must be in 'draft' or 'rejected' status.
         * @param {Object} req - The request object containing parameters.
         * @param {Object} res - The response object.
         * @returns {Object} - JSON response with success message or an error.
         */
    static async updateLesson(req, res) {
        try {
            // Ensure the user is authenticated
            const expert = await FileController.getExpert(req);
            if (!expert) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { courseId, lessonId } = req.params;
            const { title, description, removeContent, removeVideo } = req.body; // Flags for file removal

            // Check if the course exists and belongs to the user
            const course = await Course.findOne({ where: { id: courseId, expertId: expert.id } });
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }

            // Ensure the course is in 'draft' or 'rejected' status
            if (course.status !== 'draft' && course.status !== 'rejected') {
                return res.status(403).json({ error: 'Lesson can only be updated while the course is in draft or rejected status.' });
            }

            const lesson = await Lesson.findOne({ where: { id: lessonId, courseId } });
            if (!lesson) {
                return res.status(404).json({ error: 'Lesson not found' });
            }

            // Update title and description if provided
            if (title) {
                lesson.title = title;
            }
            if (description !== undefined) {
                lesson.description = description;
            }

            const lessonPath = path.join(path.resolve(), 'courses', courseId, lessonId.toString());

            // Remove content if 'removeContent' flag is set
            if (removeContent && lesson.contentPath) {
                const contentFilePath = path.join(path.resolve(), lesson.contentPath);
                if (await fs.stat(contentFilePath).catch(() => false)) {
                    await fs.unlink(contentFilePath); // Remove the content file
                }
                lesson.contentPath = null; // Clear the path in the database
            }

            // Remove video if 'removeVideo' flag is set
            if (removeVideo && lesson.videoPath) {
                const videoFilePath = path.join(path.resolve(), lesson.videoPath);
                if (await fs.stat(videoFilePath).catch(() => false)) {
                    await fs.unlink(videoFilePath); // Remove the video file
                }
                lesson.videoPath = null; // Clear the path in the database
            }

            // Save the updated lesson
            await lesson.save();

            return res.status(200).json({ message: 'Lesson updated successfully'});
        } catch (error) {
            console.error('Error updating lesson:', error);
            return res.status(500).json({ error: 'Internal server error' });
        }
    }


    /**
     * Returns all courses for the authenticated expert.
     * @param {Object} req - The request object containing headers.
     * @param {Object} res - The response object.
     * @returns {Object} - JSON response with courses or an error.
     */
    static async getExpertCourses(req, res) {
        const expert = await FileController.getExpert(req);
        if (!expert) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const courses = await Course.findAll({
            where: { expertId: expert.id },
            attributes: ['id', 'topic', 'description', 'category', 'price', 'status', 'createdAt'],
            order: [['createdAt', 'DESC']],
        });
        const formattedCourses = courses.map(course => {
            return {
                ...course.get(), // Spread the original course attributes
                createdAt: format(new Date(course.createdAt), 'dd MMMM yyyy') // Format the date
            };
        });
        return res.status(200).json({ courses: formattedCourses });
    }
    /**
     * Returns all courses that have been purchased by learners for the authenticated expert.
     * @param {Object} req - The request object containing headers.
     * @param {Object} res - The response object.
     * @returns {Object} - JSON response with courses or an error.
     */
    static async getExpertPaidCourses(req, res) {
        try {
            const expert = await FileController.getExpert(req);
            if (!expert) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const courses = await ExpertPurchasedCourse.findAll({
                where: { expertId: expert.id }
            });

            return res.status(200).json({ courses });
        } catch (error) {
            console.error('Error fetching expert paid courses:', error);
            return res.status(500).json({ error: 'An error occurred while fetching expert paid courses.' });
        }
    }

    /**
     * Deletes a lesson from a course.
     * @param {Object} req - The request object containing headers and parameters.
     * @param {Object} res - The response object.
     * @returns {Object} - JSON response with success message or an error.
     */
    static async deleteLesson(req, res) {
        const expert = await FileController.getExpert(req);
        if (!expert) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { courseId, lessonId } = req.params;

        // Find the course and check if it exists and is in draft status
        const course = await Course.findOne({ where: { id: courseId, expertId: expert.id, status: 'draft' } });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        if (course.status !== 'draft' && course.status !== 'rejected') {
            return res.status(403).json({ error: 'Lesson cannot be deleted. Not in draft or rejected status' });
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
    /**
     * Fetches lessons associated with the given course ID.
     * @param {Object} req - The request object containing parameters.
     * @param {Object} res - The response object.
     * @returns {Object} - JSON response with the lessons or an error.
     */
    static async getLessonsByCourse(req, res) {
        const expert = await FileController.getExpert(req);
        if (!expert) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { courseId } = req.params;

        // Check if the course exists and belongs to the user
        const course = await Course.findOne({ where: { id: courseId, expertId: expert.id } });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }

        // Fetch lessons associated with the course
        const lessons = await Lesson.findAll({
            where: { courseId },
            order: [['createdAt', 'ASC']],
        });


        if (!lessons.length) {
            return res.status(404).json({ error: 'No lessons found for this course' });
        }

        // Map lessons to the desired format
        const formattedLessons = lessons.map(lesson => ({
            id: lesson.id,
            courseId: lesson.courseId,
            title: lesson.title,
            description: lesson.description || null,
            contentPath: lesson.contentPath, // Ensure this path is correct
            videoPath: lesson.videoPath, // Ensure this path is correct
        }));

        return res.status(200).json({ lessons: formattedLessons });
    }

    /**
     * Submits a course for review.
     * @param {Object} req - The request object containing parameters.
     * @param {Object} res - The response object.
     * @returns {Object} - JSON response with success message or an error.
     * @throws {Unauthorized} - If the user is not an expert.
     * @throws {NotFound} - If the course is not found.
     */
    static async submitCourse(req, res) {
        const expert = await FileController.getExpert(req);
        if (!expert) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const courseId = req.params.courseId;
        const course = await Course.findOne({ where: { id: courseId, expertId: expert.id } });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        const courseLessons = await Lesson.findAll({ where: { courseId } });
        if (courseLessons.length === 0) {
            return res.status(400).json({ error: 'Course must have at least one lesson' });
        }
        if (course.status === 'approved') {
            return res.status(403).json({ error: 'Course already approved' });
        }
        if (course.status === 'pending approval') {
            return res.status(403).json({ error: 'Course already submitted' });
        }
        course.status = 'pending approval';
        await course.save();
        return res.status(200).json({ message: 'Course submitted successfully' });
    }

    /**
     * Deletes a course.
     * @param {Object} req - The request object containing parameters.
     * @param {Object} res - The response object.
     * @returns {Object} - JSON response with success message or an error.
     * @throws {Unauthorized} - If the user is not an expert.
     * @throws {NotFound} - If the course is not found.
     * @throws {Forbidden} - If the course is not in draft or rejected status.
     * @throws {InternalServerError} - If there is an error deleting the course folder.
     */
    static async deleteCourse(req, res) {
        const expert = await FileController.getExpert(req);
        if (!expert) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const { courseId } = req.params;
        const course = await Course.findOne({ where: { id: courseId, expertId: expert.id } });
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
