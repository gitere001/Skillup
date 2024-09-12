import { promises as fs } from 'fs';
import path from 'path';
import User from '../modules/users.js';
import Course from '../modules/course.js';
import Lesson from '../modules/lesson.js';
import { areSimilar } from '../utils/similarityTest.js';
import redisClient from '../storage/redis.js';
import { title } from 'process';


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

        // Fetch all existing topics for the user
        const existingCourse = await Course.findOne({ where: { expertId: user.id, topic, category, status: 'draft' } });
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
        const user = await FileController.getUser(req);
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized' });
        }
        console.log('got user', user.id)
        const { title, description, content, video } = req.body;
        const { courseId } = req.params;

        const course = await Course.findOne({ where: { id: courseId, expertId: user.id } });
        if (!course) {
            return res.status(404).json({ error: 'Course not found' });
        }
        const newLesson = await Lesson.create({
            courseId,
            title,
            description: description || null,
            contentPath: null,
            videoPath: null

        });
        console.log('new lesson', newLesson)
        const lessonPath = path.join(path.resolve(), 'courses', courseId, newLesson.id.toString());
        await fs.mkdir(lessonPath, { recursive: true });
        if (content) {
            await fs.writeFile(path.join(lessonPath, 'content.md'), content);
            newLesson.contentPath = path.join('courses', courseId, newLesson.id.toString(), 'content.md');
        }
        if (video) {
            await fs.writeFile(path.join(lessonPath, 'video.mp4'), video);
            newLesson.videoPath = path.join('courses', courseId, newLesson.id.toString(), 'video.mp4');
        }

        console.log('new lesson', newLesson)
        await newLesson.save();
        return res.status(201).json({ lessonId: newLesson.id });

    }
}

export default FileController;
