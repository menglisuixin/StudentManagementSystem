const express = require('express')
const router = express.Router();
const UserModel = require("../models/UserModel")
const RoleModel = require("../models/RoleModel")
const SchoolModel = require("../models/SchoolModel")
const MajorModel = require("../models/MajorModel")
const ClassModel = require("../models/ClassModel")
const StudentModel = require("../models/StudentModel")
const md5 = require('blueimp-md5')
// 过滤属性
const filter = {password:0,__v:0}
// 测试接口
router.get("/test",(req,res)=>{
    res.set("Access-Control-Allow-Origin", "*");
    res.send("连接成功")
})
// 登录接口
router.post("/login",(req,res)=>{
    const {username,password} = req.body
    UserModel.findOne({username,password:md5(password)}).then(user=>{
        if(user){
            if(user.role_id){
                // 普通用户
                RoleModel.findOne({_id:user.role_id}).then(role=>{
                    user._doc.role = role
                    res.send({status:0,data:user})
                })
            }else{
                // 超级管理员
                user._doc.role = {menus:[]}
                res.send({status:0,data:user})
            }
            
        }else{
            res.send({status:1,msg:'用户名或密码错误'})
        }
    }).catch(error=>{
        console.log("登录异常",error);
        res.send({status:1,msg:'登录异常，请重新尝试'})
    })
})
// 获取角色列表
router.get("/manage/role/list",(req,res)=>{
    RoleModel.find().then(roles=>{
        res.send({status:0,data:roles})
    }).catch(error=>{
        console.log("获取角色列表异常",error);
        res.send({status:1,msg:'获取角色列表异常，请重新尝试'})
    })
})
// 添加角色
router.post("/manage/role/add",(req,res)=>{
    const {name} = req.body
    RoleModel.create({name}).then(role=>{
        res.send({status:0,data:role})
    }).catch(error=>{
        console.log("添加角色异常",error);
        res.send({status:1,msg:'添加角色异常，请重新尝试'})
    })
})
// 设置角色权限
router.post("/manage/role/update",(req,res)=>{
    const role = req.body
    role.auth_time = Date.now()
    RoleModel.findOneAndUpdate({_id:role._id},role).then(oldRole=>{
        res.send({status:0,data:{...oldRole._doc,...role}})
    }).catch(error=>{
        console.log("设置角色权限异常",error);
        res.send({status:1,msg:'设置角色权限异常，请重新尝试'})
    })
})
// 获取所有用户
router.get("/manage/user/all",(req,res)=>{
    UserModel.find({username:{'$ne':'admin'}}).then(users=>{
        res.send({status:0,data:users})
    }).catch(error=>{
        console.log("获取所有用户异常",error);
        res.send({status:1,msg:'获取所有用户异常，请重新尝试'})
    })
})
// 获取用户列表（分页）
router.post('/manage/user/list',(req,res)=>{
    let page = req.body.page || 1
    let size = req.body.size || 5
    UserModel.find({username:{'$ne':'admin'}}).then(users=>{
        let count = users.length
        // skip:越过多少条数据开始查询，limit:查询多少条数据
        UserModel.find({username:{'$ne':'admin'}}).skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec().then(data=>{
            RoleModel.find().then(roles=>{
                res.send({status:0,data:{total:count,data:data,roles:roles}})
            })
        })
    }).catch(error=>{
        console.log("获取用户列表（分页）异常",error);
        res.send({status:1,msg:'获取用户列表（分页）异常，请重新尝试'})
    })
})
// 添加用户
router.post('/manage/user/add',(req,res)=>{
    const {username,password} = req.body
    UserModel.findOne({username}).then(user=>{
        if(user){
            res.send({status:1,msg:'此用户已存在'})
            return new Promise(()=>{})
        }else{
            return UserModel.create({...req.body,password:md5(password || 'buka')})
        }
    }).then(data=>{
        res.send({status:0,data})
    }).catch(error=>{
        console.log("添加用户异常",error);
        res.send({status:1,msg:'添加用户异常，请重新尝试'})
    })
})
// 根据_id查询用户
router.get('/manage/user/find',(req,res)=>{
    const user = req.query
    UserModel.findById({_id:user._id}).then(data=>{
        res.send({status:0,data})
    }).catch(error=>{
        console.log("根据id查询用户异常",error);
        res.send({status:1,msg:'根据id查询用户异常，请重新尝试'})
    })
})
// 修改用户信息
router.post('/manage/user/update',(req,res)=>{
    const user = req.body
    UserModel.findById({_id:user._id}).then(data=>{
        if(data.password != user.password){
            user.password = md5(user.password)
        }
        UserModel.findOneAndUpdate({_id:user._id},user).then(oldUser=>{
            const data = Object.assign(oldUser,user)
            res.send({status:0,data})
        }).catch(error=>{
            console.log("修改用户信息异常",error);
            res.send({status:1,msg:'修改用户信息异常，请重新尝试'})
        })
    })
})
// 删除用户
router.post('/manage/user/delete',(req,res)=>{
    const {userId} = req.body
    UserModel.deleteOne({_id:userId}).then(()=>{
        res.send({status:0})
    }).catch(error=>{
        console.log("删除用户异常",error);
        res.send({status:1,msg:'删除用户异常，请重新尝试'})
    })
})
// 获取用户最新权限列表
router.post('/menus',(req,res)=>{
    const{roleId} = req.body
    RoleModel.findOne({_id:roleId}).then(role=>{
        res.send({status:0,data:{menus:role.menus}})
    }).catch(error=>{
        console.log("获取角色权限列表异常",error);
        res.send({status:1,msg:'获取角色权限列表异常，请重新尝试'})
    })
})
// 获取学校列表
router.post('/manage/school/list',(req,res)=>{
    let page = req.body.page || 1
    let size = req.body.size || 5
    SchoolModel.find().then(schools=>{
        const count = schools.length
        SchoolModel.find().skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec().then(data=>{
            res.send({status:0,data:{total:count,data}})
        })
    }).catch(error=>{
        console.log("获取学校列表异常",error);
        res.send({status:1,msg:'获取学校列表异常，请重新尝试'})
    })
})
// 添加学校
router.post('/manage/school/add',(req,res)=>{
    const {schoolname} = req.body
    SchoolModel.findOne({schoolname}).then(school=>{
        if(school){
            res.send({status:1,msg:'此学校已存在'})
            return new Promise(()=>{})
        }else{
            return SchoolModel.create({...req.body})
        }
    }).then(data=>{
        res.send({status:0,data})
    }).catch(error=>{
        console.log("添加学校异常",error);
        res.send({status:1,msg:'添加学校异常，请重新尝试'})
    })
})
// 根据_id查询学校
router.get("/manage/school/find",(req,res)=>{
    const school = req.query
    SchoolModel.findById({_id:school._id}).then(data=>{
        res.send({status:0,data})
    }).catch(error=>{
        console.log("根据id查询学校异常",error);
        res.send({status:1,msg:'根据id查询学校异常，请重新尝试'})
    })
})
// 修改学校信息
router.post("/manage/school/update",(req,res)=>{
    const school = req.body
    SchoolModel.findOneAndUpdate({_id:school._id},school).then(oldSchool=>{
        const data = Object.assign(oldSchool,school)
        res.send({status:0,data})
    }).catch(error=>{
        console.log("修改学校信息异常",error);
        res.send({status:1,msg:'修改学校信息异常，请重新尝试'})
    })
})
// 删除学校
router.post("/manage/school/delete",(req,res)=>{
    const {schoolId} = req.body
    SchoolModel.deleteOne({_id:schoolId}).then(()=>{
        res.send({status:0})
    }).catch(error=>{
        console.log("删除学校异常",error);
        res.send({status:1,msg:'删除学校异常，请重新尝试'})
    })
})

