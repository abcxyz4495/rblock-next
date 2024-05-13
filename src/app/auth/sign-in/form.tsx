"use client";

import * as z from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { IoMdLock } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { CgSpinner } from "react-icons/cg";

import { getErrorMessage } from "@/helper/errorHelper";
import { LoginSchema } from "@/schema";

interface Props {
	callbackUrl?: string;
}

type LoginSchemaType = z.infer<typeof LoginSchema>;

export default function Form({ callbackUrl }: Props) {
	const router = useRouter();
	const [isDisabled, setIsDisabled] = useState(false);
	const [loading, setLoading] = useState(false);

	const { register, handleSubmit } = useForm<LoginSchemaType>();

	const handlerUserLogin: SubmitHandler<LoginSchemaType> = async (data) => {
		setIsDisabled(true);
		setLoading(true);

		try {
			const credentials = LoginSchema.safeParse({
				userid: data.userid,
				password: data.password,
			});
			if (!credentials) {
				console.log("Invalid credentials");
				return;
			}
			const response = await signIn("credentials", {
				...credentials?.data,
				redirect: false,
			});

			if (response?.ok) {
				router.push(callbackUrl ? callbackUrl : "/");
				router.refresh();
			}
		} catch (error: unknown) {
			console.error(getErrorMessage(error));
		} finally {
			setIsDisabled(false);
			setLoading(false);
		}
	};

	return (
		<form
			className="w-[375px] space-y-6 flex flex-col items-center justify-center"
			onSubmit={handleSubmit(handlerUserLogin)}
		>
			<div className="w-3/4 lg:w-full h-[40px] lg:h-[57px] rounded-2xl bg-[#38005B] flex justify-evenly items-center">
				<FaUser color="white" size={25} />
				<input
					type="text"
					className="text-white bg-transparent w-3/4 outline-none"
					{...register("userid")}
					placeholder="userid"
					autoComplete="off"
					required
				/>
			</div>
			<div className="w-3/4 lg:w-full h-[40px] lg:h-[57px] rounded-2xl bg-[#38005B] flex justify-evenly items-center">
				<IoMdLock color="white" size={25} />
				<input
					type="password"
					className="text-white bg-transparent w-3/4 outline-none"
					{...register("password", {
						minLength: 8,
					})}
					placeholder="Password"
					autoComplete="off"
					required
				/>
			</div>
			<button
				type="submit"
				disabled={isDisabled}
				className="w-3/4 lg:w-full h-[40px] lg:h-[57px] flex justify-center items-center bg-[#D05BFC] rounded-3xl text-xl uppercase text-white font-medium hover:bg-[#9d45bd] duration-200"
			>
				{loading ? <CgSpinner className="animate-spin" size={20} /> : "Login"}
			</button>
		</form>
	);
}
