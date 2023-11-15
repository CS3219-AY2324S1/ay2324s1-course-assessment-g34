const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
	title: { type: String, required: true },
	categories: [String],
	difficulty: {
		type: String,
		enum: ["Easy", "Medium", "Hard"],
		required: true,
	},
	link: { type: String, required: true },
	description: { type: String, require: true}
},
{
	collection: 'questionRepo'
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
