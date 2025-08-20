import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Control } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "../page";

interface PrimaryCourtInputProps {
  control: Control<z.infer<typeof formSchema>>;
}

export function PrimaryCourtInput({ control }: PrimaryCourtInputProps) {
  return (
    <FormField
      control={control}
      name="primaryCourt"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Primary Court</FormLabel>
          <FormControl>
            <Input placeholder="e.g., Family Court" {...field} />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
