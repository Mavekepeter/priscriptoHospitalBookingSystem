// API for adding doctors
const addDoctor = async(req,res)=>{
    try {
        const {name,email,password,address,speciality,degree,about,fees} = req.body
        const imageFile = req.file
        console.log({name,email,password,address,speciality,degree,about,fees},imageFile);
        
    } catch (error) {
        
    }
}
export{addDoctor}