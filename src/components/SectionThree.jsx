import { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { GraduationCap, Shirt, Users, Star, Zap, ChevronRight, Check, Sparkles } from 'lucide-react';

const SectionThree = () => {
  const { t } = useTranslation();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const carouselTrackRef = useRef(null);
  const carouselContainerRef = useRef(null);

  const benefits = [
    {
      id: 1,
      title: t('benefits.education.title'),
      description: t('benefits.education.description'),
      icon: GraduationCap,
    },
    {
      id: 2,
      title: t('benefits.wardrobe.title'),
      description: t('benefits.wardrobe.description'),
      icon: Shirt,
    },
    {
      id: 3,
      title: t('benefits.community.title'),
      description: t('benefits.community.description'),
      icon: Users,
    },
    {
      id: 4,
      title: t('benefits.experiences.title'),
      description: t('benefits.experiences.description'),
      icon: Star,
    },
  ];

  const features = [
    t('benefits.features.consultation'),
    t('benefits.features.plan'),
    t('benefits.features.support'),
  ];

  // Calcular cards por vista según el ancho de pantalla
  useEffect(() => {
    const updateCardsPerView = () => {
      const width = window.innerWidth;
      if (width >= 1400) {
        setCardsPerView(3);
      } else if (width >= 992) {
        setCardsPerView(2);
      } else {
        setCardsPerView(1);
      }
    };

    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, []);

  // Actualizar posición del carrusel
  useEffect(() => {
    if (carouselTrackRef.current) {
      const track = carouselTrackRef.current;
      const container = carouselContainerRef.current;
      
      if (container) {
        const containerWidth = container.offsetWidth;
        const cardWidth = containerWidth / cardsPerView;
        const gap = 40;
        const translateX = -currentSlide * (cardWidth + gap);
        
        track.style.transform = `translateX(${translateX}px)`;
        track.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
      }
    }
  }, [currentSlide, cardsPerView]);

  const nextSlide = () => {
    const maxSlide = benefits.length - cardsPerView;
    setCurrentSlide(prev => Math.min(prev + 1, maxSlide));
  };

  const prevSlide = () => {
    setCurrentSlide(prev => Math.max(prev - 1, 0));
  };

  return (
    <section className="relative py-20 md:py-28 lg:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden bg-gradient-to-br from-white via-[#fcfbf8] to-white">
      {/* Luxury Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div 
          className="absolute inset-0"
          style={{
            background: `
              radial-gradient(circle at 10% 10%, rgba(193, 173, 72, 0.03) 0%, transparent 30%),
              radial-gradient(circle at 90% 90%, rgba(21, 40, 33, 0.02) 0%, transparent 30%),
              linear-gradient(45deg, transparent 48%, rgba(193, 173, 72, 0.01) 49%, transparent 50%),
              linear-gradient(-45deg, transparent 48%, rgba(21, 40, 33, 0.01) 49%, transparent 50%)
            `,
            backgroundSize: '120px 120px',
          }}
        />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Header VIP */}
        <div className="text-center mb-16 md:mb-24 lg:mb-28 pt-10 md:pt-16">
          <div className="inline-flex items-center gap-3 bg-[rgba(193,173,72,0.1)] border border-[rgba(193,173,72,0.2)] backdrop-blur-sm rounded-full px-6 py-3 mb-8">
            <Sparkles className="w-4 h-4 text-[#c1ad48]" />
            <span className="font-montserrat font-bold text-xs md:text-sm uppercase tracking-widest text-[#c1ad48]">
              {t('benefits.label')}
            </span>
          </div>
          
          <h2 className="font-cormorant font-semibold text-3xl md:text-4xl lg:text-5xl text-[#152821] leading-tight mb-6">
            {t('benefits.title.line1')}
            <br />
            {t('benefits.title.line2')}
          </h2>
          
          <div className="relative inline-block mb-10">
            <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-transparent via-[#c1ad48] to-transparent" />
          </div>
          
          <p className="font-montserrat font-light text-base md:text-lg lg:text-xl text-[#152821]/70 max-w-3xl mx-auto leading-relaxed tracking-wide">
            {t('benefits.subtitle')}
          </p>
        </div>

        {/* Carrusel VIP de Beneficios */}
        <div className="relative mb-20 md:mb-24 lg:mb-28 px-2 sm:px-4 md:px-8 lg:px-12">
          <div 
            ref={carouselContainerRef}
            className="overflow-hidden rounded-3xl"
          >
            {/* Carrusel Track */}
            <div
              ref={carouselTrackRef}
              className="flex gap-10 px-2 py-4"
            >
              {benefits.map((benefit, index) => (
                <div
                  key={benefit.id}
                  className="flex-shrink-0 rounded-2xl p-6 md:p-8 lg:p-10 relative bg-gradient-to-br from-white to-[#faf8f3] border border-[rgba(21,40,33,0.08)] shadow-[0_20px_60px_rgba(21,40,33,0.08),inset_0_0_0_1px_rgba(255,255,255,0.5)] transition-all duration-500 hover:-translate-y-5 hover:scale-[1.02] hover:shadow-[0_40px_100px_rgba(21,40,33,0.2),0_0_0_1px_rgba(193,173,72,0.1),inset_0_0_100px_rgba(193,173,72,0.03)] hover:border-[rgba(193,173,72,0.3)] group"
                  style={{
                    width: `calc((100% - ${(cardsPerView - 1) * 40}px) / ${cardsPerView})`,
                    minHeight: '500px',
                  }}
                >
                  {/* Número de Beneficio */}
                  <div className="absolute top-6 right-6 font-cormorant font-bold text-6xl lg:text-7xl text-[#152821]/5 group-hover:text-[#c1ad48]/10 transition-colors duration-500">
                    0{benefit.id}
                  </div>
                  
                  {/* Icono */}
                  <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 rounded-xl md:rounded-2xl bg-gradient-to-br from-[rgba(193,173,72,0.1)] to-[rgba(193,173,72,0.2)] flex items-center justify-center mb-6 md:mb-8 group-hover:rotate-3 group-hover:scale-110 group-hover:bg-gradient-to-br from-[rgba(193,173,72,0.2)] to-[rgba(193,173,72,0.3)] group-hover:shadow-[0_15px_40px_rgba(193,173,72,0.2)] transition-all duration-500">
                    <benefit.icon className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12 text-[#c1ad48] group-hover:scale-110 transition-transform duration-500" />
                  </div>
                  
                  {/* Contenido */}
                  <div className="relative z-10 flex-1 flex flex-col">
                    <h3 className="font-cormorant font-semibold text-2xl md:text-3xl text-[#152821] mb-4 md:mb-6 min-h-[72px]">
                      {benefit.title}
                    </h3>
                    
                    {/* Divider */}
                    <div className="w-12 h-0.5 bg-gradient-to-r from-[#c1ad48] to-transparent opacity-50 mb-6" />
                    
                    <p className="font-montserrat font-light text-sm md:text-base text-[#152821]/70 leading-relaxed flex-1">
                      {benefit.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Controles del Carrusel */}
          <div className="absolute top-1/2 left-0 right-0 -translate-y-1/2 flex justify-between px-4 md:px-2 lg:px-0 pointer-events-none">
            <button
              onClick={prevSlide}
              disabled={currentSlide === 0}
              className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-white/90 backdrop-blur-lg border border-[rgba(193,173,72,0.2)] text-[#152821] flex items-center justify-center shadow-[0_10px_40px_rgba(21,40,33,0.1)] transition-all duration-400 hover:bg-[#c1ad48] hover:text-[#152821] hover:scale-110 hover:rotate-[-5deg] hover:shadow-[0_15px_50px_rgba(193,173,72,0.4)] hover:border-[#c1ad48] pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:rotate-0"
              aria-label={t('carousel.prev')}
            >
              <ChevronRight className="w-6 h-6 rotate-180" />
            </button>
            
            <button
              onClick={nextSlide}
              disabled={currentSlide >= benefits.length - cardsPerView}
              className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 rounded-full bg-white/90 backdrop-blur-lg border border-[rgba(193,173,72,0.2)] text-[#152821] flex items-center justify-center shadow-[0_10px_40px_rgba(21,40,33,0.1)] transition-all duration-400 hover:bg-[#c1ad48] hover:text-[#152821] hover:scale-110 hover:rotate-[5deg] hover:shadow-[0_15px_50px_rgba(193,173,72,0.4)] hover:border-[#c1ad48] pointer-events-auto disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:rotate-0"
              aria-label={t('carousel.next')}
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Sección de Acceso Exclusivo VIP */}
        <div className="rounded-3xl p-6 md:p-10 lg:p-16 relative overflow-hidden bg-gradient-to-br from-[#152821] to-[#0d1c16] border border-[rgba(193,173,72,0.1)] shadow-[0_40px_100px_rgba(21,40,33,0.15)]">
          {/* Overlay animado */}
          <div 
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at 20% 30%, rgba(193, 173, 72, 0.08) 0%, transparent 50%),
                radial-gradient(circle at 80% 70%, rgba(255, 255, 255, 0.03) 0%, transparent 50%),
                repeating-linear-gradient(45deg, transparent, transparent 1px, rgba(255, 255, 255, 0.01) 2px, rgba(255, 255, 255, 0.01) 4px)
              `,
              backgroundSize: '200% 200%, 200% 200%, 20px 20px',
              animation: 'gradientShift 20s ease infinite',
            }}
          />
          
          <div className="relative z-10 text-center">
            {/* Tag */}
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-[rgba(193,173,72,0.3)] rounded-full px-6 py-3 mb-8 md:mb-12 shadow-[0_10px_30px_rgba(0,0,0,0.2)]">
              <Zap className="w-4 h-4 text-[#c1ad48]" />
              <span className="font-montserrat font-bold text-xs md:text-sm uppercase tracking-wider text-[#c1ad48]">
                {t('benefits.access.label')}
              </span>
            </div>
            
            {/* Título */}
            <h3 className="font-cormorant font-semibold text-2xl md:text-3xl lg:text-4xl text-transparent bg-clip-text bg-gradient-to-br from-white to-[#c1ad48] mb-6 md:mb-8 leading-tight">
              {t('benefits.access.title.line1')}
              <br />
              {t('benefits.access.title.line2')}
            </h3>
            
            {/* Subtítulo */}
            <p className="font-montserrat font-light text-base md:text-lg text-white/85 max-w-4xl mx-auto mb-10 md:mb-12 lg:mb-16 leading-relaxed tracking-wide">
              {t('benefits.access.subtitle')}
            </p>
            
            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10 md:mb-12">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="bg-white/5 backdrop-blur-sm rounded-xl md:rounded-2xl p-6 border border-white/10 transition-all duration-500 hover:bg-white/10 hover:border-[rgba(193,173,72,0.3)] hover:-translate-y-2"
                >
                  <div className="w-10 h-10 bg-[#c1ad48] rounded-full flex items-center justify-center mx-auto mb-4 shadow-[0_10px_30px_rgba(193,173,72,0.3)]">
                    <Check className="w-5 h-5 text-[#152821] font-bold" />
                  </div>
                  <p className="font-montserrat font-medium text-sm md:text-base text-white text-center leading-relaxed">
                    {feature}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Estilos CSS personalizados */}
      <style jsx global>{`
        .font-cormorant {
          font-family: 'Marcellus', serif;
        }

        .font-montserrat {
          font-family: 'Inter', sans-serif;
        }
        
        @keyframes gradientShift {
          0%, 100% {
            background-position: 0% 0%, 100% 100%, 0 0;
          }
          50% {
            background-position: 100% 0%, 0% 100%, 20px 20px;
          }
        }
        
        /* Ajustes responsive para el carrusel */
        @media (max-width: 1400px) {
          .carousel-track-container {
            gap: 30px;
          }
        }
        
        @media (max-width: 992px) {
          .carousel-track-container {
            gap: 20px;
          }
        }
        
        @media (max-width: 768px) {
          .carousel-track-container {
            gap: 15px;
          }
        }
      `}</style>
    </section>
  );
};

export default SectionThree;