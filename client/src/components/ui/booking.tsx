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
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const bookingMutation = useMutation({
    mutationFn: async (data: any) => {
      try {
        // Submit to our database
        const response = await apiRequest("POST", "/api/bookings", data);
        const booking = await response.json();
        
        // Submit to Google Forms for data collection
        const formData = new FormData();
        formData.append('entry.1111111111', data.name); // Replace with actual Google Form field IDs
        formData.append('entry.2222222222', data.email);
        formData.append('entry.3333333333', data.phone);
        formData.append('entry.4444444444', data.address);
        formData.append('entry.5555555555', data.serviceType);
        formData.append('entry.6666666666', data.subscriptionType);
        formData.append('entry.7777777777', data.propertySize.toString());
        formData.append('entry.8888888888', data.price.toString());
        formData.append('entry.9999999999', data.specialRequests || '');
        
        // Submit to Google Form (silent failure)
        fetch('https://docs.google.com/forms/d/e/YOUR_BOOKING_GOOGLE_FORM_ID/formResponse', {
          method: 'POST',
          mode: 'no-cors',
          body: formData
        }).catch(() => {}); // Silent fail for Google Forms
        
        return booking;
      } catch (error) {
        throw error;
      }
    },
    onSuccess: (booking) => {
      toast({
        title: "Booking Created Successfully!",
        description: "Redirecting to payment...",
      });
      
      // Send email notification
      fetch('/api/send-booking-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bookingId: booking.id })
      }).catch(console.error);
      
      // Check if Stripe is configured
      if (import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
        setLocation(`/checkout/${booking.id}`);
      } else {
        setLocation('/booking-success');
      }
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

  const validateForm = () => {
    const errors: Record<string, string> = {};
    
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = "Please enter a valid email address";
    }
    if (!formData.phone.trim()) {
      errors.phone = "Phone number is required";
    } else if (!/^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/.test(formData.phone)) {
      errors.phone = "Please enter a valid phone number";
    }
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.serviceType) errors.serviceType = "Please select a service type";
    if (!formData.subscription) errors.subscription = "Please select a subscription option";
    if (!formData.propertySize) {
      errors.propertySize = "Property size is required";
    } else {
      const acres = parseFloat(formData.propertySize);
      if (isNaN(acres) || acres < 0.1 || acres > 2.5) {
        errors.propertySize = "Property size must be between 0.1 and 2.5 acres";
      }
    }
    
    return errors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors = validateForm();
    setFieldErrors(errors);
    
    if (Object.keys(errors).length > 0) {
      toast({
        title: "Please correct the errors below",
        description: "All required fields must be filled out correctly",
        variant: "destructive"
      });
      return;
    }
    
    const acres = parseFloat(formData.propertySize);
    const estimatedPrice = calculatePrice(formData.serviceType, acres);

    // Map form data to database schema
    const bookingData = {
      name: `${formData.firstName} ${formData.lastName}`.trim(),
      email: formData.email,
      phone: formData.phone,
      address: formData.address,
      serviceType: formData.serviceType,
      subscriptionType: formData.subscription,
      propertySize: acres.toString(),
      specialRequests: formData.notes,
      price: estimatedPrice.toString(),
      status: "pending"
    };

    bookingMutation.mutate(bookingData);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: "" }));
    }
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
                      <Label htmlFor="firstName" className={fieldErrors.firstName ? "text-red-600" : ""}>
                        First Name {fieldErrors.firstName && <span className="text-red-600">*</span>}
                      </Label>
                      <Input
                        id="firstName"
                        required
                        value={formData.firstName}
                        onChange={(e) => handleInputChange("firstName", e.target.value)}
                        className={`mt-2 ${fieldErrors.firstName ? "border-red-500 focus:border-red-500" : ""}`}
                      />
                      {fieldErrors.firstName && (
                        <p className="text-red-600 text-sm mt-1">{fieldErrors.firstName}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="lastName" className={fieldErrors.lastName ? "text-red-600" : ""}>
                        Last Name {fieldErrors.lastName && <span className="text-red-600">*</span>}
                      </Label>
                      <Input
                        id="lastName"
                        required
                        value={formData.lastName}
                        onChange={(e) => handleInputChange("lastName", e.target.value)}
                        className={`mt-2 ${fieldErrors.lastName ? "border-red-500 focus:border-red-500" : ""}`}
                      />
                      {fieldErrors.lastName && (
                        <p className="text-red-600 text-sm mt-1">{fieldErrors.lastName}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="email" className={fieldErrors.email ? "text-red-600" : ""}>
                      Email Address {fieldErrors.email && <span className="text-red-600">*</span>}
                    </Label>
                    <Input
                      id="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      className={`mt-2 ${fieldErrors.email ? "border-red-500 focus:border-red-500" : ""}`}
                    />
                    {fieldErrors.email && (
                      <p className="text-red-600 text-sm mt-1">{fieldErrors.email}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="phone" className={fieldErrors.phone ? "text-red-600" : ""}>
                      Phone Number {fieldErrors.phone && <span className="text-red-600">*</span>}
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => handleInputChange("phone", e.target.value)}
                      className={`mt-2 ${fieldErrors.phone ? "border-red-500 focus:border-red-500" : ""}`}
                      placeholder="(302) 123-4567"
                    />
                    {fieldErrors.phone && (
                      <p className="text-red-600 text-sm mt-1">{fieldErrors.phone}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="address" className={fieldErrors.address ? "text-red-600" : ""}>
                      Service Address {fieldErrors.address && <span className="text-red-600">*</span>}
                    </Label>
                    <Textarea
                      id="address"
                      rows={3}
                      required
                      placeholder="Enter your full address including city and ZIP code"
                      value={formData.address}
                      onChange={(e) => handleInputChange("address", e.target.value)}
                      className={`mt-2 ${fieldErrors.address ? "border-red-500 focus:border-red-500" : ""}`}
                    />
                    {fieldErrors.address && (
                      <p className="text-red-600 text-sm mt-1">{fieldErrors.address}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="serviceType" className={fieldErrors.serviceType ? "text-red-600" : ""}>
                      Service Type {fieldErrors.serviceType && <span className="text-red-600">*</span>}
                    </Label>
                    <Select value={formData.serviceType} onValueChange={(value) => handleInputChange("serviceType", value)}>
                      <SelectTrigger className={`mt-2 ${fieldErrors.serviceType ? "border-red-500 focus:border-red-500" : ""}`}>
                        <SelectValue placeholder="Select a service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mowing">Lawn Mowing & Maintenance</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldErrors.serviceType && (
                      <p className="text-red-600 text-sm mt-1">{fieldErrors.serviceType}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="subscription" className={fieldErrors.subscription ? "text-red-600" : ""}>
                      Subscription {fieldErrors.subscription && <span className="text-red-600">*</span>}
                    </Label>
                    <Select value={formData.subscription} onValueChange={(value) => handleInputChange("subscription", value)}>
                      <SelectTrigger className={`mt-2 ${fieldErrors.subscription ? "border-red-500 focus:border-red-500" : ""}`}>
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
                    {fieldErrors.subscription && (
                      <p className="text-red-600 text-sm mt-1">{fieldErrors.subscription}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="propertySize" className={fieldErrors.propertySize ? "text-red-600" : ""}>
                      Property Size (approximate acres) {fieldErrors.propertySize && <span className="text-red-600">*</span>}
                    </Label>
                    <Input
                      id="propertySize"
                      type="number"
                      step="0.1"
                      min="0.1"
                      max="2.5"
                      required
                      value={formData.propertySize}
                      onChange={(e) => handleInputChange("propertySize", e.target.value)}
                      className={`mt-2 ${fieldErrors.propertySize ? "border-red-500 focus:border-red-500" : ""}`}
                      placeholder="0.25"
                    />
                    {fieldErrors.propertySize && (
                      <p className="text-red-600 text-sm mt-1">{fieldErrors.propertySize}</p>
                    )}
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
