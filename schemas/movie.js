//引入建模工具模块mongoose
var mongoose = require('mongoose');

var MovieSchema = new mongoose.Schema({
	// 定义数据库字段类型
	director: String,
	title:String,
	language: String,
	country:String,
	summary:String,
	flash: String,
	poster: String,
	year: Number,
	meta:{
		createAt:{
			type: Date,
			default: Date.now()
		},
		updateAt:{
			type:Date,
			default:Date.now()
		}
	}

});

//添加一个方法，每次保存数据前判断是否为新增数据。
MovieSchema.pre('save', function(next) {
	if(this.isNew){
		this.meta.createAt = this.meta.updateAt = Date.now();
	}else{
		this.meta.updateAt = Date.now();
	}
	next();
});

//新增静态方法
MovieSchema.statics = {
	// 获取数据库所有数据
	fetch: function(cb) {
		return this
			.find({})
			.sort('meta.updateAt')
			.exec(cb);

	},
	//通过id查找
	findById: function(id, cb) {
		return this
		.findOne({_id: id})
		.exec(cb);
	}
};

module.exports = MovieSchema;