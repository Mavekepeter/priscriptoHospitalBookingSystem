import validator from 'validator';
import bcryptjs from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import doctorModel from '../models/doctorModel.js';
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js';
import userModel from '../models/userModel.js';

const addDoctor = async (req, res) => {
    try {
        const { name, email, password, address, speciality, degree, about, fees, experience } = req.body;
        const imageFile = req.file;

        console.log(req.file); // Check file structure
        console.log(req.body); // Check body data

        // Check if all required data is provided
        if (!name || !email || !password || !address || !speciality || !degree || !about || !fees) {
            return res.json({ success: false, message: "Missing details" });
        }

        // Validate email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" });
        }

        // Validate strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" });
        }

        // Hash doctor password
        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        // Ensure image file is uploaded
        if (!imageFile) {
            return res.json({ success: false, message: "Image file is required" });
        }

        // Upload image to Cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
        const imageUrl = imageUpload.secure_url;

        // Create doctor data
        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            fees,
            experience,
            about,
            address: JSON.parse(address), // Assuming `address` is a JSON string
            date: Date.now()
        };

        // Save doctor data to the database
        const newDoctor = new doctorModel(doctorData);
        await newDoctor.save();

        res.json({ success: true, message: 'Doctor Added' });
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};
// API FOR ADMIN LOGIN
const loginAdmin = async (req,res) =>{
    try {
        const {email,password} = req.body
        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})
        }else{
            res.json({success:false,message:"Invalid credentials"})
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }

}
//API to get all Doctors list for admin list
const allDoctors = async (req,res) =>{
     try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true,doctors})
     } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
     }
}

// Api to get all appointment list

const appointmentsAdmin = async (req,res) =>{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true,appointments})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
//API for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body;
        const appointmentData = await appointmentModel.findById(appointmentId);

        if (!appointmentData) {
            return res.json({ success: false, message: 'Appointment not found' });
        }

        // Releasing doctor's slot
        const { docId, slotDate, slotTime } = appointmentData;
        const doctorData = await doctorModel.findById(docId);

        let slot_booked = doctorData.slot_booked;
        slot_booked[slotDate] = slot_booked[slotDate].filter(e => e !== slotTime);

        // Update doctor's slot_booked in database
        await doctorModel.findByIdAndUpdate(docId, { slot_booked });

        // Mark the appointment as cancelled in the database
        appointmentData.cancelled = true;
        await appointmentData.save();

        res.json({ success: true, message: 'Appointment cancelled' });

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
};

//API to get dashboard data for admin panel

const adminDashboard = async (req,res)=>{
    try {
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})
        const dashData = {
            doctors:doctors.length,
            appointmentss:appointments.length,
            patients:users.length,
            latestAppointment:appointments.reverse().slice(0,5)
        }
        res.json({success:true,dashData})

    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}

export { addDoctor,loginAdmin,allDoctors,appointmentsAdmin,appointmentCancel,adminDashboard};
