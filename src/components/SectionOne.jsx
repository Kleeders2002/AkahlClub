// // src/components/sections/SectionOne.jsx
// import { useEffect, useRef, useState } from 'react';
// import { useTranslation } from 'react-i18next';

// const SectionOne = () => {
//   const [isVisible, setIsVisible] = useState(false);
//   const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
//   const sectionRef = useRef(null);
//   const { t } = useTranslation();

//   useEffect(() => {
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setIsVisible(true);
//         }
//       },
//       { threshold: 0.1 }
//     );

//     const handleMouseMove = (e) => {
//       setMousePosition({
//         x: (e.clientX / window.innerWidth - 0.5) * 20,
//         y: (e.clientY / window.innerHeight - 0.5) * 20
//       });
//     };

//     if (sectionRef.current) {
//       observer.observe(sectionRef.current);
//     }

//     window.addEventListener('mousemove', handleMouseMove);

//     return () => {
//       if (sectionRef.current) {
//         observer.unobserve(sectionRef.current);
//       }
//       window.removeEventListener('mousemove', handleMouseMove);
//     };
//   }, []);

//   return (
//     <section 
//       ref={sectionRef}
//       className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#152821]"
//       id="hero"
//     >
//       {/* Video Background con Parallax */}
//       <div className="absolute inset-0 overflow-hidden z-0">
//         <iframe
//           src="https://player.vimeo.com/video/1152368755?background=1&autoplay=1&loop=1&muted=1&controls=0"
//           className="absolute top-1/2 left-1/2 w-[120vw] h-[67.5vw] min-h-[120vh] min-w-[213.33vh] -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-transform duration-1000"
//           style={{
//             transform: `translate(-50%, -50%) translateX(${mousePosition.x * 0.3}px) translateY(${mousePosition.y * 0.3}px)`,
//           }}
//           frameBorder="0"
//           allow="autoplay; fullscreen; picture-in-picture"
//           title="AKAHL CLUB"
//         />
//       </div>

//       {/* Overlays */}
//       <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#152821]/90 via-[#152821]/80 to-[#152821]/90" />
//       <div className="absolute inset-0 z-20 pointer-events-none opacity-60"
//         style={{
//           backgroundImage: `
//             radial-gradient(circle at 20% 30%, rgba(193,173,72,0.1) 0%, transparent 50%),
//             radial-gradient(circle at 80% 70%, rgba(193,173,72,0.08) 0%, transparent 50%)
//           `,
//           animation: 'pulseGlow 4s ease-in-out infinite alternate'
//         }}
//       />

//       {/* Contenido Principal */}
//       <div className="relative z-30 max-w-5xl mx-auto px-6 text-center pt-32 pb-20">
//         {/* Subtitle */}
//         <div className={`text-[#c1ad48] tracking-[4px] uppercase text-sm font-medium mb-8 transition-all duration-1000 ${
//           isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
//         }`}>
//           {t('hero.subtitle')}
//         </div>

//         {/* Título */}
//         <h1 className={`font-marcellus text-7xl md:text-6xl sm:text-5xl font-light leading-tight mb-10 transition-all duration-1000 delay-200 ${
//           isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
//         }`}>
//           {t('hero.title_line1')}{' '}
//           <span className="text-[#c1ad48] italic font-semibold relative inline-block glow-text">
//             {t('hero.title_highlight')}
//             <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c1ad48] to-transparent"></span>
//           </span>
//           <br />
//           {t('hero.title_line2')}
//         </h1>

//         {/* Descripción */}
//         <p className={`font-inter text-xl md:text-lg leading-relaxed max-w-3xl mx-auto mb-12 transition-all duration-1000 delay-400 ${
//           isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
//         }`}>
//           {t('hero.description')}
//         </p>

//         {/* Botones */}
//         <div className={`flex flex-wrap justify-center gap-6 transition-all duration-1000 delay-600 ${
//           isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
//         }`}>
//           <PrimaryButton
//             href="#quiz"
//             text={t('hero.button_discover')}
//           />
//           <SecondaryButton
//             href="#membership"
//             text={t('hero.button_explore')}
//           />
//         </div>
//       </div>

//       {/* Scroll Indicator */}
//       <div className={`absolute bottom-10 left-1/2 -translate-x-1/2 z-30 transition-all duration-1000 delay-800 ${
//         isVisible ? 'opacity-100' : 'opacity-0'
//       }`}>
//         <div className="flex flex-col items-center">
//           <div className="text-xs tracking-[3px] uppercase text-white/70 mb-3">
//             {t('hero.scroll_text')}
//           </div>
//           <div className="relative w-6 h-12">
//             <div className="absolute left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-[#c1ad48] to-transparent rounded-full animate-scroll" />
//           </div>
//         </div>
//       </div>

