import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronRight, Info } from "lucide-react";

export default function ServiceArea() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);

  const locations = [
    { id: "felton", name: "Felton, DE", description: "Full service area", position: { top: "25%", left: "33%" } },
    { id: "harrington", name: "Harrington, DE", description: "Full service area", position: { top: "33%", right: "25%" } },
    { id: "farmington", name: "Farmington, DE", description: "Full service area", position: { bottom: "33%", left: "50%" } },
    { id: "houston", name: "Houston, DE", description: "Full service area", position: { top: "50%", right: "33%" } },
    { id: "brownsville", name: "Brownsville, DE", description: "Full service area", position: { bottom: "25%", left: "25%" } }
  ];

  return (
    <section id="service-area" className="py-20 bg-neutral-100">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">Our Service Area</h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            We proudly serve Delaware communities with professional lawn care services. Click on a location to learn more.
          </p>
        </div>

        <Card className="max-w-5xl mx-auto shadow-xl overflow-hidden">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-2">
              {/* Interactive Map */}
              <div className="relative h-96 md:h-full bg-neutral-200">
                <img
                  src="https://images.unsplash.com/photo-1472214103451-9374bd1c798e?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600"
                  alt="Delaware service area map"
                  className="w-full h-full object-cover"
                />

                {/* Service Location Markers */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="relative w-full h-full max-w-md">
                    {locations.map((location) => (
                      <button
                        key={location.id}
                        className="location-pin absolute transform -translate-x-1/2 -translate-y-1/2"
                        style={location.position}
                        onClick={() => setSelectedLocation(location.id)}
                      >
                        <div className={`w-8 h-8 rounded-full border-4 border-white shadow-lg pulse ${
                          selectedLocation === location.id ? 'bg-secondary' : 'bg-primary'
                        }`}></div>
                        <div className="text-xs font-semibold text-neutral-800 mt-1">
                          {location.name.split(',')[0]}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Location Information */}
              <div className="p-8">
                <div id="location-info">
                  <h3 className="text-2xl font-bold text-neutral-800 mb-4">Delaware Service Areas</h3>
                  <p className="text-neutral-600 mb-6">
                    Select a location on the map to see specific service details for that area.
                  </p>

                  <div className="space-y-4">
                    {locations.map((location) => (
                      <div
                        key={location.id}
                        className={`service-area-item p-4 rounded-xl cursor-pointer transition-colors ${
                          selectedLocation === location.id
                            ? 'bg-primary/20 border-2 border-primary'
                            : 'bg-neutral-50 hover:bg-primary/10'
                        }`}
                        onClick={() => setSelectedLocation(location.id)}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-semibold text-neutral-800">{location.name}</h4>
                            <p className="text-sm text-neutral-600">{location.description}</p>
                          </div>
                          <ChevronRight className="text-primary w-4 h-4" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <Card className="mt-6 bg-primary/10">
                    <CardContent className="p-4">
                      <div className="flex items-center text-primary mb-2">
                        <Info className="w-4 h-4 mr-2" />
                        <span className="font-semibold">Service Range</span>
                      </div>
                      <p className="text-sm text-neutral-700">
                        We serve all areas within a 25-mile radius of our central location. Contact us to confirm service availability in your area.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
