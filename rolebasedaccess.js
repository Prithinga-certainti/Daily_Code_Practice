const express = require('express');
const app = express();
app.use(express.json());
function validateRole(req, res, next){
    const {name,role}=req.body;
    if(!name || !role){
        return res.status(400).json({
            success:false,
            message:"name and role are required",
            data:null,
            errors:null
        });
    }
    if(role!=="admin"){
        return res.status(403).json({
            success:false,
            message:"admin can only access",
            data:null,
            errors:null
        });
    }
    req.user={name,role};
    next();
}
function generateReport(user){
    return {
        generatedBy:user.name,
        generatedAt:new Date(),
        status:"Report generated successfully"
    }

}
app.get("/", (req, res) => {
    res.json({
        message : "all roles"
    });
});
app.get("/report", validateRole, (req, res) => {
    const report = generateReport(req.user);
    res.json({
        success:true,
        message:"report generated successfully",
        data:report,
        errors:null
    });
});
app.listen(3000, () => {
    console.log("server is running on port 3000");
});