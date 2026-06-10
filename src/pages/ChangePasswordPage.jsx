// src/pages/ChangePasswordPage.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, Check, X, Eye, EyeOff } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export default function ChangePasswordPage({ token, onTokenUpdate }) {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Validaciones en tiempo real
  const validations = {
    length: formData.newPassword.length >= 8,
    uppercase: /[A-Z]/.test(formData.newPassword),
    lowercase: /[a-z]/.test(formData.newPassword),
    number: /[0-9]/.test(formData.newPassword),
    special: /[@$!%*?&]/.test(formData.newPassword)
  };

  const allValid = Object.values(validations).every(v => v);
  const passwordsMatch = formData.newPassword === formData.confirmPassword && formData.newPassword.length > 0;

  const API_URL = import.meta.env.VITE_API_URL || 'https://akahlclub.onrender.com';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!allValid) {
      setError('La contraseña no cumple todos los requisitos');
      return;
    }

    if (!passwordsMatch) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(`${API_URL}/api/auth/change-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ newPassword: formData.newPassword })
      });

      const data = await res.json();

      if (data.success) {
        // Éxito - mostrar animación
        setSuccess(true);

        // Guardar nuevo token
        localStorage.setItem('token', data.token);

        // Notificar al padre del nuevo token
        if (onTokenUpdate) {
          onTokenUpdate(data.token);
        }

        // Redirigir después de 1.5 segundos
        setTimeout(() => {
          navigate('/dashboard');
        }, 1500);

      } else {
        setError(data.message || 'Error al cambiar contraseña');
      }
    } catch (err) {
      console.error('Error al cambiar contraseña:', err);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  // Pantalla de éxito
  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4"
           style={{ background: 'linear-gradient(135deg, #152821 0%, #223c33 100%)' }}>
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full mb-6 animate-bounce"
               style={{ background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' }}>
            <Check className="w-12 h-12 text-white" />
          </div>
          <h2 className="text-2xl font-playfair font-bold text-white mb-2">
            ¡Contraseña Actualizada!
          </h2>
          <p className="text-gray-400">
            Redirigiendo al dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden"
         style={{ background: 'linear-gradient(135deg, #152821 0%, #223c33 100%)' }}>

      {/* Decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 rounded-full opacity-10"
             style={{ background: '#c1ad48', filter: 'blur(100px)' }} />
        <div className="absolute bottom-20 right-10 w-96 h-96 rounded-full opacity-10"
             style={{ background: '#c1ad48', filter: 'blur(120px)' }} />
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-4"
               style={{ background: 'linear-gradient(135deg, #c1ad48 0%, #d6c165 100%)' }}>
            <Shield className="w-10 h-10 text-[#152821]" />
          </div>
          <h1 className="text-3xl font-playfair font-bold text-white mb-2">
            Cambia tu Contraseña
          </h1>
          <p className="text-gray-400">
            Por seguridad, debes crear una nueva contraseña para continuar
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 p-8 shadow-2xl">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 flex items-start gap-3">
              <X className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Nueva Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Nueva Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
                  required
                  className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-[#c1ad48] focus:border-transparent
                             transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c1ad48] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirmar Contraseña */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  required
                  className="w-full pl-11 pr-12 py-3 bg-white/5 border border-white/10 rounded-lg
                             text-white placeholder-gray-500
                             focus:outline-none focus:ring-2 focus:ring-[#c1ad48] focus:border-transparent
                             transition-all"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-[#c1ad48] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              {/* Indicador de coincidencia */}
              {formData.confirmPassword && (
                <div className={`mt-2 flex items-center gap-2 text-xs ${
                  passwordsMatch ? 'text-green-400' : 'text-red-400'
                }`}>
                  {passwordsMatch ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                  <span>{passwordsMatch ? 'Las contraseñas coinciden' : 'Las contraseñas no coinciden'}</span>
                </div>
              )}
            </div>

            {/* Requisitos de contraseña */}
            <div className="bg-white/5 rounded-lg p-4 space-y-2">
              <p className="text-xs text-gray-400 font-medium mb-3">
                La contraseña debe contener:
              </p>

              {[
                { key: 'length', label: 'Mínimo 8 caracteres' },
                { key: 'uppercase', label: 'Una letra mayúscula (A-Z)' },
                { key: 'lowercase', label: 'Una letra minúscula (a-z)' },
                { key: 'number', label: 'Un número (0-9)' },
                { key: 'special', label: 'Un carácter especial (@$!%*?&)' }
              ].map(({ key, label }) => (
                <div key={key} className="flex items-center gap-2">
                  {formData.newPassword.length > 0 && validations[key] ? (
                    <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                  ) : (
                    <X className="w-4 h-4 text-gray-600 flex-shrink-0" />
                  )}
                  <span className={`text-xs ${
                    formData.newPassword.length > 0 && validations[key] ? 'text-green-400' : 'text-gray-500'
                  }`}>
                    {label}
                  </span>
                </div>
              ))}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || !allValid || !passwordsMatch}
              className="w-full py-3 px-4 rounded-lg font-semibold text-[#152821]
                         transition-all duration-300
                         hover:scale-[1.02] hover:shadow-xl
                         disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
              style={{
                background: 'linear-gradient(135deg, #c1ad48 0%, #d6c165 100%)'
              }}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Actualizando contraseña...
                </span>
              ) : 'Establecer Nueva Contraseña'}
            </button>
          </form>
        </div>

        {/* Footer info */}
        <p className="text-center text-gray-500 text-xs mt-6 flex items-center justify-center gap-2">
          <Lock className="w-3 h-3" />
          Tu contraseña está protegida con encriptación
        </p>
      </div>
    </div>
  );
}