// 获取专业列表
router.post('/manage/major/list',(req,res)=>{
    let page = req.body.page || 1
    let size = req.body.size || 5
    MajorModel.find().then(majors=>{
        const count = majors.length
        MajorModel.find().skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec().then(data=>{
            res.send({status:0,data:{total:count,data}})
        })
    }).catch(error=>{
        console.log("获取专业列表异常",error);
        res.send({status:1,msg:'获取专业列表异常，请重新尝试'})
    })
})
// 添加专业
router.post('/manage/major/add',(req,res)=>{
    const {majorname} = req.body
    MajorModel.findOne({majorname}).then(major=>{
        if(major){
            res.send({status:1,msg:'此专业已存在'})
            return new Promise(()=>{})
        }else{
            return MajorModel.create({...req.body})
        }
    }).then(data=>{
        res.send({status:0,data})
    }).catch(error=>{
        console.log("添加专业异常",error);
        res.send({status:1,msg:'添加专业异常，请重新尝试'})
    })
})
// 根据_id查询专业
router.get("/manage/major/find",(req,res)=>{
    const major = req.query
    MajorModel.findById({_id:major._id}).then(data=>{
        res.send({status:0,data})
    }).catch(error=>{
        console.log("根据id查询专业异常",error);
        res.send({status:1,msg:'根据id查询专业异常，请重新尝试'})
    })
})
// 修改专业信息
router.post("/manage/major/update",(req,res)=>{
    const major = req.body
    MajorModel.findOneAndUpdate({_id:major._id},major).then(oldMajor=>{
        const data = Object.assign(oldMajor,major)
        res.send({status:0,data})
    }).catch(error=>{
        console.log("修改专业信息异常",error);
        res.send({status:1,msg:'修改专业信息异常，请重新尝试'})
    })
})
// 删除专业
router.post("/manage/major/delete",(req,res)=>{
    const {majorId} = req.body
    MajorModel.deleteOne({_id:majorId}).then(()=>{
        res.send({status:0})
    }).catch(error=>{
        console.log("删除专业异常",error);
        res.send({status:1,msg:'删除专业异常，请重新尝试'})
    })
})
router.get("/manage/class/all",(req,res)=>{
    ClassModel.find().then(data=>{
        res.send({status:0,data})
    }).catch(error=>{
        console.log("获取所有班级异常",error);
        res.send({status:1,msg:'获取所有班级异常，请重新尝试'})
    })
})
router.post("/manage/class/list",(req,res)=>{
    let page = req.body.page || 1
    let size = req.body.size || 5
    // 前端提交数据中的条件筛选对象
    let searchMap = req.body.searchMap || {}
    // 真正到数据库中查询数据的筛选对象
    let obj = {}
    searchMap.teacher_id ? obj['teacher_id'] = searchMap.teacher_id : obj
    searchMap.manager_id ? obj['manager_id'] = searchMap.manager_id : obj
    ClassModel.find(obj).then(classes=>{
        const count = classes.length
        ClassModel.find(obj).skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec().then(data=>{
            res.send({status:0,data:{total:count,data:data}})
        })
    }).catch(error=>{
        console.log("获取班级列表异常",error);
        res.send({status:1,msg:'获取班级列表异常，请重新尝试'})
    })
})
router.post("/manage/class/add",(req,res)=>{
    const {classname} = req.body
    ClassModel.findOne({classname}).then(c=>{
        if(c){
            res.send({status:1,msg:'此班级已存在'})
            return new Promise(()=>{})
        }else{
            return ClassModel.create({...req.body})
        }
    }).then(data=>{
        res.send({status:0,data})
    }).catch(error=>{
        console.log("添加班级异常",error);
        res.send({status:1,msg:'添加班级异常，请重新尝试'})
    })
})
router.get("/manage/class/find",(req,res)=>{
    const c = req.query
    ClassModel.findById({_id:c._id}).then(data=>{
        res.send({status:0,data})
    }).catch(error=>{
        console.log("根据id查询班级",error);
        res.send({status:1,msg:'根据id查询班级，请重新尝试'})
    })
})
router.post("/manage/class/update",(req,res)=>{
    const c = req.body
    ClassModel.findOneAndUpdate({_id:c._id},c).then(oldClass=>{
        const data = Object.assign(oldClass,c)
        res.send({status:0,data})
    }).catch(error=>{
        console.log("修改班级信息异常",error);
        res.send({status:1,msg:'修改班级信息异常，请重新尝试'})
    })
})
router.post("/manage/class/delete",(req,res)=>{
    const {classId} = req.body
    ClassModel.deleteOne({_id:classId}).then(()=>{
        res.send({status:0})
    }).catch(error=>{
        console.log("删除班级异常",error);
        res.send({status:1,msg:'删除班级异常，请重新尝试'})
    })
})

