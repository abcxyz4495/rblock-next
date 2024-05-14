"use client";

import { useRouter } from "next/navigation";

const Authredirect = ({ userToken }: { userToken: string }) => {
	const router = useRouter();
	router.refresh();
	router.push("/");
	return <div></div>
};

export default Authredirect;
