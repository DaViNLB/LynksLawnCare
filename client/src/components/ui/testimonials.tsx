import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

export default function Testimonials() {
  const beforeAfterPhotos = [
    {
      before: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      after: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      location: "Harrington, DE - Seasonal Cleanup"
    },
    {
      before: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      after: "https://images.unsplash.com/photo-1570129477492-45c003edd2be?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      location: "Felton, DE - Regular Maintenance"
    },
    {
      before: "https://images.unsplash.com/photo-1544198365-f5d60b6d8190?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      after: "https://images.unsplash.com/photo-1572776685600-aca8c3456337?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600",
      location: "Houston, DE - Full Cleanup"
    }
  ];

  const testimonials = [
    {
      name: "Mike Thompson",
      location: "Felton, DE",
      review: "GreenScape Pro transformed our overgrown lawn into something we're truly proud of. Their attention to detail and reliability is unmatched!",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      name: "Sarah Martinez",
      location: "Harrington, DE",
      review: "Professional, punctual, and affordable. They've been maintaining our lawn for over a year and it's never looked better!",
      avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b5e3?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    },
    {
      name: "David Chen",
      location: "Farmington, DE",
      review: "Their seasonal cleanup service is fantastic. They left our property spotless and ready for winter. Highly recommend!",
      avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=100&h=100"
    }
  ];

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">What Our Customers Say</h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            See the transformation stories and read reviews from our satisfied customers across Delaware.
          </p>
        </div>

        {/* Before/After Gallery */}
        <div className="mb-16">
          <h3 className="text-2xl font-bold text-center text-neutral-800 mb-8">Before & After Transformations</h3>
          <div className="grid md:grid-cols-3 gap-8">
            {beforeAfterPhotos.map((photo, index) => (
              <div key={index} className="before-after-card group">
                <div className="relative overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={photo.before}
                    alt="Before lawn transformation"
                    className="w-full h-48 object-cover transition-opacity duration-500 group-hover:opacity-0"
                  />
                  <img
                    src={photo.after}
                    alt="After lawn transformation"
                    className="absolute inset-0 w-full h-48 object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  />
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-semibold group-hover:hidden">
                    BEFORE
                  </div>
                  <div className="absolute top-4 left-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
                    AFTER
                  </div>
                </div>
                <div className="p-4 text-center">
                  <p className="text-neutral-600">{photo.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Customer Reviews */}
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="testimonial-card shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-accent text-lg">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-neutral-700 mb-4 italic">"{testimonial.review}"</p>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <div className="font-semibold text-neutral-800">{testimonial.name}</div>
                    <div className="text-sm text-neutral-600">{testimonial.location}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
