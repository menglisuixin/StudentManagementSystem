const mongoose = require("mongoose");
const md5 = require("blueimp-md5");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  phone: String,
  create_time: { type: Number, default: Date.now },
  role_id: String,
});
const UserModel = mongoose.model("users", userSchema);
// 到users表中查询根据条件(username为admin)
UserModel.findOne({ username: "admin" }).then((user) => {
  // 超级管理员没有创建
  console.log(user);
  if (!user) {
    UserModel.create({
      username: "admin",
      password: md5("admin"),
      name: "admin",
    }).then((user) => {
      console.log("初始化用户：用户名：admin，密码：admin");
    });
  }
});

module.exports = UserModel;
