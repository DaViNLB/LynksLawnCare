import { useStripe, Elements, PaymentElement, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useEffect, useState } from 'react';
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CreditCard } from "lucide-react";
import { Link } from "wouter";
import { Booking } from "@shared/schema";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  throw new Error('Missing required Stripe key: VITE_STRIPE_PUBLIC_KEY');
}
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ booking }: { booking: Booking }) => {
  const stripe = useStripe();
  const elements = useElements();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!stripe || !elements) {
      setIsLoading(false);
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/?payment=success`,
      },
    });

    if (error) {
      toast({
        title: "Payment Failed",
        description: error.message,
        variant: "destructive",
      });
    } else {
      toast({
        title: "Payment Successful",
        description: "Thank you for choosing Lynks Lawn Care!",
      });
    }
    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe || isLoading} 
        className="w-full bg-primary hover:bg-secondary text-white"
      >
        <CreditCard className="w-4 h-4 mr-2" />
        {isLoading ? "Processing..." : `Pay $${booking?.estimatedPrice}`}
      </Button>
    </form>
  );
};

export default function Checkout() {
  const [, params] = useRoute("/checkout/:bookingId");
  const bookingId = params?.bookingId;
  const [clientSecret, setClientSecret] = useState("");

  const { data: booking, isLoading: bookingLoading } = useQuery<Booking>({
    queryKey: ["/api/bookings", bookingId],
    enabled: !!bookingId,
  });

  useEffect(() => {
    if (booking) {
      apiRequest("POST", "/api/create-payment-intent", { 
        amount: parseFloat(booking.estimatedPrice),
        bookingId: booking.id 
      })
        .then((res) => res.json())
        .then((data) => {
          setClientSecret(data.clientSecret);
        });
    }
  }, [booking]);

  if (bookingLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Booking Not Found</h1>
            <p className="text-gray-600 mb-4">The booking you're looking for doesn't exist.</p>
            <Link href="/">
              <Button className="bg-primary hover:bg-secondary text-white">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 py-12">
      <div className="container mx-auto px-6 max-w-4xl">
        <div className="mb-8">
          <Link href="/">
            <Button variant="ghost" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-4xl font-bold text-neutral-800">Complete Your Payment</h1>
          <p className="text-xl text-neutral-600 mt-2">Secure checkout for your lawn care service</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Booking Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Booking Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span className="text-neutral-600">Service:</span>
                <span className="font-semibold">
                  {booking.serviceType === 'mowing' ? 'Lawn Mowing & Maintenance' : 'Seasonal Cleanup'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Property Size:</span>
                <span className="font-semibold">{booking.propertySize} acres</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Customer:</span>
                <span className="font-semibold">{booking.firstName} {booking.lastName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Email:</span>
                <span className="font-semibold">{booking.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-neutral-600">Phone:</span>
                <span className="font-semibold">{booking.phone}</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total:</span>
                  <span className="text-primary">${booking.estimatedPrice}</span>
                </div>
              </div>
              <div className="bg-neutral-50 p-4 rounded-lg text-sm text-neutral-600">
                <p className="flex items-center">
                  <CreditCard className="w-4 h-4 mr-2" />
                  Payment will be processed after service completion
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Information</CardTitle>
            </CardHeader>
            <CardContent>
              <Elements stripe={stripePromise} options={{ clientSecret }}>
                <CheckoutForm booking={booking} />
              </Elements>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
