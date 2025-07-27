import { Card, CardContent } from "@/components/ui/card";
import { Check, Scissors, Shovel } from "lucide-react";

export default function Services() {
  const services = [
    {
      id: "mowing",
      title: "Lawn Mowing & Maintenance",
      description: "Regular mowing, edging, trimming, and basic lawn care to keep your grass healthy and beautiful. Includes weed removal, debris cleanup, and professional mowing patterns.",
      icon: <Scissors className="text-xl" />,
      color: "primary",
      features: [
        "Weekly or bi-weekly mowing",
        "Precision edging & trimming",
        "Debris removal & cleanup",
        "Basic weed removal"
      ],
      startingPrice: "$45/visit",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    },
    {
      id: "cleanup",
      title: "Seasonal Cleanup",
      description: "Comprehensive seasonal maintenance including leaf removal, branch cleanup, garden bed preparation, and property-wide debris removal to prepare your lawn for the changing seasons.",
      icon: <Shovel className="text-xl" />,
      color: "secondary",
      features: [
        "Complete leaf removal",
        "Branch & debris cleanup",
        "Garden bed preparation",
        "Property-wide cleanup"
      ],
      startingPrice: "$125/cleanup",
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">Our Premium Services</h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            We specialize in two core services designed to keep your lawn healthy, beautiful, and perfectly maintained year-round.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {services.map((service, index) => (
            <Card key={service.id} className={`service-card bg-neutral-50 shadow-lg hover:shadow-xl transition-all ${
              index === 0 ? "slide-in-left" : "slide-in-right"
            }`}>
              <CardContent className="p-8">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover rounded-xl mb-6"
                />

                <div className="flex items-center mb-4">
                  <div className={`${service.color === 'primary' ? 'bg-primary' : 'bg-secondary'} text-white p-3 rounded-full mr-4`}>
                    {service.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-neutral-800">{service.title}</h3>
                </div>

                <p className="text-neutral-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <div className="space-y-3 mb-6">
                  {service.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-neutral-700">
                      <Check className={`${service.color === 'primary' ? 'text-primary' : 'text-secondary'} mr-3 w-4 h-4`} />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className={`${service.color === 'primary' ? 'bg-primary/10' : 'bg-secondary/10'} p-4 rounded-xl`}>
                  <div className={`text-sm ${service.color === 'primary' ? 'text-primary' : 'text-secondary'} font-semibold mb-1`}>
                    Starting at
                  </div>
                  <div className={`text-2xl font-bold ${service.color === 'primary' ? 'text-primary' : 'text-secondary'}`}>
                    {service.startingPrice}
                  </div>
                  <div className="text-sm text-neutral-600">Based on lawn size</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
