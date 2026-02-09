import { useState, useEffect } from 'react';
import { User, Lock, CreditCard, Calendar, Mail, Phone, MapPin, Crown, AlertCircle, CheckCircle2, Eye, EyeOff, X, PauseCircle } from 'lucide-react';

export default function ProfileSection({ token, userName, userPlan, colors, t, API_URL }) {
  const [activeSection, setActiveSection] = useState('info');
  const [userData, setUserData] = useState({
    fullName: '',
    email: '',
    phone: '',
    country: '',
    stylePreference: '',
    joinDate: '',
    lastLogin: ''
  });

  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // Cancelación de suscripción
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelFeedback, setCancelFeedback] = useState('');
  const [cancelMessage, setCancelMessage] = useState({ type: '', text: '' });
  const [isCancelling, setIsCancelling] = useState(false);

  // Load user data from token
  useEffect(() => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      setUserData({
        fullName: payload.nombre || userName,
        email: payload.email || '',
        phone: payload.phone || '',
        country: payload.country || 'US',
        stylePreference: payload.stylePreference || 'CLASSIC',
        joinDate: payload.iat ? new Date(payload.iat * 1000).toLocaleDateString() : new Date().toLocaleDateString(),
        lastLogin: new Date().toLocaleDateString()
      });
    } catch (err) {
      console.error('Error parsing token:', err);
    }
  }, [token, userName]);

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Validation
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordMessage({ type: 'error', text: 'Las contraseñas nuevas no coinciden' });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: 'La contraseña debe tener al menos 8 caracteres' });
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (data.success) {
        setPasswordMessage({ type: 'success', text: 'Contraseña cambiada exitosamente' });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordMessage({ type: '', text: '' }), 3000);
      } else {
        setPasswordMessage({ type: 'error', text: data.message || 'Error al cambiar contraseña' });
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: 'Error de conexión. Intenta nuevamente.' });
    }
  };

  const handleCancelSubscription = async (e) => {
    e.preventDefault();
    setIsCancelling(true);
    setCancelMessage({ type: '', text: '' });

    try {
      const response = await fetch(`${API_URL}/api/usuarios/cancelar-suscripcion`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          reason: cancelReason,
          feedback: cancelFeedback
        })
      });

      const data = await response.json();

      if (data.success) {
        setCancelMessage({
          type: 'success',
          text: 'Solicitud de cancelación recibida. Te contactaremos en 24-48 horas para confirmar.'
        });
        setTimeout(() => {
          setShowCancelModal(false);
          setCancelReason('');
          setCancelFeedback('');
        }, 3000);
      } else {
        setCancelMessage({
          type: 'error',
          text: data.message || 'Error al procesar la solicitud'
        });
      }
    } catch (error) {
      setCancelMessage({
        type: 'error',
        text: 'Error de conexión. Intenta nuevamente.'
      });
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Profile Navigation Tabs */}
      <div className="flex flex-wrap gap-2 sm:gap-3 border-b" style={{ borderColor: 'rgba(34, 60, 51, 0.1)' }}>
        <button
          onClick={() => setActiveSection('info')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all duration-200 font-medium text-sm ${
            activeSection === 'info'
              ? 'border-b-2'
              : 'hover:bg-white/50'
          }`}
          style={{
            borderColor: activeSection === 'info' ? colors.mostazaPrimario : 'transparent',
            color: activeSection === 'info' ? colors.verdePrimario : colors.verdeMedio
          }}
        >
          <User className="w-4 h-4" />
          <span>Información Personal</span>
        </button>

        <button
          onClick={() => setActiveSection('security')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all duration-200 font-medium text-sm ${
            activeSection === 'security'
              ? 'border-b-2'
              : 'hover:bg-white/50'
          }`}
          style={{
            borderColor: activeSection === 'security' ? colors.mostazaPrimario : 'transparent',
            color: activeSection === 'security' ? colors.verdePrimario : colors.verdeMedio
          }}
        >
          <Lock className="w-4 h-4" />
          <span>Seguridad</span>
        </button>

        <button
          onClick={() => setActiveSection('subscription')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-t-lg transition-all duration-200 font-medium text-sm ${
            activeSection === 'subscription'
              ? 'border-b-2'
              : 'hover:bg-white/50'
          }`}
          style={{
            borderColor: activeSection === 'subscription' ? colors.mostazaPrimario : 'transparent',
            color: activeSection === 'subscription' ? colors.verdePrimario : colors.verdeMedio
          }}
        >
          <CreditCard className="w-4 h-4" />
          <span>Suscripción</span>
        </button>
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Personal Information Section */}
        {activeSection === 'info' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.verdePrimario }}>
                Información Personal
              </h3>
              <p className="text-sm" style={{ color: colors.verdeMedio }}>
                Gestiona tu información personal y preferencias
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.verdePrimario }}>
                  <User className="w-4 h-4" />
                  Nombre Completo
                </label>
                <input
                  type="text"
                  value={userData.fullName}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border bg-gray-50 text-gray-600 cursor-not-allowed"
                  style={{ borderColor: 'rgba(34, 60, 51, 0.1)' }}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.verdePrimario }}>
                  <Mail className="w-4 h-4" />
                  Email
                </label>
                <input
                  type="email"
                  value={userData.email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border bg-gray-50 text-gray-600 cursor-not-allowed"
                  style={{ borderColor: 'rgba(34, 60, 51, 0.1)' }}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.verdePrimario }}>
                  <Phone className="w-4 h-4" />
                  Teléfono
                </label>
                <input
                  type="tel"
                  value={userData.phone || 'No especificado'}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border bg-gray-50 text-gray-600 cursor-not-allowed"
                  style={{ borderColor: 'rgba(34, 60, 51, 0.1)' }}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.verdePrimario }}>
                  <MapPin className="w-4 h-4" />
                  País
                </label>
                <input
                  type="text"
                  value={userData.country}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border bg-gray-50 text-gray-600 cursor-not-allowed"
                  style={{ borderColor: 'rgba(34, 60, 51, 0.1)' }}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: colors.verdePrimario }}>
                  Preferencia de Estilo
                </label>
                <input
                  type="text"
                  value={userData.stylePreference || 'No especificado'}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border bg-gray-50 text-gray-600 cursor-not-allowed"
                  style={{ borderColor: 'rgba(34, 60, 51, 0.1)' }}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.verdePrimario }}>
                  <Calendar className="w-4 h-4" />
                  Miembro Desde
                </label>
                <input
                  type="text"
                  value={userData.joinDate}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border bg-gray-50 text-gray-600 cursor-not-allowed"
                  style={{ borderColor: 'rgba(34, 60, 51, 0.1)' }}
                />
              </div>
            </div>

            <div className="mt-6 p-4 rounded-lg border-l-4" style={{
              backgroundColor: 'rgba(206, 182, 82, 0.05)',
              borderColor: colors.mostazaPrimario
            }}>
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: colors.mostazaPrimario }} />
                <div>
                  <p className="font-medium text-sm" style={{ color: colors.verdePrimario }}>
                    ¿Quieres editar tu información?
                  </p>
                  <p className="text-xs mt-1" style={{ color: colors.verdeMedio }}>
                    Contáctanos en soporte@akahl.com y con gusto te ayudaremos.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Security Section */}
        {activeSection === 'security' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.verdePrimario }}>
                Cambiar Contraseña
              </h3>
              <p className="text-sm" style={{ color: colors.verdeMedio }}>
                Mantén tu cuenta segura actualizando tu contraseña regularmente
              </p>
            </div>

            {passwordMessage.text && (
              <div className={`p-4 rounded-lg flex items-start gap-3 ${
                passwordMessage.type === 'success'
                  ? 'bg-green-50 border-l-4 border-green-500'
                  : 'bg-red-50 border-l-4 border-red-500'
              }`}>
                {passwordMessage.type === 'success' ? (
                  <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                ) : (
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
                )}
                <p className="text-sm font-medium" style={{ color: passwordMessage.type === 'success' ? '#16a34a' : '#dc2626' }}>
                  {passwordMessage.text}
                </p>
              </div>
            )}

            <form onSubmit={handlePasswordChange} className="space-y-5">
              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: colors.verdePrimario }}>
                  Contraseña Actual
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: 'rgba(34, 60, 51, 0.2)', focusRingColor: colors.mostazaPrimario }}
                    placeholder="Ingresa tu contraseña actual"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, current: !showPasswords.current })}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: colors.verdeMedio }}
                  >
                    {showPasswords.current ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: colors.verdePrimario }}>
                  Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.new ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                    required
                    minLength={8}
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: 'rgba(34, 60, 51, 0.2)', focusRingColor: colors.mostazaPrimario }}
                    placeholder="Mínimo 8 caracteres"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, new: !showPasswords.new })}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: colors.verdeMedio }}
                  >
                    {showPasswords.new ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium" style={{ color: colors.verdePrimario }}>
                  Confirmar Nueva Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.confirm ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                    required
                    minLength={8}
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: 'rgba(34, 60, 51, 0.2)', focusRingColor: colors.mostazaPrimario }}
                    placeholder="Repite tu nueva contraseña"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPasswords({ ...showPasswords, confirm: !showPasswords.confirm })}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    style={{ color: colors.verdeMedio }}
                  >
                    {showPasswords.confirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-medium text-white transition-all duration-200 hover:shadow-lg"
                style={{ backgroundColor: colors.mostazaPrimario }}
              >
                Actualizar Contraseña
              </button>
            </form>
          </div>
        )}

        {/* Subscription Section */}
        {activeSection === 'subscription' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.verdePrimario }}>
                Tu Suscripción
              </h3>
              <p className="text-sm" style={{ color: colors.verdeMedio }}>
                Gestiona tu membresía Akahl Club
              </p>
            </div>

            {/* Current Plan Card */}
            <div className="p-6 rounded-2xl border-2 relative overflow-hidden"
              style={{
                borderColor: userPlan === 'ORO' ? colors.mostazaPrimario : 'rgba(192, 192, 192, 0.3)',
                background: userPlan === 'ORO'
                  ? `linear-gradient(135deg, rgba(206, 182, 82, 0.1) 0%, rgba(214, 197, 119, 0.05) 100%)`
                  : 'rgba(192, 192, 192, 0.05)'
              }}
            >
              {userPlan === 'ORO' && (
                <div className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-10"
                  style={{ background: `radial-gradient(circle, ${colors.mostazaPrimario} 0%, transparent 70%)` }}
                />
              )}

              <div className="relative">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                      style={{
                        backgroundColor: userPlan === 'ORO' ? colors.mostazaPrimario : 'rgba(192, 192, 192, 0.2)'
                      }}
                    >
                      <Crown className={`w-6 h-6 ${userPlan === 'ORO' ? 'text-white' : ''}`} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold" style={{ color: colors.verdePrimario }}>
                        Plan {userPlan === 'ORO' ? 'ORO' : 'PLATA'}
                      </h4>
                      <p className="text-xs" style={{ color: colors.verdeMedio }}>
                        {userPlan === 'ORO' ? 'Membresía Premium' : 'Membresía Estándar'}
                      </p>
                    </div>
                  </div>
                  {userPlan === 'ORO' && (
                    <div className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: colors.mostazaPrimario }}
                    >
                      ACTIVO
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-3 rounded-lg bg-white/60">
                    <div className="text-2xl font-bold" style={{ color: colors.verdePrimario }}>
                      {userPlan === 'ORO' ? '∞' : 'Limitado'}
                    </div>
                    <div className="text-xs" style={{ color: colors.verdeMedio }}>Acceso a Contenido</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/60">
                    <div className="text-2xl font-bold" style={{ color: colors.verdePrimario }}>
                      {userPlan === 'ORO' ? 'Full' : 'Básico'}
                    </div>
                    <div className="text-xs" style={{ color: colors.verdeMedio }}>Beneficios</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4">
              {userPlan === 'PLATA' && (
                <div className="p-4 rounded-xl border-2" style={{
                  borderColor: colors.mostazaPrimario,
                  background: 'linear-gradient(135deg, rgba(206, 182, 82, 0.1) 0%, rgba(214, 197, 119, 0.05) 100%)'
                }}>
                  <div className="flex items-start gap-3">
                    <Crown className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: colors.mostazaPrimario }} />
                    <div className="flex-1">
                      <h4 className="font-bold text-sm mb-1" style={{ color: colors.verdePrimario }}>
                        ¿Quieres más beneficios?
                      </h4>
                      <p className="text-xs mb-3" style={{ color: colors.verdeMedio }}>
                        Actualiza a Plan ORO y obtén acceso ilimitado a todo el contenido premium.
                      </p>
                      <a
                        href="https://checkout.systeme.io/tu-producto-oro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 rounded-lg font-bold text-white text-sm transition-all duration-200 hover:shadow-lg"
                        style={{ backgroundColor: colors.mostazaPrimario }}
                      >
                        Hacer Upgrade a ORO →
                      </a>
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-xl border bg-gray-50" style={{ borderColor: 'rgba(220, 38, 38, 0.2)' }}>
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
                  <div className="flex-1">
                    <h4 className="font-bold text-sm mb-1 text-red-900">
                      Cancelar Suscripción
                    </h4>
                    <p className="text-xs mb-3 text-red-700">
                      Lamentamos verte ir. Antes de irte, ¿podrías decirnos por qué?
                    </p>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="inline-block px-4 py-2 rounded-lg font-bold text-white text-sm transition-all duration-200 hover:shadow-lg"
                      style={{ backgroundColor: '#dc2626' }}
                    >
                      Solicitar Cancelación
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Retention Note */}
            <div className="mt-6 p-4 rounded-lg border-l-4" style={{
              backgroundColor: 'rgba(206, 182, 82, 0.05)',
              borderColor: colors.mostazaPrimario
            }}>
              <div className="flex items-start gap-3">
                <PauseCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: colors.mostazaPrimario }} />
                <div className="flex-1">
                  <p className="text-xs mb-2" style={{ color: colors.verdePrimario }}>
                    <strong>¿Solo necesitas un descanso?</strong>
                  </p>
                  <p className="text-xs" style={{ color: colors.verdeMedio }}>
                    Contáctanos antes de cancelar. Podemos pausar tu membresía o ofrecerte un descuento especial.
                    Tu satisfacción es nuestra prioridad.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modal de Cancelación de Suscripción */}
      {showCancelModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-white border-b p-6 rounded-t-2xl" style={{ borderColor: 'rgba(34, 60, 51, 0.1)' }}>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold" style={{ color: colors.verdePrimario }}>
                  Cancelar Suscripción
                </h3>
                <button
                  onClick={() => {
                    setShowCancelModal(false);
                    setCancelMessage({ type: '', text: '' });
                  }}
                  className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <X className="w-5 h-5 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-sm mb-6 text-gray-700">
                Lamentamos verte ir. Por favor ayúdanos a mejorar seleccionando el motivo principal de tu cancelación:
              </p>

              {cancelMessage.text && (
                <div className={`mb-4 p-3 rounded-lg flex items-start gap-2 ${
                  cancelMessage.type === 'success'
                    ? 'bg-green-50 border border-green-200'
                    : 'bg-red-50 border border-red-200'
                }`}>
                  {cancelMessage.type === 'success' ? (
                    <CheckCircle2 className="w-5 h-5 mt-0.5 flex-shrink-0 text-green-600" />
                  ) : (
                    <AlertCircle className="w-5 h-5 mt-0.5 flex-shrink-0 text-red-600" />
                  )}
                  <p className="text-sm">{cancelMessage.text}</p>
                </div>
              )}

              <form onSubmit={handleCancelSubscription} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Motivo de cancelación <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: 'rgba(34, 60, 51, 0.2)' }}
                  >
                    <option value="">Selecciona un motivo</option>
                    <option value="expensive">Es muy costoso</option>
                    <option value="not_using">No estoy usando el contenido</option>
                    <option value="quality">La calidad del contenido no es lo que esperaba</option>
                    <option value="technical">Problemas técnicos</option>
                    <option value="found_alternative">Encontré una alternativa</option>
                    <option value="personal">Razones personales</option>
                    <option value="other">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Comentarios adicionales (opcional)
                  </label>
                  <textarea
                    value={cancelFeedback}
                    onChange={(e) => setCancelFeedback(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 resize-none"
                    style={{ borderColor: 'rgba(34, 60, 51, 0.2)' }}
                    placeholder="Cuéntanos más sobre tu experiencia..."
                  />
                </div>

                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-xs text-blue-900">
                    <strong>Nota importante:</strong> Tu solicitud será revisada por nuestro equipo.
                    Te contactaremos en 24-48 horas para confirmar la cancelación y ofrecerte alternativas.
                    Tu membresía seguirá activa hasta que se confirme la cancelación.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setShowCancelModal(false);
                      setCancelMessage({ type: '', text: '' });
                    }}
                    className="flex-1 px-4 py-2.5 rounded-lg font-medium border-2 transition-all duration-200"
                    style={{ borderColor: 'rgba(34, 60, 51, 0.2)', color: colors.verdePrimario }}
                  >
                    Mantener Suscripción
                  </button>
                  <button
                    type="submit"
                    disabled={isCancelling}
                    className="flex-1 px-4 py-2.5 rounded-lg font-bold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#dc2626' }}
                  >
                    {isCancelling ? 'Enviando...' : 'Confirmar Cancelación'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
