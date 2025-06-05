"use client"

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useState } from "react";
import { Lawyer, getLawyerProfile, updateLawyerProfile } from "@/services/lawyerService"; // Import updateLawyerProfile
import { Loader, MapPin, Mail, Phone, Briefcase, GraduationCap } from "lucide-react";
import { toast } from "sonner";
import { indianLocations } from "@/data/indianLocations/locations";
import { practiceAreas } from "@/data/pacticeAreas/pacticeAreas";
import { ImageUpload } from "@/components/ui/image-upload";
import { useAuth } from "@/contexts/AuthContext";


const formSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 digits").optional(),
  state: z.string().min(1, "State is required"),
  city: z.string().min(1, "City is required"),
  barNumber: z.string().min(1, "Bar number is required"),
  practiceArea: z.string().min(1, "Practice area is required"),
  experience: z.number().min(0, "Years of experience must be 0 or greater"),
  bio: z.string().min(50, "Bio must be at least 50 characters"),
  lawSchool: z.string().min(1, "Law school is required"),
  degree: z.string().min(1, "Degree is required"),
  graduationYear: z.number()
    .min(1900, "Invalid graduation year")
    .max(new Date().getFullYear(), "Graduation year cannot be in the future"),
  primaryCourt: z.string().min(1, "At least one practice court is required"),
  practiceCourts: z.string().optional(),
  consultFee: z.number().min(0, "Consultation fee must be 0 or greater"),
  photo: z.string().optional(),
});



