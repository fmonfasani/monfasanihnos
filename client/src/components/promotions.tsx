import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Promotion } from '@shared/schema';

export default function Promotions() {
  const { data: promotions = [], isLoading } = useQuery<Promotion[]>({
    queryKey: ['/api/promotions'],
  });

  const formatPrice = (price: number) => {
    return `$${(price / 100).toLocaleString()}`;
  };

  const getGradientClass = (gradient: string) => {
    const gradientMap: Record<string, string> = {
      'primary': 'bg-gradient-to-br from-primary to-primary/80',
      'secondary': 'bg-gradient-to-br from-secondary to-secondary/80',
      'accent': 'bg-gradient-to-br from-accent to-accent/80',
    };
    return gradientMap[gradient] || gradientMap.primary;
  };

  return (
    <section id="promos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-4" data-testid="text-promotions-title">
            Promociones
          </h2>
          <p className="text-xl text-muted-foreground">
            Las mejores ofertas para que disfrutes más por menos
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Cargando promociones...</p>
          </div>
        )}

        {/* Promotions Grid */}
        {!isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {promotions.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-muted-foreground">No hay promociones disponibles en este momento</p>
              </div>
            ) : (
              promotions.map((promo) => (
                <Card key={promo.id} className={`${getGradientClass(promo.gradient)} text-white relative overflow-hidden`} data-testid={`card-promotion-${promo.id}`}>
                  {promo.badgeText && (
                    <div className="absolute top-0 right-0 bg-accent text-accent-foreground px-3 py-1 rounded-bl-lg font-bold" data-testid={`text-promotion-badge-${promo.id}`}>
                      {promo.badgeText}
                    </div>
                  )}
                  <CardContent className="p-6">
                    <h3 className="font-heading text-2xl font-bold mb-3" data-testid={`text-promotion-title-${promo.id}`}>
                      {promo.title}
                    </h3>
                    <p className="mb-4 opacity-90" data-testid={`text-promotion-description-${promo.id}`}>
                      {promo.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <div>
                        {promo.originalPrice && (
                          <span className="text-sm line-through opacity-75" data-testid={`text-promotion-original-price-${promo.id}`}>
                            {formatPrice(promo.originalPrice)}
                          </span>
                        )}
                        <div className="text-3xl font-bold" data-testid={`text-promotion-price-${promo.id}`}>
                          {formatPrice(promo.promoPrice)}
                        </div>
                      </div>
                      <Button 
                        variant="secondary"
                        className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                        asChild
                        data-testid={`button-promotion-order-${promo.id}`}
                      >
                        <a href="https://wa.me/5491234567890">
                          Pedir Ya
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}
      </div>
    </section>
  );
}
