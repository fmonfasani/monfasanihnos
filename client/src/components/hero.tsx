import { Button } from '@/components/ui/button';
import { Clock, Leaf, Heart, Utensils } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

interface HeroProps {
  onOrderClick: () => void;
}

export default function Hero({ onOrderClick }: HeroProps) {
  return (
    <section id="inicio" className="relative min-h-screen flex items-center">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat bg-fixed"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1513104890138-7c749659a591?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')"
        }}
      />
      <div className="absolute inset-0 bg-black/50" />
      
      <div className="relative container mx-auto px-4 text-center text-white">
        <h1 className="font-heading text-5xl md:text-7xl font-bold mb-6" data-testid="text-hero-title">
          Una Tradición <br />
          <span className="text-accent">Familiar</span>
        </h1>
        <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto leading-relaxed" data-testid="text-hero-subtitle">
          Desde 1988, elaborando las mejores pizzas artesanales con recetas familiares tradicionales
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all"
            onClick={onOrderClick}
            data-testid="button-order-now"
          >
            <Utensils className="mr-3 h-5 w-5" />
            Hacer Pedido
          </Button>
          <Button 
            asChild
            size="lg"
            className="bg-secondary hover:bg-secondary/90 text-secondary-foreground px-8 py-4 text-lg font-semibold transform hover:scale-105 transition-all"
            data-testid="button-whatsapp-hero"
          >
            <a href="https://wa.me/5491234567890" className="flex items-center">
              <FaWhatsapp className="mr-3 h-5 w-5" />
              WhatsApp
            </a>
          </Button>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="text-accent-foreground h-8 w-8" />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2" data-testid="text-feature-delivery">
              Entrega Rápida
            </h3>
            <p className="text-gray-200">30-45 minutos promedio</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Leaf className="text-accent-foreground h-8 w-8" />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2" data-testid="text-feature-fresh">
              Ingredientes Frescos
            </h3>
            <p className="text-gray-200">Seleccionados diariamente</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="text-accent-foreground h-8 w-8" />
            </div>
            <h3 className="font-heading text-xl font-semibold mb-2" data-testid="text-feature-tradition">
              Tradición Familiar
            </h3>
            <p className="text-gray-200">Más de 35 años de experiencia</p>
          </div>
        </div>
      </div>
    </section>
  );
}
