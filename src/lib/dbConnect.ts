import mongoose from "mongoose";
import { getErrorMessage } from "@/helper/errorHelper";

type ConnectionObject = {
	isConnected?: number;
};

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
	mongoose
		.connect(process.env.ATLAS_DB_URL!, {
			dbName: "rblock-next",
		})
		.then((c) => console.log(`DB Connected to ${c.connection.host}`))
		.catch((e) => console.log(e));
}

export default dbConnect;
