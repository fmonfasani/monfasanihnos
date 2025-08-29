import { Pizza } from "lucide-react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";

export default function Footer() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <footer
      className="py-12"
      style={{
        backgroundColor: "hsl(var(--footer-bg))",
        color: "hsl(var(--footer-foreground))",
      }}
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div
              className="flex items-center space-x-3 mb-4"
              data-testid="logo-footer"
            >
              <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                <Pizza className="text-primary-foreground h-5 w-5" />
              </div>
              <div>
                <h3 className="font-brand text-xl text-primary">Monfasani</h3>
                <p className="text-xs opacity-70 -mt-1">Hermanos</p>
              </div>
            </div>
            <p
              className="text-sm opacity-80"
              data-testid="text-footer-description"
            >
              Tradición italiana desde 1987. Las mejores pizzas artesanales de
              Buenos Aires.
            </p>
          </div>

          <div>
            <h4
              className="font-semibold mb-4"
              data-testid="text-footer-links-title"
            >
              Enlaces
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li>
                <button
                  onClick={() => scrollToSection("inicio")}
                  className="hover:opacity-100 transition-opacity"
                  data-testid="link-footer-inicio"
                >
                  Inicio
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("menu")}
                  className="hover:opacity-100 transition-opacity"
                  data-testid="link-footer-menu"
                >
                  Menú
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("promos")}
                  className="hover:opacity-100 transition-opacity"
                  data-testid="link-footer-promos"
                >
                  Promociones
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("sobre")}
                  className="hover:opacity-100 transition-opacity"
                  data-testid="link-footer-sobre"
                >
                  Sobre nosotros
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection("contacto")}
                  className="hover:opacity-100 transition-opacity"
                  data-testid="link-footer-contacto"
                >
                  Contacto
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h4
              className="font-semibold mb-4"
              data-testid="text-footer-contact-title"
            >
              Contacto
            </h4>
            <ul className="space-y-2 text-sm opacity-80">
              <li data-testid="text-footer-address-street">
                Martires Riocuartenses 1723
              </li>
              <li data-testid="text-footer-address-city">
                Rio Cuarto, Cordoba, Argentina
              </li>
              <li data-testid="text-footer-phone">+54 9 358 46 41453</li>
              <li data-testid="text-footer-email">
                info@monfasanihermanos.com
              </li>
            </ul>
          </div>

          <div>
            <h4
              className="font-semibold mb-4"
              data-testid="text-footer-social-title"
            >
              Síguenos
            </h4>
            <div className="flex space-x-4">
              <a
                href="#"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
                data-testid="link-footer-facebook"
              >
                <FaFacebookF className="text-primary-foreground h-4 w-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 bg-primary rounded-full flex items-center justify-center hover:bg-primary/80 transition-colors"
                data-testid="link-footer-instagram"
              >
                <FaInstagram className="text-primary-foreground h-4 w-4" />
              </a>
              <a
                href="https://wa.me/5491234567890"
                className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center hover:bg-secondary/80 transition-colors"
                data-testid="link-footer-whatsapp"
              >
                <FaWhatsapp className="text-secondary-foreground h-4 w-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-black border-opacity-20 mt-8 pt-8 text-center text-sm opacity-70">
          <p data-testid="text-footer-copyright">
            &copy; 2025 Monfasani Hermanos. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  );
}
