import mongoose, { Schema, Document } from "mongoose";

export interface Chapter extends Document {
	length: any;
	title: string;
	description: string;
	pdfURL: string;
	videoURL: string;
	isPublished: boolean;
}

export const ChapterSchema: Schema<Chapter> = new Schema({
	title: {
		type: String,
		required: [true, "Session name is required"],
	},
	description: {
		type: String,
	},
	pdfURL: String,
	videoURL: String,
	isPublished: { type: Boolean, default: false },
});

const ChapterModel =
	(mongoose.models.Chapter as mongoose.Model<Chapter>) ||
	mongoose.model<Chapter>("Chapter", ChapterSchema);

export default ChapterModel;
