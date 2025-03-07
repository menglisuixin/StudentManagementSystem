const mongoose = require('mongoose')
const schoolSchema = new mongoose.Schema({
    schoolname:{required:true,type:String}
})
const SchoolModel = mongoose.model('schools',schoolSchema)
module.exports = SchoolModel