//       {/* Estilos */}
//       <style jsx global>{`
//         @keyframes pulseGlow {
//           0% { opacity: 0.4; }
//           100% { opacity: 0.7; }
//         }
        
//         @keyframes scroll {
//           0% { transform: translateY(0); opacity: 0; }
//           40% { opacity: 1; }
//           80% { opacity: 1; }
//           100% { transform: translateY(20px); opacity: 0; }
//         }
        
//         .animate-scroll {
//           animation: scroll 2s ease-in-out infinite;
//         }
        
//         .glow-text {
//           text-shadow: 0 0 20px rgba(193, 173, 72, 0.5);
//         }
//       `}</style>
//     </section>
//   );
// };

// // Componentes de botón reutilizables
// const PrimaryButton = ({ href, text }) => (
//   <a
//     href={href}
//     className="group relative px-12 py-4 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-400 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl"
//     style={{
//       background: 'linear-gradient(135deg, #c1ad48 0%, #d4bf5a 50%, #c1ad48 100%)',
//       backgroundSize: '200% 100%',
//       color: '#152821',
//       boxShadow: '0 10px 40px rgba(193, 173, 72, 0.4)',
//       border: '1px solid rgba(255, 255, 255, 0.2)',
//     }}
//     onMouseEnter={(e) => e.currentTarget.style.backgroundPosition = '100% 0'}
//     onMouseLeave={(e) => e.currentTarget.style.backgroundPosition = '0 0'}
//   >
//     <span className="relative z-10">{text}</span>
//     <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
//       className="inline-block ml-3 relative z-10 transition-transform duration-400 group-hover:translate-x-1">
//       <line x1="5" y1="12" x2="19" y2="12" />
//       <polyline points="12 5 19 12 12 19" />
//     </svg>
//   </a>
// );

// const SecondaryButton = ({ href, text }) => (
//   <a
//     href={href}
//     className="group px-12 py-4 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-400 hover:scale-105 hover:-translate-y-1 hover:shadow-xl"
//     style={{
//       background: 'transparent',
//       color: '#ffffff',
//       border: '2px solid rgba(255, 255, 255, 0.3)',
//       backdropFilter: 'blur(10px)',
//     }}
//     onMouseEnter={(e) => {
//       e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
//       e.currentTarget.style.borderColor = '#c1ad48';
//     }}
//     onMouseLeave={(e) => {
//       e.currentTarget.style.background = 'transparent';
//       e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
//     }}
//   >
//     {text}
//   </a>
// );

// export default SectionOne;

// src/components/sections/SectionOne.jsx
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

