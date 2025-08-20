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
import { indianLocations } from "@/data/indianLocations/locations";
import { useFormContext } from "react-hook-form";

interface LocationInputsProps {
  control: Control<z.infer<typeof formSchema>>;
}

export function LocationInputs({ control }: LocationInputsProps) {
  const { watch } = useFormContext();
  const selectedState = watch("state");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <FormField
        control={control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      field.value === ""
                        ? "Select your state"
                        : "select your state"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {Object.keys(indianLocations).map((state) => (
                  <SelectItem
                    key={state}
                    value={state}>
                    {state}
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
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value}
              disabled={!selectedState}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      selectedState
                        ? "Select your city"
                        : "Select a state first"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {selectedState &&
                  indianLocations[selectedState].map((city) => (
                    <SelectItem
                      key={city}
                      value={city}>
                      {city}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
