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
      setPasswordMessage({ type: 'error', text: t('dashboard.passwordsNotMatch') });
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordMessage({ type: 'error', text: t('dashboard.passwordTooShort') });
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
        setPasswordMessage({ type: 'success', text: t('dashboard.passwordChanged') });
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        setTimeout(() => setPasswordMessage({ type: '', text: '' }), 3000);
      } else {
        setPasswordMessage({ type: 'error', text: data.message || t('dashboard.processingError') });
      }
    } catch (error) {
      setPasswordMessage({ type: 'error', text: t('dashboard.connectionError') });
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
          text: t('dashboard.cancellationReceived')
        });
        setTimeout(() => {
          setShowCancelModal(false);
          setCancelReason('');
          setCancelFeedback('');
        }, 3000);
      } else {
        setCancelMessage({
          type: 'error',
          text: data.message || t('dashboard.processingError')
        });
      }
    } catch (error) {
      setCancelMessage({
        type: 'error',
        text: t('dashboard.connectionError')
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
          <span>{t('dashboard.personalInfo')}</span>
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
          <span>{t('dashboard.security')}</span>
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
          <span>{t('dashboard.subscription')}</span>
        </button>
      </div>

      {/* Content Sections */}
      <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
        {/* Personal Information Section */}
        {activeSection === 'info' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.verdePrimario }}>
                {t('dashboard.personalInfo')}
              </h3>
              <p className="text-sm" style={{ color: colors.verdeMedio }}>
                {t('dashboard.manageInfo')}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.verdePrimario }}>
                  <User className="w-4 h-4" />
                  {t('dashboard.fullName')}
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
                  {t('dashboard.email')}
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
                  {t('dashboard.phone')}
                </label>
                <input
                  type="tel"
                  value={userData.phone || t('dashboard.notSpecified', 'No especificado')}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border bg-gray-50 text-gray-600 cursor-not-allowed"
                  style={{ borderColor: 'rgba(34, 60, 51, 0.1)' }}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.verdePrimario }}>
                  <MapPin className="w-4 h-4" />
                  {t('dashboard.country')}
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
                  {t('dashboard.stylePref')}
                </label>
                <input
                  type="text"
                  value={userData.stylePreference || t('dashboard.notSpecified', 'No especificado')}
                  disabled
                  className="w-full px-4 py-2.5 rounded-lg border bg-gray-50 text-gray-600 cursor-not-allowed"
                  style={{ borderColor: 'rgba(34, 60, 51, 0.1)' }}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium" style={{ color: colors.verdePrimario }}>
                  <Calendar className="w-4 h-4" />
                  {t('dashboard.memberSince')}
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
                    {t('dashboard.editInfo')}
                  </p>
                  <p className="text-xs mt-1" style={{ color: colors.verdeMedio }}>
                    {t('dashboard.editInfoNote')}
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
                {t('dashboard.newPassword').includes('Nueva') ? 'Cambiar Contraseña' : 'Change Password'}
              </h3>
              <p className="text-sm" style={{ color: colors.verdeMedio }}>
                {t('dashboard.securityDesc')}
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
                  {t('dashboard.currentPassword')}
                </label>
                <div className="relative">
                  <input
                    type={showPasswords.current ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                    required
                    className="w-full px-4 py-2.5 pr-10 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: 'rgba(34, 60, 51, 0.2)', focusRingColor: colors.mostazaPrimario }}
                    placeholder={t('dashboard.currentPassPlaceholder')}
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
                  {t('dashboard.newPassword')}
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
                    placeholder={t('dashboard.newPassPlaceholder')}
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
                  {t('dashboard.confirmPassword')}
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
                    placeholder={t('dashboard.confirmPassPlaceholder')}
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
                {t('dashboard.updatePassword')}
              </button>
            </form>
          </div>
        )}

        {/* Subscription Section */}
        {activeSection === 'subscription' && (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-bold mb-2" style={{ color: colors.verdePrimario }}>
                {t('dashboard.subscription')}
              </h3>
              <p className="text-sm" style={{ color: colors.verdeMedio }}>
                {t('dashboard.subscriptionDesc')}
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
                        {t('dashboard.currentPlan')} {userPlan === 'ORO ? 'ORO' : 'PLATA'}
                      </h4>
                      <p className="text-xs" style={{ color: colors.verdeMedio }}>
                        {userPlan === 'ORO' ? t('dashboard.premiumMembership') : t('dashboard.standardMembership')}
                      </p>
                    </div>
                  </div>
                  {userPlan === 'ORO' && (
                    <div className="px-3 py-1 rounded-full text-xs font-bold text-white"
                      style={{ backgroundColor: colors.mostazaPrimario }}
                    >
                      {t('dashboard.active')}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="text-center p-3 rounded-lg bg-white/60">
                    <div className="text-2xl font-bold" style={{ color: colors.verdePrimario }}>
                      {userPlan === 'ORO' ? t('dashboard.unlimited') : t('dashboard.limited')}
                    </div>
                    <div className="text-xs" style={{ color: colors.verdeMedio }}>{t('dashboard.contentAccess')}</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/60">
                    <div className="text-2xl font-bold" style={{ color: colors.verdePrimario }}>
                      {userPlan === 'ORO' ? t('dashboard.full') : t('dashboard.basic')}
                    </div>
                    <div className="text-xs" style={{ color: colors.verdeMedio }}>{t('dashboard.benefits')}</div>
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
                        {t('dashboard.upgrade')}
                      </h4>
                      <p className="text-xs mb-3" style={{ color: colors.verdeMedio }}>
                        {t('dashboard.upgradeDesc')}
                      </p>
                      <a
                        href="https://checkout.systeme.io/tu-producto-oro"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block px-4 py-2 rounded-lg font-bold text-white text-sm transition-all duration-200 hover:shadow-lg"
                        style={{ backgroundColor: colors.mostazaPrimario }}
                      >
                        {t('dashboard.upgradeButton')}
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
                      {t('dashboard.cancelSubscription')}
                    </h4>
                    <p className="text-xs mb-3 text-red-700">
                      {t('dashboard.cancelDesc')}
                    </p>
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="inline-block px-4 py-2 rounded-lg font-bold text-white text-sm transition-all duration-200 hover:shadow-lg"
                      style={{ backgroundColor: '#dc2626' }}
                    >
                      {t('dashboard.requestCancellation')}
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
                    <strong>{t('dashboard.pauseNote')}</strong>
                  </p>
                  <p className="text-xs" style={{ color: colors.verdeMedio }}>
                    {t('dashboard.pauseNoteDesc')}
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
                  {t('dashboard.cancelModalTitle')}
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
                {t('dashboard.cancelModalDesc')}
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
                    {t('dashboard.cancelReasonLabel')} <span className="text-red-600">*</span>
                  </label>
                  <select
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2"
                    style={{ borderColor: 'rgba(34, 60, 51, 0.2)' }}
                  >
                    <option value="">{t('dashboard.selectReason')}</option>
                    <option value="expensive">{t('dashboard.reasonExpensive')}</option>
                    <option value="not_using">{t('dashboard.reasonNotUsing')}</option>
                    <option value="quality">{t('dashboard.reasonQuality')}</option>
                    <option value="technical">{t('dashboard.reasonTechnical')}</option>
                    <option value="found_alternative">{t('dashboard.reasonAlternative')}</option>
                    <option value="personal">{t('dashboard.reasonPersonal')}</option>
                    <option value="other">{t('dashboard.reasonOther')}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    {t('dashboard.additionalComments')}
                  </label>
                  <textarea
                    value={cancelFeedback}
                    onChange={(e) => setCancelFeedback(e.target.value)}
                    rows="3"
                    className="w-full px-4 py-2.5 rounded-lg border focus:outline-none focus:ring-2 resize-none"
                    style={{ borderColor: 'rgba(34, 60, 51, 0.2)' }}
                    placeholder={t('dashboard.feedbackPlaceholder')}
                  />
                </div>

                <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
                  <p className="text-xs text-blue-900">
                    {t('dashboard.cancellationNote')}
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
                    {t('dashboard.keepSubscription')}
                  </button>
                  <button
                    type="submit"
                    disabled={isCancelling}
                    className="flex-1 px-4 py-2.5 rounded-lg font-bold text-white transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{ backgroundColor: '#dc2626' }}
                  >
                    {isCancelling ? t('dashboard.sending') : t('dashboard.confirmCancellation')}
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
