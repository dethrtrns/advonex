"use client";

import { z } from "zod";
import { useForm, useFormContext } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
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
import { indianLocations } from "@/data/indianLocations/locations";

const schema = z.object({
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
});

type LocationInputsData = z.infer<typeof schema>;

interface Props {
  initialValues?: LocationInputsData;
  submitMode?: "internal" | "external";
  onSubmit?: (values: LocationInputsData) => Promise<void>;
}

export function LocationInputs({
  initialValues,
  submitMode = "internal",
  onSubmit,
}: Props) {
  const form = useForm<LocationInputsData>({
    resolver: zodResolver(schema),
    defaultValues: initialValues,
  });

  const selectedState = form.watch("state");

  const handleSubmit = async (values: LocationInputsData) => {
    if (submitMode === "internal") {
      try {
        await updateLawyerProfile({
          location: `${values.city}, ${values.state}`,
        });
        toast.success("Location info updated");
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            name="state"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>State</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.keys(indianLocations).map((state) => (
                      <SelectItem key={state} value={state}>
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
            name="city"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>City</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={!selectedState}
                >
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
                        <SelectItem key={city} value={city}>
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
        {submitMode === "internal" && (
          <Button type="submit">Save</Button>
        )}
      </form>
    </Form>
  );
}
