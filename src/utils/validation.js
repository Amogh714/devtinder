const validator=require("validator")

const validationatsignup=(req)=>{
    const {firstName,lastName,emailId,password}=req.body;
    if(firstName===""||lastName===""){
        throw new Error("name is invalid please write a valid name");
    }
    else if(!validator.isEmail(emailId)){
        throw new Error("email is invalid");
    }
    else if(!validator.isStrongPassword(password)){
        throw new Error("please enter a strong password");
    }
}
const updateProfileValidation=(req)=>{
    const appendablefeilds=[
        "firstName",
        "lastName",
        "age",
        "gender",
        "photourl",
        "about",
        "skills",
    ];
    const isvalidate=Object.keys(req.body).every((feilds)=>appendablefeilds.includes(feilds));

    return isvalidate;
}

module.exports={validationatsignup,updateProfileValidation};
