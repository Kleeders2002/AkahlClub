// components/MembershipForm.jsx
import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { ChevronDown, Search } from 'lucide-react';
import TermsModal from './modals/TermsModal';
import PrivacyModal from './modals/PrivacyModal';

// Lista de países con banderas y códigos
const countries = [
  { code: 'AF', name: 'Afghanistan', flag: '🇦🇫', dialCode: '+93' },
  { code: 'AL', name: 'Albania', flag: '🇦🇱', dialCode: '+355' },
  { code: 'DZ', name: 'Algeria', flag: '🇩🇿', dialCode: '+213' },
  { code: 'AD', name: 'Andorra', flag: '🇦🇩', dialCode: '+376' },
  { code: 'AO', name: 'Angola', flag: '🇦🇴', dialCode: '+244' },
  { code: 'AG', name: 'Antigua and Barbuda', flag: '🇦🇬', dialCode: '+1' },
  { code: 'AR', name: 'Argentina', flag: '🇦🇷', dialCode: '+54' },
  { code: 'AM', name: 'Armenia', flag: '🇦🇲', dialCode: '+374' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', dialCode: '+61' },
  { code: 'AT', name: 'Austria', flag: '🇦🇹', dialCode: '+43' },
  { code: 'AZ', name: 'Azerbaijan', flag: '🇦🇿', dialCode: '+994' },
  { code: 'BS', name: 'Bahamas', flag: '🇧🇸', dialCode: '+1' },
  { code: 'BH', name: 'Bahrain', flag: '🇧🇭', dialCode: '+973' },
  { code: 'BD', name: 'Bangladesh', flag: '🇧🇩', dialCode: '+880' },
  { code: 'BB', name: 'Barbados', flag: '🇧🇧', dialCode: '+1' },
  { code: 'BY', name: 'Belarus', flag: '🇧🇾', dialCode: '+375' },
  { code: 'BE', name: 'Belgium', flag: '🇧🇪', dialCode: '+32' },
  { code: 'BZ', name: 'Belize', flag: '🇧🇿', dialCode: '+501' },
  { code: 'BJ', name: 'Benin', flag: '🇧🇯', dialCode: '+229' },
  { code: 'BT', name: 'Bhutan', flag: '🇧🇹', dialCode: '+975' },
  { code: 'BO', name: 'Bolivia', flag: '🇧🇴', dialCode: '+591' },
  { code: 'BA', name: 'Bosnia and Herzegovina', flag: '🇧🇦', dialCode: '+387' },
  { code: 'BW', name: 'Botswana', flag: '🇧🇼', dialCode: '+267' },
  { code: 'BR', name: 'Brazil', flag: '🇧🇷', dialCode: '+55' },
  { code: 'BN', name: 'Brunei', flag: '🇧🇳', dialCode: '+673' },
  { code: 'BG', name: 'Bulgaria', flag: '🇧🇬', dialCode: '+359' },
  { code: 'BF', name: 'Burkina Faso', flag: '🇧🇫', dialCode: '+226' },
  { code: 'BI', name: 'Burundi', flag: '🇧🇮', dialCode: '+257' },
  { code: 'KH', name: 'Cambodia', flag: '🇰🇭', dialCode: '+855' },
  { code: 'CM', name: 'Cameroon', flag: '🇨🇲', dialCode: '+237' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', dialCode: '+1' },
  { code: 'CV', name: 'Cape Verde', flag: '🇨🇻', dialCode: '+238' },
  { code: 'CF', name: 'Central African Republic', flag: '🇨🇫', dialCode: '+236' },
  { code: 'TD', name: 'Chad', flag: '🇹🇩', dialCode: '+235' },
  { code: 'CL', name: 'Chile', flag: '🇨🇱', dialCode: '+56' },
  { code: 'CN', name: 'China', flag: '🇨🇳', dialCode: '+86' },
  { code: 'CO', name: 'Colombia', flag: '🇨🇴', dialCode: '+57' },
  { code: 'KM', name: 'Comoros', flag: '🇰🇲', dialCode: '+269' },
  { code: 'CG', name: 'Congo', flag: '🇨🇬', dialCode: '+242' },
  { code: 'CD', name: 'Congo (DRC)', flag: '🇨🇩', dialCode: '+243' },
  { code: 'CR', name: 'Costa Rica', flag: '🇨🇷', dialCode: '+506' },
  { code: 'HR', name: 'Croatia', flag: '🇭🇷', dialCode: '+385' },
  { code: 'CU', name: 'Cuba', flag: '🇨🇺', dialCode: '+53' },
  { code: 'CY', name: 'Cyprus', flag: '🇨🇾', dialCode: '+357' },
  { code: 'CZ', name: 'Czech Republic', flag: '🇨🇿', dialCode: '+420' },
  { code: 'DK', name: 'Denmark', flag: '🇩🇰', dialCode: '+45' },
  { code: 'DJ', name: 'Djibouti', flag: '🇩🇯', dialCode: '+253' },
  { code: 'DM', name: 'Dominica', flag: '🇩🇲', dialCode: '+1' },
  { code: 'DO', name: 'Dominican Republic', flag: '🇩🇴', dialCode: '+1' },
  { code: 'EC', name: 'Ecuador', flag: '🇪🇨', dialCode: '+593' },
  { code: 'EG', name: 'Egypt', flag: '🇪🇬', dialCode: '+20' },
  { code: 'SV', name: 'El Salvador', flag: '🇸🇻', dialCode: '+503' },
  { code: 'GQ', name: 'Equatorial Guinea', flag: '🇬🇶', dialCode: '+240' },
  { code: 'ER', name: 'Eritrea', flag: '🇪🇷', dialCode: '+291' },
  { code: 'EE', name: 'Estonia', flag: '🇪🇪', dialCode: '+372' },
  { code: 'SZ', name: 'Eswatini', flag: '🇸🇿', dialCode: '+268' },
  { code: 'ET', name: 'Ethiopia', flag: '🇪🇹', dialCode: '+251' },
  { code: 'FJ', name: 'Fiji', flag: '🇫🇯', dialCode: '+679' },
  { code: 'FI', name: 'Finland', flag: '🇫🇮', dialCode: '+358' },
  { code: 'FR', name: 'France', flag: '🇫🇷', dialCode: '+33' },
  { code: 'GA', name: 'Gabon', flag: '🇬🇦', dialCode: '+241' },
  { code: 'GM', name: 'Gambia', flag: '🇬🇲', dialCode: '+220' },
  { code: 'GE', name: 'Georgia', flag: '🇬🇪', dialCode: '+995' },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', dialCode: '+49' },
  { code: 'GH', name: 'Ghana', flag: '🇬🇭', dialCode: '+233' },
  { code: 'GR', name: 'Greece', flag: '🇬🇷', dialCode: '+30' },
  { code: 'GD', name: 'Grenada', flag: '🇬🇩', dialCode: '+1' },
  { code: 'GT', name: 'Guatemala', flag: '🇬🇹', dialCode: '+502' },
  { code: 'GN', name: 'Guinea', flag: '🇬🇳', dialCode: '+224' },
  { code: 'GW', name: 'Guinea-Bissau', flag: '🇬🇼', dialCode: '+245' },
  { code: 'GY', name: 'Guyana', flag: '🇬🇾', dialCode: '+592' },
  { code: 'HT', name: 'Haiti', flag: '🇭🇹', dialCode: '+509' },
  { code: 'HN', name: 'Honduras', flag: '🇭🇳', dialCode: '+504' },
  { code: 'HU', name: 'Hungary', flag: '🇭🇺', dialCode: '+36' },
  { code: 'IS', name: 'Iceland', flag: '🇮🇸', dialCode: '+354' },
  { code: 'IN', name: 'India', flag: '🇮🇳', dialCode: '+91' },
  { code: 'ID', name: 'Indonesia', flag: '🇮🇩', dialCode: '+62' },
  { code: 'IR', name: 'Iran', flag: '🇮🇷', dialCode: '+98' },
  { code: 'IQ', name: 'Iraq', flag: '🇮🇶', dialCode: '+964' },
  { code: 'IE', name: 'Ireland', flag: '🇮🇪', dialCode: '+353' },
  { code: 'IL', name: 'Israel', flag: '🇮🇱', dialCode: '+972' },
  { code: 'IT', name: 'Italy', flag: '🇮🇹', dialCode: '+39' },
  { code: 'CI', name: 'Ivory Coast', flag: '🇨🇮', dialCode: '+225' },
  { code: 'JM', name: 'Jamaica', flag: '🇯🇲', dialCode: '+1' },
  { code: 'JP', name: 'Japan', flag: '🇯🇵', dialCode: '+81' },
  { code: 'JO', name: 'Jordan', flag: '🇯🇴', dialCode: '+962' },
  { code: 'KZ', name: 'Kazakhstan', flag: '🇰🇿', dialCode: '+7' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', dialCode: '+254' },
  { code: 'KI', name: 'Kiribati', flag: '🇰🇮', dialCode: '+686' },
  { code: 'KW', name: 'Kuwait', flag: '🇰🇼', dialCode: '+965' },
  { code: 'KG', name: 'Kyrgyzstan', flag: '🇰🇬', dialCode: '+996' },
  { code: 'LA', name: 'Laos', flag: '🇱🇦', dialCode: '+856' },
  { code: 'LV', name: 'Latvia', flag: '🇱🇻', dialCode: '+371' },
  { code: 'LB', name: 'Lebanon', flag: '🇱🇧', dialCode: '+961' },
  { code: 'LS', name: 'Lesotho', flag: '🇱🇸', dialCode: '+266' },
  { code: 'LR', name: 'Liberia', flag: '🇱🇷', dialCode: '+231' },
  { code: 'LY', name: 'Libya', flag: '🇱🇾', dialCode: '+218' },
  { code: 'LI', name: 'Liechtenstein', flag: '🇱🇮', dialCode: '+423' },
  { code: 'LT', name: 'Lithuania', flag: '🇱🇹', dialCode: '+370' },
  { code: 'LU', name: 'Luxembourg', flag: '🇱🇺', dialCode: '+352' },
  { code: 'MG', name: 'Madagascar', flag: '🇲🇬', dialCode: '+261' },
  { code: 'MW', name: 'Malawi', flag: '🇲🇼', dialCode: '+265' },
  { code: 'MY', name: 'Malaysia', flag: '🇲🇾', dialCode: '+60' },
  { code: 'MV', name: 'Maldives', flag: '🇲🇻', dialCode: '+960' },
  { code: 'ML', name: 'Mali', flag: '🇲🇱', dialCode: '+223' },
  { code: 'MT', name: 'Malta', flag: '🇲🇹', dialCode: '+356' },
  { code: 'MH', name: 'Marshall Islands', flag: '🇲🇭', dialCode: '+692' },
  { code: 'MR', name: 'Mauritania', flag: '🇲🇷', dialCode: '+222' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', dialCode: '+230' },
  { code: 'MX', name: 'Mexico', flag: '🇲🇽', dialCode: '+52' },
  { code: 'FM', name: 'Micronesia', flag: '🇫🇲', dialCode: '+691' },
  { code: 'MD', name: 'Moldova', flag: '🇲🇩', dialCode: '+373' },
  { code: 'MC', name: 'Monaco', flag: '🇲🇨', dialCode: '+377' },
  { code: 'MN', name: 'Mongolia', flag: '🇲🇳', dialCode: '+976' },
  { code: 'ME', name: 'Montenegro', flag: '🇲🇪', dialCode: '+382' },
  { code: 'MA', name: 'Morocco', flag: '🇲🇦', dialCode: '+212' },
  { code: 'MZ', name: 'Mozambique', flag: '🇲🇿', dialCode: '+258' },
  { code: 'MM', name: 'Myanmar', flag: '🇲🇲', dialCode: '+95' },
  { code: 'NA', name: 'Namibia', flag: '🇳🇦', dialCode: '+264' },
  { code: 'NR', name: 'Nauru', flag: '🇳🇷', dialCode: '+674' },
  { code: 'NP', name: 'Nepal', flag: '🇳🇵', dialCode: '+977' },
  { code: 'NL', name: 'Netherlands', flag: '🇳🇱', dialCode: '+31' },
  { code: 'NZ', name: 'New Zealand', flag: '🇳🇿', dialCode: '+64' },
  { code: 'NI', name: 'Nicaragua', flag: '🇳🇮', dialCode: '+505' },
  { code: 'NE', name: 'Niger', flag: '🇳🇪', dialCode: '+227' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', dialCode: '+234' },
  { code: 'KP', name: 'North Korea', flag: '🇰🇵', dialCode: '+850' },
  { code: 'MK', name: 'North Macedonia', flag: '🇲🇰', dialCode: '+389' },
  { code: 'NO', name: 'Norway', flag: '🇳🇴', dialCode: '+47' },
  { code: 'OM', name: 'Oman', flag: '🇴🇲', dialCode: '+968' },
  { code: 'PK', name: 'Pakistan', flag: '🇵🇰', dialCode: '+92' },
  { code: 'PW', name: 'Palau', flag: '🇵🇼', dialCode: '+680' },
  { code: 'PS', name: 'Palestine', flag: '🇵🇸', dialCode: '+970' },
  { code: 'PA', name: 'Panama', flag: '🇵🇦', dialCode: '+507' },
  { code: 'PG', name: 'Papua New Guinea', flag: '🇵🇬', dialCode: '+675' },
  { code: 'PY', name: 'Paraguay', flag: '🇵🇾', dialCode: '+595' },
  { code: 'PE', name: 'Peru', flag: '🇵🇪', dialCode: '+51' },
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', dialCode: '+63' },
  { code: 'PL', name: 'Poland', flag: '🇵🇱', dialCode: '+48' },
  { code: 'PT', name: 'Portugal', flag: '🇵🇹', dialCode: '+351' },
  { code: 'PR', name: 'Puerto Rico', flag: '🇵🇷', dialCode: '+1' },
  { code: 'QA', name: 'Qatar', flag: '🇶🇦', dialCode: '+974' },
  { code: 'RO', name: 'Romania', flag: '🇷🇴', dialCode: '+40' },
  { code: 'RU', name: 'Russia', flag: '🇷🇺', dialCode: '+7' },
  { code: 'RW', name: 'Rwanda', flag: '🇷🇼', dialCode: '+250' },
  { code: 'KN', name: 'Saint Kitts and Nevis', flag: '🇰🇳', dialCode: '+1' },
  { code: 'LC', name: 'Saint Lucia', flag: '🇱🇨', dialCode: '+1' },
  { code: 'VC', name: 'Saint Vincent and the Grenadines', flag: '🇻🇨', dialCode: '+1' },
  { code: 'WS', name: 'Samoa', flag: '🇼🇸', dialCode: '+685' },
  { code: 'SM', name: 'San Marino', flag: '🇸🇲', dialCode: '+378' },
  { code: 'ST', name: 'Sao Tome and Principe', flag: '🇸🇹', dialCode: '+239' },
  { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', dialCode: '+966' },
  { code: 'SN', name: 'Senegal', flag: '🇸🇳', dialCode: '+221' },
  { code: 'RS', name: 'Serbia', flag: '🇷🇸', dialCode: '+381' },
  { code: 'SC', name: 'Seychelles', flag: '🇸🇨', dialCode: '+248' },
  { code: 'SL', name: 'Sierra Leone', flag: '🇸🇱', dialCode: '+232' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', dialCode: '+65' },
  { code: 'SK', name: 'Slovakia', flag: '🇸🇰', dialCode: '+421' },
  { code: 'SI', name: 'Slovenia', flag: '🇸🇮', dialCode: '+386' },
  { code: 'SB', name: 'Solomon Islands', flag: '🇸🇧', dialCode: '+677' },
  { code: 'SO', name: 'Somalia', flag: '🇸🇴', dialCode: '+252' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', dialCode: '+27' },
  { code: 'KR', name: 'South Korea', flag: '🇰🇷', dialCode: '+82' },
  { code: 'SS', name: 'South Sudan', flag: '🇸🇸', dialCode: '+211' },
  { code: 'ES', name: 'Spain', flag: '🇪🇸', dialCode: '+34' },
  { code: 'LK', name: 'Sri Lanka', flag: '🇱🇰', dialCode: '+94' },
  { code: 'SD', name: 'Sudan', flag: '🇸🇩', dialCode: '+249' },
  { code: 'SR', name: 'Suriname', flag: '🇸🇷', dialCode: '+597' },
  { code: 'SE', name: 'Sweden', flag: '🇸🇪', dialCode: '+46' },
  { code: 'CH', name: 'Switzerland', flag: '🇨🇭', dialCode: '+41' },
  { code: 'SY', name: 'Syria', flag: '🇸🇾', dialCode: '+963' },
  { code: 'TW', name: 'Taiwan', flag: '🇹🇼', dialCode: '+886' },
  { code: 'TJ', name: 'Tajikistan', flag: '🇹🇯', dialCode: '+992' },
  { code: 'TZ', name: 'Tanzania', flag: '🇹🇿', dialCode: '+255' },
  { code: 'TH', name: 'Thailand', flag: '🇹🇭', dialCode: '+66' },
  { code: 'TL', name: 'Timor-Leste', flag: '🇹🇱', dialCode: '+670' },
  { code: 'TG', name: 'Togo', flag: '🇹🇬', dialCode: '+228' },
  { code: 'TO', name: 'Tonga', flag: '🇹🇴', dialCode: '+676' },
  { code: 'TT', name: 'Trinidad and Tobago', flag: '🇹🇹', dialCode: '+1' },
  { code: 'TN', name: 'Tunisia', flag: '🇹🇳', dialCode: '+216' },
  { code: 'TR', name: 'Turkey', flag: '🇹🇷', dialCode: '+90' },
  { code: 'TM', name: 'Turkmenistan', flag: '🇹🇲', dialCode: '+993' },
  { code: 'TV', name: 'Tuvalu', flag: '🇹🇻', dialCode: '+688' },
  { code: 'UG', name: 'Uganda', flag: '🇺🇬', dialCode: '+256' },
  { code: 'UA', name: 'Ukraine', flag: '🇺🇦', dialCode: '+380' },
  { code: 'AE', name: 'United Arab Emirates', flag: '🇦🇪', dialCode: '+971' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', dialCode: '+44' },
  { code: 'US', name: 'United States', flag: '🇺🇸', dialCode: '+1' },
  { code: 'UY', name: 'Uruguay', flag: '🇺🇾', dialCode: '+598' },
  { code: 'UZ', name: 'Uzbekistan', flag: '🇺🇿', dialCode: '+998' },
  { code: 'VU', name: 'Vanuatu', flag: '🇻🇺', dialCode: '+678' },
  { code: 'VA', name: 'Vatican City', flag: '🇻🇦', dialCode: '+39' },
  { code: 'VE', name: 'Venezuela', flag: '🇻🇪', dialCode: '+58' },
  { code: 'VN', name: 'Vietnam', flag: '🇻🇳', dialCode: '+84' },
  { code: 'YE', name: 'Yemen', flag: '🇾🇪', dialCode: '+967' },
  { code: 'ZM', name: 'Zambia', flag: '🇿🇲', dialCode: '+260' },
  { code: 'ZW', name: 'Zimbabwe', flag: '🇿🇼', dialCode: '+263' }
];

const MembershipForm = () => {
  const { t } = useTranslation();
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(() => {
    return countries[0];
  });
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    stylePreference: '', // Moved before membership plan
    membershipPlan: 'PLATA',
    comments: '',
    acceptedTerms: false
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const countryDropdownRef = React.useRef(null);
  const searchInputRef = React.useRef(null);

  // Opciones de preferencia de estilo - Sin emojis
  const styleOptions = [
    { id: 'old-money', label: t('form.stylePreference.oldMoney', 'Old Money'), description: t('form.stylePreference.oldMoneyDesc', 'Elegant, conservative and timeless') },
    { id: 'classic', label: t('form.stylePreference.classic', 'Classic'), description: t('form.stylePreference.classicDesc', 'Traditional and sophisticated') },
    { id: 'modern', label: t('form.stylePreference.modern', 'Modern'), description: t('form.stylePreference.modernDesc', 'Contemporary and current') },
  ];

  // Filtrar países basados en la búsqueda
  const filteredCountries = countries.filter(country =>
    country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    country.dialCode.includes(searchQuery)
  );

  // Cerrar dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (countryDropdownRef.current && !countryDropdownRef.current.contains(event.target)) {
        setShowCountryDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Enfocar el input de búsqueda cuando se abre el dropdown
  useEffect(() => {
    if (showCountryDropdown && searchInputRef.current) {
      setTimeout(() => {
        searchInputRef.current.focus();
      }, 100);
    }
  }, [showCountryDropdown]);

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
    setShowCountryDropdown(false);
    setSearchQuery('');
  };

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    setFormData(prev => ({
      ...prev,
      phone: value
    }));
    if (errors.phone) {
      setErrors(prev => ({ ...prev, phone: '' }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Función para manejar la selección de preferencia de estilo
  const handleStyleSelect = (style) => {
    setFormData(prev => ({
      ...prev,
      stylePreference: style
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.firstName.trim()) {
      newErrors.firstName = t('form.errors.firstName');
    }
    
    if (!formData.lastName.trim()) {
      newErrors.lastName = t('form.errors.lastName');
    }
    
    if (!formData.email.trim()) {
      newErrors.email = t('form.errors.emailRequired');
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('form.errors.emailInvalid');
    }
    
    if (!formData.phone.trim()) {
      newErrors.phone = t('form.errors.phoneRequired');
    } else if (formData.phone.replace(/\D/g, '').length < 7) {
      newErrors.phone = t('form.errors.phoneInvalid');
    }
    
    if (!formData.acceptedTerms) {
      newErrors.acceptedTerms = t('form.errors.termsRequired');
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const formatPhoneNumber = (phoneNumber) => {
    if (!phoneNumber) return '';
    const cleaned = phoneNumber.replace(/\D/g, '');
    
    // Formato basado en la longitud
    if (cleaned.length <= 3) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
    if (cleaned.length <= 10) return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
    return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6, 10)} ${cleaned.slice(10, 15)}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);
    
    try {
      // Aquí va la conexión con tu backend
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/auth/register';
      
      const fullPhoneNumber = `${selectedCountry.dialCode}${formData.phone}`;
      
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          nombre: `${formData.firstName} ${formData.lastName}`,
          telefono: fullPhoneNumber,
          pais: selectedCountry.code,
          estilo_preferencia: formData.stylePreference,
          plan: formData.membershipPlan,
          comentarios: formData.comments
        })
      });
      
      const data = await response.json();
      
      if (data.success) {
        setSubmitStatus({ 
          type: 'success', 
          message: t('form.success.message') 
        });
        
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          stylePreference: '',
          membershipPlan: 'PLATA',
          comments: '',
          acceptedTerms: false
        });
        
        // Si requiere pago, redirigir
        if (data.requiresPayment && data.checkoutUrl) {
          setTimeout(() => {
            window.location.href = data.checkoutUrl;
          }, 2000);
        }
      } else {
        throw new Error(data.message || t('form.errors.submissionFailed'));
      }
    } catch (error) {
      setSubmitStatus({ 
        type: 'error', 
        message: error.message || t('form.errors.connectionFailed') 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="membership-form" className="relative min-h-screen py-20 md:py-28 px-4 md:px-8 lg:px-16 xl:px-20 flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1594744803329-e58b31de8bf5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-dark-green/95 via-dark-green/92 to-dark-green/90"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_10%_20%,rgba(193,173,72,0.08)_0%,transparent_50%),radial-gradient(circle_at_90%_80%,rgba(193,173,72,0.05)_0%,transparent_50%)]"></div>
      </div>

      {/* Form Container */}
      <div className="relative z-10 max-w-2xl w-full bg-dark-green/95 backdrop-blur-lg rounded-2xl md:rounded-3xl p-6 md:p-8 lg:p-12 border border-gold/20 shadow-2xl">
        {/* Header */}
        <div className="text-center mb-8 md:mb-12">
          <h2 className="font-cormorant text-3xl md:text-4xl lg:text-5xl font-semibold text-white mb-4">
            {t('form.title')}
          </h2>
          
          <p className="font-cormorant text-base md:text-lg text-white/80 leading-relaxed max-w-xl mx-auto">
            {t('form.subtitle')}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block font-montserrat text-sm font-semibold text-gold mb-2 uppercase tracking-wider">
                {t('form.labels.firstName')}
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-dark-green/80 border ${errors.firstName ? 'border-red-500' : 'border-gold/30'} rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300`}
                placeholder={t('form.placeholders.firstName')}
              />
              {errors.firstName && (
                <p className="mt-2 text-sm text-red-400">{errors.firstName}</p>
              )}
            </div>
            
            <div>
              <label className="block font-montserrat text-sm font-semibold text-gold mb-2 uppercase tracking-wider">
                {t('form.labels.lastName')}
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-dark-green/80 border ${errors.lastName ? 'border-red-500' : 'border-gold/30'} rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300`}
                placeholder={t('form.placeholders.lastName')}
              />
              {errors.lastName && (
                <p className="mt-2 text-sm text-red-400">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block font-montserrat text-sm font-semibold text-gold mb-2 uppercase tracking-wider">
              {t('form.labels.email')}
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-dark-green/80 border ${errors.email ? 'border-red-500' : 'border-gold/30'} rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300`}
              placeholder={t('form.placeholders.email')}
            />
            {errors.email && (
              <p className="mt-2 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          {/* Phone with Country Selector */}
          <div>
            <label className="block font-montserrat text-sm font-semibold text-gold mb-2 uppercase tracking-wider">
              {t('form.labels.phone')}
            </label>
            
            <div className="flex gap-2">
              {/* Country Selector Button */}
              <div className="relative flex-shrink-0" ref={countryDropdownRef}>
                <button
                  type="button"
                  onClick={() => setShowCountryDropdown(!showCountryDropdown)}
                  className="flex items-center gap-2 px-3 py-3 bg-dark-green/80 border border-gold/30 rounded-lg hover:bg-dark-green/90 transition-all duration-300 whitespace-nowrap"
                >
                  <span className="text-lg">{selectedCountry.flag}</span>
                  <span className="font-montserrat text-sm text-white">
                    {selectedCountry.dialCode}
                  </span>
                  <ChevronDown className={`w-4 h-4 text-gold transition-transform duration-300 ${showCountryDropdown ? 'rotate-180' : ''}`} />
                </button>

                {/* Country Dropdown */}
                {showCountryDropdown && (
                  <div className="absolute top-full left-0 mt-2 w-72 bg-dark-green border border-gold/30 rounded-lg shadow-2xl z-50 max-h-96 overflow-hidden">
                    {/* Search Input */}
                    <div className="p-3 border-b border-gold/20">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gold/70" />
                        <input
                          ref={searchInputRef}
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder={t('form.phoneSearch', 'Buscar país...')}
                          className="w-full pl-10 pr-4 py-2 bg-dark-green/80 border border-gold/20 rounded-lg text-white placeholder-white/40 text-sm focus:outline-none focus:border-gold"
                        />
                      </div>
                    </div>

                    {/* Country List */}
                    <div className="overflow-y-auto max-h-64">
                      {filteredCountries.length > 0 ? (
                        filteredCountries.map((country) => (
                          <button
                            key={country.code}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className={`w-full flex items-center justify-between px-4 py-3 hover:bg-dark-green/80 transition-colors duration-200 ${selectedCountry.code === country.code ? 'bg-gold/20' : ''}`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="text-xl">{country.flag}</span>
                              <span className="font-montserrat text-sm text-white text-left">
                                {country.name}
                              </span>
                            </div>
                            <span className="font-montserrat text-sm text-gold">
                              {country.dialCode}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-4 py-3 text-center text-white/60 text-sm">
                          {t('form.noCountries', 'No se encontraron países')}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Phone Input */}
              <div className="flex-grow">
                <input
                  type="tel"
                  name="phone"
                  value={formatPhoneNumber(formData.phone)}
                  onChange={handlePhoneChange}
                  className={`w-full px-4 py-3 bg-dark-green/80 border ${errors.phone ? 'border-red-500' : 'border-gold/30'} rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300`}
                  placeholder={t('form.placeholders.phone')}
                />
                {errors.phone && (
                  <p className="mt-2 text-sm text-red-400">{errors.phone}</p>
                )}
                <p className="mt-1 text-xs text-white/60">
                  {t('form.phoneFormat', 'Número completo:')} {selectedCountry.dialCode} {formatPhoneNumber(formData.phone)}
                </p>
              </div>
            </div>
          </div>

          {/* Style Preference (Now before Membership Plan) */}
<div>
  <label className="block font-montserrat text-sm font-semibold text-gold mb-3 uppercase tracking-wider">
    {t('form.labels.stylePreference', 'Tu preferencia de estilo (Opcional)')}
  </label>
  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
    {styleOptions.map((style) => (
      <button
        key={style.id}
        type="button"
        onClick={() => handleStyleSelect(formData.stylePreference === style.label ? '' : style.label)}
        className={`relative p-4 bg-dark-green/60 border-2 rounded-xl transition-all duration-300 flex flex-col items-center justify-center ${
          formData.stylePreference === style.label 
            ? 'border-gold shadow-lg shadow-gold/40 scale-105 bg-dark-green/80' 
            : 'border-gold/30 hover:border-gold/60'
        }`}
      >
        {/* Selected indicator */}
        {formData.stylePreference === style.label && (
          <div className="absolute -top-3 -right-3 bg-gold text-dark-green rounded-full p-2 shadow-lg animate-scale-in">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
        )}
        
        <span className="font-montserrat font-bold text-white text-sm mb-1">
          {style.label}
        </span>
        <span className="font-montserrat text-xs text-white/70 text-center">
          {style.description}
        </span>
      </button>
    ))}
  </div>
  <p className="mt-2 text-xs text-white/60 text-center">
    {t('form.stylePreference.description', 'Selecciona el estilo que más se identifica contigo. Esta información nos ayuda a personalizar tu experiencia.')}
    <span className="block mt-1 text-gold/80">
      {t('form.stylePreference.hint', 'Haz clic nuevamente para deseleccionar')}
    </span>
  </p>
</div>

<style jsx>{`
  @keyframes scale-in {
    0% {
      transform: scale(0) rotate(-180deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.2) rotate(0deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }
  
  .animate-scale-in {
    animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`}</style>

          {/* Membership Plan */}
<div>
  <label className="block font-montserrat text-sm font-semibold text-gold mb-3 uppercase tracking-wider">
    {t('form.labels.membership')}
  </label>
  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
    {/* Silver Plan */}
    <label className="cursor-pointer relative">
      <input
        type="radio"
        name="membershipPlan"
        value="PLATA"
        checked={formData.membershipPlan === 'PLATA'}
        onChange={handleChange}
        className="hidden"
      />
      
      <div className={`relative p-4 bg-gradient-to-br from-dark-green/80 via-dark-green/60 to-dark-green/80 border-2 rounded-xl transition-all duration-300 ${
        formData.membershipPlan === 'PLATA' 
          ? 'border-gold shadow-lg shadow-gold/40 scale-105' 
          : 'border-gold/30 hover:border-gold/60'
      }`}>
        
        {/* Selected indicator */}
        {formData.membershipPlan === 'PLATA' && (
          <div className="absolute -top-3 -right-3 bg-gold text-dark-green rounded-full p-2 shadow-lg animate-scale-in">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
        )}
        
        <div className="flex justify-between items-center mb-3 relative z-10">
          <span className="font-montserrat font-bold text-white text-lg">
            {t('form.plans.silver.title')}
          </span>
          <span className="font-montserrat font-bold text-gold text-xl">
            $9.99
          </span>
        </div>
        
        <ul className="space-y-2 text-sm text-white/90 relative z-10">
          <li className="flex items-center">
            <span className="mr-2 text-gold text-lg">✓</span>
            <span>{t('form.plans.silver.feature1')}</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-gold text-lg">✓</span>
            <span>{t('form.plans.silver.feature2')}</span>
          </li>
          <li className="flex items-center">
            <span className="mr-2 text-gold text-lg">✓</span>
            <span>{t('form.plans.silver.feature3')}</span>
          </li>
        </ul>
      </div>
    </label>
    
    {/* Gold Plan */}
    <label className="cursor-pointer relative">
      <input
        type="radio"
        name="membershipPlan"
        value="ORO"
        checked={formData.membershipPlan === 'ORO'}
        onChange={handleChange}
        className="hidden"
      />
      
      {/* Enhanced glow effect for gold */}
      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-gold via-yellow-300 to-gold opacity-0 hover:opacity-20 blur-xl transition-opacity duration-500"></div>
      
      <div className={`relative p-4 bg-gradient-to-br from-dark-green/80 via-dark-green/60 to-dark-green/80 border-2 rounded-xl overflow-hidden group transition-all duration-300 ${
        formData.membershipPlan === 'ORO' 
          ? 'border-gold shadow-2xl shadow-gold/50 scale-105' 
          : 'border-gold/50 hover:border-gold hover:shadow-2xl hover:shadow-gold/30'
      }`}>
        
        {/* Selected indicator */}
        {formData.membershipPlan === 'ORO' && (
          <div className="absolute -top-3 -right-3 bg-gold text-dark-green rounded-full p-2 shadow-lg animate-scale-in">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
            </svg>
          </div>
        )}
        
        {/* Animated shine effect */}
        <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        
        <div className="flex justify-between items-center mb-3 relative z-10">
          <span className="font-montserrat font-bold text-white text-lg group-hover:text-gold transition-colors duration-300">
            {t('form.plans.gold.title')}
          </span>
          <span className="font-montserrat font-bold text-gold text-xl group-hover:scale-110 transition-transform duration-300">
            $19.99
          </span>
        </div>
        
        <ul className="space-y-2 text-sm text-white/90 relative z-10">
          <li className="flex items-center group/item hover:translate-x-1 transition-transform duration-200">
            <span className="mr-2 text-gold text-lg animate-pulse">✦</span>
            <span className="group-hover/item:text-white transition-colors duration-200">
              {t('form.plans.gold.feature1')}
            </span>
          </li>
          <li className="flex items-center group/item hover:translate-x-1 transition-transform duration-200">
            <span className="mr-2 text-gold text-lg animate-pulse" style={{animationDelay: '0.2s'}}>✦</span>
            <span className="group-hover/item:text-white transition-colors duration-200">
              {t('form.plans.gold.feature2')}
            </span>
          </li>
          <li className="flex items-center group/item hover:translate-x-1 transition-transform duration-200">
            <span className="mr-2 text-gold text-lg animate-pulse" style={{animationDelay: '0.4s'}}>✦</span>
            <span className="group-hover/item:text-white transition-colors duration-200">
              {t('form.plans.gold.feature3')}
            </span>
          </li>
        </ul>
      </div>
    </label>
  </div>
</div>

<style jsx>{`
  @keyframes scale-in {
    0% {
      transform: scale(0) rotate(-180deg);
      opacity: 0;
    }
    50% {
      transform: scale(1.2) rotate(0deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
      opacity: 1;
    }
  }
  
  .animate-scale-in {
    animation: scale-in 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  }
`}</style>

          {/* Comments */}
          <div>
            <label className="block font-montserrat text-sm font-semibold text-gold mb-2 uppercase tracking-wider">
              {t('form.labels.comments')}
            </label>
            <textarea
              name="comments"
              value={formData.comments}
              onChange={handleChange}
              rows="4"
              className="w-full px-4 py-3 bg-dark-green/80 border border-gold/30 rounded-lg text-white placeholder-white/40 focus:outline-none focus:border-gold focus:ring-2 focus:ring-gold/20 transition-all duration-300 resize-none"
              placeholder={t('form.placeholders.comments')}
            />
          </div>

          {/* Terms Checkbox */}
          <div className={`p-4 bg-dark-green/60 border ${errors.acceptedTerms ? 'border-red-500' : 'border-gold/20'} rounded-xl transition-all duration-300`}>
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={handleChange}
                className="mt-1 w-5 h-5 bg-dark-green border-2 border-gold/50 rounded focus:ring-gold focus:ring-offset-0 focus:ring-2"
              />
              <span className="font-montserrat text-sm text-white/90 leading-relaxed">
                {t('form.terms.text')}
                <button
                  type="button"
                  onClick={() => setShowTermsModal(true)}
                  className="text-gold hover:text-gold/80 underline transition-colors duration-300"
                >
                  {t('form.terms.terms')}
                </button>
                {t('form.terms.and')}
                <button
                  type="button"
                  onClick={() => setShowPrivacyModal(true)}
                  className="text-gold hover:text-gold/80 underline transition-colors duration-300"
                >
                  {t('form.terms.privacy')}
                </button>
                {t('form.terms.suffix')}
              </span>
            </label>
            {errors.acceptedTerms && (
              <p className="mt-2 text-sm text-red-400">{errors.acceptedTerms}</p>
            )}
          </div>

          {/* Submit Status */}
          {submitStatus && (
            <div className={`p-4 rounded-lg ${submitStatus.type === 'success' ? 'bg-green-500/20 border border-green-500/30' : 'bg-red-500/20 border border-red-500/30'}`}>
              <p className={`font-montserrat text-sm ${submitStatus.type === 'success' ? 'text-green-400' : 'text-red-400'}`}>
                {submitStatus.message}
              </p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 px-6 bg-gradient-to-r from-gold to-[#d4af37] text-dark-green font-montserrat font-bold text-lg rounded-xl hover:opacity-90 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed ${isSubmitting ? 'animate-pulse' : ''}`}
          >
            {isSubmitting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-dark-green border-t-transparent rounded-full animate-spin"></div>
                <span>{t('form.buttons.processing')}</span>
              </div>
            ) : (
              t('form.buttons.submit')
            )}
          </button>
        </form>
      </div>

      {/* Modals */}
      <TermsModal 
        isOpen={showTermsModal} 
        onClose={() => setShowTermsModal(false)} 
      />
      <PrivacyModal 
        isOpen={showPrivacyModal} 
        onClose={() => setShowPrivacyModal(false)} 
      />
    </section>
  );
};

export default MembershipForm;