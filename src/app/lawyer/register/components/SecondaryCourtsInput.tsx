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

interface SecondaryCourtsInputProps {
  control: Control<z.infer<typeof formSchema>>;
}

interface Court {
  id: string;
  name: string;
}

export function SecondaryCourtsInput({ control }: SecondaryCourtsInputProps) {
  const [courtOptions, setCourtOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/static-data/courts`
        );
        const json = await res.json();
        const options: Option[] = (json.data || []).map((court: Court) => ({
          label: court.name,
          value: court.name, // temp changed id to name till backend fixed to support id
        }));
        setCourtOptions(options);
      } catch (err) {
        console.error("Error fetching courts:", err);
        setCourtOptions([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCourts();
  }, []);

  return (
    <FormField
      control={control}
      name="secondaryCourts"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Secondary Courts</FormLabel>
          <FormControl>
            <MultipleSelector
              options={courtOptions}
              defaultOptions={courtOptions}
              value={courtOptions.filter((c) =>
                (field.value ?? []).includes(c.value)
              )}
              onChange={(selected) =>
                field.onChange(selected.map((s) => s.value))
              }
              placeholder={
                loading ? "Loading courts..." : "Select secondary courts"
              }
              emptyIndicator={
                <p className="text-center text-sm">No courts found</p>
              }
              onSearchSync={(query) =>
                courtOptions.filter((c) =>
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
