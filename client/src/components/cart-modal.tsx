import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import { CartItem } from '@/lib/types';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemoveItem: (id: string) => void;
  onCheckout: () => void;
  totalPrice: number;
}

export default function CartModal({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
  totalPrice,
}: CartModalProps) {
  const formatPrice = (price: number) => {
    return `$${(price / 100).toLocaleString()}`;
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      onCheckout();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md" data-testid="modal-cart">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2" data-testid="text-cart-title">
            <ShoppingCart className="h-5 w-5" />
            Mi Pedido
          </DialogTitle>
        </DialogHeader>

        <div className="max-h-96 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="text-center py-12" data-testid="container-empty-cart">
              <ShoppingCart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground font-medium">Tu carrito está vacío</p>
              <p className="text-sm text-muted-foreground">Agregá productos desde el menú</p>
            </div>
          ) : (
            <div className="space-y-4" data-testid="container-cart-items">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between bg-muted rounded-lg p-3" data-testid={`cart-item-${item.id}`}>
                  <div className="flex-1">
                    <div className="font-medium" data-testid={`text-cart-item-name-${item.id}`}>{item.name}</div>
                    <div className="text-sm text-muted-foreground" data-testid={`text-cart-item-price-${item.id}`}>
                      {formatPrice(item.price)}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      data-testid={`button-decrease-${item.id}`}
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center" data-testid={`text-cart-item-quantity-${item.id}`}>
                      {item.quantity}
                    </span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      data-testid={`button-increase-${item.id}`}
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-destructive hover:text-destructive"
                      onClick={() => onRemoveItem(item.id)}
                      data-testid={`button-remove-${item.id}`}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {cart.length > 0 && (
          <div className="border-t pt-4">
            <div className="flex justify-between text-lg font-semibold mb-4">
              <span>Total:</span>
              <span data-testid="text-cart-total">{formatPrice(totalPrice)}</span>
            </div>
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={handleCheckout}
              data-testid="button-checkout"
            >
              Finalizar Pedido
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
