export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface TimeSlot {
  time: string;
  available: boolean;
  capacity: number;
  booked: number;
}

export interface OrderFormData {
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
  mode: 'takeaway' | 'delivery';
  address?: string;
  neighborhood?: string;
  reference?: string;
  date: string;
  time: string;
  notes?: string;
}
