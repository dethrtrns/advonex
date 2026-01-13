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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { updateLawyerProfile } from "@/services/lawyerService";
import { toast } from "sonner";

const schema = z.object({
  bio: z
    .string()
    .min(50, "Bio must be at least 50 characters")
    .max(1000, "Bio cannot be more than 1000 characters"),
});

type BioInputData = z.infer<typeof schema>;

interface Props {
  initialValues?: BioInputData;
  submitMode?: "internal" | "external";
  onSubmit?: (values: BioInputData) => Promise<void>;
}

export function BioInput({
  initialValues,
  submitMode = "internal",
  onSubmit,
}: Props) {
  const form = useForm<BioInputData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const handleSubmit = async (values: BioInputData) => {
    if (submitMode === "internal") {
      try {
        await updateLawyerProfile({
          bio: values.bio,
        });
        toast.success("Bio updated");
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
        {submitMode === "internal" && (
          <Button type="submit">Save</Button>
        )}
      </form>
    </Form>
  );
}
