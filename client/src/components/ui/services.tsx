import { Card, CardContent } from "@/components/ui/card";
import { Check, Scissors, Shovel } from "lucide-react";

export default function Services() {
  const services = [
    {
      id: "mowing",
      title: "Lawn Mowing & Maintenance",
      description: "Professional lawn mowing and maintenance service for residential properties using a dependable push mower, string trimmer (weed eater), and leaf blower equipment — perfect for small to mid-sized residential lawns. Each visit includes:",
      icon: <Scissors className="text-xl" />,
      color: "primary",
      features: [
        "Even, full-coverage grass cutting",
        "Clean, precise edging along driveways, sidewalks, and flowerbeds",
        "Full blow-off of clippings from hard surfaces for a neat finish"
      ],
      startingPrice: "$30/visit",
      subscriptionOptions: [
        { type: "Weekly", price: "$30/visit", savings: "Most Popular" },
        { type: "Bi-weekly", price: "$35/visit", savings: "Great Value" },
        { type: "Monthly", price: "$40/visit", savings: "Budget Friendly" },
        { type: "Quarterly", price: "$50/visit", savings: "Seasonal" },
        { type: "Yearly", price: "Custom Quote", savings: "Best Rate" }
      ],
      image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16 fade-in-up">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">Our Service</h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Professional lawn mowing and maintenance service for residential properties in Kent County Delaware with flexible subscription options.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          {services.map((service, index) => (
            <Card key={service.id} className="service-card bg-neutral-50 shadow-lg hover:shadow-xl transition-all slide-in-left">
              <CardContent className="p-8">
                <img
                  src={service.image}
                  alt={service.title}
                  className="w-full h-48 object-cover rounded-xl mb-6"
                />

                <div className="flex items-center mb-4">
                  <div className="bg-primary text-white p-3 rounded-full mr-4">
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
                      <Check className="text-primary mr-3 w-4 h-4" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>

                <div className="bg-primary/10 p-4 rounded-xl mb-6">
                  <div className="text-sm text-primary font-semibold mb-1">
                    Starting at
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {service.startingPrice}
                  </div>
                  <div className="text-sm text-neutral-600">For residential lawns under 0.1 acre</div>
                </div>


              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
