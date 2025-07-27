import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Phone, Mail, Clock, Send, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

export default function Contact() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    service: "",
    address: "",
    message: ""
  });

  const contactMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/contacts", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Message Sent Successfully!",
        description: "We'll respond to your inquiry within 24 hours.",
      });
      setFormData({
        name: "",
        email: "",
        phone: "",
        service: "",
        address: "",
        message: ""
      });
    },
    onError: (error: any) => {
      toast({
        title: "Message Failed",
        description: error.message || "There was an error sending your message.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    contactMutation.mutate(formData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <section id="contact" className="py-20 bg-white">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-neutral-800 mb-6">Get In Touch</h2>
          <p className="text-xl text-neutral-600 max-w-3xl mx-auto">
            Ready to transform your lawn? Contact us today for a free estimate or to schedule your service.
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              <Card className="bg-neutral-50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-primary text-white p-3 rounded-full mr-4">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800">Phone</h3>
                      <p className="text-neutral-600">(302) 555-LAWN</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-neutral-50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-secondary text-white p-3 rounded-full mr-4">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800">Email</h3>
                      <p className="text-neutral-600">info@lynkslawncare.com</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-neutral-50">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className="bg-accent text-neutral-900 p-3 rounded-full mr-4">
                      <Clock className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-neutral-800">Business Hours</h3>
                      <div className="text-neutral-600 text-sm">
                        <p>Monday - Friday: 7AM - 6PM</p>
                        <p>Saturday: 8AM - 4PM</p>
                        <p>Sunday: Closed</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-primary to-secondary text-white">
                <CardContent className="p-6">
                  <h3 className="font-bold text-lg mb-3">Emergency Services</h3>
                  <p className="text-sm mb-4">Storm cleanup and urgent lawn care needs</p>
                  <a href="tel:302-555-LAWN" className="inline-flex items-center text-accent font-semibold">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Now
                  </a>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card className="bg-neutral-50">
                <CardHeader>
                  <CardTitle className="text-2xl">Send Us a Message</CardTitle>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Name</Label>
                        <Input
                          id="name"
                          required
                          value={formData.name}
                          onChange={(e) => handleInputChange("name", e.target.value)}
                          className="mt-2"
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          required
                          value={formData.phone}
                          onChange={(e) => handleInputChange("phone", e.target.value)}
                          className="mt-2"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="email">Email</Label>
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
                      <Label htmlFor="service">Service Needed</Label>
                      <Select value={formData.service} onValueChange={(value) => handleInputChange("service", value)}>
                        <SelectTrigger className="mt-2">
                          <SelectValue placeholder="Select a service" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="estimate">Free Estimate</SelectItem>
                          <SelectItem value="mowing">Lawn Mowing & Maintenance</SelectItem>
                          <SelectItem value="cleanup">Seasonal Cleanup</SelectItem>
                          <SelectItem value="emergency">Emergency Service</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="address">Property Address</Label>
                      <Input
                        id="address"
                        placeholder="City, State ZIP"
                        value={formData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Message</Label>
                      <Textarea
                        id="message"
                        rows={4}
                        required
                        placeholder="Tell us about your lawn care needs..."
                        value={formData.message}
                        onChange={(e) => handleInputChange("message", e.target.value)}
                        className="mt-2"
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full bg-primary text-white hover:bg-secondary py-3"
                      disabled={contactMutation.isPending}
                    >
                      <Send className="w-4 h-4 mr-2" />
                      {contactMutation.isPending ? "Sending..." : "Send Message"}
                    </Button>

                    <div className="text-sm text-neutral-600 text-center">
                      We'll respond to your inquiry within 24 hours
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
