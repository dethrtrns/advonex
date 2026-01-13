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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { updateLawyerProfile } from "@/services/lawyerService";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import {
  bringPracticeAreas,
  practiceArea,
} from "@/data/pacticeAreas/pacticeAreas";

const schema = z.object({
  barNumber: z.string().min(1, "Bar number is required"),
  practiceArea: z.string().min(1, "Practice area is required"),
  experience: z
    .number()
    .min(1, "Years of experience must be 1 or greater")
    .max(100, "Years of experience cannot be greater than 100"),
  consultFee: z
    .number()
    .min(50, "Consultation fee must be 50 or greater")
    .max(10000, "Consultation fee cannot be greater than 10000"),
});

type ProfessionalInfoInputsData = z.infer<typeof schema>;

interface Props {
  initialValues?: ProfessionalInfoInputsData;
  submitMode?: "internal" | "external";
  onSubmit?: (values: ProfessionalInfoInputsData) => Promise<void>;
}

export function ProfessionalInfoInputs({
  initialValues,
  submitMode = "internal",
  onSubmit,
}: Props) {
  const form = useForm<ProfessionalInfoInputsData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const [practiceAreasList, setPracticeAreasList] = useState<practiceArea[]>(
    []
  );

  useEffect(() => {
    const fetchAndSetPracticeAreas = async () => {
      try {
        const areas = await bringPracticeAreas();
        setPracticeAreasList(areas);
      } catch (error) {
        console.error("Error fetching practice areas:", error);
      }
    };

    fetchAndSetPracticeAreas();
  }, []);

  const handleSubmit = async (values: ProfessionalInfoInputsData) => {
    if (submitMode === "internal") {
      try {
        await updateLawyerProfile({
          barId: values.barNumber,
          experience: values.experience,
          consultFee: values.consultFee,
          specialization: { id: values.practiceArea },
        });
        toast.success("Professional info updated");
      } catch {
        toast.error("Update failed");
      }
    } else if (onSubmit) {
      await onSubmit(values);
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-4">
        <FormField
          control={form.control}
          name="barNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Bar Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter your bar number"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="practiceArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Primary Practice Area</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your primary practice area" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {practiceAreasList.map((area) => (
                    <SelectItem
                      key={area.id}
                      value={area.id}>
                      {area.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="experience"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Years of Experience</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder="Enter years of experience"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="consultFee"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Consultation Fee ($/hr)</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  min="0"
                  placeholder="Enter your hourly consultation fee"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {submitMode === "internal" && <Button type="submit">Save</Button>}
      </form>
    </Form>
  );
}
