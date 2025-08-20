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

interface EducationInputsProps {
  control: Control<z.infer<typeof formSchema>>;
}

export function EducationInputs({ control }: EducationInputsProps) {
  return (
    <>
      <FormField
        control={control}
        name="lawSchool"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Law School</FormLabel>
            <FormControl>
              <Input placeholder="Enter your law school name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          control={control}
          name="degree"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Degree</FormLabel>
              <FormControl>
                <Input placeholder="e.g., Juris Doctor (J.D.)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={control}
          name="graduationYear"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Graduation Year</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="1900"
                  max={new Date().getFullYear()}
                  placeholder="Enter graduation year"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
