import Header from '@/components/header';
import Hero from '@/components/hero';
import Menu from '@/components/menu';
import Promotions from '@/components/promotions';
import About from '@/components/about';
import Contact from '@/components/contact';
import Footer from '@/components/footer';
import CartModal from '@/components/cart-modal';
import OrderModal from '@/components/order-modal';
import { useCart } from '@/hooks/use-cart';
import { useState } from 'react';

export default function Home() {
  const cart = useCart();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);

  const openCart = () => setIsCartOpen(true);
  const closeCart = () => setIsCartOpen(false);
  
  const openOrderModal = () => {
    setIsCartOpen(false);
    setIsOrderModalOpen(true);
  };
  const closeOrderModal = () => setIsOrderModalOpen(false);

  return (
    <div className="min-h-screen bg-background">
      <Header 
        cartCount={cart.getTotalItems()} 
        onCartClick={openCart}
        onOrderClick={openOrderModal}
      />
      
      <main>
        <Hero onOrderClick={openOrderModal} />
        <Menu onAddToCart={cart.addToCart} />
        <Promotions />
        <About />
        <Contact />
      </main>
      
      <Footer />
      
      <CartModal
        isOpen={isCartOpen}
        onClose={closeCart}
        cart={cart.cart}
        onUpdateQuantity={cart.updateQuantity}
        onRemoveItem={cart.removeFromCart}
        onCheckout={openOrderModal}
        totalPrice={cart.getTotalPrice()}
      />
      
      <OrderModal
        isOpen={isOrderModalOpen}
        onClose={closeOrderModal}
        cart={cart.cart}
        totalPrice={cart.getTotalPrice()}
        onOrderComplete={cart.clearCart}
      />
    </div>
  );
}
