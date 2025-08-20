"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { updateLawyerProfile } from "@/services/lawyerService";
import { toast } from "sonner";
import FileUpload from "@/components/kokonutui/file-upload";

const schema = z.object({
  photo: z.string().min(1, "Photo is required"),
});

type PhotoUploadData = z.infer<typeof schema>;

interface Props {
  initialValues?: PhotoUploadData;
  submitMode?: "internal" | "external";
  onSubmit?: (values: PhotoUploadData) => Promise<void>;
}

export function PhotoUpload({
  initialValues,
  submitMode = "internal",
  onSubmit,
}: Props) {
  const form = useForm<PhotoUploadData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const handleSubmit = async (values: PhotoUploadData) => {
    if (submitMode === "internal") {
      try {
        await updateLawyerProfile({
          photo: values.photo,
        });
        toast.success("Photo updated");
      } catch {
        toast.error("Update failed");
      }
    } else if (onSubmit) {
      await onSubmit(values);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="photo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Profile Picture</FormLabel>
              <FormControl>
                <div className="flex">
                  <input type="hidden" {...field} />
                  <FileUpload
                    onUploadSuccess={(imageUrl) => {
                      field.onChange(imageUrl);
                      console.log("Image URL updated:", imageUrl);
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {submitMode === "internal" && (
          <Button type="submit">Save</Button>
        )}
      </form>
    </Form>
  );
}
