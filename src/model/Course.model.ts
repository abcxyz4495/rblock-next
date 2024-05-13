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

export interface Course extends Document {
	title: string;
	description: string;
	chapters: [];
	imageURL: { public_url: string; id: string };
	createdAt: Date;
	isPublished: boolean;
}

const CourseSchema: Schema<Course> = new Schema({
	title: {
		type: String,
		required: [true, "Course name is required"],
		unique: true,
	},
	description: String,
	chapters: [{ type: mongoose.Schema.Types.ObjectId, ref: "Chapter" }],
	imageURL: {
		public_url: String,
		id: String,
	},
	createdAt: Date,
	isPublished: {
		type: Boolean,
		default: false,
	},
});

const CourseModel =
	(mongoose.models.Course as mongoose.Model<Course>) ||
	mongoose.model<Course>("Course", CourseSchema);

export default CourseModel;
