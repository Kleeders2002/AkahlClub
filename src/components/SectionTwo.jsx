import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

const images = [
  "https://i.ibb.co/KpDY5xBz/1.png",
  "https://i.ibb.co/KcNFWWk5/3.png",
  "https://i.ibb.co/HDTJXrJJ/5.png",
  "https://i.ibb.co/jPnLqP9H/2.png",
  "https://i.ibb.co/k6mVSfpC/4.png",
];

// URLs de iconos personalizados
const iconUrls = {
  benefit1: "https://i.ibb.co/JR2WBtB2/6.png",
  benefit2: "https://i.ibb.co/TFgzbFb/4.png",
  benefit3: "https://i.ibb.co/QjCSrqXv/5.png",
};

export default function SectionTwo() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const { t } = useTranslation();

  const nextSlide = () =>
    setCurrentIndex((prev) => (prev + 1) % images.length);

  const prevSlide = () =>
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(nextSlide, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  return (
    <>
      <section className="relative bg-gradient-to-br from-[#f9f7f0] via-[#fdfcf8] to-[#f5f3ea] py-16 md:py-24 lg:py-28 overflow-hidden">
        
        {/* Textura sutil de fondo */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />

        {/* Elementos decorativos flotantes - Responsive */}
        <div className="absolute top-10 left-5 w-48 h-48 md:w-72 md:h-72 bg-[#ceb652]/5 rounded-full blur-3xl" />
        <div className="absolute bottom-10 right-5 w-64 h-64 md:w-96 md:h-96 bg-[#233c33]/5 rounded-full blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Línea decorativa superior - Responsive */}
          <div className="flex items-center justify-center mb-12 md:mb-16">
            <div className="h-px w-10 md:w-20 bg-gradient-to-r from-transparent to-[#ceb652]/30" />
            <div className="mx-4 md:mx-6 w-2 h-2 rounded-full bg-[#ceb652]" />
            <div className="h-px w-10 md:w-20 bg-gradient-to-l from-transparent to-[#ceb652]/30" />
          </div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 xl:gap-20 items-center">

            {/* COLUMNA IZQUIERDA - Más compacta */}
            <div className="space-y-8 md:space-y-10">

              {/* Subtítulo con animación - Responsive */}
              <div className="relative inline-block">
                <div className="absolute -inset-1 md:-inset-2 bg-[#ceb652]/10 blur-xl rounded-lg" />
                <div className="relative text-[#ceb652] uppercase tracking-[3px] md:tracking-[4px] text-xs font-semibold px-4 py-2 md:px-6 md:py-3 border border-[#ceb652]/20 rounded-full backdrop-blur-sm bg-white/50">
                  {t('section2.subtitle') || "La Revolución del Estilo"}
                </div>
              </div>

              {/* Título principal - Responsive */}
              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl leading-[1.1] font-light text-[#233c33]">
                {t('section2.title_line1') || "Más que moda,"}
                <br />
                <span 
                  className="font-serif italic text-[#ceb652] relative inline-block"
                  style={{
                    textShadow: '0 0 40px rgba(206, 182, 82, 0.15)'
                  }}
                >
                  {t('section2.title_highlight') || "una identidad consciente"}
                  <svg 
                    className="absolute -bottom-1 md:-bottom-2 left-0 w-full" 
                    viewBox="0 0 300 12" 
                    fill="none"
                  >
                    <path 
                      d="M2 10C50 5 100 2 150 5C200 8 250 10 298 8" 
                      stroke="#ceb652" 
                      strokeWidth="2" 
                      strokeLinecap="round"
                      opacity="0.4"
                    />
                  </svg>
                </span>
              </h2>

              {/* Descripción elegante - Responsive */}
              <p 
                className="text-base md:text-lg text-[#233c33]/80 leading-relaxed max-w-xl font-light"
                dangerouslySetInnerHTML={{ __html: t('section2.description') || "AKAHL CLUB no es una tienda. Es un <strong class='font-medium text-[#233c33]'>ecosistema exclusivo</strong> que transforma tu relación con la moda en una expresión auténtica, refinada y duradera." }}
              />

              {/* Línea divisoria sutil */}
              <div className="w-12 md:w-16 h-px bg-gradient-to-r from-[#ceb652] to-transparent" />

              {/* BENEFICIOS PREMIUM - Más compactos */}
              <div className="space-y-6 md:space-y-8">

                {/* ITEM 1 */}
                <div className="group flex items-start gap-4 md:gap-5 p-4 md:p-5 rounded-xl md:rounded-2xl transition-all duration-500 hover:bg-white/80 hover:shadow-lg md:hover:shadow-xl hover:-translate-x-1 md:hover:-translate-x-2 border border-transparent hover:border-[#ceb652]/10">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-[#ceb652]/20 rounded-lg md:rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-14 h-14 md:w-16 md:h-16 bg-white rounded-lg md:rounded-xl flex items-center justify-center border border-[#ceb652]/20 group-hover:scale-110 transition-transform duration-500 shadow-md">
                      {/* REEMPLAZA ESTA URL CON TU PROPIO ICONO */}
                      <img
                        src={iconUrls.benefit1}
                        alt="Icono Beneficio 1"
                        className="w-10 h-10 md:w-12 md:h-12 object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg md:text-xl font-light text-[#233c33] mb-1 md:mb-2 group-hover:text-[#ceb652] transition-colors duration-300">
                      {t('section2.benefit1.title') || "Club Privado y Exclusivo"}
                    </h4>
                    <p className="text-sm md:text-base text-[#233c33]/70 font-light leading-relaxed">
                      {t('section2.benefit1.description') || "Acceso limitado para quienes buscan estilo atemporal y distinción."}
                    </p>
                  </div>
                </div>

                {/* ITEM 2 */}
                <div className="group flex items-start gap-4 md:gap-5 p-4 md:p-5 rounded-xl md:rounded-2xl transition-all duration-500 hover:bg-white/80 hover:shadow-lg md:hover:shadow-xl hover:-translate-x-1 md:hover:-translate-x-2 border border-transparent hover:border-[#ceb652]/10">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-[#ceb652]/20 rounded-lg md:rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-14 h-14 md:w-16 md:h-16 bg-white rounded-lg md:rounded-xl flex items-center justify-center border border-[#ceb652]/20 group-hover:scale-110 transition-transform duration-500 shadow-md">
                      {/* REEMPLAZA ESTA URL CON TU PROPIO ICONO */}
                      <img
                        src={iconUrls.benefit2}
                        alt="Icono Beneficio 2"
                        className="w-10 h-10 md:w-12 md:h-12 object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg md:text-xl font-light text-[#233c33] mb-1 md:mb-2 group-hover:text-[#ceb652] transition-colors duration-300">
                      {t('section2.benefit2.title') || "Educación Personalizada"}
                    </h4>
                    <p className="text-sm md:text-base text-[#233c33]/70 font-light leading-relaxed">
                      {t('section2.benefit2.description') || "Guías y acompañamiento para dominar combinaciones y patrones."}
                    </p>
                  </div>
                </div>

                {/* ITEM 3 */}
                <div className="group flex items-start gap-4 md:gap-5 p-4 md:p-5 rounded-xl md:rounded-2xl transition-all duration-500 hover:bg-white/80 hover:shadow-lg md:hover:shadow-xl hover:-translate-x-1 md:hover:-translate-x-2 border border-transparent hover:border-[#ceb652]/10">
                  <div className="relative flex-shrink-0">
                    <div className="absolute inset-0 bg-[#ceb652]/20 rounded-lg md:rounded-xl blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative w-14 h-14 md:w-16 md:h-16 bg-white rounded-lg md:rounded-xl flex items-center justify-center border border-[#ceb652]/20 group-hover:scale-110 transition-transform duration-500 shadow-md">
                      {/* REEMPLAZA ESTA URL CON TU PROPIO ICONO */}
                      <img
                        src={iconUrls.benefit3}
                        alt="Icono Beneficio 3"
                        className="w-10 h-10 md:w-12 md:h-12 object-contain"
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-lg md:text-xl font-light text-[#233c33] mb-1 md:mb-2 group-hover:text-[#ceb652] transition-colors duration-300">
                      {t('section2.benefit3.title') || "Personalización Única"}
                    </h4>
                    <p className="text-sm md:text-base text-[#233c33]/70 font-light leading-relaxed">
                      {t('section2.benefit3.description') || "Prendas que reflejan tu esencia, no tendencias pasajeras."}
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* COLUMNA DERECHA — CARRUSEL PREMIUM 16:9 */}
            <div 
              className="relative w-full"
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
            >

              {/* Marco decorativo - Responsive */}
              <div className="absolute -inset-2 md:-inset-4 bg-gradient-to-br from-[#ceb652]/10 via-transparent to-[#233c33]/10 rounded-xl md:rounded-3xl blur-xl md:blur-2xl" />

              {/* CONTENEDOR PRINCIPAL CON RELACIÓN 16:9 - Responsive */}
              <div className="relative overflow-hidden rounded-xl md:rounded-2xl shadow-lg md:shadow-2xl bg-[#233c33]/5 border border-[#ceb652]/10 aspect-[4/3] md:aspect-[16/9]">

                {/* SLIDER */}
                <div
                  className="flex transition-transform duration-1000 ease-out h-full"
                  style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                >
                  {images.map((img, i) => (
                    <div key={i} className="relative w-full h-full flex-shrink-0">
                      <img
                        src={img}
                        className="w-full h-full object-cover"
                        alt={`Style ${i + 1}`}
                        loading="lazy"
                      />
                      {/* Overlay sutil */}
                      <div className="absolute inset-0 bg-gradient-to-t from-[#233c33]/20 via-transparent to-transparent" />
                    </div>
                  ))}
                </div>

                {/* Número de imagen actual - Responsive */}
                <div className="absolute top-4 right-4 md:top-6 md:right-6 px-3 md:px-4 py-1 md:py-2 bg-white/90 backdrop-blur-md rounded-full text-[#233c33] text-xs md:text-sm font-light border border-[#ceb652]/20">
                  {currentIndex + 1} / {images.length}
                </div>

                {/* CONTROLES ELEGANTES - Responsive */}
                <div className="absolute inset-0 flex justify-between items-center px-4 md:px-6 pointer-events-none">
                  <button
                    onClick={prevSlide}
                    className="pointer-events-auto group w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-md hover:bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl border border-[#ceb652]/20 flex items-center justify-center"
                    aria-label={t('section2.carousel.prev') || "Previous slide"}
                  >
                    {/* Flecha izquierda - mantengo SVG para controles del carrusel */}
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-[#233c33] group-hover:text-[#ceb652] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextSlide}
                    className="pointer-events-auto group w-10 h-10 md:w-12 md:h-12 bg-white/90 backdrop-blur-md hover:bg-white rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl border border-[#ceb652]/20 flex items-center justify-center"
                    aria-label={t('section2.carousel.next') || "Next slide"}
                  >
                    {/* Flecha derecha - mantengo SVG para controles del carrusel */}
                    <svg className="w-5 h-5 md:w-6 md:h-6 text-[#233c33] group-hover:text-[#ceb652] transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* DOTS PREMIUM - Responsive */}
              <div className="flex justify-center gap-2 mt-6 md:mt-8">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`transition-all duration-500 rounded-full ${
                      index === currentIndex
                        ? "w-8 md:w-10 h-2 bg-[#ceb652]"
                        : "w-2 h-2 bg-[#233c33]/20 hover:bg-[#233c33]/40"
                    }`}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>

              {/* Indicador de progreso - Responsive */}
              <div className="mt-4 md:mt-6 w-full h-1 bg-[#233c33]/10 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-[#ceb652] to-[#d4c56a] transition-all duration-500"
                  style={{ width: `${((currentIndex + 1) / images.length) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        section {
          font-family: 'Inter', sans-serif;
        }

        h2 span {
          font-family: 'Marcellus', serif;
        }
      `}</style>
    </>
  );
}