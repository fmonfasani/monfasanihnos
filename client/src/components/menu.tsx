import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Pizza, Plus } from 'lucide-react';
import { FaCookieBite } from 'react-icons/fa';
import { Product } from '../../../shared/schema';

interface MenuProps {
  onAddToCart: (id: string, name: string, price: number) => void;
}

export default function Menu({ onAddToCart }: MenuProps) {
  const [activeTab, setActiveTab] = useState<'pizza' | 'empanada'>('pizza');

  const { data: products = [], isLoading } = useQuery<Product[]>({
    queryKey: ['/api/products'],
  });

  const pizzas = products.filter(p => p.type === 'pizza');
  const empanadas = products.filter(p => p.type === 'empanada');

  const handleAddToCart = (product: Product) => {
    onAddToCart(product.id, product.name, product.price);
  };

  const formatPrice = (price: number) => {
    return `$${(price / 100).toLocaleString()}`;
  };

  return (
    <section id="menu" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-menu-title">
            Nuestro Menú
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Descubrí el sabor auténtico de nuestras especialidades, preparadas con amor y tradición
          </p>
        </div>

        {/* Menu Tabs */}
        <div className="flex justify-center mb-12">
          <div className="bg-background rounded-lg p-1 shadow-lg">
            <Button
              variant={activeTab === 'pizza' ? 'default' : 'ghost'}
              className={`menu-tab ${activeTab === 'pizza' ? 'active' : ''}`}
              onClick={() => setActiveTab('pizza')}
              data-testid="tab-pizzas"
            >
              <Pizza className="mr-2 h-4 w-4" />
              Pizzas
            </Button>
            <Button
              variant={activeTab === 'empanada' ? 'default' : 'ghost'}
              className={`menu-tab ${activeTab === 'empanada' ? 'active' : ''}`}
              onClick={() => setActiveTab('empanada')}
              data-testid="tab-empanadas"
            >
              <FaCookieBite className="mr-2 h-4 w-4" />
              Empanadas
            </Button>
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando productos...</p>
          </div>
        )}

        {/* Menu Content */}
        {!isLoading && (
          <div className="transition-all duration-300">
            {activeTab === 'pizza' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="container-pizzas">
                {pizzas.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <Pizza className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay pizzas disponibles en este momento</p>
                  </div>
                ) : (
                  pizzas.map((pizza) => (
                    <Card key={pizza.id} className="bg-card shadow-lg hover:shadow-xl transition-shadow" data-testid={`card-pizza-${pizza.id}`}>
                      {pizza.image && (
                        <img 
                          src={pizza.image} 
                          alt={pizza.name} 
                          className="w-full h-48 object-cover rounded-t-lg"
                        />
                      )}
                      <CardContent className="p-6">
                        <h3 className="font-heading text-xl font-semibold mb-2" data-testid={`text-pizza-name-${pizza.id}`}>
                          {pizza.name}
                        </h3>
                        <p className="text-muted-foreground mb-4" data-testid={`text-pizza-description-${pizza.id}`}>
                          {pizza.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-2xl text-primary" data-testid={`text-pizza-price-${pizza.id}`}>
                            {formatPrice(pizza.price)}
                          </span>
                          <Button 
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={() => handleAddToCart(pizza)}
                            data-testid={`button-add-pizza-${pizza.id}`}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Agregar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}

            {activeTab === 'empanada' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="container-empanadas">
                {empanadas.length === 0 ? (
                  <div className="col-span-full text-center py-12">
                    <FaCookieBite className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No hay empanadas disponibles en este momento</p>
                  </div>
                ) : (
                  empanadas.map((empanada) => (
                    <Card key={empanada.id} className="bg-card shadow-lg hover:shadow-xl transition-shadow" data-testid={`card-empanada-${empanada.id}`}>
                      {empanada.image && (
                        <img 
                          src={empanada.image} 
                          alt={empanada.name} 
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                      )}
                      <CardContent className="p-4">
                        <h3 className="font-heading text-lg font-semibold mb-2" data-testid={`text-empanada-name-${empanada.id}`}>
                          {empanada.name}
                        </h3>
                        <p className="text-muted-foreground text-sm mb-3" data-testid={`text-empanada-description-${empanada.id}`}>
                          {empanada.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-lg text-primary" data-testid={`text-empanada-price-${empanada.id}`}>
                            {formatPrice(empanada.price)}
                          </span>
                          <Button 
                            size="sm"
                            className="bg-primary hover:bg-primary/90 text-primary-foreground"
                            onClick={() => handleAddToCart(empanada)}
                            data-testid={`button-add-empanada-${empanada.id}`}
                          >
                            <Plus className="mr-1 h-3 w-3" />
                            Agregar
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
