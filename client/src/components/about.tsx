export default function About() {
  return (
    <section id="sobre" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="font-heading text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="text-about-title">
              Nuestra Historia
            </h2>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed" data-testid="text-about-paragraph-1">
              En 1988, La mama comenzo con un emprendmiento que no eran del area de comida, el negocio se fue transformando hasta que en 2025 a los hermanos Luis y Leonardo se les ocurrio                  vender pizzas con las receta familiar que fue de generacion en generacion: Una tradicion familiar que se ha mantenido viva por mas de 35 años compartir los sabores auténticos                 de la pizza tradicional italiana en Argentina.
            </p>
            <p className="text-lg text-muted-foreground mb-6 leading-relaxed" data-testid="text-about-paragraph-2">
              Con más de 35 años de tradición familiar, seguimos elaborando nuestras pizzas con la misma 
              pasión del primer día, utilizando ingredientes frescos y recetas que han pasado de generación 
              en generación.
            </p>
            <div className="flex items-center space-x-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary" data-testid="text-stat-years">35+</div>
                <div className="text-muted-foreground">Años de tradición</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary" data-testid="text-stat-customers">50k+</div>
                <div className="text-muted-foreground">Clientes felices</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary" data-testid="text-stat-artisanal">100%</div>
                <div className="text-muted-foreground">Artesanal</div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1571407970349-bc81e7e96d47?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=600" 
              alt="Hermanos Monfasani en la cocina" 
              className="rounded-lg shadow-xl w-full"
              data-testid="img-about-brothers"
            />
            <div className="absolute -bottom-6 -left-6 bg-primary text-primary-foreground p-6 rounded-lg shadow-lg">
              <div className="font-heading text-xl font-bold" data-testid="text-secret-recipe-title">¡La receta secreta!</div>
              <div className="text-sm opacity-90">Masa fermentada 24 horas</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
