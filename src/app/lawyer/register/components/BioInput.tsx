import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Control } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "../page.old";

interface BioInputProps {
  control: Control<z.infer<typeof formSchema>>;
}

export function BioInput({ control }: BioInputProps) {
  return (
    <FormField
      control={control}
      name="bio"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Professional Bio</FormLabel>
          <FormControl>
            <Textarea
              placeholder="Write a brief description of your professional background and expertise"
              className="h-32"
              {...field}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