const SectionOne = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const sectionRef = useRef(null);
  const { t } = useTranslation();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <section 
      ref={sectionRef}
      className="relative w-full min-h-screen flex items-center justify-center overflow-hidden bg-[#152821] text-white"
      id="hero"
    >
      {/* Video Background con Parallax - OPTIMIZADO para responsive */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <iframe
          src="https://player.vimeo.com/video/1152368755?background=1&autoplay=1&loop=1&muted=1&controls=0"
          className="absolute top-1/2 left-1/2 w-[140%] h-[140%] min-w-[140%] min-h-[140%] -translate-x-1/2 -translate-y-1/2 object-cover transition-transform duration-1000"
          style={{
            transform: `translate(-50%, -50%) translateX(${mousePosition.x * 0.3}px) translateY(${mousePosition.y * 0.3}px) scale(1.1)`,
          }}
          frameBorder="0"
          allow="autoplay; fullscreen; picture-in-picture"
          title="AKAHL CLUB"
          allowFullScreen
        />
      </div>

      {/* Overlays */}
      <div className="absolute inset-0 z-10 bg-gradient-to-br from-[#152821]/90 via-[#152821]/80 to-[#152821]/90" />
      <div className="absolute inset-0 z-20 pointer-events-none opacity-60"
        style={{
          backgroundImage: `
            radial-gradient(circle at 20% 30%, rgba(193,173,72,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 70%, rgba(193,173,72,0.08) 0%, transparent 50%)
          `,
          animation: 'pulseGlow 4s ease-in-out infinite alternate'
        }}
      />

      {/* Contenido Principal */}
      <div className="relative z-30 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20 sm:pt-24 md:pt-28 lg:pt-32 pb-16 sm:pb-20">
        {/* Subtitle */}
        <div className={`text-[#c1ad48] tracking-[3px] sm:tracking-[4px] uppercase text-xs sm:text-sm font-medium mb-4 sm:mb-6 md:mb-8 transition-all duration-1000 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {t('hero.subtitle')}
        </div>

        {/* Título */}
        <h1 className={`font-marcellus text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-light leading-snug sm:leading-tight mb-6 sm:mb-8 md:mb-10 transition-all duration-1000 delay-200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {t('hero.title_line1')}{' '}
          <span className="text-[#c1ad48] italic font-semibold relative inline-block glow-text">
            {t('hero.title_highlight')}
            <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#c1ad48] to-transparent"></span>
          </span>
          <br className="hidden sm:block" />
          {t('hero.title_line2')}
        </h1>

        {/* Descripción */}
        <p className={`font-inter text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl sm:max-w-3xl mx-auto mb-8 sm:mb-10 md:mb-12 transition-all duration-1000 delay-400 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          {t('hero.description')}
        </p>

        {/* Botones */}
        <div className={`flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 transition-all duration-1000 delay-600 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
        }`}>
          <PrimaryButton
            href="/login"
            text={t('hero.button_discover')}
          />
          <SecondaryButton
            href="/membership"
            text={t('hero.button_explore')}
          />
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className={`absolute bottom-6 sm:bottom-8 md:bottom-10 left-1/2 -translate-x-1/2 z-30 transition-all duration-1000 delay-800 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex flex-col items-center">
          <div className="text-xs tracking-[3px] uppercase text-white/70 mb-2 sm:mb-3">
            {t('hero.scroll_text')}
          </div>
          <div className="relative w-6 h-12">
            <div className="absolute left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-[#c1ad48] to-transparent rounded-full animate-scroll" />
          </div>
        </div>
      </div>

      {/* Estilos locales para esta sección */}
      <style jsx>{`
        @keyframes pulseGlow {
          0% { opacity: 0.4; }
          100% { opacity: 0.7; }
        }
        
        @keyframes scroll {
          0% { transform: translateY(0); opacity: 0; }
          40% { opacity: 1; }
          80% { opacity: 1; }
          100% { transform: translateY(20px); opacity: 0; }
        }
        
        .animate-scroll {
          animation: scroll 2s ease-in-out infinite;
        }
        
        .glow-text {
          text-shadow: 0 0 20px rgba(193, 173, 72, 0.5);
        }

        /* Responsive adicional para pantallas muy pequeñas */
        @media (max-width: 320px) {
          .text-3xl {
            font-size: 1.75rem;
          }
          .text-xs {
            font-size: 0.7rem;
          }
        }

        /* Video responsivo - más grande en móvil y tablet para cubrir todo */
        @media (max-width: 640px) {
          iframe {
            width: 300% !important;
            height: 300% !important;
            min-width: 300% !important;
            min-height: 300% !important;
          }
        }

        @media (min-width: 641px) and (max-width: 1024px) {
          iframe {
            width: 180% !important;
            height: 180% !important;
            min-width: 180% !important;
            min-height: 180% !important;
          }
        }

        @media (min-width: 1025px) {
          iframe {
            width: 140% !important;
            height: 140% !important;
            min-width: 140% !important;
            min-height: 140% !important;
          }
        }
      `}</style>
    </section>
  );
};

// Componentes de botón reutilizables - CON TEXTO BLANCO
const PrimaryButton = ({ href, text }) => (
  <a
    href={href}
    className="group relative px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-400 hover:scale-105 hover:-translate-y-1 hover:shadow-2xl w-full sm:w-auto text-center"
    style={{
      background: 'linear-gradient(135deg, #c1ad48 0%, #d4bf5a 50%, #c1ad48 100%)',
      backgroundSize: '200% 100%',
      color: '#ffffff',
      boxShadow: '0 10px 40px rgba(193, 173, 72, 0.4)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
    }}
    onMouseEnter={(e) => e.currentTarget.style.backgroundPosition = '100% 0'}
    onMouseLeave={(e) => e.currentTarget.style.backgroundPosition = '0 0'}
  >
    <span className="relative z-10">{text}</span>
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"
      className="inline-block ml-3 relative z-10 transition-transform duration-400 group-hover:translate-x-1">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  </a>
);

const SecondaryButton = ({ href, text }) => (
  <a
    href={href}
    className="group px-8 sm:px-10 md:px-12 py-3 sm:py-4 rounded-full font-bold text-xs sm:text-sm tracking-wider uppercase transition-all duration-400 hover:scale-105 hover:-translate-y-1 hover:shadow-xl w-full sm:w-auto text-center"
    style={{
      background: 'transparent',
      color: '#ffffff',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      backdropFilter: 'blur(10px)',
    }}
    onMouseEnter={(e) => {
      e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
      e.currentTarget.style.borderColor = '#c1ad48';
    }}
    onMouseLeave={(e) => {
      e.currentTarget.style.background = 'transparent';
      e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
    }}
  >
    {text}
  </a>
);

export default SectionOne;