// 获取学员列表
router.post("/manage/student/list",(req,res)=>{
    let page = req.body.page || 1
    let size = req.body.size || 5
    let searchMap = req.body.searchMap || {}
    let obj = {}
    searchMap.name ? obj['name'] = searchMap.name : obj;
    searchMap.direction ? obj['direction'] = searchMap.direction : obj;
    searchMap.class ? obj['class'] = searchMap.class : obj;
    searchMap.teacher_id ? obj['teacher_id'] = searchMap.teacher_id : obj;
    searchMap.manager_id ? obj['manager_id'] = searchMap.manager_id : obj;
    StudentModel.find(obj).then(students=>{
        const count = students.length
        StudentModel.find(obj).skip((page - 1) * parseInt(size)).limit(parseInt(size)).exec().then(data=>{
            res.send({status:0,data:{total:count,data:data}})
        })
    }).catch(error=>{
        console.log("获取学员列表异常",error);
        res.send({status:1,msg:'获取学员列表异常，请重新尝试'})
    })
})
// 添加学员
router.post("/manage/student/add",(req,res)=>{
    StudentModel.create({...req.body}).then(data=>{
        res.send({status:0,data})
    }).catch(error=>{
        console.log("添加学员异常",error);
        res.send({status:1,msg:'添加学员异常，请重新尝试'})
    })
})
// 根据id查询学员
router.get("/manage/student/find",(req,res)=>{
    const student = req.query
    StudentModel.findById({_id:student._id}).then(data=>{
        res.send({status:0,data})
    }).catch(error=>{
        console.log("根据id查询学员异常",error);
        res.send({status:1,msg:'根据id查询学员异常，请重新尝试'})
    })
})
// 更新学员信息
router.post("/manage/student/update",(req,res)=>{
    const student = req.body
    StudentModel.findOneAndUpdate({_id:student._id},student).then(oldStudent=>{
        const data = Object.assign(oldStudent,student)
        res.send({status:0,data})
    }).catch(error=>{
        console.log("更新学员信息异常",error);
        res.send({status:1,msg:'更新学员信息异常，请重新尝试'})
    })
})
// 删除学员
router.post("/manage/student/delete",(req,res)=>{
    const {studentId} = req.body
    StudentModel.deleteOne({_id:studentId}).then(()=>{
        res.send({status:0})
    }).catch(error=>{
        console.log("删除学员异常",error);
        res.send({status:1,msg:'删除学员异常，请重新尝试'})
    })
})

