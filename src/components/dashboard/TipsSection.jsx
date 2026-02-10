import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Lightbulb, Search, Filter, Calendar, Star, Lock, Crown } from 'lucide-react';

export default function TipsSection({ contenido, colors, t, userPlan }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOro, setFilterOro] = useState(false);
  const [filterCategoria, setFilterCategoria] = useState('todas');

  // Obtener categorías únicas
  const categorias = ['todas', ...new Set(contenido.tips.map(tip => tip.categoria))];

  // Filtrar contenido
  const tipsFiltrados = contenido.tips
    .filter(tip => {
      const coincideBusqueda = tip.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (tip.descripcion && tip.descripcion.toLowerCase().includes(searchTerm.toLowerCase()));
      const coincideOro = !filterOro || tip.premium;
      const coincideCategoria = filterCategoria === 'todas' || tip.categoria === filterCategoria;
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
              placeholder={t('dashboard.searchTips')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.blancoHielo,
                borderColor: 'rgba(34, 60, 51, 0.2)',
                focusRingColor: colors.doradoClaro
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
          <Lightbulb className="w-4 h-4" />
          <span>{tipsFiltrados.length} {t('dashboard.of')} {contenido.tips.length} {t('dashboard.tips')}</span>
        </div>
      </div>

      {tipsFiltrados.length === 0 ? (
        <div className="rounded-xl p-8 sm:p-12 text-center" style={{ backgroundColor: colors.blancoHielo }}>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center" style={{ backgroundColor: `${colors.doradoClaro}10` }}>
            <Search className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: colors.doradoMedio }} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: colors.verdePrimario }}>{t('dashboard.noTips')}</h3>
          <p className="text-xs sm:text-sm" style={{ color: colors.verdeMedio }}>{t('dashboard.noResultsDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4">
          {tipsFiltrados.map((tip) => {
            const fechaCreacion = new Date(tip.createdAt || tip.updatedAt || Date.now());
            const fechaFormateada = fechaCreacion.toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            return (
              <div
                key={tip.id}
                className={`rounded-xl p-4 sm:p-6 shadow-lg border transition-all duration-300 hover:shadow-xl relative ${
                  tip.premium && userPlan === 'PLATA' ? 'opacity-75 grayscale-[50%]' : ''
                }`}
                style={{
                  backgroundColor: colors.blancoHielo,
                  borderColor: 'rgba(34, 60, 51, 0.1)'
                }}
              >
                {/* Overlay de bloqueo para contenido ORO cuando usuario es PLATA */}
                {tip.premium && userPlan === 'PLATA' && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/60 backdrop-blur-[2px] rounded-xl">
                    <div className="text-center p-6">
                      <div className="w-16 h-16 mx-auto mb-3 rounded-full flex items-center justify-center" style={{ backgroundColor: `${colors.mostazaPrimario}30`, border: `2px solid ${colors.mostazaPrimario}` }}>
                        <Crown className="w-8 h-8" style={{ color: colors.mostazaPrimario }} />
                      </div>
                      <p className="text-white font-bold text-sm mb-1">{t('dashboard.premiumContent')}</p>
                      <p className="text-white/80 text-xs">{t('dashboard.lockedContent')}</p>
                      <a
                        href="/membership"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-white text-xs mt-3 transition-all duration-200 hover:shadow-lg"
                        style={{ backgroundColor: colors.mostazaPrimario }}
                      >
                        <Lock className="w-3 h-3" />
                        {t('dashboard.upgradeToAccess')}
                      </a>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3 sm:gap-5">
                  <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center flex-shrink-0" style={{ backgroundColor: `${colors.doradoClaro}15` }}>
                    <Lightbulb className="w-6 h-6 sm:w-7 sm:h-7" style={{ color: colors.doradoClaro }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-2">
                      <h3 className="font-bold text-base sm:text-lg" style={{ color: colors.verdePrimario }}>{tip.titulo}</h3>
                      {tip.premium && (
                        <span className="px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold flex-shrink-0 flex items-center gap-1" style={{
                          backgroundColor: `linear-gradient(135deg, ${colors.mostazaPrimario} 0%, ${colors.doradoMedio} 100%)`,
                          color: colors.verdePrimario
                        }}>
                          <Star className="w-3 h-3 fill-current" />
                          ORO
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-[10px] sm:text-sm mb-2">
                      {tip.categoria && (
                        <span className="px-2 sm:px-3 py-1 rounded-lg font-medium" style={{
                          backgroundColor: `${colors.verdeClaro}15`,
                          color: colors.verdeClaro
                        }}>
                          {tip.categoria}
                        </span>
                      )}
                      <span className="flex items-center gap-1" style={{ color: colors.verdeSuave }}>
                        <Calendar className="w-3 h-3" />
                        {fechaFormateada}
                      </span>
                    </div>
                    {tip.descripcion && (
                      <p className="text-xs sm:text-sm line-clamp-2" style={{ color: colors.verdeMedio }}>
                        {tip.descripcion}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
