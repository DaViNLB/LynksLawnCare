import Navigation from "@/components/ui/navigation";
import Hero from "@/components/ui/hero";
import Services from "@/components/ui/services";
import PricingCalculator from "@/components/ui/pricing-calculator";
import ServiceArea from "@/components/ui/service-area";
import Booking from "@/components/ui/booking";
import About from "@/components/ui/about";
import Contact from "@/components/ui/contact";
import Footer from "@/components/ui/footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <Navigation />
      <Hero />
      <Services />
      <PricingCalculator />
      <ServiceArea />
      <Booking />
      <About />
      <Contact />
      <Footer />
    </div>
  );
}
