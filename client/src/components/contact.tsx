import { MapPin, Clock, Truck } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

export default function Contact() {
  return (
    <section id="contacto" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-contact-title">
            Contacto
          </h2>
          <p className="text-xl text-muted-foreground">
            Estamos aquí para servirte los mejores sabores
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <FaWhatsapp className="text-primary-foreground h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-semibold mb-2" data-testid="text-whatsapp-title">WhatsApp</h3>
                <p className="text-muted-foreground mb-2">Hacé tu pedido directamente por WhatsApp</p>
                <a 
                  href="https://wa.me/5491234567890" 
                  className="text-primary hover:text-primary/80 font-medium"
                  data-testid="link-whatsapp-phone"
                >
                  +54 9 11 1234-5678
                </a>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                <MapPin className="text-secondary-foreground h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-semibold mb-2" data-testid="text-address-title">Dirección</h3>
                <p className="text-muted-foreground" data-testid="text-address-street">Av. Corrientes 1234, Capital Federal</p>
                <p className="text-muted-foreground" data-testid="text-address-city">Buenos Aires, Argentina</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                <Clock className="text-accent-foreground h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-semibold mb-2" data-testid="text-hours-title">Horarios</h3>
                <div className="text-muted-foreground space-y-1">
                  <p data-testid="text-hours-days">Lunes a Domingo</p>
                  <p data-testid="text-hours-time">11:00 - 15:00 / 19:00 - 24:00</p>
                  <p className="text-sm text-primary" data-testid="text-hours-note">No cerramos ningún día</p>
                </div>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                <Truck className="text-muted-foreground h-6 w-6" />
              </div>
              <div>
                <h3 className="font-heading text-xl font-semibold mb-2" data-testid="text-delivery-title">Delivery</h3>
                <p className="text-muted-foreground" data-testid="text-delivery-radius">Radio de 5km desde nuestro local</p>
                <p className="text-muted-foreground" data-testid="text-delivery-free">Envío sin cargo en compras mayores a $4.000</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg shadow-lg overflow-hidden">
            <div className="h-96 bg-muted flex items-center justify-center" data-testid="container-map">
              <div className="text-center text-muted-foreground">
                <MapPin className="h-16 w-16 mx-auto mb-4" />
                <p className="font-semibold" data-testid="text-map-title">Mapa interactivo</p>
                <p className="text-sm" data-testid="text-map-address">Av. Corrientes 1234, CABA</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
