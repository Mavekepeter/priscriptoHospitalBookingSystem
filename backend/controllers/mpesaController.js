import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export const getMpesaToken = async () => {
    const auth = Buffer.from(`${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`).toString('base64');
    
    try {
        const response = await axios.get('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
            headers: { Authorization: `Basic ${auth}` }
        });
        return response.data.access_token;
    } catch (error) {
        console.error('MPesa Token Error:', error.response.data);
        throw new Error('Failed to get MPesa token');
    }
};

export const stkPush = async (req, res) => {
const { phone, amount } = req.body;

const token = await getMpesaToken();
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0'); // Ensure 2 digits
const date = String(now.getDate()).padStart(2, '0');
const hours = String(now.getHours()).padStart(2, '0');
const minutes = String(now.getMinutes()).padStart(2, '0');
const seconds = String(now.getSeconds()).padStart(2, '0');
const timestamp = `${year}${month}${date}${hours}${minutes}${seconds}`;

console.log("Generated Timestamp:", timestamp); // Debugging

    const password = Buffer.from(`${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`).toString('base64');

    const requestBody = {
        BusinessShortCode: process.env.MPESA_SHORTCODE,
        Password: password,
        Timestamp: timestamp,
        TransactionType: 'CustomerPayBillOnline',
        Amount: amount,
        PartyA: 174379,
        PartyB: process.env.MPESA_SHORTCODE,
        PhoneNumber: phone,
        CallBackURL: process.env.MPESA_CALLBACK_URL,
        AccountReference: 'Animal Health Management System',
        TransactionDesc: 'Payment for services'
    };

    try {
        const response = await axios.post('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', requestBody, {
            headers: { Authorization: `Bearer ${token}` }
        });

        res.json({ success: true, message: 'STK Push Sent', data: response.data });
    } catch (error) {
        console.error('STK Push Error:', error.response.data);
        res.json({ success: false, message: 'STK Push Failed', error: error.response.data });
    }
};
export const mpesaCallback = (req, res) => {
    console.log('MPesa Callback:', req.body);

    const { Body } = req.body;
    if (Body.stkCallback.ResultCode === 0) {
        console.log('Payment Successful:', Body.stkCallback.CallbackMetadata);
    } else {
        console.log('Payment Failed:', Body.stkCallback.ResultDesc);
    }

    res.status(200).json({ message: 'Callback received' });
};

