"use client";

import { useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Control } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "../page"; // adjust if schema moved
import MultipleSelector, { Option } from "@/components/ui/multiselect";

interface SecondaryPracticeAreasInputProps {
  control: Control<z.infer<typeof formSchema>>;
}
// practicearea interface
// "id": "string",
//       "name": "string",
//       "description": "string",

interface PracticeArea {
  id: string;
  name: string;
  description: string;
}

export function SecondaryPracticeAreasInput({
  control,
}: SecondaryPracticeAreasInputProps) {
  const [practiceAreaOptions, setPracticeAreaOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPracticeAreas = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/static-data/practice-areas`
        );
        const json = await res.json();
        const options: Option[] = (json.data || []).map(
          (area: PracticeArea) => ({
            label: area.name,
            value: area,
          })
        );
        setPracticeAreaOptions(options);
      } catch (err) {
        console.error("Error fetching practice areas:", err);
        setPracticeAreaOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPracticeAreas();
  }, []);

  return (
    <FormField
      control={control}
      name="secondaryPracticeAreas"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Secondary Practice Areas</FormLabel>
          <FormControl>
            <MultipleSelector
              options={practiceAreaOptions}
              defaultOptions={practiceAreaOptions}
              value={practiceAreaOptions.filter((c) =>
                (field.value ?? []).includes(c.value)
              )}
              onChange={(selected) =>
                field.onChange(selected.map((s) => s.value))
              }
              placeholder={
                loading
                  ? "Loading practice areas..."
                  : "Select all Categories/Areas of law you Practice."
              }
              emptyIndicator={
                <p className="text-center text-sm">No categories found</p>
              }
              onSearchSync={(query) =>
                practiceAreaOptions.filter((c) =>
                  c.label.toLowerCase().includes(query.toLowerCase())
                )
              }
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
