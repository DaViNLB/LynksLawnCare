import { Leaf, Phone, Mail, Clock, Facebook, Instagram } from "lucide-react";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const serviceLinks = [
    { href: "services", label: "Lawn Mowing" },
    { href: "services", label: "Seasonal Cleanup" },
    { href: "pricing", label: "Free Estimates" },
    { href: "contact", label: "Emergency Service" }
  ];

  const serviceAreas = [
    "Felton, DE",
    "Harrington, DE", 
    "Farmington, DE",
    "Houston, DE",
    "Brownsville, DE"
  ];

  const contactInfo = [
    { icon: <Phone className="w-4 h-4" />, text: "(302) 555-LAWN" },
    { icon: <Mail className="w-4 h-4" />, text: "info@lynkslawncare.com" },
    { icon: <Clock className="w-4 h-4" />, text: "Mon-Fri: 7AM-6PM" }
  ];

  return (
    <footer className="bg-neutral-800 text-white py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <Leaf className="text-2xl text-primary" />
              <span className="text-2xl font-bold">Lynks Lawn Care</span>
            </div>
            <p className="text-neutral-300 mb-4">
              Professional lawn care services in Delaware. Visit us at lynkslawncare.com for exceptional outdoor transformations.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Services</h4>
            <ul className="space-y-2 text-neutral-300">
              {serviceLinks.map((link, index) => (
                <li key={index}>
                  <button
                    onClick={() => scrollToSection(link.href)}
                    className="hover:text-primary transition-colors text-left"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Areas */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Service Areas</h4>
            <ul className="space-y-2 text-neutral-300">
              {serviceAreas.map((area, index) => (
                <li key={index}>{area}</li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold text-lg mb-4">Contact</h4>
            <ul className="space-y-2 text-neutral-300">
              {contactInfo.map((info, index) => (
                <li key={index} className="flex items-center">
                  <span className="text-primary mr-2">{info.icon}</span>
                  {info.text}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-neutral-700 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-neutral-400 text-sm">© 2024 Lynks Lawn Care. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors text-sm">Privacy Policy</a>
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors text-sm">Terms of Service</a>
              <a href="#" className="text-neutral-400 hover:text-primary transition-colors text-sm">Licensed & Insured</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
