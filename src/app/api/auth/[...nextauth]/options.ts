import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User.model";
import { getErrorMessage } from "@/helper/errorHelper";

// type credentialsType = {
// 	userid: string;
// 	password: string;
// 	redirect: string;
// 	csrfToken: string;
// 	callbackUrl: string;
// 	json: boolean;
// };

export const authOptions: NextAuthOptions = {
	providers: [
		CredentialsProvider({
			id: "credentials",
			name: "Credentials",
			credentials: {
				userid: { label: "userid", type: "text" },
				password: { label: "password", type: "password" },
			},
			async authorize(credentials: any): Promise<any> {
				await dbConnect();

				try {
					console.log("Getting", credentials);
					const user = await UserModel.findOne({
						userid: credentials.userid,
					}).select("+password");



					if (!user) {
						throw new Error("User not found");
					}

					const isPasswordCorrect = credentials.password === user.password;

					if (isPasswordCorrect) {
						return user;
					} else {
						throw new Error("Incorrect password");
					}
				} catch (error: unknown) {
					console.error(getErrorMessage(error));
				}
			},
		}),
	],
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token._id = user._id?.toString();
				token.userid = user.userid as string;
				token.role = user.role as "user" | "admin";
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user._id = token._id as string;
				session.user.userid = token.userid;
				session.user.role = token.role;
			}
			return session;
		},
	},
	session: { strategy: "jwt" },
	pages: { signIn: "/auth/sign-in" },
	jwt: { secret: process.env.NEXTAUTH_SECRET! },
};
