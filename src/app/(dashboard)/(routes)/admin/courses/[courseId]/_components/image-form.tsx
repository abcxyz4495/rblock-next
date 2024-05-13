"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { v4 } from "uuid";
import { ImageIcon, Pencil, PlusCircle } from "lucide-react";
import { useCallback, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getErrorMessage } from "@/helper/errorHelper";
import { FileUpload } from "./image-upload";

interface ImageFormProps {
	initialData: {
		imageURL_public_url: string;
		imageURL_id: string;
	};
	courseId: string;
}

const formSchema = z.object({
	imageURL: z.object({
		id: z.string().min(1, { message: "Image id is required" }),
		public_url: z.string().min(1, { message: "Image URL is required" }),
	}),
});

export const ImageForm = ({ initialData, courseId }: ImageFormProps) => {
	const { toast } = useToast();
	const router = useRouter();
	const [isEditing, setIsEditing] = useState(false);
	const toggleEdit = () => setIsEditing((prev) => !prev);
	const [image, setImage] = useState<File | null>(null);

	const form = useForm<z.infer<typeof formSchema>>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			imageURL: {
				public_url: initialData?.imageURL_public_url,
				id: initialData?.imageURL_id,
			},
		},
	});

	const { isSubmitting, isValid } = form.formState;

	const onSubmit = useCallback(
		async (values: File) => {
			try {
				const formData = new FormData();
				formData.append("image", values);
				formData.append("refId", initialData?.imageURL_id || v4());
				console.log("Patching...");
				await axios.patch(`/api/courses/${courseId}/file`, formData, {
					headers: { "Content-Type": "multipart/form-data" },
				});
				toast({
					variant: "success",
					description: "Course updated successfully",
				});
				toggleEdit();
				router.refresh();
			} catch (error: unknown) {
				const errorMessage = getErrorMessage(error);
				toast({ variant: "destructive", description: errorMessage });
			}
		},
		[courseId, initialData?.imageURL_id, router, toast]
	);

	// console.log(initialData.imageURL_public_url);

	return (
		<div className="mt-6 border bg-slate-100 rounded-md p-4">
			<div className="font-medium flex items-center justify-between">
				Course Image
				<Button onClick={toggleEdit} variant="ghost">
					{isEditing && <>Cancel</>}
					{!isEditing && !initialData?.imageURL_public_url && (
						<>
							<PlusCircle className="h-4 w-4 mr-2" />
							Add an Image
						</>
					)}
					{!isEditing && initialData?.imageURL_public_url && (
						<>
							<Pencil className="h-4 w-4 mr-2" />
							Edit Image
						</>
					)}
				</Button>
			</div>
			{!isEditing &&
				(!initialData?.imageURL_public_url ? (
					<div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
						<ImageIcon className="h-10 w-10 text-slate-500" />
					</div>
				) : (
					<div className="relative aspect-video mt-2">
						<Image
							src={initialData.imageURL_public_url}
							fill
							className="object-cover rounded-md"
							alt="Upload"
						/>
					</div>
				))}
			{isEditing && (
				<div>
					<FileUpload onSubmit={onSubmit} image={image} setImage={setImage} />
					<div className="text-xs text-muted-foreground mt-4">
						16:9 aspect ratio recommended
					</div>
				</div>
			)}
		</div>
	);
};
