const mongoose = require('mongoose')
const express = require('express')
const path = require('path')
const bodyParser = require("body-parser")
const app = express()

app.use(express.static("public"))
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.use("/node_modules",express.static(path.join(__dirname,"./node_modules")))

const indexRouter = require("./routers")
app.use("/",indexRouter)

mongoose.connect('mongodb://localhost/d2402stu').then(()=>{
    console.log("连接数据库成功");
    app.listen(3000,()=>{
        console.log("服务器已启动！");
    })
}).catch(error=>{
    console.log("连接数据库失败",error);
})