// 获取所有学校
router.get("/manage/school/all",(req,res)=>{
    SchoolModel.find().then(schools=>{
        res.send({status:0,data:schools})
    })
})
// 获取所有专业
router.get("/manage/major/all",(req,res)=>{
    MajorModel.find().then(majors=>{
        res.send({status:0,data:majors})
    })
})
// 查询某一年学员数量
router.post('/manage/student/date',(req,res)=>{
    let {year} = req.body
    year = year + ""
    StudentModel.aggregate([
        {
            // 添加字段
            $project:{
                year:{$substr:['$admission_date',0,4]},
                month:{$substr:['$admission_date',5,2]}
            }
        },
        // 匹配年份
        {
            $match:{year}
        },
        // 分组查询，按月份查询
        {
            $group:{
                _id:'$month',
                count:{$sum:1}
            }
        },
        // 排序
        {
            $sort:{_id:1}
        }
    ]).exec().then(data=>{
        return res.send({status:0,data})
    })
})
// 校验原密码是否正确
router.post("/manage/user/pwd",(req,res)=>{
    const body =req.body
    UserModel.findOne({
        _id:body.userId,
        password:md5(body.password)
    }).then(user=>{
        if(!user){
            return res.send({status:1,msg:'密码不正确'})
        }
        return res.send({status:0,data:user})
    })
})
// 修改密码
router.put('/manage/user/pwd',(req,res)=>{
    const _id = req.body.userId
    UserModel.findOne({_id:_id}).then(user=>{
        if(!user){
            return res.send({status:1,msg:'密码不正确'})
        }
        user.password = md5(req.body.password)
        UserModel.findByIdAndUpdate(_id,user).then(()=>{
            return res.send({status:0,msg:'修改密码成功'})
        })
    })
})
require("./file-upload")(router)

module.exports = router



