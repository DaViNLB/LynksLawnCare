import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { CalendarCheck, Phone, Shield, Check } from "lucide-react";

export default function PricingCalculator() {
  const [serviceType] = useState("mowing");
  const [acres, setAcres] = useState([0.1]);
  const [pricing, setPricing] = useState({ basePrice: 30, totalPrice: 30 });

  const serviceDetails = {
    mowing: {
      base: 30,
      perAcre: 70,
      services: [
        "Even, full-coverage grass cutting",
        "Clean, precise edging along driveways, sidewalks, and flowerbeds", 
        "Full blow-off of clippings from hard surfaces for a neat finish"
      ]
    }
  };

  useEffect(() => {
    const service = serviceDetails[serviceType as keyof typeof serviceDetails];
    const acreValue = acres[0];
    const additional = acreValue > 0.1 ? (acreValue - 0.1) * service.perAcre : 0;
    const total = service.base + additional;

    setPricing({
      basePrice: service.base,
      totalPrice: total
    });
  }, [serviceType, acres]);

  const scrollToBooking = () => {
    const element = document.getElementById("booking");
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="pricing" className="py-20 bg-neutral-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">Get Instant Pricing</h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Our transparent pricing is based on your property size. Get an instant estimate and book your service today.
          </p>
        </div>

        <Card className="max-w-4xl mx-auto shadow-xl">
          <CardContent className="p-8">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Calculator Input */}
              <div>
                <h3 className="text-2xl font-bold text-neutral-800 mb-6">Calculate Your Price</h3>

                <div className="space-y-6">
                  <div className="bg-primary/10 p-4 rounded-lg">
                    <h4 className="font-semibold text-primary mb-2">Service: Lawn Mowing & Maintenance</h4>
                    <p className="text-sm text-neutral-600">Professional residential lawn care service</p>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-neutral-700 mb-2">Property Size (Acres)</label>
                    <div className="px-2">
                      <Slider
                        value={acres}
                        onValueChange={setAcres}
                        min={0.1}
                        max={2.5}
                        step={0.1}
                        className="w-full"
                      />
                    </div>
                    <div className="flex justify-between text-sm text-neutral-500 mt-2">
                      <span>0.1</span>
                      <span>1.25</span>
                      <span>2.5</span>
                    </div>
                    <div className="mt-3 text-center">
                      <span className="text-2xl font-bold text-primary">{acres[0]}</span>
                      <span className="text-neutral-600"> acres</span>
                    </div>
                  </div>

                  <Card className="bg-neutral-50">
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-neutral-800 mb-2">What's Included:</h4>
                      <div className="space-y-2 text-sm text-neutral-600">
                        {serviceDetails[serviceType as keyof typeof serviceDetails].services.map((service, idx) => (
                          <div key={idx} className="flex items-center">
                            <Check className="text-primary mr-2 w-4 h-4" />
                            <span>{service}</span>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Price Display */}
              <div className="bg-gradient-to-br from-primary to-secondary text-white p-8 rounded-xl">
                <h3 className="text-2xl font-bold mb-6">Your Estimate</h3>

                <div className="space-y-4 mb-6">
                  <div className="flex justify-between items-center">
                    <span>Base Service:</span>
                    <span className="font-semibold">${pricing.basePrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Property Size:</span>
                    <span className="font-semibold">{acres[0]} acres</span>
                  </div>
                  <hr className="border-white/30" />
                  <div className="flex justify-between items-center text-xl font-bold">
                    <span>Total Price:</span>
                    <span>${pricing.totalPrice.toFixed(2)}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <Button
                    onClick={scrollToBooking}
                    className="w-full bg-accent text-neutral-900 hover:bg-yellow-400"
                  >
                    <CalendarCheck className="w-4 h-4 mr-2" />
                    Book This Service
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full border-2 border-white text-white hover:bg-white hover:text-primary"
                  >
                    <Phone className="w-4 h-4 mr-2" />
                    Call for Custom Quote
                  </Button>
                </div>

                <div className="mt-6 text-sm text-white/80 flex items-center">
                  <Shield className="w-4 h-4 mr-2" />
                  100% Satisfaction Guarantee
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
