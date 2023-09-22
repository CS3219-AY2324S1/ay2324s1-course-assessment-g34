const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
	title: { type: String, required: true },
	categories: [String],
	complexity: {
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

// const questionDescriptionSchema = new mongoose.Schema({
// 	qid: { type: Number, required: true },
// 	description: { type: String, required: true },
// 	});

// 	const QuestionDescription = mongoose.model(
// 	"QuestionDescription",
// 	questionDescriptionSchema
// );

// module.exports = QuestionDescription;

module.exports = Question;
