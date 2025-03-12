// import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MapPin, Mail, Phone, Star, Briefcase, GraduationCap } from "lucide-react";
// import Link from "next/link";

type LawyerProfile = {
  id: string;
  name: string;
  photo: string;
  practiceAreas: string[];
  location: string;
  rating: number;
  reviewCount: number;
  experience: number;
  email: string;
  phone: string;
  bio: string;
  education: Array<{
    degree: string;
    institution: string;
    year: string;
  }>;
  reviews: Array<{
    id: string;
    author: string;
    rating: number;
    comment: string;
    date: string;
  }>;
};

const mockLawyerProfile: LawyerProfile = {
  id: "1",
  name: "Sarah Johnson",
  photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1000&auto=format&fit=crop",
  practiceAreas: ["Civil Law", "Family Law", "Estate Planning"],
  location: "New York, NY",
  rating: 4.8,
  reviewCount: 127,
  experience: 12,
  email: "sarah.johnson@advonex.com",
  phone: "(555) 123-4567",
  bio: "Sarah Johnson is a highly experienced attorney specializing in civil and family law. With over 12 years of practice, she has successfully handled numerous complex cases and is known for her dedication to client advocacy and thorough approach to legal matters.",
  education: [
    {
      degree: "Juris Doctor",
      institution: "Harvard Law School",
      year: "2011"
    },
    {
      degree: "Bachelor of Arts in Political Science",
      institution: "Yale University",
      year: "2008"
    }
  ],
  reviews: [
    {
      id: "r1",
      author: "John D.",
      rating: 5,
      comment: "Sarah was extremely professional and helped me navigate a complex divorce case. Her expertise and compassion made a difficult situation much easier to handle.",
      date: "2024-02-15"
    },
    {
      id: "r2",
      author: "Maria R.",
      rating: 4.5,
      comment: "Very knowledgeable in family law. Always responsive and provided clear explanations throughout the process.",
      date: "2024-01-28"
    }
  ]
}


export default function LawyerProfile() {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="flex flex-col gap-6 md:flex-row md:items-start">
        <div className="relative aspect-square w-full max-w-sm overflow-hidden rounded-lg md:w-1/4">
          <img
            src={mockLawyerProfile.photo}
            alt={mockLawyerProfile.name}
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1 space-y-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">{mockLawyerProfile.name}</h1>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{mockLawyerProfile.location}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {mockLawyerProfile.practiceAreas.map((area) => (
              <span
                key={area}
                className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary"
              >
                {area}
              </span>
            ))}
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-yellow-400" />
              <span className="font-medium">{mockLawyerProfile.rating}/5.0</span>
              <span className="text-muted-foreground">({mockLawyerProfile.reviewCount} reviews)</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Briefcase className="h-4 w-4" />
              <span>{mockLawyerProfile.experience} years experience</span>
            </div>
          </div>

          {/* <div className="flex flex-col gap-3 sm:flex-row">
            <Button className="flex-1" size="lg">
              <Calendar className="mr-2 h-4 w-4" />
              Book Consultation
            </Button>
            <Button variant="outline" className="flex-1" size="lg">
              <MessageSquare className="mr-2 h-4 w-4" />
              Send Message
            </Button>
          </div> */}
        </div>
      </div>

      {/* Contact Information */}
      <Card>
        <CardContent className="grid gap-4 p-6 sm:grid-cols-2">
          <div className="flex items-center gap-3">
            <Mail className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Email</div>
              <a href={`mailto:${mockLawyerProfile.email}`} className="text-sm text-muted-foreground hover:underline">
                {mockLawyerProfile.email}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="h-5 w-5 text-muted-foreground" />
            <div>
              <div className="text-sm font-medium">Phone</div>
              <a href={`tel:${mockLawyerProfile.phone}`} className="text-sm text-muted-foreground hover:underline">
                {mockLawyerProfile.phone}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">About</h2>
        <p className="text-muted-foreground">{mockLawyerProfile.bio}</p>
      </div>

      {/* Education Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Education</h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {mockLawyerProfile.education.map((edu) => (
            <Card key={edu.institution}>
              <CardContent className="flex items-start gap-4 p-6">
                <GraduationCap className="h-5 w-5 text-primary" />
                <div>
                  <div className="font-medium">{edu.degree}</div>
                  <div className="text-sm text-muted-foreground">{edu.institution}</div>
                  <div className="text-sm text-muted-foreground">{edu.year}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Reviews Section */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Client Reviews</h2>
        <div className="grid gap-4">
          {mockLawyerProfile.reviews.map((review) => (
            <Card key={review.id}>
              <CardContent className="p-6">
                <div className="mb-2 flex items-center justify-between">
                  <div className="font-medium">{review.author}</div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 text-yellow-400" />
                    <span>{review.rating}</span>
                  </div>
                </div>
                <p className="text-muted-foreground">{review.comment}</p>
                <div className="mt-2 text-sm text-muted-foreground">{review.date}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}