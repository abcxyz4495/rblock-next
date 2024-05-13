import { getErrorMessage } from "@/helper/errorHelper";
import { initializeApp } from "firebase/app";
import {
	getStorage,
	ref,
	getDownloadURL,
	uploadBytes,
} from "firebase/storage";

const firebaseConfig = {
	apiKey: process.env.FIREBASE_API_KEY,
	authDomain: process.env.FIREBASE_AUTH_DOMAIN,
	projectId: process.env.FIREBASE_PROJECT_ID,
	storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
	messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
	appId: process.env.FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

export async function uploadFileInStorage(
	type: string,
	refId: string,
	file: File
) {
	try {
		let storageRef;
		if (type === "courseImage") {
			storageRef = ref(storage, `courseImage/${refId}`);
		} else {
			return { success: false, error: "Unsupported file type" };
		}

		console.log("refId", refId);

		if (!file.type.startsWith("image/")) {
			return { success: false, error: "Only image files allowed" };
		}

		const snapshot = await uploadBytes(storageRef, file);
		const downloadURL = await getDownloadURL(snapshot?.ref);

		return { success: true, id: refId, url: downloadURL };
	} catch (error: unknown) {
		const errorMessage = getErrorMessage(error);
		return { success: false, error: errorMessage };
	}
}
