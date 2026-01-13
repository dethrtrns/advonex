"use client";

import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { Control } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "../page.old";
import { useEffect, useState } from "react";

interface ProfessionalInfoInputsProps {
  control: Control<z.infer<typeof formSchema>>;
}

interface PracticeArea {
  id: string;
  name: string;
  description?: string;
}

export function ProfessionalInfoInputs({
  control,
}: ProfessionalInfoInputsProps) {
  const [practiceAreasList, setPracticeAreasList] = useState<PracticeArea[]>(
    []
  );
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPracticeAreas = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/static-data/practice-areas`
        );
        const json = await res.json();
        setPracticeAreasList(json.data || []);
      } catch (error) {
        console.error("Error fetching practice areas:", error);
        setPracticeAreasList([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeAreas();
  }, []);

  return (
    <>
      {/* Bar Number */}
      <FormField
        control={control}
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

      {/* Practice Area */}
      <FormField
        control={control}
        name="practiceArea"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Primary Practice Area</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loading
                        ? "Loading practice areas..."
                        : "Select your primary practice area"
                    }
                  />
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

      {/* Years of Experience */}
      <FormField
        control={control}
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

      {/* Consultation Fee */}
      <FormField
        control={control}
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
    </>
  );
}
