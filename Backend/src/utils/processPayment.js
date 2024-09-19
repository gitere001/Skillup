import { v4 as uuidv4 } from 'uuid';

// SkillUp paybill number
const PAYBILL_NUMBER = '123456';

// Simulated response data
const simulatePaymentResponse = (orderId, totalAmount) => {
    return {
        paybillNumber: PAYBILL_NUMBER,
        accountReference: orderId,
        amount: totalAmount,
        status: 'success',
        paymentId: uuidv4(),
        transactionDate: new Date().toISOString(),
        message: 'Payment processed successfully',
    };
};

export const processPayment = async (amount, orderId) => {
    try {
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Generate simulated response
        const responseData = simulatePaymentResponse(orderId, amount);

        // Return simulated response data
        return responseData;
    } catch (error) {
        console.error('Payment processing error:', error);
        throw new Error('Payment processing failed');
    }
};

export default processPayment;