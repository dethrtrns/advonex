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
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { updateLawyerProfile } from "@/services/lawyerService";
import { toast } from "sonner";

const schema = z.object({
  lawSchool: z.string().min(1, "Law school is required"),
  degree: z.string().min(1, "Degree is required"),
  graduationYear: z
    .number()
    .min(1900, "Invalid graduation year")
    .max(new Date().getFullYear(), "Graduation year cannot be in the future"),
});

type EducationInputsData = z.infer<typeof schema>;

interface Props {
  initialValues?: EducationInputsData;
  submitMode?: "internal" | "external";
  onSubmit?: (values: EducationInputsData) => Promise<void>;
}

export function EducationInputs({
  initialValues,
  submitMode = "internal",
  onSubmit,
}: Props) {
  const form = useForm<EducationInputsData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const handleSubmit = async (values: EducationInputsData) => {
    if (submitMode === "internal") {
      try {
        await updateLawyerProfile({
          education: {
            institution: values.lawSchool,
            degree: values.degree,
            year: values.graduationYear,
          },
        });
        toast.success("Education info updated");
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
            control={form.control}
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
            control={form.control}
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
        {submitMode === "internal" && (
          <Button type="submit">Save</Button>
        )}
      </form>
    </Form>
  );
}
