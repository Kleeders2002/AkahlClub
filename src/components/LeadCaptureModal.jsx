// components/LeadCaptureModal.jsx
import { useState } from 'react';

const LeadCaptureModal = ({ onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phoneCode: '+1',
    phone: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [alreadyRegistered, setAlreadyRegistered] = useState(false);
  const [language, setLanguage] = useState('en'); // 'en' o 'es'

  // Códigos de teléfono por país
  const phoneCodes = [
    { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
    { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
    { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },
    { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
    { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
    { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
    { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
    { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54' },
    { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56' },
    { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '+57' },
    { code: 'PE', name: 'Peru', flag: '🇵🇪', dialCode: '+51' },
    { code: 'VE', name: 'Venezuela', flag: '🇻🇪', dialCode: '+58' },
    { code: 'EC', name: 'Ecuador', flag: '🇪🇨', dialCode: '+593' },
    { code: 'UY', name: 'Uruguay', flag: '🇺🇾', dialCode: '+598' },
    { code: 'PY', name: 'Paraguay', flag: '🇵🇾', dialCode: '+595' },
    { code: 'BO', name: 'Bolivia', flag: '🇧🇴', dialCode: '+591' },
  ];

  // Textos traducidos
  const translations = {
    en: {
      successTitle: (name) => `Thank you ${name}!`,
      successMessage: "You've successfully joined the exclusive AKAHL VIP circle. Check your email for a welcome message with all the details.",
      alreadyRegisteredTitle: "You're Already a VIP Member!",
      alreadyRegisteredMessage: "This email is already part of our exclusive circle. You're receiving all our updates and special benefits.",
      alreadyRegisteredNote: "Check your inbox for our latest exclusive content.",
      redirecting: "Redirecting to main content...",
      title: "AKAHL CLUB",
      subtitle: "Exclusive VIP Access",
      description: "Join the private circle and get exclusive benefits before anyone else",
      benefits: [
        'Priority access to new collections',
        'Exclusive discounts for members',
        'Premium content and behind-the-scenes',
        'Personalized VIP support'
      ],
      form: {
        name: "Full name *",
        email: "Email *",
        phoneCode: "Code",
        phone: "Phone (optional)"
      },
      privacyCheckbox: "By registering, you accept our Privacy Policy and receive exclusive communications from AKAHL CLUB. You can unsubscribe at any time.",
      submitButton: "Join the VIP Club",
      cancelButton: "Continue without registering now",
      privacyNote: "Your information is safe with us. We will not share your data with third parties.",
      errors: {
        nameRequired: "Name is required",
        emailRequired: "Email is required",
        emailInvalid: "Invalid email address",
        emailAlreadyExists: "This email is already registered in our VIP circle",
        phoneInvalid: "Invalid phone number"
      }
    },
    es: {
      successTitle: (name) => `¡Gracias ${name}!`,
      successMessage: "Te has unido exitosamente al círculo exclusivo VIP de AKAHL. Revisa tu correo para un mensaje de bienvenida con todos los detalles.",
      alreadyRegisteredTitle: "¡Ya Eres Miembro VIP!",
      alreadyRegisteredMessage: "Este correo ya forma parte de nuestro círculo exclusivo. Estás recibiendo todas nuestras actualizaciones y beneficios especiales.",
      alreadyRegisteredNote: "Revisa tu bandeja de entrada para ver nuestro último contenido exclusivo.",
      redirecting: "Redirigiendo al contenido principal...",
      title: "AKAHL CLUB",
      subtitle: "Acceso Exclusivo VIP",
      description: "Únete al círculo privado y obtén beneficios exclusivos antes que nadie",
      benefits: [
        'Acceso prioritario a nuevas colecciones',
        'Descuentos exclusivos para miembros',
        'Contenido premium y behind-the-scenes',
        'Soporte VIP personalizado'
      ],
      form: {
        name: "Nombre completo *",
        email: "Correo electrónico *",
        phoneCode: "Código",
        phone: "Teléfono (opcional)"
      },
      privacyCheckbox: "Al registrarte, aceptas nuestra Política de Privacidad y recibir comunicaciones exclusivas de AKAHL CLUB. Puedes darte de baja en cualquier momento.",
      submitButton: "Unirme al Club VIP",
      cancelButton: "Continuar sin registrarme ahora",
      privacyNote: "Tu información está segura con nosotros. No compartiremos tus datos con terceros.",
      errors: {
        nameRequired: 'El nombre es requerido',
        emailRequired: 'El correo es requerido',
        emailInvalid: 'Correo electrónico inválido',
        emailAlreadyExists: 'Este correo ya está registrado en nuestro círculo VIP',
        phoneInvalid: 'Número de teléfono inválido'
      }
    }
  };

  const t = translations[language];

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = t.errors.nameRequired;
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t.errors.emailRequired;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t.errors.emailInvalid;
    }
    
    if (formData.phone && !/^[\d\s\-\(\)]{7,15}$/.test(formData.phone)) {
      newErrors.phone = t.errors.phoneInvalid;
    }
    
    return newErrors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
  
    setLoading(true);
  
    try {
      // Combinar código + teléfono si existe teléfono
      const fullPhone = formData.phone 
        ? `${formData.phoneCode} ${formData.phone}` 
        : null;

      const response = await fetch('http://localhost:4000/api/leads', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          phone: fullPhone,
          language: language
        }),
      });
    
      const result = await response.json();
    
      if (!response.ok) {
        if (result.details) {
          const newErrors = {};
          result.details.forEach(detail => {
            newErrors[detail.field] = detail.message;
          });
          setErrors(newErrors);
        } else if (result.alreadyExists) {
          // Email ya registrado - mostrar pantalla especial
          setAlreadyRegistered(true);
          setTimeout(() => {
            onClose();
          }, 4000);
        } else {
          throw new Error(result.error || 'Error del servidor');
        }
        return;
      }
    
      // Éxito
      onSubmit(result.user || formData);
      setSubmitted(true);
    
      setTimeout(() => {
        onClose();
      }, 4000);
    
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = language === 'es' 
        ? 'Hubo un error. Por favor intenta de nuevo.' 
        : 'An error occurred. Please try again.';
    
      setErrors(prev => ({
        ...prev,
        submit: errorMessage
      }));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Versión "Ya registrado"
  if (alreadyRegistered) {
    return (
      <div className="fixed inset-0 z-[10000] overflow-y-auto">
        <div 
          className="fixed inset-0 transition-opacity" 
          style={{
            background: 'linear-gradient(135deg, rgba(15, 28, 23, 0.95) 0%, rgba(26, 51, 43, 0.95) 100%)',
            backdropFilter: 'blur(15px)'
          }}
        />
        
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className="relative transform overflow-hidden rounded-2xl text-center max-w-md w-full"
            style={{
              background: 'linear-gradient(135deg, rgba(21, 40, 33, 0.95) 0%, rgba(26, 51, 43, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(193, 173, 72, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
            }}
          >
            <div
              className="h-0.5 opacity-60"
              style={{
                background: 'linear-gradient(90deg, transparent, #c1ad48, transparent)',
                animation: 'shimmer 3s ease-in-out infinite',
              }}
            />
            
            <div className="p-8">
              {/* Ícono de "ya existe" */}
              <div className="relative inline-block mb-6">
                <div 
                  className="absolute inset-0 rounded-full opacity-30"
                  style={{
                    background: 'radial-gradient(circle, rgba(193, 173, 72, 0.4), transparent 70%)',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                />
                <div 
                  className="relative w-20 h-20 rounded-full flex items-center justify-center mx-auto text-4xl"
                  style={{
                    background: 'rgba(193, 173, 72, 0.1)',
                    border: '2px solid rgba(193, 173, 72, 0.3)',
                    color: '#c1ad48'
                  }}
                >
                  ★
                </div>
              </div>
              
              <h3 
                className="text-2xl font-bold mb-3"
                style={{
                  background: 'linear-gradient(135deg, #c1ad48 0%, #d4bf5a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                {t.alreadyRegisteredTitle}
              </h3>
              
              <p className="text-gray-300 mb-4 leading-relaxed">
                {t.alreadyRegisteredMessage}
              </p>
              
              <div 
                className="inline-block px-6 py-3 rounded-lg mb-6"
                style={{
                  background: 'rgba(193, 173, 72, 0.1)',
                  border: '1px solid rgba(193, 173, 72, 0.2)',
                }}
              >
                <p className="text-sm text-gray-400">
                  📧 <span style={{color: '#c1ad48'}}>{formData.email}</span>
                </p>
              </div>
              
              <p className="text-gray-400 text-sm mb-6">
                {t.alreadyRegisteredNote}
              </p>
              
              <div 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium tracking-wider"
                style={{
                  background: 'rgba(193, 173, 72, 0.1)',
                  border: '1px solid rgba(193, 173, 72, 0.2)',
                  color: '#c1ad48'
                }}
              >
                <div className="w-2 h-2 rounded-full animate-pulse" style={{background: '#c1ad48'}}></div>
                <span>{t.redirecting}</span>
              </div>
            </div>
            
            <div
              className="h-px opacity-40"
              style={{
                background: 'linear-gradient(90deg, transparent, #c1ad48, transparent)',
                animation: 'shimmer 3s ease-in-out infinite reverse',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  // Versión exitosa (después de enviar)
  if (submitted) {
    return (
      <div className="fixed inset-0 z-[10000] overflow-y-auto">
        <div 
          className="fixed inset-0 transition-opacity" 
          style={{
            background: 'linear-gradient(135deg, rgba(15, 28, 23, 0.95) 0%, rgba(26, 51, 43, 0.95) 100%)',
            backdropFilter: 'blur(15px)'
          }}
        />
        
        <div className="flex min-h-full items-center justify-center p-4">
          <div 
            className="relative transform overflow-hidden rounded-2xl text-center max-w-md w-full"
            style={{
              background: 'linear-gradient(135deg, rgba(21, 40, 33, 0.95) 0%, rgba(26, 51, 43, 0.95) 100%)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(193, 173, 72, 0.2)',
              boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)'
            }}
          >
            <div
              className="h-0.5 opacity-60"
              style={{
                background: 'linear-gradient(90deg, transparent, #c1ad48, transparent)',
                animation: 'shimmer 3s ease-in-out infinite',
              }}
            />
            
            <div className="p-8">
              <div className="relative inline-block mb-6">
                <div 
                  className="absolute inset-0 rounded-full opacity-30"
                  style={{
                    background: 'radial-gradient(circle, rgba(193, 173, 72, 0.4), transparent 70%)',
                    animation: 'pulse 2s ease-in-out infinite'
                  }}
                />
                <div 
                  className="relative w-20 h-20 rounded-full flex items-center justify-center mx-auto text-4xl"
                  style={{
                    background: 'rgba(193, 173, 72, 0.1)',
                    border: '2px solid rgba(193, 173, 72, 0.3)',
                    color: '#c1ad48'
                  }}
                >
                  ✓
                </div>
              </div>
              
              <h3 
                className="text-2xl font-bold mb-3"
                style={{
                  background: 'linear-gradient(135deg, #c1ad48 0%, #d4bf5a 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  fontFamily: "'Inter', sans-serif"
                }}
              >
                {t.successTitle(formData.name.split(' ')[0])}
              </h3>
              
              <p className="text-gray-300 mb-6 leading-relaxed">
                {t.successMessage}
              </p>
              
              <div 
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium tracking-wider"
                style={{
                  background: 'rgba(193, 173, 72, 0.1)',
                  border: '1px solid rgba(193, 173, 72, 0.2)',
                  color: '#c1ad48'
                }}
              >
                <div className="w-2 h-2 rounded-full animate-pulse" style={{background: '#c1ad48'}}></div>
                <span>{t.redirecting}</span>
              </div>
            </div>
            
            <div
              className="h-px opacity-40"
              style={{
                background: 'linear-gradient(90deg, transparent, #c1ad48, transparent)',
                animation: 'shimmer 3s ease-in-out infinite reverse',
              }}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[10000] overflow-y-auto">
      <div 
        className="fixed inset-0 transition-opacity" 
        style={{
          background: 'linear-gradient(135deg, rgba(15, 28, 23, 0.97) 0%, rgba(26, 51, 43, 0.97) 100%)',
          backdropFilter: 'blur(15px)'
        }}
        onClick={onClose}
      />
      
      <div className="flex min-h-full items-center justify-center p-4">
        <div 
          className="relative transform overflow-hidden rounded-2xl max-w-md w-full"
          style={{
            background: 'linear-gradient(135deg, rgba(21, 40, 33, 0.98) 0%, rgba(26, 51, 43, 0.98) 100%)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(193, 173, 72, 0.2)',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)'
          }}
        >
          <div
            className="h-0.5 opacity-60"
            style={{
              background: 'linear-gradient(90deg, transparent, #c1ad48, transparent)',
              animation: 'shimmer 3s ease-in-out infinite',
            }}
          />
          
          <button
            onClick={() => setLanguage(language === 'en' ? 'es' : 'en')}
            className="absolute left-4 top-4 z-10 group"
            aria-label={language === 'en' ? "Cambiar a español" : "Switch to English"}
          >
            <div 
              className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                background: 'rgba(193, 173, 72, 0.08)',
                border: '2px solid rgba(193, 173, 72, 0.2)',
                color: '#c1ad48'
              }}
            >
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle, rgba(193, 173, 72, 0.15), transparent)'
                }}
              />
              <span className="relative text-sm font-medium">
                {language === 'en' ? 'ES' : 'EN'}
              </span>
            </div>
          </button>
          
          <button
            onClick={onClose}
            className="absolute right-4 top-4 z-10 group"
            aria-label={language === 'en' ? "Close" : "Cerrar"}
          >
            <div 
              className="relative w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
              style={{
                background: 'rgba(193, 173, 72, 0.08)',
                border: '2px solid rgba(193, 173, 72, 0.2)',
                color: '#c1ad48'
              }}
            >
              <div 
                className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{
                  background: 'radial-gradient(circle, rgba(193, 173, 72, 0.15), transparent)'
                }}
              />
              <span className="relative text-xl font-light">✕</span>
            </div>
          </button>

          <div className="p-8">
            <div className="text-center mb-8">
              <div className="relative inline-block mb-4">
                <div 
                  className="absolute -inset-4 rounded-full opacity-20"
                  style={{
                    background: 'radial-gradient(circle, rgba(193, 173, 72, 0.4), transparent 70%)'
                  }}
                />
                <img 
                  src="https://i.ibb.co/mFRJ8DWJ/Brutalist-Webzine-Blog-Post-Bold-Instagram-Post-Renaissance-CD-Cover-Art-2.png" 
                  alt="AKAHL CLUB"
                  className="h-16 mx-auto object-contain"
                />
              </div>
              
              <p className="text-gray-300 text-sm uppercase tracking-wider mb-2">
                {t.subtitle}
              </p>
              
              <p className="text-gray-400 text-sm mb-6">
                {t.description}
              </p>
              
              <div 
                className="w-24 h-px mx-auto mb-6"
                style={{
                  background: 'linear-gradient(90deg, transparent, #c1ad48, transparent)'
                }}
              />
            </div>

            <div className="space-y-3 mb-8">
              {t.benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div 
                    className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold mt-0.5"
                    style={{
                      background: 'rgba(193, 173, 72, 0.15)',
                      border: '1px solid rgba(193, 173, 72, 0.3)',
                      color: '#c1ad48'
                    }}
                  >
                    ✓
                  </div>
                  <span className="text-gray-300 text-sm">{benefit}</span>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 ${
                    errors.name 
                      ? 'border-red-500/50' 
                      : 'border-transparent'
                  }`}
                  style={{
                    background: 'rgba(15, 28, 23, 0.7)',
                    border: '1px solid',
                    borderColor: errors.name 
                      ? 'rgba(239, 68, 68, 0.5)' 
                      : 'rgba(193, 173, 72, 0.15)',
                    color: '#fff',
                    fontFamily: "'Inter', sans-serif"
                  }}
                  placeholder={t.form.name}
                />
                {errors.name && (
                  <p className="mt-2 text-sm text-red-400">{errors.name}</p>
                )}
              </div>

              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={`w-full px-4 py-3.5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 ${
                    errors.email 
                      ? 'border-red-500/50' 
                      : 'border-transparent'
                  }`}
                  style={{
                    background: 'rgba(15, 28, 23, 0.7)',
                    border: '1px solid',
                    borderColor: errors.email 
                      ? 'rgba(239, 68, 68, 0.5)' 
                      : 'rgba(193, 173, 72, 0.15)',
                    color: '#fff',
                    fontFamily: "'Inter', sans-serif"
                  }}
                  placeholder={t.form.email}
                />
                {errors.email && (
                  <p className="mt-2 text-sm text-red-400">{errors.email}</p>
                )}
              </div>

              <div className="flex gap-2">
                <div className="w-28">
                  <select
                    name="phoneCode"
                    value={formData.phoneCode}
                    onChange={handleChange}
                    className="w-full px-3 py-3.5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#c1ad48]/30"
                    style={{
                      background: 'rgba(15, 28, 23, 0.7)',
                      border: '1px solid rgba(193, 173, 72, 0.15)',
                      color: '#fff',
                      fontFamily: "'Inter', sans-serif"
                    }}
                  >
                    {phoneCodes.map((item) => (
                      <option key={item.code} value={item.dialCode} style={{background: '#152821'}}>
                        {item.flag} {item.dialCode}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex-1">
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#c1ad48]/30"
                    style={{
                      background: 'rgba(15, 28, 23, 0.7)',
                      border: '1px solid rgba(193, 173, 72, 0.15)',
                      color: '#fff',
                      fontFamily: "'Inter', sans-serif"
                    }}
                    placeholder={t.form.phone}
                  />
                </div>
              </div>
              {errors.phone && (
                <p className="mt-2 text-sm text-red-400">{errors.phone}</p>
              )}

              <div className="flex items-start gap-3 pt-2">
                <input
                  id="privacy"
                  type="checkbox"
                  required
                  className="mt-1.5 w-4 h-4 rounded transition-all duration-300"
                  style={{
                    background: 'rgba(15, 28, 23, 0.7)',
                    border: '1px solid rgba(193, 173, 72, 0.3)',
                    color: '#c1ad48'
                  }}
                />
                <label htmlFor="privacy" className="text-xs text-gray-400 leading-relaxed">
                  {t.privacyCheckbox}
                </label>
              </div>

              <div className="space-y-3 pt-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="group relative w-full py-4 rounded-full font-bold text-sm tracking-wider uppercase transition-all duration-400 hover:scale-[1.02]"
                  style={{
                    background: 'linear-gradient(135deg, #c1ad48 0%, #d4bf5a 50%, #c1ad48 100%)',
                    backgroundSize: '200% 100%',
                    color: '#152821',
                    boxShadow: '0 8px 30px rgba(193, 173, 72, 0.4)',
                    border: '1px solid rgba(193, 173, 72, 0.3)',
                    fontFamily: "'Inter', sans-serif",
                    fontWeight: 600
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
                  <span className="relative z-10">
                    {loading ? (language === 'en' ? 'Processing...' : 'Procesando...') : t.submitButton}
                  </span>
                  <div
                    className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-400"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), transparent)',
                    }}
                  />
                </button>
                
                <button
                  type="button"
                  onClick={onClose}
                  className="group relative w-full py-3.5 text-sm font-medium tracking-wide transition-all duration-300 hover:text-gray-200"
                  style={{
                    color: 'rgba(193, 173, 72, 0.8)'
                  }}
                >
                  <span className="relative z-10">
                    {t.cancelButton}
                  </span>
                  <div 
                    className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-px group-hover:w-24 transition-all duration-300"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(193, 173, 72, 0.5), transparent)'
                    }}
                  />
                </button>
              </div>
            </form>

            <p className="text-xs text-gray-500 text-center mt-8 pt-6 border-t border-gray-800/50">
              {t.privacyNote}
            </p>
          </div>

          <div
            className="h-px opacity-40"
            style={{
              background: 'linear-gradient(90deg, transparent, #c1ad48, transparent)',
              animation: 'shimmer 3s ease-in-out infinite reverse',
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default LeadCaptureModal;