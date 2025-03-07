const mongoose = require('mongoose')
const studentSchema = new mongoose.Schema({
    name :{type:String,required:true}	  ,//姓名
    gender :{type:String,required:true}    ,//性别
    school :String    ,//学校
    major :String	  ,//专业
    grade :String	  ,//年级
    education :String,//学历
    direction :{type:String,required:true},//学习方向
    id_number :String,//身份号码
    phone :{type:String,required:true}	  ,//电话号码
    parent :String	  ,//家长姓名
    parent_phone:String,//家长联系电话
    address :String	  ,//家庭住址
    qq :String	      ,//QQ号码
    class :{type:String,required:true}	  ,//所在班级
    admission_date:String,//入学时间
    teacher_id :{type:String,required:true},//教师id
    manager_id :{type:String,required:true},//学管id
    pictures :Array,//照片数组
    note :String	  ,//备注信息
})
const StudentModel = mongoose.model("students",studentSchema)
module.exports = StudentModel