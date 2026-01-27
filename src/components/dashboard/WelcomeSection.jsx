import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  FileText,
  Video,
  Lightbulb,
  ArrowUpRight,
  Sparkles,
  Crown,
  Clock,
  Award,
  CheckCircle2,
  Gem
} from 'lucide-react';

export default function WelcomeSection({ userName, userPlan, contenido, setActiveTab, colors, isMobile, setSidebarOpen }) {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 sm:space-y-8">

      {/* Welcome Banner with Image */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl" style={{ background: `linear-gradient(135deg, ${colors.verdePrimario} 0%, ${colors.verdeMedio} 50%, ${colors.verdeClaro} 100%)` }}>
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200&h=600&fit=crop"
            alt="Fashion"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 sm:w-96 sm:h-96 rounded-full opacity-10" style={{ backgroundColor: colors.mostazaPrimario, transform: 'translate(30%, -30%)' }}></div>
        <div className="relative p-6 sm:p-10">
          <div className="flex flex-col lg:flex-row items-start justify-between gap-6">
            <div className="flex-1 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-full mb-4 sm:mb-6" style={{ backgroundColor: 'rgba(206, 182, 82, 0.2)' }}>
                <Sparkles className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: colors.mostazaPrimario }} />
                <span className="text-xs sm:text-sm font-semibold" style={{ color: colors.mostazaPrimario }}>{t('dashboard.welcomeBack')}</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3 sm:mb-4">
                {t('dashboard.hello')}, {userName}
              </h2>
              <p className="text-base sm:text-lg mb-4 sm:mb-6" style={{ color: colors.doradoClaro }}>
                {t('dashboard.readyMessage')}
              </p>
              <div className="flex flex-wrap gap-3 sm:gap-4">
                <button
                  onClick={() => setActiveTab('guias')}
                  className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:transform hover:scale-105 text-sm sm:text-base"
                  style={{
                    backgroundColor: colors.mostazaPrimario,
                    color: colors.verdePrimario
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = colors.doradoMedio;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = colors.mostazaPrimario;
                  }}
                >
                  <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
                  {t('dashboard.explore')}
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <img
                src="https://images.unsplash.com/photo-1617137968427-85924c800a22?w=200&h=200&fit=crop"
                alt="Premium Style"
                className="w-32 h-32 rounded-2xl object-cover shadow-2xl"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
        {[
          {
            label: t('dashboard.guides'),
            count: contenido.guias.length,
            icon: BookOpen,
            color: colors.verdeClaro,
            bg: `linear-gradient(135deg, ${colors.verdePrimario} 0%, ${colors.verdeMedio} 100%)`,
            image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=100&h=100&fit=crop'
          },
          {
            label: t('dashboard.ebooks'),
            count: contenido.ebooks.length,
            icon: FileText,
            color: colors.mostazaPrimario,
            bg: `linear-gradient(135deg, ${colors.verdePrimario} 0%, ${colors.verdeMedio} 100%)`,
            image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=100&h=100&fit=crop'
          },
          {
            label: t('dashboard.videos'),
            count: contenido.videos.length,
            icon: Video,
            color: colors.verdeAccent,
            bg: `linear-gradient(135deg, ${colors.verdePrimario} 0%, ${colors.verdeMedio} 100%)`,
            image: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=100&h=100&fit=crop'
          },
          {
            label: t('dashboard.tips'),
            count: contenido.tips.length,
            icon: Lightbulb,
            color: colors.doradoClaro,
            bg: `linear-gradient(135deg, ${colors.verdePrimario} 0%, ${colors.verdeMedio} 100%)`,
            image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=100&h=100&fit=crop'
          }
        ].map((stat, index) => (
          <div
            key={index}
            className="rounded-xl p-4 sm:p-6 shadow-lg border transition-all duration-300 hover:transform hover:scale-105 cursor-pointer relative overflow-hidden"
            style={{
              background: stat.bg,
              borderColor: 'rgba(206, 182, 82, 0.2)'
            }}
            onClick={() => {
              if (stat.label === t('dashboard.guides')) setActiveTab('guias');
              else if (stat.label === t('dashboard.ebooks')) setActiveTab('ebooks');
              else if (stat.label === t('dashboard.videos')) setActiveTab('videos');
              else if (stat.label === t('dashboard.tips')) setActiveTab('tips');
              if (isMobile) setSidebarOpen(false);
            }}
          >
            <div className="absolute inset-0 opacity-15">
              <img src={stat.image} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="relative">
              <div className="flex items-start justify-between mb-3 sm:mb-4">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }}>
                  <stat.icon className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: stat.color }} />
                </div>
                <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: `${stat.color}20` }}>
                  <ArrowUpRight className="w-3 h-3 sm:w-4 sm:h-4" style={{ color: stat.color }} />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-bold text-white mb-1">{stat.count}</div>
              <div className="text-xs sm:text-sm font-medium" style={{ color: colors.doradoClaro }}>{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Access Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {/* Recent Activity */}
        <div className="rounded-xl p-4 sm:p-6 shadow-lg border" style={{ backgroundColor: colors.blancoHielo, borderColor: 'rgba(34, 60, 51, 0.1)' }}>
          <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.verdeClaro}15` }}>
              <Clock className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: colors.verdeClaro }} />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg" style={{ color: colors.verdePrimario }}>{t('dashboard.recentActivity')}</h3>
              <p className="text-xs sm:text-sm" style={{ color: colors.verdeMedio }}>{t('dashboard.lastAccess')}</p>
            </div>
          </div>
          <div className="space-y-3 sm:space-y-4">
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all duration-200 hover:shadow-md" style={{ backgroundColor: colors.cremaSuave }}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${colors.mostazaPrimario}15` }}>
                <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: colors.mostazaPrimario }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs sm:text-sm truncate" style={{ color: colors.grisOscuro }}>{t('dashboard.sessionStarted')}</p>
                <p className="text-[10px] sm:text-xs" style={{ color: colors.verdeMedio }}>{t('dashboard.momentsAgo')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-xl transition-all duration-200 hover:shadow-md" style={{ backgroundColor: colors.cremaSuave }}>
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${colors.verdeClaro}15` }}>
                <Award className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: colors.verdeClaro }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-xs sm:text-sm truncate" style={{ color: colors.grisOscuro }}>{t('dashboard.activeMembership')} {userPlan} {t('dashboard.active')}</p>
                <p className="text-[10px] sm:text-xs" style={{ color: colors.verdeMedio }}>{t('dashboard.fullAccess')}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Features */}
        <div className="rounded-xl p-4 sm:p-6 shadow-lg border relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${colors.verdePrimario} 0%, ${colors.verdeMedio} 100%)`, borderColor: 'rgba(206, 182, 82, 0.2)' }}>
          <div className="absolute inset-0 opacity-10">
            <img
              src="https://images.unsplash.com/photo-1445205170230-053b83016050?w=400&h=400&fit=crop"
              alt=""
              className="w-full h-full object-cover"
            />
          </div>
          <div className="relative">
            <div className="flex items-center gap-2 sm:gap-3 mb-4 sm:mb-6">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.mostazaPrimario}20` }}>
                <Gem className="w-4 h-4 sm:w-5 sm:h-5" style={{ color: colors.mostazaPrimario }} />
              </div>
              <div>
                <h3 className="font-bold text-base sm:text-lg text-white">{t('dashboard.benefits')} {userPlan}</h3>
                <p className="text-xs sm:text-sm" style={{ color: colors.doradoClaro }}>{t('dashboard.exclusivePerks')}</p>
              </div>
            </div>
            <div className="space-y-2 sm:space-y-3">
              <div className="flex items-center gap-2 sm:gap-3 text-white">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: colors.verdeAccent }}></div>
                <span className="text-xs sm:text-sm">{t('dashboard.unlimitedAccess')}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-white">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: colors.verdeAccent }}></div>
                <span className="text-xs sm:text-sm">{t('dashboard.weeklyUpdates')}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-white">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: colors.verdeAccent }}></div>
                <span className="text-xs sm:text-sm">{t('dashboard.prioritySupport')}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3 text-white">
                <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full" style={{ backgroundColor: colors.verdeAccent }}></div>
                <span className="text-xs sm:text-sm">{t('dashboard.exclusiveEvents')}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
