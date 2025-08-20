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
import {
  bringPracticeAreas,
  practiceArea,
} from "@/data/pacticeAreas/pacticeAreas";

interface ProfessionalInfoInputsProps {
  control: Control<z.infer<typeof formSchema>>;
}

export function ProfessionalInfoInputs({
  control,
}: ProfessionalInfoInputsProps) {
  const [practiceAreasList, setPracticeAreasList] = useState<practiceArea[]>(
    []
  );

  useEffect(() => {
    const fetchAndSetPracticeAreas = async () => {
      try {
        const areas = await bringPracticeAreas();
        setPracticeAreasList(areas);
        console.log("Practice areas fetched:", areas);
      } catch (error) {
        console.error("Error fetching practice areas:", error);
      }
    };

    fetchAndSetPracticeAreas();
  }, []);

  return (
    <>
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
      <FormField
        control={control}
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
