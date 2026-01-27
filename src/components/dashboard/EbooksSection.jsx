import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Download, Search, Filter, Calendar, Star, User } from 'lucide-react';

export default function EbooksSection({ contenido, colors, getThumbnailForContent, t }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOro, setFilterOro] = useState(false);
  const [filterCategoria, setFilterCategoria] = useState('todas');

  // Obtener categorías únicas
  const categorias = ['todas', ...new Set(contenido.ebooks.map(e => e.categoria))];

  // Filtrar contenido
  const ebooksFiltrados = contenido.ebooks
    .filter(ebook => {
      const coincideBusqueda = ebook.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             ebook.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             (ebook.autor && ebook.autor.toLowerCase().includes(searchTerm.toLowerCase()));
      const coincideOro = !filterOro || ebook.premium;
      const coincideCategoria = filterCategoria === 'todas' || ebook.categoria === filterCategoria;
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
              placeholder={t('dashboard.searchEbooks')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2"
              style={{
                backgroundColor: colors.blancoHielo,
                borderColor: 'rgba(34, 60, 51, 0.2)',
                focusRingColor: colors.mostazaPrimario
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
          <FileText className="w-4 h-4" />
          <span>{ebooksFiltrados.length} {t('dashboard.of')} {contenido.ebooks.length} {t('dashboard.ebooks')}</span>
        </div>
      </div>

      {ebooksFiltrados.length === 0 ? (
        <div className="rounded-xl p-8 sm:p-12 text-center" style={{ backgroundColor: colors.blancoHielo }}>
          <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full mx-auto mb-4 sm:mb-6 flex items-center justify-center" style={{ backgroundColor: `${colors.mostazaPrimario}10` }}>
            <Search className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: colors.doradoMedio }} />
          </div>
          <h3 className="text-lg sm:text-xl font-bold mb-2" style={{ color: colors.verdePrimario }}>{t('dashboard.noEbooks')}</h3>
          <p className="text-xs sm:text-sm" style={{ color: colors.verdeMedio }}>{t('dashboard.noResultsDesc')}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {ebooksFiltrados.map((ebook, index) => {
            const thumbnail = getThumbnailForContent('EBOOK', ebook.categoria, index);
            const fechaCreacion = new Date(ebook.createdAt || ebook.updatedAt || Date.now());
            const fechaFormateada = fechaCreacion.toLocaleDateString('es-ES', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            });

            return (
              <div
                key={ebook.id}
                className="rounded-xl overflow-hidden shadow-lg border transition-all duration-300 hover:transform hover:scale-105 hover:shadow-xl flex flex-col"
                style={{ backgroundColor: colors.blancoHielo, borderColor: 'rgba(34, 60, 51, 0.1)' }}
              >
                {/* Miniatura con imagen */}
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <img
                    src={thumbnail.image}
                    alt={ebook.titulo}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-3 right-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ backgroundColor: `rgba(255, 255, 255, 0.95)`, backdropFilter: 'blur(10px)' }}>
                      {thumbnail.icon}
                    </div>
                  </div>
                  {ebook.premium && (
                    <span className="absolute top-3 right-3 px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-bold flex items-center gap-1" style={{
                      backgroundColor: `linear-gradient(135deg, ${colors.mostazaPrimario} 0%, ${colors.doradoMedio} 100%)`,
                      color: colors.verdePrimario
                    }}>
                      <Star className="w-3 h-3 fill-current" />
                      ORO
                    </span>
                  )}
                </div>
                <div className="p-4 sm:p-6 flex-1 flex flex-col">
                  <div className="flex items-start justify-between mb-2 sm:mb-3">
                    <h3 className="font-bold text-sm sm:text-lg line-clamp-2 flex-1" style={{ color: colors.verdePrimario }}>{ebook.titulo}</h3>
                  </div>

                  {/* Autor */}
                  {ebook.autor && (
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs mb-2" style={{ color: colors.verdeSuave }}>
                      <User className="w-3 h-3" />
                      <span>{ebook.autor}</span>
                    </div>
                  )}

                  {/* Fecha de subida */}
                  <div className="flex items-center gap-1 text-[10px] sm:text-xs mb-2" style={{ color: colors.verdeSuave }}>
                    <Calendar className="w-3 h-3" />
                    <span>Añadido: {fechaFormateada}</span>
                  </div>

                  {ebook.paginas && (
                    <div className="flex items-center gap-1 text-[10px] sm:text-xs mb-3 sm:mb-4" style={{ color: colors.verdeMedio }}>
                      <FileText className="w-3 h-3" />
                      <span>{ebook.paginas} páginas</span>
                    </div>
                  )}

                  <p className="text-xs sm:text-sm mb-3 sm:mb-4 line-clamp-2" style={{ color: colors.verdeMedio }}>{ebook.descripcion}</p>

                  <a
                    href={ebook.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full flex items-center justify-center gap-2 px-3 sm:px-4 py-2.5 sm:py-3 rounded-xl font-semibold transition-all duration-300 hover:shadow-md text-xs sm:text-sm mt-auto"
                    style={{
                      background: `linear-gradient(135deg, ${colors.mostazaPrimario} 0%, ${colors.doradoMedio} 100%)`,
                      color: colors.verdePrimario
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                  >
                    <Download className="w-3 h-3 sm:w-4 sm:h-4" />
                    {t('dashboard.downloadEbook')}
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