export default function LawyerDashboard() {
  const [lawyer, setLawyer] = useState<Lawyer | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false); // Add submitting state
  const [cities, setCities] = useState<string[]>([]);

  const {user} = useAuth();
  const profileId = user?.lawyerProfileId as string | null;
 
  // Add more detailed logging
  
  console.log('User object:', user);
  console.log('Profile ID:', profileId);
  console.log('User authenticated:', !!user);
  
  if (user && !profileId) {
    console.log("User does not have lawyer profile ID!");
    alert("User not authorised!");
    window.location.href = "/";
    return null;
  }

  if (!user) {
    console.log("User is not Authenticated!");
    alert("Please login to continue!");
    window.location.href = "/";
    return null;
  }
  
 

  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",  
      lastName: "",   
      email: "",
      phone: "",
      state: "",
      city: "",
      barNumber: "",  // Fix: changed barId to barNumber to match schema
      practiceArea: "" ,
      experience: 0,
      bio: "",
      consultFee: 0,
      practiceCourts: "",
      primaryCourt: "",
      lawSchool: "",  // Fix: changed institution to lawSchool
      degree: "",
      graduationYear: 0,  // Fix: changed year to graduationYear
      photo: "",
    }
  });

  
   // Update cities when state changes
   const selectedState = form.watch("state");
   useEffect(() => {
     if (selectedState) {
       setCities(indianLocations[selectedState as keyof typeof indianLocations] || []);
       form.setValue("city", ""); // Reset city when state changes
     }
   }, [selectedState, form]);

  useEffect(() => {

    const fetchProfile = async (profileId: string | null) => {
      try {
       
        if (user?.profileId) {
          console.log(`Current Authenticated User with ProfileId: ${user.profileId}   `);
        }
        {
          console.log(`Hardcoded Profile Id: 550e8400-e29b-41d4-a716-446655440030 `);
        }
        const profile = await getLawyerProfile( (profileId) ? profileId : '550e8400-e29b-41d4-a716-446655440030');
        
        setLawyer(profile);
        
        // Split name into first and last name
        const profileName = profile?.name ? profile.name : '' ;
       
        const nameParts = profileName.split(' ');
        const firstName = nameParts[0];
        const lastName = nameParts.slice(1).join(' ');
        
        
        
        // Populate form with existing data
        form.reset({
          firstName,
          lastName,
          email: profile.email,
          phone: profile.phone,
          state: profile.location?.split(', ')[1] || '', // Extract state from location
          city: profile.location?.split(', ')[0] || '', // Extract city from location
          barNumber: profile.barId || '',
          practiceArea: profile.practiceAreas[0]?.practiceArea.name.toLowerCase().replace(/ /g, '-') || '', // Use practiceArea.name
          experience: profile.experience || 0,
          bio: profile.bio || '',
          consultFee: profile.consultFee || 0,
          primaryCourt: profile.primaryCourt?.name || '', // Use primaryCourt.name
          practiceCourts: profile.practiceCourts?.[0]?.practiceCourt.name || '', // Use first practiceCourt name
          lawSchool: profile.education?.institution || '',
          degree: profile.education?.degree || '',
          graduationYear: profile.education?.year || 0, // year is already a number in the interface
          photo: profile.photo || ''
        });

      } catch (error) {
        
        console.error("Error fetching profile:", error);
        toast.error("Failed to load profile");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile(profileId);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [form.reset]); // Depend on form.reset to ensure it runs once on mount

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (!lawyer) return; // Should not happen if form is enabled only when lawyer exists

    setIsSubmitting(true); // Set submitting state
    try {
      // Transform form data to match API structure (UpdateLawyer interface: Different from lawyer interface)
      const transformedData = {
        name: `${values.firstName} ${values.lastName}`,
        // phone: values.phone,
        location: `${values.city}, ${values.state}`, 
        barId: values.barNumber,
        // practiceArea: [{ 
        //   practiceArea: {
        //     name: values.practiceArea,
        //   }
        // }],
        experience: values.experience,
        bio: values.bio,
        consultFee: values.consultFee,
        specialization: values.practiceArea,
        primaryCourt:  values.primaryCourt,
        
        // practiceCourts: values.practiceCourts ? [{
        //   practiceCourt: {
        //     name: values.practiceCourts
        //   }
        // }] : [],
        education: {
          // id, createdAt, updatedAt, and lawyerProfileId are missing but likely handled by the API
          institution: values.lawSchool,
          degree: values.degree,
          year: Number(values.graduationYear) // Changed from String to Number to match the interface
        },
        photo: values.photo ? values.photo : lawyer.photo,
      };

      console.log("Updating profile with:", transformedData);

      // Call the service function
      const updatedProfile = await updateLawyerProfile(transformedData);

      setLawyer(updatedProfile); // Update local state with the response from API
      form.reset(values); // Reset form with current values to prevent dirty state
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      // Error toast is handled in the service function
      console.error("Failed to update profile:", error);
    } finally {
      setIsSubmitting(false); // Reset submitting state
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-semibold text-destructive">Error</h2>
        <p className="text-muted-foreground">Could not load profile</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mt-8">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <Button onClick={() => setIsEditing(!isEditing)}>
          {isEditing ? "Cancel" : "Edit Profile"}
        </Button>
      </div>

      {isEditing ? (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* <Card>
              <CardHeader>
                <CardTitle>Profile Photo</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="photo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Profile Photo URL</FormLabel>
                      <FormControl>
                        <Input type="text" placeholder="Enter photo URL" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                {lawyer.photo && (
                  <div className="mt-4">
                    <img 
                      src={lawyer.photo} 
                      alt="Current profile photo" 
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                  </div>
                )}
              </CardContent>
            </Card> */}

             {/* Image Upload section */}
          
    <FormField
           control={form.control}
           name="photo"
           render={({ field }) => (
          <FormItem>
            <FormLabel>Profile Picture</FormLabel>
            <FormControl>
          <div className="flex">
            <input type="hidden" {...field} />
          <ImageUpload 
            buttonText="Upload Profile Picture"
            onUploadComplete={(imageUrl) => {
              field.onChange(imageUrl);
              console.log("Image URL updated:", imageUrl);
            }}
            name={`${form.watch("firstName")} ${form.watch("lastName")} `}
            photo={lawyer.photo}
          />
        </div>
      </FormControl>
      <FormMessage />
      </FormItem>
      )}
    />

            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your first name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Last Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your last name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Email Field */}
                {/* <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="Enter your email address" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}
                 {/* Phone Number Field */}

                {/* <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input type="tel" placeholder="Enter your phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                /> */}

                {/* Location Fields - State and City */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="state"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>State</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={(field.value ==="") ? "Select your state" : "select your state"} />
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
                  control={form.control}
                  name="city"
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
                            <SelectValue placeholder={selectedState ? "Select your city" : "Select a state first"} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {cities.map((city) => (
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="barNumber"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bar Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your bar number" {...field} />
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
                      {/* Use value prop instead of defaultValue for controlled component */}
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your primary practice area" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {practiceAreas.map((area) => (
                            <SelectItem key={area} value={area.toLowerCase().replace(/ /g, "-")}>
                              {area}
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
                <FormField
                  control={form.control}
                  name="primaryCourt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Primary Court</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Family Court" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="practiceCourts"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Secondary Court (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Civil Court" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Professional Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Write a brief description of your professional background and expertise"
                          className="h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Education</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="lawSchool"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Law School</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter your law school name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="degree"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Degree</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Juris Doctor (J.D.)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="graduationYear"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Graduation Year</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1900"
                            max={new Date().getFullYear()}
                            placeholder="Enter graduation year"
                            {...field}
                            onChange={(e) => field.onChange(Number(e.target.value))}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end space-x-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full md:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </div>
          </form>
        </Form>
      ) : (
        <div className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle>Profile Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center justify-center sm:flex-row items-center justify-start gap-8 ">
            {lawyer.photo && (
                  <div className=""><img
                    src={lawyer.photo}
                    alt={lawyer.name}
                    className="h-46 w-46 rounded-lg object-cover"
                  /></div>
                )}
              <div className="">
               
                <div>
                  <h2 className="text-2xl font-bold">{lawyer.name}</h2>
                  <div className="flex items-center text-sm text-muted-foreground">
                    <MapPin className="mr-1 h-4 w-4" />
                    {lawyer.location}
                  </div>
                  <div className="mt-4 flex items-center space-x-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Bar ID</div>
                      <div className="font-medium">{lawyer.barId}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Practice Area</div>
                      <div className="font-medium">{lawyer.specialization?.name}</div>
                    </div>
                    
                  </div>
                  <div>
                      <div className="text-sm text-muted-foreground mt-4">Consultation Fee</div>
                      <div className="text-2xl font-bold text-primary">${lawyer.consultFee}/hr</div>
                    </div>
                  </div>
              </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Email</div>
                    <div className="text-sm text-muted-foreground">{lawyer.email}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Phone</div>
                    <div className="text-sm text-muted-foreground">{lawyer.phone}</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Professional Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Briefcase className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Experience</div>
                    <div className="text-sm text-muted-foreground">{lawyer.experience} years</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="text-sm font-medium">Education</div>
                    <div className="text-sm text-muted-foreground">
                      {lawyer.education?.degree} - {lawyer.education?.institution}
                    </div>
                    <div className="text-sm text-muted-foreground">Class of {lawyer.education?.year}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{lawyer.bio}</p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}


