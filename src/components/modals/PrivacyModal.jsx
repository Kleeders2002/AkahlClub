// components/modals/PrivacyModal.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const PrivacyModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-fadeUp">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-dark-green to-[#1a332b] p-6 border-b border-gold/20">
          <div className="flex justify-between items-center">
            <h3 className="font-cormorant text-2xl md:text-3xl text-white font-semibold">
              {t('privacy.title', 'Política de Privacidad')}
            </h3>
            <button
              onClick={onClose}
              className="text-white/80 hover:text-white text-2xl transition-colors duration-300"
            >
              ×
            </button>
          </div>
        </div>

        <div className="p-6 md:p-8 overflow-y-auto max-h-[70vh]">
          <div className="space-y-6 text-dark-green/80">
            <section>
              <h4 className="font-playfair text-lg font-bold text-dark-green mb-3">
                1. {t('privacy.section1.title', 'Información que Recopilamos')}
              </h4>
              <p className="font-cormorant text-sm leading-relaxed mb-3">
                {t('privacy.section1.content', 'Recopilamos información personal que nos proporcionas voluntariamente cuando te registras en Akahl Club:')}
              </p>
              <ul className="font-cormorant text-sm space-y-2 list-disc pl-5">
                <li>{t('privacy.section1.item1', 'Nombre completo y apellido')}</li>
                <li>{t('privacy.section1.item2', 'Dirección de correo electrónico')}</li>
                <li>{t('privacy.section1.item3', 'Número de teléfono (opcional)')}</li>
                <li>{t('privacy.section1.item4', 'Preferencias de estilo (opcional)')}</li>
              </ul>
            </section>

            <section>
              <h4 className="font-playfair text-lg font-bold text-dark-green mb-3">
                2. {t('privacy.section2.title', 'Uso de la Información')}
              </h4>
              <ul className="font-cormorant text-sm space-y-2 list-disc pl-5">
                <li>{t('privacy.section2.item1', 'Proporcionar acceso a la plataforma y contenido exclusivo')}</li>
                <li>{t('privacy.section2.item2', 'Enviar comunicaciones sobre nuevos contenidos y actualizaciones')}</li>
                <li>{t('privacy.section2.item3', 'Personalizar la experiencia según tus preferencias')}</li>
                <li>{t('privacy.section2.item4', 'Procesar pagos de membresías premium')}</li>
              </ul>
            </section>

            <section>
              <h4 className="font-playfair text-lg font-bold text-dark-green mb-3">
                3. {t('privacy.section3.title', 'Protección de Datos')}
              </h4>
              <p className="font-cormorant text-sm leading-relaxed">
                {t('privacy.section3.content', 'Implementamos medidas de seguridad técnicas y organizativas para proteger tu información personal contra accesos no autorizados, pérdida o alteración. Utilizamos encriptación SSL para todas las transmisiones de datos.')}
              </p>
            </section>

            <section>
              <h4 className="font-playfair text-lg font-bold text-dark-green mb-3">
                4. {t('privacy.section4.title', 'Compartición de Información')}
              </h4>
              <p className="font-cormorant text-sm leading-relaxed">
                {t('privacy.section4.content', 'No vendemos, alquilamos ni compartimos tu información personal con terceros con fines comerciales. Solo compartimos información cuando es necesario para:')}
              </p>
              <ul className="font-montserrat text-sm space-y-2 list-disc pl-5 mt-3">
                <li>{t('privacy.section4.item1', 'Cumplir con requerimientos legales')}</li>
                <li>{t('privacy.section4.item2', 'Procesar pagos a través de proveedores certificados')}</li>
                <li>{t('privacy.section4.item3', 'Proveer servicios técnicos esenciales')}</li>
              </ul>
            </section>

            <section>
              <h4 className="font-playfair text-lg font-bold text-dark-green mb-3">
                5. {t('privacy.section5.title', 'Tus Derechos')}
              </h4>
              <ul className="font-cormorant text-sm space-y-2 list-disc pl-5">
                <li>{t('privacy.section5.item1', 'Acceder a tu información personal')}</li>
                <li>{t('privacy.section5.item2', 'Corregir datos inexactos')}</li>
                <li>{t('privacy.section5.item3', 'Solicitar la eliminación de tus datos')}</li>
                <li>{t('privacy.section5.item4', 'Retirar tu consentimiento en cualquier momento')}</li>
              </ul>
            </section>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-gold to-[#d4af37] text-dark-green font-montserrat font-bold rounded-lg hover:opacity-90 transition-opacity duration-300"
            >
              {t('privacy.accept_button', 'Entendido')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyModal;