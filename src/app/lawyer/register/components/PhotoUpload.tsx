import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FileUpload from "@/components/kokonutui/file-upload";
import { Control, ControllerRenderProps } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "../page.old"; // Assuming formSchema is exported from page.tsx
import { uploadLawyerImage } from "@/services/lawyerService";
import { useState } from "react";
import { toast } from "sonner";

interface PhotoUploadProps {
  control: Control<z.infer<typeof formSchema>>;
}

export function PhotoUpload({ control }: PhotoUploadProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleImageUpload = async (file: File, field: ControllerRenderProps<z.infer<typeof formSchema>, "photo">) => {
    setIsUploading(true);
    try {
      const response = await uploadLawyerImage(file);
      if (response.success && response.data?.imageUrl) {
        field.onChange(response.data.imageUrl);
        toast.success("Image uploaded successfully");
      } else {
        toast.error(response.message || "Failed to upload image");
      }
    } catch (error) {
      toast.error("Failed to upload image");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormField
      control={control}
      name="photo"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Profile Picture</FormLabel>
          <FormControl>
            <div className="flex">
              <input type="hidden" {...field} />
              <FileUpload
                onUploadSuccess={(file) => handleImageUpload(file, field)}
              />
              {isUploading && <p>Uploading...</p>}
            </div>
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}


