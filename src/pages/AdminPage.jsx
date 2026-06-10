import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  BookOpen,
  FileText,
  Video,
  Lightbulb,
  Plus,
  Trash2,
  Edit,
  LogOut,
  Users,
  BarChart3,
  Loader,
  CheckCircle,
  XCircle,
  Search,
  Filter,
  Crown
} from 'lucide-react';

export default function AdminPanel({ token, onLogout }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [contenido, setContenido] = useState({
    ebooks: [],
    guias: [],
    videos: [],
    tips: []
  });
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descripcion: '',
    tipo: 'EBOOK',
    url: '',
    premium: false,
    duracion: '',
    autor: '',
    paginas: '',
    categoria: '',
    thumbnailUrl: '',
    idioma: 'es'
  });
  const [submitStatus, setSubmitStatus] = useState({ type: '', message: '' });
  const [filterType, setFilterType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  const API_URL = import.meta.env.VITE_API_URL || 'https://akahlclub.onrender.com';

  // Colores Akhal Club
  const colors = {
    verdePrimario: '#223c33',
    verdeMedio: '#2f4f45',
    verdeClaro: '#3e7c67',
    mostazaPrimario: '#ceb652',
    doradoMedio: '#d6c577',
    doradoClaro: '#eadc9d',
    blancoHielo: '#f3f7f9',
    fondo: '#f2f0e0'
  };

  // Cargar contenido y estadísticas
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Obtener todo el contenido
        const contenidoRes = await fetch(`${API_URL}/api/admin/contenido`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const contenidoData = await contenidoRes.json();

        if (contenidoData.success) {
          const grouped = {
            ebooks: contenidoData.data.filter(c => c.tipo === 'EBOOK'),
            guias: contenidoData.data.filter(c => c.tipo === 'GUIA'),
            videos: contenidoData.data.filter(c => c.tipo === 'VIDEO'),
            tips: contenidoData.data.filter(c => c.tipo === 'TIP')
          };
          setContenido(grouped);
        }

        // Obtener estadísticas
        const statsRes = await fetch(`${API_URL}/api/admin/stats`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const statsData = await statsRes.json();

        if (statsData.success) {
          setStats(statsData.data);
        }
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  const handleLogout = () => {
    onLogout();
    navigate('/login');
  };

  const handleDelete = async (id, tipo) => {
    if (!confirm(`¿Estás seguro de eliminar este ${tipo.toLowerCase()}?`)) return;

    try {
      const res = await fetch(`${API_URL}/api/admin/contenido/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      const data = await res.json();

      if (data.success) {
        // Recargar contenido
        const contenidoRes = await fetch(`${API_URL}/api/admin/contenido`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const contenidoData = await contenidoRes.json();

        if (contenidoData.success) {
          const grouped = {
            ebooks: contenidoData.data.filter(c => c.tipo === 'EBOOK'),
            guias: contenidoData.data.filter(c => c.tipo === 'GUIA'),
            videos: contenidoData.data.filter(c => c.tipo === 'VIDEO'),
            tips: contenidoData.data.filter(c => c.tipo === 'TIP')
          };
          setContenido(grouped);
        }

        setSubmitStatus({ type: 'success', message: 'Contenido eliminado exitosamente' });
        setTimeout(() => setSubmitStatus({ type: '', message: '' }), 3000);
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Error al eliminar contenido' });
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      titulo: item.titulo,
      descripcion: item.descripcion,
      tipo: item.tipo,
      url: item.url,
      premium: item.premium,
      duracion: item.duracion || '',
      autor: item.autor || '',
      paginas: item.paginas || '',
      categoria: item.categoria || '',
      thumbnailUrl: item.thumbnailUrl || '',
      idioma: item.idioma
    });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ type: '', message: '' });

    try {
      const payload = {
        ...formData,
        premium: formData.premium === true || formData.premium === 'true'
      };

      const url = editingItem
        ? `${API_URL}/api/admin/contenido/${editingItem.id}`
        : `${API_URL}/api/admin/contenido`;

      const method = editingItem ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (data.success) {
        // Recargar contenido
        const contenidoRes = await fetch(`${API_URL}/api/admin/contenido`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        const contenidoData = await contenidoRes.json();

        if (contenidoData.success) {
          const grouped = {
            ebooks: contenidoData.data.filter(c => c.tipo === 'EBOOK'),
            guias: contenidoData.data.filter(c => c.tipo === 'GUIA'),
            videos: contenidoData.data.filter(c => c.tipo === 'VIDEO'),
            tips: contenidoData.data.filter(c => c.tipo === 'TIP')
          };
          setContenido(grouped);
        }

        setShowModal(false);
        setEditingItem(null);
        setFormData({
          titulo: '',
          descripcion: '',
          tipo: 'EBOOK',
          url: '',
          premium: false,
          duracion: '',
          autor: '',
          paginas: '',
          categoria: '',
          thumbnailUrl: '',
          idioma: 'es'
        });

        setSubmitStatus({
          type: 'success',
          message: editingItem ? 'Contenido actualizado' : 'Contenido creado'
        });
        setTimeout(() => setSubmitStatus({ type: '', message: '' }), 3000);
      } else {
        setSubmitStatus({ type: 'error', message: data.message || 'Error al guardar' });
      }
    } catch (error) {
      setSubmitStatus({ type: 'error', message: 'Error de conexión' });
    }
  };

  const filteredItems = () => {
    let items = [];

    if (filterType === 'all') {
      items = [...contenido.ebooks, ...contenido.guias, ...contenido.videos, ...contenido.tips];
    } else {
      items = contenido[filterType.toLowerCase()] || [];
    }

    if (searchTerm) {
      items = items.filter(item =>
        item.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const getIconForType = (tipo) => {
    switch (tipo) {
      case 'EBOOK': return <FileText className="w-5 h-5" />;
      case 'GUIA': return <BookOpen className="w-5 h-5" />;
      case 'VIDEO': return <Video className="w-5 h-5" />;
      case 'TIP': return <Lightbulb className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: colors.fondo }}>
        <Loader className="w-8 h-8 animate-spin" style={{ color: colors.mostazaPrimario }} />
      </div>
    );
  }

  return (
    <div className="min-h-screen" style={{ backgroundColor: colors.fondo }}>
      {/* Header */}
      <header className="bg-white shadow-sm border-b" style={{ borderColor: 'rgba(34, 60, 51, 0.1)' }}>
        <div className="px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${colors.mostazaPrimario}15` }}>
              <Crown className="w-5 h-5" style={{ color: colors.mostazaPrimario }} />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ color: colors.verdePrimario }}>Panel de Administración</h1>
              <p className="text-xs" style={{ color: colors.verdeMedio }}>Akhal Club</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
          >
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </header>

      <div className="px-4 sm:px-6 lg:px-8 py-8">
        {/* Status Message */}
        {submitStatus.message && (
          <div className={`mb-6 p-4 rounded-lg flex items-center gap-3 ${
            submitStatus.type === 'success' ? 'bg-green-50' : 'bg-red-50'
          }`}>
            {submitStatus.type === 'success' ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <XCircle className="w-5 h-5 text-red-600" />
            )}
            <span className={`text-sm font-medium ${
              submitStatus.type === 'success' ? 'text-green-800' : 'text-red-800'
            }`}>{submitStatus.message}</span>
          </div>
        )}

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${colors.verdeClaro}15` }}>
                  <FileText className="w-5 h-5" style={{ color: colors.verdeClaro }} />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: colors.verdePrimario }}>{stats.contenido.total}</p>
                  <p className="text-xs" style={{ color: colors.verdeMedio }}>Total Contenido</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${colors.mostazaPrimario}15` }}>
                  <Star className="w-5 h-5" style={{ color: colors.mostazaPrimario }} />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: colors.verdePrimario }}>{stats.contenido.premium}</p>
                  <p className="text-xs" style={{ color: colors.verdeMedio }}>Contenido Premium</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${colors.doradoClaro}15` }}>
                  <Users className="w-5 h-5" style={{ color: colors.doradoMedio }} />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: colors.verdePrimario }}>{stats.usuarios.activos}</p>
                  <p className="text-xs" style={{ color: colors.verdeMedio }}>Usuarios Activos</p>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-sm">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${colors.verdeAccent}15` }}>
                  <BarChart3 className="w-5 h-5" style={{ color: colors.verdeAccent }} />
                </div>
                <div>
                  <p className="text-2xl font-bold" style={{ color: colors.verdePrimario }}>{stats.contenido.gratis}</p>
                  <p className="text-xs" style={{ color: colors.verdeMedio }}>Contenido Gratis</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-xl shadow-sm mb-6">
          <div className="border-b" style={{ borderColor: 'rgba(34, 60, 51, 0.1)' }}>
            <div className="flex overflow-x-auto">
              {[
                { id: 'all', label: 'Todos', count: contenido.ebooks.length + contenido.guias.length + contenido.videos.length + contenido.tips.length },
                { id: 'ebooks', label: 'E-Books', count: contenido.ebooks.length, icon: FileText },
                { id: 'guias', label: 'Guías', count: contenido.guias.length, icon: BookOpen },
                { id: 'videos', label: 'Videos', count: contenido.videos.length, icon: Video },
                { id: 'tips', label: 'Tips', count: contenido.tips.length, icon: Lightbulb }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setFilterType(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors whitespace-nowrap ${
                      filterType === tab.id
                        ? 'border-current font-medium'
                        : 'border-transparent'
                    }`}
                    style={{
                      borderColor: filterType === tab.id ? colors.mostazaPrimario : 'transparent',
                      color: filterType === tab.id ? colors.verdePrimario : colors.verdeMedio
                    }}
                  >
                    {Icon && <Icon className="w-4 h-4" />}
                    <span>{tab.label}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      filterType === tab.id ? 'bg-opacity-100' : 'bg-opacity-50'
                    }`} style={{
                      backgroundColor: filterType === tab.id ? `${colors.mostazaPrimario}20` : 'rgba(34, 60, 51, 0.1)',
                      color: colors.verdePrimario
                    }}>{tab.count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Search and Add */}
          <div className="p-4 flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar contenido..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{
                  borderColor: 'rgba(34, 60, 51, 0.2)',
                  focusRingColor: colors.mostazaPrimario
                }}
              />
            </div>
            <button
              onClick={() => {
                setEditingItem(null);
                setFormData({
                  titulo: '',
                  descripcion: '',
                  tipo: filterType === 'all' ? 'EBOOK' : filterType.toUpperCase().slice(0, -1),
                  url: '',
                  premium: false,
                  duracion: '',
                  autor: '',
                  paginas: '',
                  categoria: '',
                  thumbnailUrl: '',
                  idioma: 'es'
                });
                setShowModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-medium text-white text-sm transition-all hover:shadow-lg"
              style={{ backgroundColor: colors.mostazaPrimario }}
            >
              <Plus className="w-4 h-4" />
              Agregar Contenido
            </button>
          </div>
        </div>

        {/* Content List */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {filteredItems().length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No hay contenido para mostrar</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Título</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Categoría</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Premium</th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Idioma</th>
                    <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y" style={{ divideColor: 'rgba(34, 60, 51, 0.1)' }}>
                  {filteredItems().map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div className="flex items-center gap-2" style={{ color: colors.verdePrimario }}>
                          {getIconForType(item.tipo)}
                          <span className="text-sm font-medium">{item.tipo}</span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium" style={{ color: colors.verdePrimario }}>{item.titulo}</div>
                        <div className="text-xs text-gray-500 truncate max-w-xs">{item.descripcion}</div>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-2 py-1 rounded-full text-xs" style={{
                          backgroundColor: `${colors.verdeClaro}15`,
                          color: colors.verdeClaro
                        }}>{item.categoria || '-'}</span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.premium ? (
                          <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" style={{
                            backgroundColor: `${colors.mostazaPrimario}15`,
                            color: colors.mostazaPrimario
                          }}>
                            <Star className="w-3 h-3 fill-current" />
                            ORO
                          </span>
                        ) : (
                          <span className="text-xs text-gray-500">Gratis</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-xs text-gray-500 uppercase">{item.idioma}</td>
                      <td className="px-4 py-3 whitespace-nowrap text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleEdit(item)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ backgroundColor: `${colors.verdeClaro}15`, color: colors.verdeClaro }}
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item.id, item.tipo)}
                            className="p-2 rounded-lg transition-colors"
                            style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444' }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b" style={{ borderColor: 'rgba(34, 60, 51, 0.1)' }}>
              <h2 className="text-xl font-bold" style={{ color: colors.verdePrimario }}>
                {editingItem ? 'Editar Contenido' : 'Nuevo Contenido'}
              </h2>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.verdePrimario }}>Tipo</label>
                  <select
                    value={formData.tipo}
                    onChange={(e) => setFormData({ ...formData, tipo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{ borderColor: 'rgba(34, 60, 51, 0.2)' }}
                    required
                  >
                    <option value="EBOOK">E-Book</option>
                    <option value="GUIA">Guía</option>
                    <option value="VIDEO">Video</option>
                    <option value="TIP">Tip</option>
                  </select>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.verdePrimario }}>Título *</label>
                  <input
                    type="text"
                    value={formData.titulo}
                    onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{ borderColor: 'rgba(34, 60, 51, 0.2)' }}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.verdePrimario }}>Descripción *</label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{ borderColor: 'rgba(34, 60, 51, 0.2)' }}
                    rows={3}
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.verdePrimario }}>URL *</label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{ borderColor: 'rgba(34, 60, 51, 0.2)' }}
                    placeholder="https://..."
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.verdePrimario }}>Categoría</label>
                  <input
                    type="text"
                    value={formData.categoria}
                    onChange={(e) => setFormData({ ...formData, categoria: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{ borderColor: 'rgba(34, 60, 51, 0.2)' }}
                    placeholder="Ej: Estilo, Negocios..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.verdePrimario }}>Idioma</label>
                  <select
                    value={formData.idioma}
                    onChange={(e) => setFormData({ ...formData, idioma: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{ borderColor: 'rgba(34, 60, 51, 0.2)' }}
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                  </select>
                </div>

                {(formData.tipo === 'EBOOK' || formData.tipo === 'GUIA') && (
                  <>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: colors.verdePrimario }}>Autor</label>
                      <input
                        type="text"
                        value={formData.autor}
                        onChange={(e) => setFormData({ ...formData, autor: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border"
                        style={{ borderColor: 'rgba(34, 60, 51, 0.2)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1" style={{ color: colors.verdePrimario }}>Páginas</label>
                      <input
                        type="number"
                        value={formData.paginas}
                        onChange={(e) => setFormData({ ...formData, paginas: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border"
                        style={{ borderColor: 'rgba(34, 60, 51, 0.2)' }}
                      />
                    </div>
                  </>
                )}

                {formData.tipo === 'VIDEO' && (
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium mb-1" style={{ color: colors.verdePrimario }}>Duración</label>
                    <input
                      type="text"
                      value={formData.duracion}
                      onChange={(e) => setFormData({ ...formData, duracion: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border"
                      style={{ borderColor: 'rgba(34, 60, 51, 0.2)' }}
                      placeholder="Ej: 10:30"
                    />
                  </div>
                )}

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1" style={{ color: colors.verdePrimario }}>Thumbnail URL</label>
                  <input
                    type="url"
                    value={formData.thumbnailUrl}
                    onChange={(e) => setFormData({ ...formData, thumbnailUrl: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border"
                    style={{ borderColor: 'rgba(34, 60, 51, 0.2)' }}
                    placeholder="https://..."
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={formData.premium}
                      onChange={(e) => setFormData({ ...formData, premium: e.target.checked })}
                      className="rounded"
                      style={{ accentColor: colors.mostazaPrimario }}
                    />
                    <span className="text-sm font-medium" style={{ color: colors.verdePrimario }}>
                      Contenido Premium (solo para miembros ORO)
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 rounded-lg font-medium text-white transition-all hover:shadow-lg"
                  style={{ backgroundColor: colors.mostazaPrimario }}
                >
                  {editingItem ? 'Actualizar' : 'Crear'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    setEditingItem(null);
                  }}
                  className="px-4 py-2 rounded-lg font-medium"
                  style={{ backgroundColor: 'rgba(34, 60, 51, 0.1)', color: colors.verdePrimario }}
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Add Star icon import
import { Star } from 'lucide-react';
