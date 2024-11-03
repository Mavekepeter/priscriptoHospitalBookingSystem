import doctorModel from "../models/doctorModel.js";
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appointmentModel from "../models/appointmentModel.js";
const changeAvailabity = async (req,res) =>{
    try {
        
        const {docId} = req.body
        const docData = await doctorModel.findById(docId)
        await doctorModel.findByIdAndUpdate(docId,{available: !docData.available})
        res.json({success:true,message:'Availabilty changed'})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
const doctorList = async (req,res)=>{
    try {
        const doctors = await doctorModel.find({}).select(['-password','-email'])
        res.json({success:true,doctors})
    } catch (error) {
        
    }
}
//API for doctor login
const loginDoctor = async (req,res) =>{
    try {
        const {email,password} = req.body
        const doctor = await doctorModel.findOne({email})

        if(!doctor){
            return res,json({success:false,message:'Invalid credentials'})
        }
        const isMatch = await bcrypt.compare(password,doctor.password)
        if (isMatch) {
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRECT)
            res.json({success:true,token})
        }else{
            return res.json({success:false,message:'Invalid credentials'})
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
// api to get doctor appointment for doctor panel
const appointmentsDoctor = async (req,res) =>{
    try {
        
        const {docId} = req.body 
        const appointments = await appointmentModel.find({docId})

        res.json({success:true,appointments})
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: error.message });
    }
}
export{changeAvailabity,doctorList,loginDoctor,appointmentsDoctor}