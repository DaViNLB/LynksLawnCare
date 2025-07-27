import { Button } from "@/components/ui/button";
import { CalendarCheck, Leaf } from "lucide-react";

export default function Hero() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      <div className="absolute inset-0 hero-bg"></div>
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&h=1080"
          alt="Healthy green grass lawn"
          className="w-full h-full object-cover opacity-30"
        />
      </div>

      <div className="relative z-10 container mx-auto px-6 text-center text-white">
        <div className="max-w-4xl mx-auto fade-in-up">
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Transform Your Lawn Into a{" "}
            <span className="text-accent">Masterpiece</span>
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-neutral-100 max-w-2xl mx-auto">
            Reliable lawn mowing, edging, and leaf blowing services for homes and small businesses in Delaware. Choose from one-time, weekly, bi-weekly, monthly, quarterly or yearly visiting options — quality work and fair pricing.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              onClick={() => scrollToSection("booking")}
              className="bg-accent text-neutral-900 hover:bg-yellow-400 px-8 py-4 text-lg font-semibold transform hover:scale-105"
            >
              <CalendarCheck className="w-5 h-5 mr-2" />
              Schedule Free Estimate
            </Button>
            <Button
              variant="outline"
              onClick={() => scrollToSection("services")}
              className="border-2 border-white text-white bg-white/20 hover:bg-white hover:text-primary px-8 py-4 text-lg font-semibold"
            >
              <Leaf className="w-5 h-5 mr-2" />
              View Services
            </Button>
          </div>

          <div className="mt-12 flex justify-center max-w-3xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-accent">100%</div>
              <div className="text-neutral-200">Satisfaction Guarantee</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
