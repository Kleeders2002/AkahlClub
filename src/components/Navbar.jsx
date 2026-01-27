import { useState, useEffect, useRef } from 'react';
import { Instagram, Globe, ChevronDown, Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [languageOpen, setLanguageOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const languageRef = useRef(null);
  const mobileMenuRef = useRef(null);
  const { t, i18n } = useTranslation();

  // Determinar si estamos en el portal
  const isPortalRoute = location.pathname.startsWith('/portal');

  // Determinar si mostrar el botón de membresía (solo en landing y comparative)
  const showMembershipButton = location.pathname === '/' || location.pathname === '/comparative';

  // Determinar si mostrar el botón de login (solo en landing pages, no en portal ni en login)
  const showLoginButton = !isPortalRoute && location.pathname !== '/login';

  // Detectar scroll para cambiar fondo
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menús al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (languageRef.current && !languageRef.current.contains(event.target)) {
        setLanguageOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cambiar idioma
  const handleLanguageChange = (lang) => {
    i18n.changeLanguage(lang);
    setLanguageOpen(false);
    document.documentElement.lang = lang;
  };

  // Obtener el idioma actual de forma segura
  const currentLanguage = i18n.language || 'en';

  return (
    <>
      <div id="akahl-elite-navbar">
        <nav
          className={`fixed top-0 left-0 right-0 w-full h-[70px] md:h-[90px] flex items-center justify-between px-4 md:px-[5%] box-border transition-all duration-500 z-[9999] ${
            isScrolled
              ? 'bg-gradient-to-b from-[#0f1c17]/95 to-[#152821]/95 backdrop-blur-md shadow-2xl'
              : 'bg-gradient-to-b from-[#152821] to-[#1a332b]'
          }`}
          style={{
            borderBottom: '1px solid rgba(193, 173, 72, 0.15)',
          }}
        >

          {/* Izquierda: Iconos sociales (solo desktop) */}
          <div className="hidden md:flex items-center gap-5 relative z-10">
            {/* WhatsApp */}
            <a
              href="https://wa.me/+17868658511"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-400 hover:scale-105 hover:-translate-y-1"
              style={{
                background: 'rgba(193, 173, 72, 0.08)',
                borderColor: 'rgba(193, 173, 72, 0.2)',
                color: '#c1ad48',
              }}
            >
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{
                  background: 'radial-gradient(circle at center, rgba(193, 173, 72, 0.15), transparent)',
                }}
              />
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative z-10 group-hover:scale-110 transition-transform duration-300"
              >
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
              </svg>
            </a>

            {/* Instagram */}
            <a
              href="https://instagram.com/akahlstyle"
              target="_blank"
              rel="noopener noreferrer"
              className="group relative w-11 h-11 rounded-full border-2 flex items-center justify-center transition-all duration-400 hover:scale-105 hover:-translate-y-1"
              style={{
                background: 'rgba(193, 173, 72, 0.08)',
                borderColor: 'rgba(193, 173, 72, 0.2)',
                color: '#c1ad48',
              }}
            >
              <div
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{
                  background: 'radial-gradient(circle at center, rgba(193, 173, 72, 0.15), transparent)',
                }}
              />
              <Instagram className="w-5 h-5 relative z-10 group-hover:scale-110 transition-transform duration-300" />
            </a>

            {/* Divider */}
            <div
              className="w-px h-7 ml-1"
              style={{
                background: 'linear-gradient(180deg, transparent, rgba(193, 173, 72, 0.3), transparent)',
              }}
            />
          </div>

          {/* Menú móvil */}
          <div className="md:hidden flex items-center relative z-10">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="group relative w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300"
              style={{
                background: 'rgba(193, 173, 72, 0.08)',
                borderColor: 'rgba(193, 173, 72, 0.2)',
                color: '#c1ad48',
              }}
            >
              {mobileMenuOpen ? (
                <X className="w-5 h-5 transition-transform duration-300" />
              ) : (
                <Menu className="w-5 h-5 transition-transform duration-300" />
              )}
            </button>
          </div>

          {/* Centro: Logo */}
          <div className="absolute left-1/2 transform -translate-x-1/2 z-10">
            <Link to="/" className="block relative group" onClick={() => setMobileMenuOpen(false)}>
              <div
                className="absolute inset-[-10px] md:inset-[-15px] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'radial-gradient(circle, rgba(193, 173, 72, 0.1), transparent 70%)',
                }}
              />
              <img
                src="https://i.ibb.co/mFRJ8DWJ/Brutalist-Webzine-Blog-Post-Bold-Instagram-Post-Renaissance-CD-Cover-Art-2.png"
                alt="AKAHL CLUB"
                className="h-12 md:h-14 w-auto transition-all duration-400 hover:scale-110 hover:-translate-y-0.5"
                style={{
                  filter: 'drop-shadow(0 4px 20px rgba(193, 173, 72, 0.4)) brightness(1.1)',
                }}
              />
            </Link>
          </div>

          {/* Derecha: Idioma, Login y CTA (desktop) */}
          <div className="hidden md:flex items-center gap-5 relative z-10">
            {/* Selector de idioma */}
            <div className="relative" ref={languageRef}>
              <button
                onClick={() => setLanguageOpen(!languageOpen)}
                className="group flex items-center gap-2 px-4 py-2.5 rounded-full border transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                style={{
                  background: 'rgba(193, 173, 72, 0.08)',
                  borderColor: 'rgba(193, 173, 72, 0.2)',
                  color: '#c1ad48',
                  fontFamily: "'Inter', sans-serif",
                  fontWeight: 500,
                  fontSize: '14px',
                  letterSpacing: '0.5px',
                }}
              >
                <Globe className="w-4 h-4 group-hover:rotate-180 transition-transform duration-500" />
                <span className="min-w-[30px] text-center">
                  {currentLanguage.toUpperCase().slice(0, 2)}
                </span>
                <ChevronDown 
                  className={`w-4 h-4 transition-transform duration-300 ${languageOpen ? 'rotate-180' : ''}`}
                />
                <div
                  className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(193, 173, 72, 0.15), transparent)',
                  }}
                />
              </button>

              {/* Menú desplegable */}
              {languageOpen && (
                <div
                  className="absolute top-full mt-2 right-0 w-40 rounded-xl overflow-hidden"
                  style={{
                    background: 'linear-gradient(135deg, rgba(21, 40, 33, 0.95) 0%, rgba(26, 51, 43, 0.95) 100%)',
                    backdropFilter: 'blur(12px)',
                    border: '1px solid rgba(193, 173, 72, 0.2)',
                    boxShadow: '0 15px 40px rgba(0, 0, 0, 0.4)',
                    zIndex: 99999,
                    animation: 'fadeInDown 0.3s ease-out',
                    pointerEvents: 'auto',
                  }}
                >
                  <div
                    className="absolute inset-0 opacity-30"
                    style={{
                      background: 'radial-gradient(circle at top right, rgba(193, 173, 72, 0.1), transparent 70%)',
                    }}
                  />
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLanguageChange('es');
                    }}
                    className={`w-full px-4 py-3.5 flex items-center justify-between transition-all duration-250 cursor-pointer ${
                      currentLanguage === 'es' ? 'bg-[#c1ad48]/20' : ''
                    }`}
                    style={{ 
                      borderBottom: '1px solid rgba(193, 173, 72, 0.1)',
                      position: 'relative',
                      zIndex: 100000,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, rgba(193, 173, 72, 0.2), transparent)';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = currentLanguage === 'es' ? 'rgba(193, 173, 72, 0.2)' : 'transparent';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <span 
                      className={`${currentLanguage === 'es' ? 'text-white' : 'text-[#c1ad48]'} transition-colors duration-250 font-medium`}
                      style={{ textShadow: currentLanguage === 'es' ? '0 0 10px rgba(193, 173, 72, 0.5)' : 'none' }}
                    >
                      Español
                    </span>
                    <span className="text-xs text-[#c1ad48]/60 font-semibold">ES</span>
                  </button>
                  
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleLanguageChange('en');
                    }}
                    className={`w-full px-4 py-3.5 flex items-center justify-between transition-all duration-250 cursor-pointer ${
                      currentLanguage === 'en' ? 'bg-[#c1ad48]/20' : ''
                    }`}
                    style={{ 
                      position: 'relative',
                      zIndex: 100000,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'linear-gradient(to right, rgba(193, 173, 72, 0.2), transparent)';
                      e.currentTarget.style.transform = 'translateX(5px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = currentLanguage === 'en' ? 'rgba(193, 173, 72, 0.2)' : 'transparent';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <span 
                      className={`${currentLanguage === 'en' ? 'text-white' : 'text-[#c1ad48]'} transition-colors duration-250 font-medium`}
                      style={{ textShadow: currentLanguage === 'en' ? '0 0 10px rgba(193, 173, 72, 0.5)' : 'none' }}
                    >
                      English
                    </span>
                    <span className="text-xs text-[#c1ad48]/60 font-semibold">EN</span>
                  </button>
                </div>
              )}
            </div>

            {/* Divider */}
            <div
              className="w-px h-7 mr-1"
              style={{
                background: 'linear-gradient(180deg, transparent, rgba(193, 173, 72, 0.3), transparent)',
              }}
            />

            {/* Botón de Login - Solo en landing pages */}
            {showLoginButton && (
              <>
                <Link
                  to="/login"
                  className="group relative flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold text-sm tracking-wide transition-all duration-300 hover:scale-105 hover:-translate-y-0.5"
                  style={{
                    background: 'rgba(193, 173, 72, 0.1)',
                    borderColor: 'rgba(193, 173, 72, 0.25)',
                    color: '#c1ad48',
                    border: '1px solid',
                    fontFamily: "'Inter', sans-serif",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(193, 173, 72, 0.2)';
                    e.currentTarget.style.borderColor = 'rgba(193, 173, 72, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(193, 173, 72, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(193, 173, 72, 0.25)';
                  }}
                >
                  <span className="relative z-10">{t('nav.login')}</span>
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-full"
                    style={{
                      background: 'radial-gradient(circle at center, rgba(193, 173, 72, 0.15), transparent)',
                    }}
                  />
                </Link>

                {/* Divider */}
                <div
                  className="w-px h-7"
                  style={{
                    background: 'linear-gradient(180deg, transparent, rgba(193, 173, 72, 0.3), transparent)',
                  }}
                />
              </>
            )}

            {/* CTA Button - Cambiado a Link interno - Solo visible en landing y comparative */}
            {showMembershipButton && (
              <Link
                to="/membership"
                className="group relative flex items-center gap-3 px-6 md:px-8 py-3 md:py-4 rounded-full font-bold text-xs md:text-sm tracking-wider uppercase transition-all duration-400 hover:scale-105 hover:-translate-y-1"
              style={{
                background: 'linear-gradient(135deg, #c1ad48 0%, #d4bf5a 50%, #c1ad48 100%)',
                backgroundSize: '200% 100%',
                color: '#152821',
                boxShadow: '0 8px 30px rgba(193, 173, 72, 0.4)',
                border: '1px solid rgba(193, 173, 72, 0.3)',
                fontFamily: "'Inter', sans-serif",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundPosition = '100% 0';
                e.currentTarget.style.boxShadow = '0 15px 50px rgba(193, 173, 72, 0.6)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundPosition = '0 0';
                e.currentTarget.style.boxShadow = '0 8px 30px rgba(193, 173, 72, 0.4)';
              }}
            >
              <span className="relative z-10">{t('nav.membership', 'Membresía Exclusiva')}</span>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative z-10 transition-transform duration-400 group-hover:translate-x-1"
              >
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                style={{
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent)',
                }}
              />
            </Link>
            )}
          </div>

          {/* CTA móvil simplificado - Solo visible en landing y comparative */}
          {showMembershipButton && (
            <div className="md:hidden flex items-center relative z-10">
              <Link
                to="/membership"
                className="group relative flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs tracking-wider uppercase transition-all duration-400"
                style={{
                  background: 'linear-gradient(135deg, #c1ad48 0%, #d4bf5a 50%, #c1ad48 100%)',
                  backgroundSize: '200% 100%',
                  color: '#152821',
                  boxShadow: '0 4px 20px rgba(193, 173, 72, 0.4)',
                  border: '1px solid rgba(193, 173, 72, 0.3)',
                  fontFamily: "'Inter', sans-serif",
                }}
                onClick={() => setMobileMenuOpen(false)}
              >
                <span className="relative z-10">JOIN</span>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="relative z-10"
                >
                  <line x1="5" y1="12" x2="19" y2="12" />
                  <polyline points="12 5 19 12 12 19" />
                </svg>
              </Link>
            </div>
          )}

          {/* Menú móvil desplegable - Unificado con desktop (redes sociales, login, membresía e idioma) */}
          {mobileMenuOpen && (
            <div
              ref={mobileMenuRef}
              className="md:hidden absolute top-full left-0 right-0 mt-0 rounded-b-2xl overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(15, 28, 23, 0.98) 0%, rgba(21, 40, 33, 0.98) 100%)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid rgba(193, 173, 72, 0.2)',
                borderLeft: '1px solid rgba(193, 173, 72, 0.1)',
                borderRight: '1px solid rgba(193, 173, 72, 0.1)',
                boxShadow: '0 20px 60px rgba(0, 0, 0, 0.6)',
                animation: 'slideDown 0.3s ease-out',
              }}
            >
              <div className="p-6">
                {/* Redes sociales en móvil */}
                <div className="flex justify-center gap-6 mb-8">
                  <a
                    href="https://wa.me/+17868658511"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-400"
                    style={{
                      background: 'rgba(193, 173, 72, 0.1)',
                      borderColor: 'rgba(193, 173, 72, 0.3)',
                      color: '#c1ad48',
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <svg
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
                    </svg>
                  </a>

                  <a
                    href="https://instagram.com/akahlstyle"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative w-14 h-14 rounded-full border-2 flex items-center justify-center transition-all duration-400"
                    style={{
                      background: 'rgba(193, 173, 72, 0.1)',
                      borderColor: 'rgba(193, 173, 72, 0.3)',
                      color: '#c1ad48',
                    }}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Instagram className="w-6 h-6" />
                  </a>
                </div>

                {/* Selector de idioma en móvil */}
                <div className="mb-8">
                  <h3 className="text-[#c1ad48] text-sm font-semibold mb-4 text-center uppercase tracking-wider">
                    Language / Idioma
                  </h3>
                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => {
                        handleLanguageChange('es');
                        setMobileMenuOpen(false);
                      }}
                      className={`px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 ${
                        currentLanguage === 'es'
                          ? 'bg-[#c1ad48] text-[#152821] shadow-lg scale-105'
                          : 'bg-transparent text-[#c1ad48] border-2 border-[#c1ad48]/50 hover:border-[#c1ad48] hover:bg-[#c1ad48]/10 shadow-md'
                      }`}
                      style={{
                        minWidth: '140px',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      Español
                    </button>
                    <button
                      onClick={() => {
                        handleLanguageChange('en');
                        setMobileMenuOpen(false);
                      }}
                      className={`px-8 py-4 rounded-full font-semibold text-base transition-all duration-300 ${
                        currentLanguage === 'en'
                          ? 'bg-[#c1ad48] text-[#152821] shadow-lg scale-105'
                          : 'bg-transparent text-[#c1ad48] border-2 border-[#c1ad48]/50 hover:border-[#c1ad48] hover:bg-[#c1ad48]/10 shadow-md'
                      }`}
                      style={{
                        minWidth: '140px',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      English
                    </button>
                  </div>
                </div>

                {/* Botones de Login y Membresía en móvil */}
                <div className="flex flex-col gap-4">
                  {/* Botón de Login - Solo en landing pages */}
                  {showLoginButton && (
                    <Link
                      to="/login"
                      onClick={() => setMobileMenuOpen(false)}
                      className="group relative w-full flex items-center justify-center gap-2 px-6 py-3 rounded-full font-semibold text-sm tracking-wide transition-all duration-300"
                      style={{
                        background: 'rgba(193, 173, 72, 0.1)',
                        borderColor: 'rgba(193, 173, 72, 0.25)',
                        color: '#c1ad48',
                        border: '1px solid',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      <span className="relative z-10">{t('nav.login')}</span>
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-full"
                        style={{
                          background: 'radial-gradient(circle at center, rgba(193, 173, 72, 0.15), transparent)',
                        }}
                      />
                    </Link>
                  )}

                  {/* Botón de Membresía - Solo en landing y comparative */}
                  {showMembershipButton && (
                    <Link
                      to="/membership"
                      onClick={() => setMobileMenuOpen(false)}
                      className="group relative w-full flex items-center justify-center gap-3 px-6 py-3.5 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-400"
                      style={{
                        background: 'linear-gradient(135deg, #c1ad48 0%, #d4bf5a 50%, #c1ad48 100%)',
                        backgroundSize: '200% 100%',
                        color: '#152821',
                        boxShadow: '0 8px 30px rgba(193, 173, 72, 0.4)',
                        border: '1px solid rgba(193, 173, 72, 0.3)',
                        fontFamily: "'Inter', sans-serif",
                      }}
                    >
                      <span className="relative z-10">{t('nav.membership')}</span>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="relative z-10"
                      >
                        <line x1="5" y1="12" x2="19" y2="12" />
                        <polyline points="12 5 19 12 12 19" />
                      </svg>
                      <div
                        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 rounded-full"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent)',
                        }}
                      />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Línea de oro inferior - muy sutil */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              height: '0.5px',
              background: 'linear-gradient(90deg, transparent, rgba(193, 173, 72, 0.15), transparent)',
            }}
          />
        </nav>
      </div>

      {/* Estilos globales */}
      <style>
        {`
        @keyframes shimmer {
          0%, 100% { 
            opacity: 0.3;
            transform: translateX(-100%);
          }
          50% { 
            opacity: 1;
            transform: translateX(100%);
          }
        }
        
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        /* Efectos hover */
        #akahl-elite-navbar a[href*="wa.me"]:hover,
        #akahl-elite-navbar a[href*="instagram"]:hover {
          background: rgba(193, 173, 72, 0.15) !important;
          border-color: rgba(193, 173, 72, 0.5) !important;
          box-shadow: 0 12px 35px rgba(193, 173, 72, 0.3) !important;
        }
        
        #akahl-elite-navbar a[href*="wa.me"]:hover {
          color: #25D366 !important;
          border-color: rgba(37, 211, 102, 0.4) !important;
        }
        
        #akahl-elite-navbar a[href*="instagram"]:hover {
          color: #E4405F !important;
          border-color: rgba(228, 64, 95, 0.4) !important;
        }
        
        /* Efecto hover para logo */
        #akahl-elite-navbar img:hover {
          filter: drop-shadow(0 8px 35px rgba(193, 173, 72, 0.7)) brightness(1.2) !important;
        }
        
        /* Responsive */
        @media (max-width: 640px) {
          #akahl-elite-navbar nav {
            padding: 0 16px !important;
          }
          
          #akahl-elite-navbar img {
            height: 40px !important;
          }
          
          #akahl-elite-navbar .md\\:hidden a[href="/membership"] {
            padding: 10px 16px !important;
            font-size: 11px !important;
          }
          
          #akahl-elite-navbar .md\\:hidden button {
            width: 36px !important;
            height: 36px !important;
          }
          
          /* Menú móvil más compacto */
          #akahl-elite-navbar .md\\:hidden + div {
            padding: 4px !important;
          }
          
          #akahl-elite-navbar .md\\:hidden + div .flex.gap-6 {
            gap: 16px !important;
          }
          
          #akahl-elite-navbar .md\\:hidden + div .flex.gap-6 a {
            width: 48px !important;
            height: 48px !important;
          }
          
          #akahl-elite-navbar .md\\:hidden + div h3 {
            font-size: 12px !important;
            margin-bottom: 12px !important;
          }
          
          #akahl-elite-navbar .md\\:hidden + div .flex.gap-4 button {
            padding: 10px 16px !important;
            font-size: 13px !important;
          }
        }
        
        @media (max-width: 480px) {
          #akahl-elite-navbar nav {
            height: 65px !important;
          }
          
          #akahl-elite-navbar img {
            height: 36px !important;
          }
          
          #akahl-elite-navbar .md\\:hidden a[href="/membership"] {
            padding: 8px 14px !important;
            font-size: 10px !important;
          }
          
          #akahl-elite-navbar .md\\:hidden a[href="/membership"] span {
            display: none;
          }
          
          #akahl-elite-navbar .md\\:hidden a[href="/membership"]::after {
            content: 'JOIN';
          }
          
          /* Menú móvil más compacto */
          #akahl-elite-navbar .md\\:hidden + div {
            padding: 16px !important;
          }
          
          #akahl-elite-navbar .md\\:hidden + div .flex.gap-6 {
            gap: 12px !important;
          }
          
          #akahl-elite-navbar .md\\:hidden + div .flex.gap-6 a {
            width: 44px !important;
            height: 44px !important;
          }
        }
        
        @media (max-width: 360px) {
          #akahl-elite-navbar nav {
            padding: 0 12px !important;
          }
          
          #akahl-elite-navbar img {
            height: 32px !important;
          }
          
          #akahl-elite-navbar .md\\:hidden a[href="/membership"] {
            padding: 6px 12px !important;
          }
          
          /* Menú móvil más compacto */
          #akahl-elite-navbar .md\\:hidden + div {
            padding: 12px !important;
          }
          
          #akahl-elite-navbar .md\\:hidden + div .flex.gap-6 {
            gap: 8px !important;
          }
          
          #akahl-elite-navbar .md\\:hidden + div .flex.gap-6 a {
            width: 40px !important;
            height: 40px !important;
          }
        }
        
        /* Prevenir scroll cuando el menú móvil está abierto */
        body.mobile-menu-open {
          overflow: hidden;
        }
        `}
      </style>
    </>
  );
}