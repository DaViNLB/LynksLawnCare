import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Award, Users, Clock, Leaf, Phone, Star } from "lucide-react";

export default function About() {
  const features = [
    {
      icon: <Award className="w-6 h-6" />,
      title: "Licensed & Insured",
      description: "Fully covered for your peace of mind",
      color: "primary"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Local Team",
      description: "Delaware residents serving neighbors",
      color: "secondary"
    },
    {
      icon: <Clock className="w-6 h-6" />,
      title: "Reliable Service",
      description: "On-time, every time guarantee",
      color: "accent"
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="about" className="py-20 bg-neutral-100">
      <div className="container mx-auto px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="slide-in-left">
              <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">About Lynks Lawn Care</h2>
              <p className="text-xl text-neutral-600 mb-6 leading-relaxed">
                We're a family-owned lawn care business serving Delaware communities with passion and professionalism. Founded in 2018, we've built our reputation on quality work, reliable service, and satisfied customers.
              </p>
              <p className="text-neutral-600 mb-8 leading-relaxed">We take pride in transforming outdoor spaces and exceeding customer expectations with every service.</p>

              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-center">
                    <div className={`${
                      feature.color === 'primary' ? 'bg-primary' :
                      feature.color === 'secondary' ? 'bg-secondary' :
                      'bg-accent text-neutral-900'
                    } text-white p-3 rounded-full mr-4`}>
                      {feature.icon}
                    </div>
                    <div>
                      <div className="font-semibold text-neutral-800">{feature.title}</div>
                      <div className="text-sm text-neutral-600">{feature.description}</div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  onClick={() => scrollToSection("contact")}
                  className="bg-primary text-white hover:bg-secondary"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  Contact Us
                </Button>
              </div>
            </div>

            <div className="slide-in-right">
              <img
                src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                alt="Professional lawn care team providing quality service"
                className="w-full rounded-2xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
