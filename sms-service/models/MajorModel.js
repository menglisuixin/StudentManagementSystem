const mongoose = require('mongoose')
const majorSchema = new mongoose.Schema({
    majorname:{required:true,type:String}
})
const MajorModel = mongoose.model('majors',majorSchema)
module.exports = MajorModel