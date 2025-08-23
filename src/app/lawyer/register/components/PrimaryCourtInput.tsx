"use client";

import { useEffect, useState } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
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

interface PrimaryCourtInputProps {
  control: Control<z.infer<typeof formSchema>>;
}

interface Court {
  id: string;
  name: string;
}

export function PrimaryCourtInput({ control }: PrimaryCourtInputProps) {
  const [courts, setCourts] = useState<Court[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchCourts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/static-data/courts`
        );
        const json = await res.json();
        setCourts(json.data || []);
      } catch (err) {
        console.error("Error fetching courts:", err);
        setCourts([]);
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
          <Select
            onValueChange={field.onChange}
            value={field.value || ""}>
            <FormControl>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    loading ? "Loading courts..." : "Select your primary court"
                  }
                />
              </SelectTrigger>
            </FormControl>
            <SelectContent>
              {courts.map((court) => (
                <SelectItem
                  key={court.id}
                  value={court.id}>
                  {court.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
