import User from "../modules/users.js";
import Course from "../modules/course.js";
import UserPurchasedCourse from "../modules/purchasedCourse.js";
import FileController from "./FileController.js";
import welcomeNote from "../utils/customWelcome.js";
import { validate as isUuid } from "uuid";
import Lesson from "../modules/lesson.js";
import { Op } from "sequelize";

class LearnerController {
	/**
	 * Returns a welcome note for the authenticated learner.
	 * @param {Object} req - The request object containing headers.
	 * @param {Object} res - The response object.
	 * @returns {Object} - JSON response with the welcome note or an error.
	 */
	static async getWelcomeNote(req, res) {
		try {
			const user = await FileController.getUser(req);
			if (!user) {
				return res.status(401).json({ error: 'Unauthorized' });
			}
			const response = await welcomeNote(user)
			return res.status(200).json({ response });
        } catch (error) {
            console.error('Error fetching welcome note:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
	/**
	 * Fetches the available courses that are approved and can be purchased.
	 * @param {Object} req - The request object containing query parameters.
	 * @param {Object} res - The response object.
	 * @returns {Object} - JSON response containing the list of available courses, hasMore flag, limit, and offset, or an error.
	 */
	static async getAvailableCourses(req, res) {


	try {
		const {limit = 10, offset = 0} = req.query;
		const user = await FileController.getUser(req);
		if (!user) {
			return res.status(401).json({ error: 'Unauthorized' });
		}

		const courses = await Course.findAll({
			where: { status: 'approved' },
			limit: parseInt(limit),
			offset: parseInt(offset)
		});
		const hasMore = courses.length === parseInt(limit);

		return res.status(200).json({
			courses: courses,
			hasMore,
			limit: parseInt(limit),
			offset: parseInt(offset)
		});


	} catch (error) {
		console.error('Error fetching available courses:', error);
		return res.status(500).json({ error: 'An error occurred while fetching available courses.' });

	}
}
        /**
         * Searches for courses by topic and returns a list of courses that are approved and match the search query.
         * @param {Object} req - The request object containing query parameters.
         * @param {string} req.query.query - The search query to filter courses by topic.
         * @param {string} req.query.limit - The limit of courses to fetch. Defaults to 10.
         * @param {string} req.query.offset - The offset of courses to fetch. Defaults to 0.
         * @param {Object} res - The response object.
         * @returns {Object} - JSON response containing the list of courses, hasMore flag, limit, and offset, or an error.
         */
static async searchCourse(req, res) {
    const user = await FileController.getUser(req);
    if (!user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    try {
        const { query, limit = 10, offset = 0 } = req.query; // Get limit and offset from query params
        const courses = await Course.findAll({
            where: {
                topic: {
                    [Op.iLike]: `%${query}%`
                },
                status: 'approved'
            },
            limit: parseInt(limit), // Apply limit
            offset: parseInt(offset) // Apply offset
        });

        const hasMore = courses.length === parseInt(limit);

        return res.status(200).json({
            courses,
            hasMore,
            limit: parseInt(limit),
            offset: parseInt(offset)
        });
    } catch (error) {
        console.error('Error searching courses:', error);
        return res.status(500).json({ error: 'An error occurred while searching courses.' });
    }
}
        /**
         * Fetches the list of courses purchased by the authenticated user.
         * @param {Object} req - The request object containing headers.
         * @param {Object} res - The response object.
         * @returns {Object} - JSON response containing the list of purchased courses, or an error.
         */
static async getLearnerPurchasedCourses(req, res) {
	const user = await FileController.getUser(req);
	if (!user) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
	try {
		const purchasedCourses = await UserPurchasedCourse.findAll({
			where: {
				userId: user.id
			},
		});
		const courseIds = purchasedCourses.map(purchasedCourse => purchasedCourse.courseId);
		const courses = await Course.findAll({
			where: {
				id: courseIds
			},
			order: [['createdAt', 'DESC']],
		})
		return res.status(200).json({ courses });

	} catch (error) {
		console.error('Error fetching purchased courses:', error);
		return res.status(500).json({ error: 'An error occurred while fetching purchased courses.' });

	}
}

        /**
         * Fetches the list of lessons for a given course ID.
         * @param {Object} req - The request object containing parameters.
         * @param {Object} res - The response object.
         * @returns {Object} - JSON response containing the list of lessons, or an error.
         * @throws {Unauthorized} - If the user is not an authenticated learner.
         * @throws {BadRequest} - If the course ID is not provided or is invalid.
         * @throws {InternalServerError} - If there is an error fetching the lessons.
         */
static async getLessonsBasedOnCourseId (req, res) {

	const user = await FileController.getUser(req);
	if (!user) {
		return res.status(401).json({ error: 'Unauthorized' });
	}
	const { courseId } = req.params;
	if (!courseId) {
		return res.status(400).json({ error: 'Course ID is required' });
	}
	if (!isUuid(courseId)) {
		return res.status(400).json({ error: 'Invalid course ID' });
	}

	try {
		const lessons = await Lesson.findAll({ where: { courseId } });
		return res.status(200).json({ lessons });
	} catch (error) {
		console.error('Error fetching lessons:', error);
		return res.status(500).json({ error: 'An error occurred while fetching lessons.' });
	}

}


}

export default LearnerController;