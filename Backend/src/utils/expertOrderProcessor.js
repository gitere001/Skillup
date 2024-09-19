import Course from '../modules/course.js';
import ExpertPurchasedCourse from '../modules/expertPurchasedCourses.js';

export const processExpertOrders = async (order) => {
    try {
        // Fetch courses for the order
        const courses = await Course.findAll({ where: { id: order.courseIds } });

        // Create records in ExpertPurchasedCourse
        const expertRecords = courses.map(async (course) => {
            const expertId = course.expertId;
            const amount = course.price * 0.80;

            return ExpertPurchasedCourse.create({
                expertId,
                courseId: course.id,
                amount,
                paymentStatus: 'not disbursed'
            });
        });

        await Promise.all(expertRecords);
    } catch (error) {
        console.error('Error processing expert orders:', error);
        throw new Error('Error processing expert orders');
    }
};
