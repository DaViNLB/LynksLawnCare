import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Phone, Mail } from "lucide-react";
import { Link } from "wouter";

export default function BookingSuccess() {
  return (
    <div className="min-h-screen bg-neutral-50 py-20">
      <div className="container mx-auto px-6">
        <Card className="max-w-2xl mx-auto text-center">
          <CardHeader>
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-600">Booking Confirmed!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-neutral-600">
              Thank you for choosing Lynks Lawn Care! Your service request has been received and we'll contact you within 24 hours to schedule your appointment.
            </p>
            
            <div className="bg-neutral-100 p-6 rounded-lg">
              <h3 className="font-semibold text-neutral-800 mb-4">What happens next?</h3>
              <div className="space-y-3 text-left">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">1</div>
                  <p className="text-neutral-600">We'll review your request and prepare a customized service plan</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">2</div>
                  <p className="text-neutral-600">Our team will contact you to schedule your free estimate</p>
                </div>
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mr-3 mt-0.5">3</div>
                  <p className="text-neutral-600">We'll provide professional lawn care service at your scheduled time</p>
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="font-semibold text-neutral-800 mb-4">Need to reach us?</h3>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  variant="outline"
                  onClick={() => window.location.href = 'tel:+13024690503'}
                  className="flex items-center"
                >
                  <Phone className="w-4 h-4 mr-2" />
                  (302) 469-0503
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.location.href = 'mailto:davinlynksservices@gmail.com'}
                  className="flex items-center"
                >
                  <Mail className="w-4 h-4 mr-2" />
                  Email Us
                </Button>
              </div>
            </div>

            <div className="pt-6">
              <Link href="/">
                <Button className="bg-primary text-white hover:bg-secondary">
                  Return to Home
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}