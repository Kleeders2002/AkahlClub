import React from 'react';
import { useTranslation } from 'react-i18next';

const SectionFour = () => {
  const { t } = useTranslation();

  return (
    <section className="relative py-28 lg:py-32 px-4 md:px-5% bg-gradient-to-br from-[#fcfbf8] via-[#faf8f3] to-[#f5f3ed] overflow-hidden">
      {/* Luxury Background */}
      <div className="absolute inset-0 z-10 bg-[radial-gradient(circle_at_15%_15%,rgba(193,173,72,0.04)_0%,transparent_25%),radial-gradient(circle_at_85%_85%,rgba(192,192,192,0.03)_0%,transparent_25%),repeating-linear-gradient(45deg,transparent,transparent_1px,rgba(21,40,33,0.01)_2px,rgba(21,40,33,0.01)_4px)] bg-[size:200%_200%,200%_200%,30px_30px] animate-bgFloat"></div>
      
      <style jsx>{`
        @keyframes bgFloat {
          0%, 100% { background-position: 0% 0%, 100% 100%, 0 0; }
          50% { background-position: 100% 0%, 0% 100%, 30px 30px; }
        }
        .animate-bgFloat {
          animation: bgFloat 25s ease infinite;
        }
      `}</style>

      <div className="relative z-20 max-w-7xl mx-auto">
        {/* Header VIP */}
        <div className="text-center mb-20 lg:mb-28 relative">
          <div className="relative before:absolute before:inset-0 before:w-[400px] before:h-[400px] before:lg:w-[500px] before:lg:h-[500px] before:bg-radial-circle before:from-gold/10 before:to-transparent before:translate-x-[-50%] before:translate-y-[-50%] before:left-1/2 before:top-1/2 before:z-[-1]">
            <div className="inline-flex items-center gap-3 font-montserrat text-xs lg:text-sm font-bold tracking-[0.25em] lg:tracking-[0.3em] text-gold uppercase bg-white/90 backdrop-blur-lg py-3 lg:py-4 px-6 lg:px-9 rounded-full border border-gold/20 shadow-lg mb-6 lg:mb-8">
              <span>👑</span>
              <span>{t('membership.label', 'TU CAMINO AL ESTILO')}</span>
            </div>
            
            <h2 className="font-stanford text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-semibold text-dark-green leading-tight mb-6 lg:mb-8 tracking-tight relative after:absolute after:bottom-[-20px] after:left-1/2 after:transform after:translate-x-[-50%] after:w-28 after:h-1 after:bg-gradient-to-r after:from-transparent after:via-gold after:to-transparent">
              {t('membership.title_line1', 'Elige tu nivel de')}<br />
              {t('membership.title_line2', 'membresía ideal')}
            </h2>
            
            <p className="font-montserrat text-base lg:text-xl text-dark-green/70 max-w-4xl mx-auto leading-relaxed lg:leading-loose font-light tracking-wide mt-10 lg:mt-12">
              {t('membership.subtitle', 'Desde una introducción gratuita hasta acceso completo a nuestra comunidad premium, tenemos el plan perfecto para tu viaje de estilo.')}
            </p>
          </div>
        </div>

        {/* Grid de Membresías */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-6xl mx-auto mb-20 lg:mb-28 px-4 lg:px-8">
          {/* Plan Plata */}
          <div className="relative bg-gradient-to-br from-white via-[#fcfaf5] to-white rounded-3xl p-8 lg:p-12 border border-dark-green/10 shadow-2xl hover:shadow-3xl transition-all duration-500 ease-in-out hover:-translate-y-6 hover:scale-[1.02] group overflow-hidden">
            {/* Glow Border Effect */}
            <div className="absolute inset-[-2px] bg-gradient-to-br from-transparent via-gold/30 to-transparent rounded-[34px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse z-[-1]"></div>
            
            <div className="pb-8 lg:pb-10 text-center border-b border-dark-green/10 mb-8 lg:mb-10">
              <div className="inline-flex items-center gap-3 font-montserrat text-xs lg:text-sm font-extrabold tracking-[0.15em] uppercase py-3 lg:py-4 px-6 lg:px-8 rounded-full backdrop-blur-lg mb-6 lg:mb-8 relative overflow-hidden bg-gradient-to-br from-silver/15 to-platinum/10 text-gray-600 border border-silver/30 shadow-lg">
                <span>🥈</span>
                <span>{t('membership.silver.badge', 'ENTRADA')}</span>
              </div>
              
              <h3 className="font-stanford text-2xl lg:text-3xl xl:text-4xl font-semibold text-gray-600 mb-4 lg:mb-6 leading-tight">
                {t('membership.silver.name', 'Akahl Club Plata')}
              </h3>
              
              <div className="flex items-baseline justify-center gap-2 lg:gap-3 mt-6 lg:mt-8 mb-2">
                <span className="font-montserrat text-xl lg:text-2xl font-bold text-dark-green/80">$</span>
                <div className="font-montserrat text-4xl lg:text-5xl xl:text-6xl font-extrabold text-gray-600">
                  {t('membership.silver.price', '0')}
                </div>
              </div>
              
              <div className="font-montserrat text-sm lg:text-base text-dark-green/60 font-medium tracking-wide">
                {t('membership.silver.period', 'Por siempre gratis')}
              </div>
            </div>
            
            <div className="flex flex-col flex-grow pb-8 lg:pb-10">
              <p className="font-montserrat text-base lg:text-lg text-dark-green/80 leading-relaxed text-center mb-8 lg:mb-10 font-light">
                {t('membership.silver.description', 'Ideal para iniciar tu camino hacia el estilo atemporal y conocer nuestra comunidad.')}
              </p>
              
              <div className="flex items-center gap-4 mb-6 lg:mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-silver/10 text-gray-600 border border-silver/20">
                  <span>✓</span>
                </div>
                <h4 className="font-montserrat text-sm font-bold text-dark-green uppercase tracking-wider">
                  {t('membership.silver.benefits_title', 'Lo que incluye:')}
                </h4>
              </div>
              
              <ul className="space-y-3 lg:space-y-4 mb-8 lg:mb-10 flex-grow">
                {[1, 2, 3, 4, 5].map((num) => (
                  <li key={num} className="relative pl-12 py-3 lg:py-4 font-montserrat text-dark-green/80 hover:text-dark-green transition-all duration-300 hover:translate-x-2 border-b border-dark-green/5 group-hover:border-gold/20">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center bg-silver/10 text-gray-600 border border-silver/20">
                      ✓
                    </div>
                    {t(`membership.silver.benefit${num}`, 
                      num === 1 ? 'Acceso al grupo de WhatsApp de la comunidad' :
                      num === 2 ? 'Consejos semanales de estilo y combinaciones' :
                      num === 3 ? 'Newsletter mensual con tips de moda y estilo' :
                      num === 4 ? 'Acceso a eventos gratuitos ocasionales' :
                      'Descuentos especiales en primera compra'
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-8 lg:pt-10 text-center border-t border-dark-green/10">
              <a
                href="/membership"
                className="w-full flex items-center justify-center gap-4 py-5 lg:py-6 px-6 font-montserrat text-sm lg:text-base font-extrabold tracking-wider uppercase rounded-2xl bg-gradient-to-br from-gray-200 to-gray-300 text-gray-600 shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] relative overflow-hidden group/btn"
              >
                <span>{t('membership.silver.button', 'Comenzar con Plata')}</span>
                <span>→</span>
              </a>
            </div>
          </div>

          {/* Plan Oro */}
          <div className="relative bg-gradient-to-br from-white via-[#fcfaf5] to-white rounded-3xl p-8 lg:p-12 border border-dark-green/10 shadow-2xl hover:shadow-3xl transition-all duration-500 ease-in-out hover:-translate-y-6 hover:scale-[1.02] group overflow-hidden">
            {/* Glow Border Effect */}
            <div className="absolute inset-[-2px] bg-gradient-to-br from-transparent via-gold/30 to-transparent rounded-[34px] opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse z-[-1]"></div>
            
            <div className="pb-8 lg:pb-10 text-center border-b border-dark-green/10 mb-8 lg:mb-10">
              <div className="inline-flex items-center gap-3 font-montserrat text-xs lg:text-sm font-extrabold tracking-[0.15em] uppercase py-3 lg:py-4 px-6 lg:px-8 rounded-full backdrop-blur-lg mb-6 lg:mb-8 relative overflow-hidden bg-gradient-to-br from-gold/15 to-yellow-100/10 text-gold border border-gold/30 shadow-lg">
                <span>🏆</span>
                <span>{t('membership.gold.badge', 'RECOMENDADO')}</span>
              </div>
              
              <h3 className="font-stanford text-2xl lg:text-3xl xl:text-4xl font-semibold bg-gradient-to-br from-dark-green to-[#2c463c] bg-clip-text text-transparent mb-4 lg:mb-6 leading-tight">
                {t('membership.gold.name', 'Akahl Club Oro')}
              </h3>
              
              <div className="flex items-baseline justify-center gap-2 lg:gap-3 mt-6 lg:mt-8 mb-2">
                <span className="font-montserrat text-xl lg:text-2xl font-bold text-dark-green/80">$</span>
                <div className="font-montserrat text-4xl lg:text-5xl xl:text-6xl font-extrabold bg-gradient-to-br from-gold to-[#d4af37] bg-clip-text text-transparent">
                  {t('membership.gold.price', '9.99')}
                </div>
              </div>
              
              <div className="font-montserrat text-sm lg:text-base text-dark-green/60 font-medium tracking-wide">
                {t('membership.gold.period', 'Por mes (cancelas cuando quieras)')}
              </div>
            </div>
            
            <div className="flex flex-col flex-grow pb-8 lg:pb-10">
              <p className="font-montserrat text-base lg:text-lg text-dark-green/80 leading-relaxed text-center mb-8 lg:mb-10 font-light">
                {t('membership.gold.description', 'Acceso completo a la comunidad premium y recursos exclusivos para mejorar tu estilo.')}
              </p>
              
              <div className="flex items-center gap-4 mb-6 lg:mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gold/10 text-gold border border-gold/20">
                  <span>✦</span>
                </div>
                <h4 className="font-montserrat text-sm font-bold text-dark-green uppercase tracking-wider">
                  {t('membership.gold.benefits_title', 'Todo lo de Plata, más:')}
                </h4>
              </div>
              
              <ul className="space-y-3 lg:space-y-4 mb-8 lg:mb-10 flex-grow">
                <li className="relative pl-12 py-3 lg:py-4 font-montserrat text-dark-green/80 hover:text-dark-green transition-all duration-300 hover:translate-x-2 border-b border-dark-green/5 group-hover:border-gold/20">
                  <div className="absolute left-0 top-4 w-8 h-8 rounded-xl flex items-center justify-center bg-gold/10 text-gold border border-gold/20">
                    ✦
                  </div>
                  <strong>{t('membership.gold.benefit1', 'Acceso a la biblioteca digital:')}</strong>
                  <ul className="mt-3 lg:mt-4 space-y-2 lg:space-y-3 pl-4 border-t border-dark-green/5 pt-3">
                    {[1, 2, 3, 4].map((num) => (
                      <li key={num} className="relative pl-8 text-sm lg:text-base text-dark-green/70 hover:text-dark-green transition-colors duration-300">
                        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center bg-gold/5 text-gold border border-gold/15">
                          →
                        </div>
                        {t(`membership.gold.benefit1_sublist${num}`,
                          num === 1 ? 'E-books de combinación de patrones' :
                          num === 2 ? 'Guías de tejidos y texturas' :
                          num === 3 ? 'Manual de estilo atemporal' :
                          'PDFs con consejos de tendencias conscientes'
                        )}
                      </li>
                    ))}
                  </ul>
                </li>
                
                {[2, 3, 4, 5].map((num) => (
                  <li key={num} className="relative pl-12 py-3 lg:py-4 font-montserrat text-dark-green/80 hover:text-dark-green transition-all duration-300 hover:translate-x-2 border-b border-dark-green/5 group-hover:border-gold/20">
                    <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-8 h-8 rounded-xl flex items-center justify-center bg-gold/10 text-gold border border-gold/20">
                      ✦
                    </div>
                    {t(`membership.gold.benefit${num}`,
                      num === 2 ? 'Tutoriales y recursos exclusivos mensuales' :
                      num === 3 ? 'Acceso exclusivo a la comunidad VIP de WhatsApp' :
                      num === 4 ? 'Descuentos especiales en prendas personalizadas' :
                      'Acceso anticipado a lanzamientos y colecciones'
                    )}
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="pt-8 lg:pt-10 text-center border-t border-dark-green/10">
              <a
                href="/membership"
                className="w-full flex items-center justify-center gap-4 py-5 lg:py-6 px-6 font-montserrat text-sm lg:text-base font-extrabold tracking-wider uppercase rounded-2xl bg-gradient-to-br from-gold to-[#d4af37] text-dark-green shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 hover:scale-[1.02] relative overflow-hidden group/btn"
              >
                <span>{t('membership.gold.button', 'Comenzar Membresía Oro')}</span>
                <span>→</span>
              </a>
            </div>
          </div>
        </div>

        {/* Comparison Section VIP */}
        <div className="relative bg-gradient-to-br from-dark-green to-[#0d1c16] rounded-3xl p-8 lg:p-16 xl:p-20 text-center overflow-hidden shadow-3xl border border-gold/10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(193,173,72,0.08)_0%,transparent_50%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.03)_0%,transparent_50%)] z-10"></div>
          
          <div className="relative z-20">
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-lg text-gold py-3 lg:py-4 px-6 lg:px-9 rounded-full border border-gold/30 shadow-2xl mb-8 lg:mb-12 font-montserrat text-xs lg:text-sm font-bold tracking-[0.2em] uppercase">
              <span>💎</span>
              <span>{t('membership.comparison.badge', 'RECOMENDACIÓN EXPERTA')}</span>
            </div>
            
            <h3 className="font-cormorant text-2xl lg:text-3xl xl:text-4xl font-semibant text-white mb-6 lg:mb-8 leading-tight">
              {t('membership.comparison.title', '¿No estás seguro de cuál elegir?')}
            </h3>
            
            <p className="font-montserrat text-base lg:text-lg xl:text-xl text-white/95 max-w-4xl mx-auto leading-relaxed lg:leading-loose mb-10 lg:mb-12 font-normal tracking-wide">
              <strong>{t('membership.comparison.text_line1', 'Comienza con el plan Plata por $9.99/mes')}</strong>{' '}
              {t('membership.comparison.text_line2', 'y únete a nuestra comunidad. Si decides acceder a más recursos y beneficios exclusivos, puedes actualizar al plan Oro en cualquier momento y mantener todos tus privilegios.')}
            </p>
            
            <a
              href="/comparative"
              className="inline-flex items-center justify-center gap-4 py-5 lg:py-6 px-10 lg:px-14 font-montserrat text-sm lg:text-base font-extrabold tracking-wider uppercase rounded-2xl bg-gradient-to-br from-gold to-[#d4af37] text-dark-green shadow-2xl hover:shadow-3xl transition-all duration-500 hover:-translate-y-1 hover:scale-105 relative overflow-hidden group/btn"
            >
              <span>{t('membership.comparison.button', 'Comparar planes completos')}</span>
              <span>→</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SectionFour;