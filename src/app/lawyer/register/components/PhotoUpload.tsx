import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import FileUpload from "@/components/kokonutui/file-upload";
import { Control } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "../page.old"; // Assuming formSchema is exported from page.tsx

interface PhotoUploadProps {
  control: Control<z.infer<typeof formSchema>>;
}

export function PhotoUpload({ control }: PhotoUploadProps) {
  return (
    <FormField
      control={control}
      name="photo"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Profile Picture</FormLabel>
          <FormControl>
            <div className="flex">
              <input
                type="hidden"
                {...field}
              />
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
  );
}
