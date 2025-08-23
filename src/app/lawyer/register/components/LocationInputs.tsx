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
import { Control, useFormContext } from "react-hook-form";
import * as z from "zod";
import { formSchema } from "../page.old";

interface LocationInputsProps {
  control: Control<z.infer<typeof formSchema>>;
}

interface State {
  id: string;
  name: string;
}

interface City {
  id: string;
  name: string;
}

export function LocationInputs({ control }: LocationInputsProps) {
  const { watch, setValue } = useFormContext();
  const selectedStateId = watch("state");

  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // fetch states on mount
  useEffect(() => {
    const fetchStates = async () => {
      setLoadingStates(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/static-data/states`
        );
        const json = await res.json();
        setStates(json.data || []); // ✅ unwrap .data
      } catch (err) {
        console.error("Error fetching states:", err);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };
    fetchStates();
  }, []);

  // fetch cities whenever state changes
  useEffect(() => {
    if (!selectedStateId) {
      setCities([]);
      return;
    }

    const fetchCities = async () => {
      setLoadingCities(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}/static-data/cities-by-state/${selectedStateId}`
        );
        const json = await res.json();
        setCities(json.data || []); // ✅ unwrap .data
        setValue("city", "");
      } catch (err) {
        console.error("Error fetching cities:", err);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };

    fetchCities();
  }, [selectedStateId, setValue]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {/* State Select */}
      <FormField
        control={control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>State</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || ""}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      loadingStates ? "Loading states..." : "Select your state"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem
                    key={state.id}
                    value={state.id}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* City Select */}
      <FormField
        control={control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>City</FormLabel>
            <Select
              onValueChange={field.onChange}
              value={field.value || ""}
              disabled={!selectedStateId || loadingCities}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue
                    placeholder={
                      !selectedStateId
                        ? "Select a state first"
                        : loadingCities
                        ? "Loading cities..."
                        : "Select your city"
                    }
                  />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {cities.map((city) => (
                  <SelectItem
                    key={city.id}
                    value={city.id} // ✅ return ID not name
                  >
                    {city.name}
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
