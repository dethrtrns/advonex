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
import { formSchema } from "../page.old";
import MultipleSelector, { Option } from "@/components/ui/multiselect";

interface PrimaryCourtInputProps {
  control: Control<z.infer<typeof formSchema>>;
}

interface Court {
  id: string;
  name: string;
}

export function PrimaryCourtInput({ control }: PrimaryCourtInputProps) {
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
          value: court.id, // temp changed id to name till backend fixed to support id
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
      name="primaryCourt"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Primary Court</FormLabel>
          <FormControl>
            <MultipleSelector
              options={courtOptions} // 👈 add this
              defaultOptions={courtOptions}
              value={
                field.value
                  ? courtOptions.filter((c) => c.value === field.value)
                  : []
              }
              onChange={(selected) => {
                // MultipleSelector gives array of Option objects
                field.onChange(selected.length > 0 ? selected[0].value : "");
              }}
              placeholder={
                loading ? "Loading courts..." : "Select your primary court"
              }
              emptyIndicator={
                <p className="text-center text-red-400 text-sm">
                  No courts found
                </p>
              }
              maxSelected={1} // single select
              // onSearchSync={(inputValue) =>
              //   courtOptions.filter((c) =>
              //     c.label.toLowerCase().includes(inputValue.toLowerCase())
              //   )
              // }
              // onSearchSync={(inputValue) => {
              //   if (!inputValue) return courtOptions;
              //   return courtOptions.filter((c) =>
              //     c.label.toLowerCase().includes(inputValue.toLowerCase())
              //   );
              // }}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
