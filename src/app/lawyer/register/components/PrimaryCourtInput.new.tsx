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
  primaryCourt: z.string().min(1, "At least one practice court is required"),
});

type PrimaryCourtInputData = z.infer<typeof schema>;

interface Props {
  initialValues?: PrimaryCourtInputData;
  submitMode?: "internal" | "external";
  onSubmit?: (values: PrimaryCourtInputData) => Promise<void>;
}

export function PrimaryCourtInput({
  initialValues,
  submitMode = "internal",
  onSubmit,
}: Props) {
  const form = useForm<PrimaryCourtInputData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const handleSubmit = async (values: PrimaryCourtInputData) => {
    if (submitMode === "internal") {
      try {
        await updateLawyerProfile({
          primaryCourt: values.primaryCourt,
        });
        toast.success("Primary court updated");
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
        {submitMode === "internal" && (
          <Button type="submit">Save</Button>
        )}
      </form>
    </Form>
  );
}
