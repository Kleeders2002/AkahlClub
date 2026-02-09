import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';
import {
  LogOut,
  User,
  Loader,
  Star,
  Menu,
  X,
  Shield,
  BookOpen,
  FileText,
  Video,
  Lightbulb,
  Home,
  Settings,
  CreditCard,
  Lock
} from 'lucide-react';

import WelcomeSection from './dashboard/WelcomeSection';
import GuiasSection from './dashboard/GuiasSection';
import EbooksSection from './dashboard/EbooksSection';
import VideosSection from './dashboard/VideosSection';
import TipsSection from './dashboard/TipsSection';
import ProfileSection from './dashboard/ProfileSection';

export default function Dashboard({ token, onLogout }) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('bienvenida');
  const [userName, setUserName] = useState('Miembro VIP');
  const [userPlan, setUserPlan] = useState('PLATA');
  const [contenido, setContenido] = useState({
    guias: [],
    ebooks: [],
    videos: [],
    tips: []
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'https://akahlclub.onrender.com';
  console.log('🔗 Dashboard API URL:', API_URL); // Debug: Verify correct API URL

  const tabs = [
    { id: 'bienvenida', label: t('dashboard.controlPanel', 'Panel de Control'), icon: Home },
    { id: 'guias', label: t('dashboard.guides', 'Guías de Estilo'), icon: BookOpen },
    { id: 'ebooks', label: t('dashboard.ebooks', 'E-Books'), icon: FileText },
    { id: 'videos', label: t('dashboard.videos', 'Videos'), icon: Video },
    { id: 'tips', label: t('dashboard.tips', 'Tips'), icon: Lightbulb },
    { id: 'perfil', label: t('dashboard.profile', 'Perfil'), icon: User }
  ];

  // Detectar pantalla móvil
  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Generar miniaturas elegantes basadas en categoría
  const getThumbnailForContent = (tipo, categoria, index) => {
    const gradients = {
      guia: [
        'from-emerald-800 via-green-900 to-teal-900',
        'from-blue-800 via-slate-900 to-blue-900',
        'from-violet-800 via-purple-900 to-indigo-900',
        'from-rose-800 via-pink-900 to-red-900',
        'from-amber-800 via-orange-900 to-yellow-900'
      ],
      ebook: [
        'from-yellow-600 via-amber-700 to-orange-800',
        'from-rose-600 via-pink-700 to-red-800',
        'from-violet-600 via-purple-700 to-indigo-800',
        'from-cyan-600 via-teal-700 to-blue-800',
        'from-emerald-600 via-green-700 to-teal-800'
      ]
    };

    const icons = {
      guia: [<BookMarked key="icon" />, <GraduationCap key="icon2" />, <SparklesIcon key="icon3" />, <Target key="icon4" />, <Zap key="icon5" />],
      ebook: [<GraduationCap key="icon" />, <BookMarked key="icon2" />, <SparklesIcon key="icon3" />, <Target key="icon4" />, <Zap key="icon5" />]
    };

    const placeholderImages = {
      guia: [
        'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1617137968427-85924c800a22?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1490114538077-0a7f8cb49891?w=400&h=300&fit=crop'
      ],
      ebook: [
        'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1532012197267-da84d127e765?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=300&fit=crop',
        'https://images.unsplash.com/photo-1516979187457-637abb4f9353?w=400&h=300&fit=crop'
      ]
    };

    const gradientArray = tipo === 'GUIA' ? gradients.guia : gradients.ebook;
    const iconArray = tipo === 'GUIA' ? icons.guia : icons.ebook;
    const imageArray = tipo === 'GUIA' ? placeholderImages.guia : placeholderImages.ebook;

    return {
      gradient: gradientArray[index % gradientArray.length],
      icon: iconArray[index % iconArray.length],
      image: imageArray[index % imageArray.length]
    };
  };

  // Colores Akhal Club
  const colors = {
    verdePrimario: '#223c33',
    verdeMedio: '#2f4f45',
    verdeClaro: '#3e7c67',
    verdeAccent: '#30b784',
    verdeSuave: '#68c58c',
    mostazaPrimario: '#ceb652',
    doradoMedio: '#d6c577',
    doradoClaro: '#eadc9d',
    crema: '#f6e9c3',
    cremaSuave: '#f7eed8',
    grisOscuro: '#292b2a',
    blancoHielo: '#f3f7f9',
    fondo: '#f2f0e0'
  };

  // Cargar contenido desde la API
  useEffect(() => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserName(payload.nombre || 'Miembro VIP');
      setUserPlan(payload.plan || 'PLATA');
    } catch (err) {
      console.error('Error al decodificar token:', err);
    }

    const fetchContenido = async () => {
      setLoading(true);
      try {
        const idioma = i18n.language || 'es'; // 🌍 Obtener idioma actual con fallback
        console.log('🌍 Idioma actual:', idioma);
        console.log('🌍 URL:', `${API_URL}/api/contenido?idioma=${idioma}&tipo=GUIA`);

        const tipos = ['GUIA', 'EBOOK', 'VIDEO', 'TIP'];
        const resultados = await Promise.all(
          tipos.map(tipo =>
            fetch(`${API_URL}/api/contenido?idioma=${idioma}&tipo=${tipo}`, {
              headers: {
                'Authorization': `Bearer ${token}`
              }
            }).then(res => res.json())
          )
        );

        console.log('📊 Resultados:', {
          guias: resultados[0].data?.length || 0,
          ebooks: resultados[1].data?.length || 0,
          videos: resultados[2].data?.length || 0,
          tips: resultados[3].data?.length || 0
        });

        setContenido({
          guias: resultados[0].data || [],
          ebooks: resultados[1].data || [],
          videos: resultados[2].data || [],
          tips: resultados[3].data || []
        });
      } catch (error) {
        console.error('Error al cargar contenido:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContenido();
  }, [token, i18n.language]);

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (err) {
      console.error('Error al cerrar sesión:', err);
    } finally {
      if (onLogout) onLogout();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: colors.fondo }}>
        <div className="text-center">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4" style={{ borderColor: colors.mostazaPrimario, opacity: 0.2 }}></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-transparent animate-spin" style={{ borderColor: colors.mostazaPrimario }}></div>
            <Loader className="w-6 h-6 sm:w-8 sm:h-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ color: colors.mostazaPrimario }} />
          </div>
          <p className="text-base sm:text-lg font-semibold mb-2" style={{ color: colors.grisOscuro }}>{t('dashboard.loading')}</p>
          <p className="text-xs sm:text-sm" style={{ color: colors.verdeMedio }}>{t('dashboard.preparing')}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative" style={{ backgroundColor: colors.fondo }}>

      {/* Mobile Menu Button */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-3 rounded-xl shadow-lg"
        style={{ backgroundColor: colors.mostazaPrimario }}
      >
        {sidebarOpen ? <X className="w-6 h-6" style={{ color: colors.verdePrimario }} /> : <Menu className="w-6 h-6" style={{ color: colors.verdePrimario }} />}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {sidebarOpen && isMobile && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed left-0 top-0 h-full shadow-xl flex flex-col transition-transform duration-300 z-40 ${
        isMobile ? (sidebarOpen ? 'translate-x-0' : '-translate-x-full') : 'translate-x-0'
      }`} style={{ width: isMobile ? '280px' : '18rem', backgroundColor: colors.verdePrimario }}>
        {/* Logo Section */}
        <div className="p-4 sm:p-6 lg:p-8 border-b" style={{ borderColor: 'rgba(206, 182, 82, 0.15)' }}>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${colors.mostazaPrimario} 0%, ${colors.doradoMedio} 100%)` }}>
              <Crown className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: colors.verdePrimario }} />
            </div>
            <div>
              <h2 className="text-white font-bold text-base sm:text-lg">Akahl Club</h2>
              <p className="text-[10px] sm:text-xs uppercase tracking-wider" style={{ color: colors.mostazaPrimario }}>{t('dashboard.memberPortal')}</p>
            </div>
          </div>
        </div>

        {/* User Profile */}
        <div className="px-4 sm:px-6 py-4 sm:py-6">
          <div className="rounded-xl p-3 sm:p-4 border" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', borderColor: 'rgba(206, 182, 82, 0.2)' }}>
            <div className="flex items-center gap-2 sm:gap-3 mb-3">
              <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `rgba(206, 182, 82, 0.15)` }}>
                <User className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: colors.mostazaPrimario }} />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-white font-semibold text-xs sm:text-sm truncate">{userName}</h3>
                <div className="flex items-center gap-1 sm:gap-2 mt-1">
                  <span className="text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded-full" style={{
                    backgroundColor: userPlan === 'ORO' ? `linear-gradient(135deg, ${colors.mostazaPrimario} 0%, ${colors.doradoMedio} 100%)` : `rgba(206, 182, 82, 0.2)`,
                    color: userPlan === 'ORO' ? colors.verdePrimario : colors.mostazaPrimario
                  }}>
                    {userPlan === 'ORO' ? (
                      <span className="flex items-center gap-1">
                        <Star className="w-2 h-2 sm:w-3 sm:h-3 fill-current" />
                        <span className="hidden xs:inline">ORO</span>
                      </span>
                    ) : 'PLATA'}
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[10px] sm:text-xs">
              <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                <div className="font-bold text-white text-sm sm:text-base">{contenido.guias.length + contenido.ebooks.length + contenido.videos.length}</div>
                <div style={{ color: colors.verdeSuave }}>{t('dashboard.contents')}</div>
              </div>
              <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)' }}>
                <div className="font-bold text-white text-sm sm:text-base">{contenido.tips.length}</div>
                <div style={{ color: colors.verdeSuave }}>{t('dashboard.tips')}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 sm:px-4 space-y-1 sm:space-y-2 overflow-y-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                  if (isMobile) setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3.5 rounded-xl transition-all duration-300 group ${
                  activeTab === tab.id
                    ? 'shadow-lg transform scale-105'
                    : 'hover:bg-white/5'
                }`}
                style={{
                  backgroundColor: activeTab === tab.id ? `linear-gradient(135deg, ${colors.mostazaPrimario} 0%, ${colors.doradoMedio} 100%)` : 'transparent',
                  color: activeTab === tab.id ? colors.fondo : colors.doradoClaro
                }}
              >
                <Icon className={`flex-shrink-0 w-4 h-4 sm:w-5 sm:h-5`} />
                <span className={`text-xs sm:text-sm ${activeTab === tab.id ? 'font-bold' : 'font-medium'}`}>{tab.label}</span>
                {activeTab === tab.id && (
                  <div className="ml-auto w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: colors.fondo }}></div>
                )}
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-3 sm:p-4 border-t" style={{ borderColor: 'rgba(206, 182, 82, 0.15)' }}>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl transition-all duration-300 group"
            style={{
              backgroundColor: 'rgba(239, 68, 68, 0.1)',
              color: '#fca5a5'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.2)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(239, 68, 68, 0.1)';
            }}
          >
            <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="font-medium text-xs sm:text-sm">{t('dashboard.logout')}</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`min-h-screen transition-all duration-300 ${
        isMobile ? 'ml-0' : 'ml-72'
      }`}>

        {/* Header */}
        <header className="sticky top-0 z-10 backdrop-blur-xl border-b" style={{ backgroundColor: `${colors.blancoHielo}/80`, borderColor: 'rgba(34, 60, 51, 0.1)' }}>
          <div className="px-4 sm:px-6 lg:px-8 py-4 sm:py-5 flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl sm:text-2xl font-bold truncate" style={{ color: colors.verdePrimario }}>
                {activeTab === 'bienvenida' ? t('dashboard.controlPanelTitle') :
                 activeTab === 'guias' ? t('dashboard.guidesTitle') :
                 activeTab === 'ebooks' ? t('dashboard.ebooksTitle') :
                 activeTab === 'videos' ? t('dashboard.videosTitle') :
                 activeTab === 'tips' ? t('dashboard.tipsTitle') :
                 activeTab === 'perfil' ? t('dashboard.profileTitle') : ''}
              </h1>
              <p className="text-xs sm:text-sm mt-1" style={{ color: colors.verdeMedio }}>
                {userPlan === 'ORO' ? t('dashboard.vipAccess') : t('dashboard.standardAccess')}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 ml-2 sm:ml-4">
              <div className="hidden sm:flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg" style={{ backgroundColor: colors.cremaSuave }}>
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: colors.verdeClaro }} />
                <span className="text-xs sm:text-sm font-medium" style={{ color: colors.verdePrimario }}>{t('dashboard.activeMember')}</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="p-4 sm:p-6 lg:p-8">

          {/* Bienvenida Tab */}
          {activeTab === 'bienvenida' && (
            <WelcomeSection
              userName={userName}
              userPlan={userPlan}
              contenido={contenido}
              setActiveTab={setActiveTab}
              colors={colors}
              isMobile={isMobile}
              setSidebarOpen={setSidebarOpen}
            />
          )}

          {/* Guías Tab */}
          {activeTab === 'guias' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold" style={{ color: colors.verdePrimario }}>{t('dashboard.guidesTitle')}</h2>
                  <p className="text-xs sm:text-sm mt-1" style={{ color: colors.verdeMedio }}>{t('dashboard.guidesDesc')}</p>
                </div>
              </div>
              <GuiasSection
                contenido={contenido}
                colors={colors}
                getThumbnailForContent={getThumbnailForContent}
                t={t}
              />
            </div>
          )}

          {/* E-Books Tab */}
          {activeTab === 'ebooks' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold" style={{ color: colors.verdePrimario }}>{t('dashboard.ebooksTitle')}</h2>
                  <p className="text-xs sm:text-sm mt-1" style={{ color: colors.verdeMedio }}>{t('dashboard.ebooksDesc')}</p>
                </div>
              </div>
              <EbooksSection
                contenido={contenido}
                colors={colors}
                getThumbnailForContent={getThumbnailForContent}
                t={t}
              />
            </div>
          )}

          {/* Videos Tab */}
          {activeTab === 'videos' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold" style={{ color: colors.verdePrimario }}>{t('dashboard.videosTitle')}</h2>
                  <p className="text-xs sm:text-sm mt-1" style={{ color: colors.verdeMedio }}>{t('dashboard.videosDesc')}</p>
                </div>
              </div>
              <VideosSection
                contenido={contenido}
                colors={colors}
                t={t}
              />
            </div>
          )}

          {/* Tips Tab */}
          {activeTab === 'tips' && (
            <div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 sm:mb-8">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold" style={{ color: colors.verdePrimario }}>{t('dashboard.tipsTitle')}</h2>
                  <p className="text-xs sm:text-sm mt-1" style={{ color: colors.verdeMedio }}>{t('dashboard.tipsDesc')}</p>
                </div>
              </div>
              <TipsSection
                contenido={contenido}
                colors={colors}
                t={t}
              />
            </div>
          )}

          {/* Profile Tab */}
          {activeTab === 'perfil' && (
            <ProfileSection
              token={token}
              userName={userName}
              userPlan={userPlan}
              colors={colors}
              t={t}
              API_URL={API_URL}
            />
          )}

        </div>
      </main>
    </div>
  );
}

// Add Home icon
function Home({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

// Componentes auxiliares importados
import { Crown } from 'lucide-react';
import { BookMarked, GraduationCap, Sparkles as SparklesIcon, Target, Zap } from 'lucide-react';
