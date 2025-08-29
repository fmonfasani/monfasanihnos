import { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { CartItem, OrderFormData } from '@/lib/types';
import { CalendarSlot } from '../../../shared/schema';
import { Footprints, Truck, Check } from 'lucide-react';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  totalPrice: number;
  onOrderComplete: () => void;
}

export default function OrderModal({
  isOpen,
  onClose,
  cart,
  totalPrice,
  onOrderComplete,
}: OrderModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<OrderFormData>({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    mode: 'takeaway',
    address: '',
    neighborhood: '',
    reference: '',
    date: new Date().toISOString().split('T')[0],
    time: '',
    notes: '',
  });

  const [showConfirmation, setShowConfirmation] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');

  // Fetch available time slots for selected date
  const { data: slots = [] } = useQuery<CalendarSlot[]>({
    queryKey: ['/api/slots', formData.date],
    enabled: !!formData.date,
  });

  const createOrderMutation = useMutation({
    mutationFn: async (orderData: any) => {
      const response = await apiRequest('POST', '/api/orders', orderData);
      return response.json();
    },
    onSuccess: (data) => {
      setOrderNumber(data.orderNumber);
      setShowConfirmation(true);
      onOrderComplete();
      queryClient.invalidateQueries({ queryKey: ['/api/orders'] });
      queryClient.invalidateQueries({ queryKey: ['/api/slots'] });
      toast({
        title: 'Pedido confirmado',
        description: `Tu pedido ${data.orderNumber} ha sido recibido exitosamente`,
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'No se pudo procesar el pedido',
        variant: 'destructive',
      });
    },
  });

  const formatPrice = (price: number) => {
    return `$${(price / 100).toLocaleString()}`;
  };

  const getDeliveryFee = () => {
    if (formData.mode === 'delivery' && totalPrice < 400000) { // $4000 in cents
      return 50000; // $500 in cents
    }
    return 0;
  };

  const getFinalTotal = () => {
    return totalPrice + getDeliveryFee();
  };

  const generateTimeSlots = () => {
    const timeSlots: { time: string; available: boolean }[] = [];
    
    // Morning slots (11:00-15:00)
    for (let hour = 11; hour <= 14; hour++) {
      for (let minute = 0; minute < 60; minute += 20) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const dbSlot = slots.find(s => s.time === time);
        const available = !dbSlot || dbSlot.bookedCount < dbSlot.capacity;
        timeSlots.push({ time, available });
      }
    }
    
    // Evening slots (19:00-24:00)
    for (let hour = 19; hour <= 23; hour++) {
      for (let minute = 0; minute < 60; minute += 20) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const dbSlot = slots.find(s => s.time === time);
        const available = !dbSlot || dbSlot.bookedCount < dbSlot.capacity;
        timeSlots.push({ time, available });
      }
    }
    
    return timeSlots;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast({
        title: 'Error',
        description: 'Tu carrito está vacío',
        variant: 'destructive',
      });
      return;
    }

    if (!formData.time) {
      toast({
        title: 'Error',
        description: 'Debes seleccionar un horario',
        variant: 'destructive',
      });
      return;
    }

    const scheduledAt = new Date(`${formData.date}T${formData.time}:00`);
    
    const orderData = {
      order: {
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail || null,
        mode: formData.mode,
        address: formData.mode === 'delivery' ? formData.address : null,
        neighborhood: formData.mode === 'delivery' ? formData.neighborhood : null,
        reference: formData.mode === 'delivery' ? formData.reference : null,
        notes: formData.notes || null,
        scheduledAt,
        totalAmount: getFinalTotal(),
        deliveryFee: getDeliveryFee(),
      },
      items: cart.map(item => ({
        productId: item.id,
        quantity: item.quantity,
        price: item.price,
      })),
    };

    createOrderMutation.mutate(orderData);
  };

  const handleClose = () => {
    if (showConfirmation) {
      setShowConfirmation(false);
      setOrderNumber('');
    }
    onClose();
  };

  // Set minimum date to today
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setFormData(prev => ({ ...prev, date: today }));
  }, []);

  if (showConfirmation) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md" data-testid="modal-order-confirmation">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-6">
              <Check className="text-secondary-foreground h-8 w-8" />
            </div>
            <h2 className="font-heading text-2xl font-semibold mb-4" data-testid="text-confirmation-title">
              ¡Pedido Confirmado!
            </h2>
            <p className="text-muted-foreground mb-6">
              Tu pedido ha sido recibido exitosamente
            </p>
            
            <div className="bg-muted rounded-lg p-4 mb-6">
              <div className="text-sm text-muted-foreground mb-1">Número de pedido</div>
              <div className="font-bold text-xl" data-testid="text-order-number">{orderNumber}</div>
            </div>
            
            <p className="text-sm text-muted-foreground mb-6">
              Te contactaremos por WhatsApp para confirmar los detalles
            </p>
            
            <Button 
              className="w-full"
              onClick={handleClose}
              data-testid="button-close-confirmation"
            >
              Cerrar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-2xl max-h-screen overflow-y-auto" data-testid="modal-order">
        <DialogHeader>
          <DialogTitle data-testid="text-order-modal-title">Finalizar Pedido</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Información del Cliente</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="customerName">Nombre completo *</Label>
                <Input
                  id="customerName"
                  value={formData.customerName}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
                  required
                  data-testid="input-customer-name"
                />
              </div>
              <div>
                <Label htmlFor="customerPhone">Teléfono *</Label>
                <Input
                  id="customerPhone"
                  type="tel"
                  value={formData.customerPhone}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerPhone: e.target.value }))}
                  required
                  data-testid="input-customer-phone"
                />
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="customerEmail">Email (opcional)</Label>
                <Input
                  id="customerEmail"
                  type="email"
                  value={formData.customerEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, customerEmail: e.target.value }))}
                  data-testid="input-customer-email"
                />
              </div>
            </div>
          </div>

          {/* Delivery Method */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Modalidad</h3>
            <RadioGroup
              value={formData.mode}
              onValueChange={(value: 'takeaway' | 'delivery') => 
                setFormData(prev => ({ ...prev, mode: value }))
              }
              data-testid="radio-delivery-method"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                  <RadioGroupItem value="takeaway" id="takeaway" className="sr-only" />
                  <Label
                    htmlFor="takeaway"
                    className={`delivery-option ${formData.mode === 'takeaway' ? 'selected' : ''}`}
                    data-testid="option-takeaway"
                  >
                    <div className="flex items-center space-x-3">
                      <Footprints className="h-6 w-6 text-primary" />
                      <div>
                        <div className="font-semibold">Retiro en local</div>
                        <div className="text-sm text-muted-foreground">Sin costo adicional</div>
                      </div>
                    </div>
                  </Label>
                </div>
                <div className="relative">
                  <RadioGroupItem value="delivery" id="delivery" className="sr-only" />
                  <Label
                    htmlFor="delivery"
                    className={`delivery-option ${formData.mode === 'delivery' ? 'selected' : ''}`}
                    data-testid="option-delivery"
                  >
                    <div className="flex items-center space-x-3">
                      <Truck className="h-6 w-6 text-primary" />
                      <div>
                        <div className="font-semibold">Delivery</div>
                        <div className="text-sm text-muted-foreground">$500 (gratis +$4000)</div>
                      </div>
                    </div>
                  </Label>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Delivery Address */}
          {formData.mode === 'delivery' && (
            <div data-testid="container-delivery-address">
              <h3 className="font-heading text-lg font-semibold mb-4">Dirección de Entrega</h3>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="address">Dirección completa *</Label>
                  <Input
                    id="address"
                    placeholder="Calle, número, piso, departamento"
                    value={formData.address}
                    onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                    required={formData.mode === 'delivery'}
                    data-testid="input-address"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="neighborhood">Barrio</Label>
                    <Input
                      id="neighborhood"
                      value={formData.neighborhood}
                      onChange={(e) => setFormData(prev => ({ ...prev, neighborhood: e.target.value }))}
                      data-testid="input-neighborhood"
                    />
                  </div>
                  <div>
                    <Label htmlFor="reference">Referencia</Label>
                    <Input
                      id="reference"
                      placeholder="Entre qué calles, punto de referencia"
                      value={formData.reference}
                      onChange={(e) => setFormData(prev => ({ ...prev, reference: e.target.value }))}
                      data-testid="input-reference"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Schedule */}
          <div>
            <h3 className="font-heading text-lg font-semibold mb-4">Fecha y Hora</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="orderDate">Fecha *</Label>
                <Input
                  id="orderDate"
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value, time: '' }))}
                  required
                  data-testid="input-order-date"
                />
              </div>
              <div>
                <Label htmlFor="orderTime">Hora *</Label>
                <Select
                  value={formData.time}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, time: value }))}
                  required
                >
                  <SelectTrigger data-testid="select-order-time">
                    <SelectValue placeholder="Seleccionar horario" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1 text-sm font-medium text-muted-foreground">Almuerzo</div>
                    {generateTimeSlots()
                      .filter(slot => {
                        const hour = parseInt(slot.time.split(':')[0]);
                        return hour >= 11 && hour <= 14;
                      })
                      .map((slot) => (
                        <SelectItem 
                          key={slot.time} 
                          value={slot.time}
                          disabled={!slot.available}
                          data-testid={`time-slot-${slot.time}`}
                        >
                          {slot.time} {!slot.available && '(Completo)'}
                        </SelectItem>
                      ))}
                    <div className="px-2 py-1 text-sm font-medium text-muted-foreground">Cena</div>
                    {generateTimeSlots()
                      .filter(slot => {
                        const hour = parseInt(slot.time.split(':')[0]);
                        return hour >= 19;
                      })
                      .map((slot) => (
                        <SelectItem 
                          key={slot.time} 
                          value={slot.time}
                          disabled={!slot.available}
                          data-testid={`time-slot-${slot.time}`}
                        >
                          {slot.time} {!slot.available && '(Completo)'}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Order Notes */}
          <div>
            <Label htmlFor="orderNotes">Notas adicionales</Label>
            <Textarea
              id="orderNotes"
              placeholder="Aclaraciones sobre tu pedido..."
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              data-testid="textarea-order-notes"
            />
          </div>

          {/* Order Summary */}
          <div className="bg-muted rounded-lg p-4" data-testid="container-order-summary">
            <h3 className="font-heading text-lg font-semibold mb-3">Resumen del Pedido</h3>
            <div className="space-y-2 mb-4">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm" data-testid={`summary-item-${item.id}`}>
                  <span>{item.name} x{item.quantity}</span>
                  <span>{formatPrice(item.price * item.quantity)}</span>
                </div>
              ))}
              {getDeliveryFee() > 0 && (
                <div className="flex justify-between text-sm" data-testid="summary-delivery-fee">
                  <span>Envío</span>
                  <span>{formatPrice(getDeliveryFee())}</span>
                </div>
              )}
            </div>
            <div className="border-t border-border pt-3">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total:</span>
                <span data-testid="text-order-total">{formatPrice(getFinalTotal())}</span>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button 
            type="submit" 
            className="w-full"
            disabled={createOrderMutation.isPending}
            data-testid="button-submit-order"
          >
            {createOrderMutation.isPending ? 'Procesando...' : 'Confirmar Pedido'}
          </Button>

          {createOrderMutation.isError && (
            <Alert variant="destructive">
              <AlertDescription>
                Error al procesar el pedido. Por favor, inténtalo nuevamente.
              </AlertDescription>
            </Alert>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
}
