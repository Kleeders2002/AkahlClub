import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Video, Play, Search, Filter, Calendar, Star, Clock, Lock, Crown } from 'lucide-react';

export default function VideosSection({ contenido, colors, t, userPlan }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOro, setFilterOro] = useState(false);
  const [filterCategoria, setFilterCategoria] = useState('todas');

  // Obtener categorías únicas
  const categorias = ['todas', ...new Set(contenido.videos.map(v => v.categoria))];

  // Filtrar contenido
  const videosFiltrados = contenido.videos
    .filter(video => {
      const coincideBusqueda = video.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             video.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
      const coincideOro = !filterOro || video.premium;
      const coincideCategoria = filterCategoria === 'todas' || video.categoria === filterCategoria;
      return coincideBusqueda && coincideOro && coincideCategoria;
    })
    .sort((a, b) => new Date(b.createdAt || b.updatedAt) - new Date(a.createdAt || a.updatedAt));

  return (
    <div>
      {/* Search and Filters */}
      <div className="mb-6 space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder={t('dashboard.searchVideos')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.blancoHielo,
                borderColor: 'rgba(34, 60, 51, 0.2)',
                focusRingColor: colors.verdeAccent
              }}
            />
          </div>

          {/* Category Filter */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5" style={{ color: colors.verdeMedio }} />
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="px-4 py-3 rounded-xl border focus:outline-none focus:ring-2 text-sm"
              style={{
                backgroundColor: colors.blancoHielo,
                borderColor: 'rgba(34, 60, 51, 0.2)',
                color: colors.verdePrimario
              }}
            >
              {categorias.map(cat => (
                <option key={cat} value={cat}>
                  {cat === 'todas' ? t('dashboard.allCategories') : cat}
                </option>
              ))}
            </select>
          </div>

          {/* Oro Filter */}
          <button
            onClick={() => setFilterOro(!filterOro)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl border transition-all duration-300 ${
              filterOro ? 'shadow-lg' : ''
            }`}
            style={{
              backgroundColor: filterOro ? `linear-gradient(135deg, ${colors.mostazaPrimario} 0%, ${colors.doradoMedio} 100%)` : colors.blancoHielo,
              borderColor: filterOro ? colors.mostazaPrimario : 'rgba(34, 60, 51, 0.2)',
              color: filterOro ? colors.verdePrimario : colors.verdeMedio
            }}
          >
            <Star className="w-5 h-5" fill={filterOro ? 'currentColor' : 'none'} />
            <span className="font-medium text-sm">{t('dashboard.goldOnly')}</span>
          </button>
        </div>

        {/* Results Count */}
        <div className="flex items-center gap-2 text-sm" style={{ color: colors.verdeMedio }}>
          <Video className="w-4 h-4" />
          <span>{videosFiltrados.length} {t('dashboard.of')} {contenido.videos.length} {t('dashboard.videos')}</span>
        </div>
      </div>

      {videosFiltrados.length === 0 ? (
        <div className="rounded-xl p-8 sm:p-12 text-center" style={{ backgroundColor: colors.blancoHielo }}>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center" style={{ backgroundColor: `${colors.verdeAccent}10` }}>
            <Search className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: colors.verdeAccent }} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: colors.verdePrimario }}>{t('dashboard.noVideos')}</h3>
          <p className="text-xs sm:text-sm" style={{ color: colors.verdeMedio }}>{t('dashboard.noResultsDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {videosFiltrados.map((video) => {
            const fechaCreacion = new Date(video.createdAt || video.updatedAt || Date.now());
            const fechaFormateada = fechaCreacion.toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            return (
              <div
                key={video.id}
                className={`rounded-xl overflow-hidden shadow-lg border transition-all duration-300 hover:shadow-xl flex flex-col relative ${
                  video.premium && userPlan === 'PLATA' ? 'opacity-75 grayscale-[50%]' : 'hover:transform hover:scale-105'
                }`}
                style={{ backgroundColor: colors.blancoHielo, borderColor: 'rgba(34, 60, 51, 0.1)' }}
              >
                {/* Overlay de bloqueo para contenido ORO cuando usuario es PLATA */}
                {video.premium && userPlan === 'PLATA' && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[2px]">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.mostazaPrimario}30`, border: `2px solid ${colors.mostazaPrimario}` }}>
                        <Crown className="w-8 h-8" style={{ color: colors.mostazaPrimario }} />
                      </div>
                      <p className="text-white font-bold text-sm mb-1">{t('dashboard.premiumContent')}</p>
                      <p className="text-white/80 text-xs">{t('dashboard.lockedContent')}</p>
                    </div>
                  </div>
                )}
                <div className="relative h-48 sm:h-52 flex items-center justify-center overflow-hidden">
                  {video.thumbnailUrl ? (
                    <img src={video.thumbnailUrl} alt={video.titulo} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br" style={{ background: `linear-gradient(135deg, ${colors.verdePrimario} 0%, ${colors.verdeMedio} 100%)` }}></div>
                  )}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center" style={{ backgroundColor: `rgba(206, 182, 82, 0.9)`, backdropFilter: 'blur(10px)' }}>
                      <Play className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: colors.verdePrimario }} />
                    </div>
                  </div>
                  {video.duracion && (
                    <span className="absolute bottom-3 right-3 px-2 sm:px-3 py-1 rounded-lg text-[10px] sm:text-xs font-bold flex items-center gap-1" style={{
                      backgroundColor: 'rgba(0, 0, 0, 0.8)',
                      color: colors.doradoClaro
                    }}>
                      <Clock className="w-3 h-3" />
                      {video.duracion}
                    </span>
                  )}
                  {video.premium && (
                    <span className="absolute top-3 left-3 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1" style={{
                      backgroundColor: `linear-gradient(135deg, ${colors.mostazaPrimario} 0%, ${colors.doradoMedio} 100%)`,
                      color: colors.verdePrimario
                    }}>
                      <Star className="w-3 h-3 fill-current" />
                      ORO
                    </span>
                  )}
                </div>
                <div className="p-4 sm:p-5 flex-1 flex flex-col">
                  <h3 className="font-bold text-sm sm:text-lg mb-2 line-clamp-2" style={{ color: colors.verdePrimario }}>{video.titulo}</h3>

                  {/* Fecha de subida */}
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs mb-2" style={{ color: colors.verdeSuave }}>
                    <Calendar className="w-3 h-3" />
                    <span>Añadido: {fechaFormateada}</span>
                  </div>

                  {video.premium && userPlan === 'PLATA' ? (
                    // CONTENIDO BLOQUEADO PARA PLATA
                    <a
                      href="/membership"
                      className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-md text-xs sm:text-sm mt-auto relative overflow-hidden"
                      style={{
                        background: 'linear-gradient(135deg, #9ca3af 0%, #6b7280 100%)',
                        color: 'white',
                        cursor: 'pointer'
                      }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20">
                        <Lock className="w-4 h-4" />
                        <Lock className="w-4 h-4" />
                        <Lock className="w-4 h-4" />
                      </div>
                      <Lock className="w-3 h-3 sm:w-4 sm:h-4 relative z-10" />
                      <span className="relative z-10">{t('dashboard.upgradeToAccess')}</span>
                    </a>
                  ) : (
                    // CONTENIDO ACCESIBLE
                    <a
                      href={video.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-md text-xs sm:text-sm mt-auto"
                      style={{
                        background: `linear-gradient(135deg, ${colors.verdeAccent} 0%, ${colors.verdeSuave} 100%)`,
                        color: 'white'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-2px)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                      }}
                    >
                      <Play className="w-3 h-3 sm:w-4 sm:h-4" />
                      {t('dashboard.watchVideo')}
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
