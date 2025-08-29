import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Pizza, ShoppingCart } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';

interface HeaderProps {
  cartCount: number;
  onCartClick: () => void;
  onOrderClick: () => void;
}

export default function Header({ cartCount, onCartClick, onOrderClick }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsMobileMenuOpen(false);
  };

  const NavLinks = () => (
    <>
      <button 
        onClick={() => scrollToSection('inicio')} 
        className="text-foreground hover:text-primary transition-colors font-medium"
        data-testid="link-inicio"
      >
        Inicio
      </button>
      <button 
        onClick={() => scrollToSection('menu')} 
        className="text-foreground hover:text-primary transition-colors font-medium"
        data-testid="link-menu"
      >
        Menú
      </button>
      <button 
        onClick={() => scrollToSection('promos')} 
        className="text-foreground hover:text-primary transition-colors font-medium"
        data-testid="link-promos"
      >
        Promos
      </button>
      <button 
        onClick={() => scrollToSection('sobre')} 
        className="text-foreground hover:text-primary transition-colors font-medium"
        data-testid="link-sobre"
      >
        Sobre
      </button>
      <button 
        onClick={() => scrollToSection('contacto')} 
        className="text-foreground hover:text-primary transition-colors font-medium"
        data-testid="link-contacto"
      >
        Contacto
      </button>
    </>
  );

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3" data-testid="logo">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <Pizza className="text-primary-foreground h-6 w-6" />
            </div>
            <div>
              <h1 className="font-brand text-2xl text-primary">Monfasani</h1>
              <p className="text-xs text-muted-foreground -mt-1">Hermanos</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <NavLinks />
          </nav>

          {/* CTA Buttons */}
          <div className="flex items-center space-x-3">
            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={onCartClick}
              data-testid="button-cart"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 bg-accent text-accent-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium"
                  data-testid="text-cart-count"
                >
                  {cartCount}
                </span>
              )}
            </Button>
            
            {/* WhatsApp Button */}
            <Button 
              asChild 
              className="bg-secondary hover:bg-secondary/90 text-secondary-foreground"
              data-testid="button-whatsapp"
            >
              <a href="https://wa.me/5491234567890" className="flex items-center space-x-2">
                <FaWhatsapp className="w-4 h-4" />
                <span className="hidden sm:inline">Pedir ahora</span>
              </a>
            </Button>

            {/* Mobile Menu Button */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="md:hidden"
                  data-testid="button-mobile-menu"
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col space-y-4 mt-8">
                  <NavLinks />
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
