import Admin from "../modules/admin.js";
import Course from "../modules/course.js";
import { validate as isUuid } from "uuid";
import redisClient from "../storage/redis.js";
import welcomeNote from "../utils/customWelcome.js";

/**
 * CourseReviewController class to manage course reviews and approvals.
 */
class CourseReviewController {

    /**
     * Retrieves the admin details from the request header token.
     * @param {Object} req - The request object containing headers.
     * @returns {Promise<Object|null>} - Returns an admin object if found, otherwise null.
     */
    static async getAdmin(req) {
        const token = req.header("X-Token");
        const key = `auth_${token}`;
        const adminId = await redisClient.get(key);
        if (!adminId) {
            return null;
        }

        const admin = await Admin.findOne({ where: { id: adminId } });
        if (!admin) {
            return null;
        }
        return admin;
    }

    /**
     * Returns a welcome note for the authenticated admin.
     * @param {Object} req - The request object containing headers.
     * @param {Object} res - The response object.
     * @returns {Object} - JSON response with the welcome note or an error.
     */
    static async getWelcomeNote(req, res) {
        try {
            const admin = await CourseReviewController.getAdmin(req);
            if (!admin) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const welcome = await welcomeNote(admin);
            return res.status(200).json({ welcome });
        } catch (error) {
            console.error('Error fetching welcome note:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Fetches courses that are under the admin's expertise and pending approval.
     * @param {Object} req - The request object.
     * @param {Object} res - The response object.
     * @returns {Object} - JSON response containing the list of courses or an error.
     */
    static async getCoursesOfAdminExpertise(req, res) {
        try {
            const admin = await CourseReviewController.getAdmin(req);

            if (!admin) {
                return res.status(401).json({ error: "Unauthorized" });
            }

            const courses = await Course.findAll({
                where: {
                    category: admin.category,
                    status: 'pending approval'
                },
                order: [['createdAt', 'ASC']]
            });

            return res.status(200).json({ courses });
        } catch (error) {
            console.error('Error fetching courses:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Approves a course by changing its status to 'approved'.
     * @param {Object} req - The request object containing parameters.
     * @param {Object} res - The response object.
     * @returns {Object} - JSON response with success message or an error.
     */
    static async approveCourse(req, res) {
        try {
            const admin = await CourseReviewController.getAdmin(req);
            if (!admin) {
                return res.status(401).json({ error: 'Unauthorized' });
            }

            const { courseId } = req.params;
            if (!courseId) {
                return res.status(400).json({ error: 'Course ID is required' });
            }

            if (!isUuid(courseId)) {
                return res.status(400).json({ error: 'Invalid course ID' });
            }

            const course = await Course.findOne({ where: { id: courseId } });
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }
            if (course.status !== 'pending approval') {
                return res.status(400).json({ error: 'Course status is not pending approval' });
            }

            course.status = 'approved';
            await course.save();
            return res.status(200).json({ message: 'Course approved successfully' });
        } catch (error) {
            console.error('Error approving course:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }

    /**
     * Rejects a course by changing its status to 'rejected'.
     * @param {Object} req - The request object containing parameters.
     * @param {Object} res - The response object.
     * @returns {Object} - JSON response with success message or an error.
     */
    static async rejectCourse(req, res) {
        try {
            const admin = await CourseReviewController.getAdmin(req);
            if (!admin) {
                return res.status(401).json({ error: 'Unauthorized' });
            }
            const { courseId } = req.params;
            if (!courseId) {
                return res.status(400).json({ error: 'Course ID is required' });
            }

            if (!isUuid(courseId)) {
                return res.status(400).json({ error: 'Invalid course ID' });
            }

            const course = await Course.findOne({ where: { id: courseId } });
            if (!course) {
                return res.status(404).json({ error: 'Course not found' });
            }
            if (course.status !== 'pending approval') {
                return res.status(400).json({ error: 'Course status is not pending approval' });
            }

            course.status = 'rejected';
            await course.save();
            return res.status(200).json({ message: 'Course rejected successfully' });
        } catch (error) {
            console.error('Error rejecting course:', error);
            return res.status(500).json({ error: 'Internal Server Error' });
        }
    }
}

export default CourseReviewController;
