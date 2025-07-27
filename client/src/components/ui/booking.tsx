import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CalendarCheck, CreditCard, Shield, Smartphone, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { useLocation } from "wouter";

export default function Booking() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    serviceType: "",
    propertySize: "",
    subscription: "",
    notes: ""
  });

  const bookingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/bookings", data);
      return response.json();
    },
    onSuccess: (booking) => {
      toast({
        title: "Booking Created Successfully!",
        description: "Redirecting to payment...",
      });
      // Redirect to checkout page
      setLocation(`/checkout/${booking.id}`);
    },
    onError: (error: any) => {
      toast({
        title: "Booking Failed",
        description: error.message || "There was an error creating your booking.",
        variant: "destructive",
      });
    },
  });

  const calculatePrice = (serviceType: string, acres: number) => {
    const pricing = {
      mowing: { base: 30, perAcre: 70 }
    };

    const service = pricing[serviceType as keyof typeof pricing];
    if (!service) return 0;

    const additional = acres > 0.1 ? (acres - 0.1) * service.perAcre : 0;
    return service.base + additional;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const acres = parseFloat(formData.propertySize);
    const estimatedPrice = calculatePrice(formData.serviceType, acres);

    bookingMutation.mutate({
      ...formData,
      propertySize: acres.toString(),
      estimatedPrice: estimatedPrice.toString(),
      status: "pending"
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="booking" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">Schedule Your Service</h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Book your lawn care service online. Choose your preferred date and time, and we'll take care of the rest.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Booking Form */}
            <Card className="bg-neutral-50">
              <CardHeader>
                <CardTitle className="text-2xl">Book Your Appointment</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name</Label>
                      <Input
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name</Label>
                      <Input
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className="mt-2"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="address">Service Address</Label>
                    <Textarea
                      id="address"
                      rows={3}
                      required
                      placeholder="Enter your full address including city and ZIP code"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="serviceType">Service Type</Label>
                    <Select value={formData.serviceType} onValueChange={(value) => handleInputChange("serviceType", value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mowing">Lawn Mowing & Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="subscription">Subscription</Label>
                    <Select value={formData.subscription} onValueChange={(value) => handleInputChange("subscription", value)}>
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Select subscription option" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="one-time">One-time</SelectItem>
                        <SelectItem value="weekly">Weekly</SelectItem>
                        <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
                        <SelectItem value="monthly">Monthly</SelectItem>
                        <SelectItem value="quarterly">Quarterly</SelectItem>
                        <SelectItem value="yearly">Yearly</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="propertySize">Property Size (approximate acres)</Label>
                    <Input
                      id="propertySize"
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="2.5"
                      required
                      value={formData.propertySize}
                      onChange={(e) => handleInputChange("propertySize", e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="notes">Additional Notes</Label>
                    <Textarea
                      id="notes"
                      rows={3}
                      placeholder="Any specific requirements or notes about your property"
                      value={formData.notes}
                      onChange={(e) => handleInputChange("notes", e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-primary text-white hover:bg-secondary py-3"
                    disabled={bookingMutation.isPending}
                  >
                    <CalendarCheck className="w-4 h-4 mr-2" />
                    {bookingMutation.isPending ? "Creating Booking..." : "Schedule Free Estimate"}
                  </Button>

                  <div className="text-sm text-neutral-600 text-center flex items-center justify-center">
                    <Shield className="w-4 h-4 mr-1" />
                    Your information is secure and protected
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Calendly Integration & Payment Info */}
            <div className="space-y-8">
              {/* Calendly Widget Placeholder */}
              <Card className="bg-gradient-to-br from-primary to-secondary text-white">
                <CardHeader>
                  <CardTitle className="text-2xl">Available Times</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-white/20 rounded-xl p-6 backdrop-filter backdrop-blur-sm">
                    <div className="text-center py-8">
                      <CalendarCheck className="w-16 h-16 mx-auto mb-4 opacity-75" />
                      <p className="text-lg">Interactive calendar will load here</p>
                      <p className="text-sm opacity-75 mt-2">Choose your preferred appointment time</p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center text-sm">
                    <CalendarCheck className="w-4 h-4 mr-2" />
                    <span>Most appointments available within 48 hours</span>
                  </div>
                </CardContent>
              </Card>

              {/* Payment Information */}
              <Card className="bg-neutral-50">
                <CardHeader>
                  <CardTitle className="text-2xl">Payment Options</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center p-4 bg-white rounded-xl">
                    <CreditCard className="text-2xl text-primary mr-4 w-8 h-8" />
                    <div>
                      <div className="font-semibold text-neutral-800">Secure Online Payment</div>
                      <div className="text-sm text-neutral-600">Pay securely after service completion</div>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-white rounded-xl">
                    <Smartphone className="text-2xl text-primary mr-4 w-8 h-8" />
                    <div>
                      <div className="font-semibold text-neutral-800">Mobile Payments</div>
                      <div className="text-sm text-neutral-600">Apple Pay, Google Pay supported</div>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-white rounded-xl">
                    <DollarSign className="text-2xl text-primary mr-4 w-8 h-8" />
                    <div>
                      <div className="font-semibold text-neutral-800">Flexible Options</div>
                      <div className="text-sm text-neutral-600">Cash, check, or digital payment</div>
                    </div>
                  </div>

                  <Card className="bg-accent/20">
                    <CardContent className="p-4">
                      <div className="flex items-center text-neutral-800">
                        <Shield className="text-primary mr-2 w-4 h-4" />
                        <span className="font-semibold">100% Secure</span>
                      </div>
                      <p className="text-sm text-neutral-600 mt-1">All payments are processed securely through Stripe</p>
                    </CardContent>
                  </Card>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
