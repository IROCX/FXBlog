const mongoose = require('mongoose');

const commentSchema = new mongoose.Schema(
	{
		text: {
			type: String,
			required: true,
			trim: true, // Remove leading and trailing whitespaces
			maxlength: [
				5000,
				'Text exceeds the maximum allowed length (5000 characters).',
			],
		},
		author: {
			id: {
				type: mongoose.Schema.Types.ObjectId,
				ref: 'User',
				required: true,
			},
			username: {
				type: String,
				required: true,
			},
		},
	},
	{
		timestamps: true, // Adds createdAt and updatedAt fields
	}
);

const Comment = mongoose.model('Comment', commentSchema);

module.exports = Comment;
