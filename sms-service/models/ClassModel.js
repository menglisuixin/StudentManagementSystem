const mongoose = require("mongoose")
const classSchema = new mongoose.Schema({
    classname:{type:String,required:true},
    teacher_id:{type:String,required:true},
    manager_id:{type:String,required:true}
})
const ClassModel = mongoose.model("classes",classSchema)
module.exports = ClassModel