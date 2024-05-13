import dbConnect from "@/lib/dbConnect";
import ChapterModel from "@/model/Chapter.model";
import CourseModel from "@/model/Course.model";

interface GetChapterProps {
	userId: string;
	courseId: string;
	chapterId: string;
}

export const getChapter = async ({
	userId,
	courseId,
	chapterId,
}: GetChapterProps) => {
	try {
		dbConnect();
		const course = await CourseModel.find({
			_id: courseId,
			isPublished: true,
		}).populate("chapters");
		return 
	} catch (error: unknown) {
		return {
			chapter: null,
			course: null,
		};
	}
};
