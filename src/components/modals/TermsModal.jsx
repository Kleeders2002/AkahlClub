// components/modals/TermsModal.jsx
import React from 'react';
import { useTranslation } from 'react-i18next';

const TermsModal = ({ isOpen, onClose }) => {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl animate-fadeUp">
        <div className="sticky top-0 z-10 bg-gradient-to-r from-dark-green to-[#1a332b] p-6 border-b border-gold/20">
          <div className="flex justify-between items-center">
            <h3 className="font-cormorant text-2xl md:text-3xl text-white font-semibold">
              {t('terms.title', 'Términos y Condiciones')}
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
              <h4 className="font-montserrat text-lg font-bold text-dark-green mb-3">
                1. {t('terms.section1.title', 'Aceptación de Términos')}
              </h4>
              <p className="font-montserrat text-sm leading-relaxed">
                {t('terms.section1.content', 'Al unirte a AKAHL CLUB, aceptas estos términos y condiciones en su totalidad. Estos términos constituyen un acuerdo legal entre tú y AKAHL CLUB.')}
              </p>
            </section>

            <section>
              <h4 className="font-montserrat text-lg font-bold text-dark-green mb-3">
                2. {t('terms.section2.title', 'Membresía y Suscripción')}
              </h4>
              <ul className="font-montserrat text-sm space-y-2 list-disc pl-5">
                <li>{t('terms.section2.item1', 'El plan Plata cuesta $9.99/mes y requiere pago al registrarse.')}</li>
                <li>{t('terms.section2.item2', 'El plan Oro es una suscripción mensual que puede cancelarse en cualquier momento.')}</li>
                <li>{t('terms.section2.item3', 'Los pagos se procesan de forma segura a través de nuestro proveedor de pagos.')}</li>
              </ul>
            </section>

            <section>
              <h4 className="font-montserrat text-lg font-bold text-dark-green mb-3">
                3. {t('terms.section3.title', 'Uso de Contenido')}
              </h4>
              <p className="font-montserrat text-sm leading-relaxed">
                {t('terms.section3.content', 'Todo el contenido proporcionado en AKAHL CLUB es propiedad intelectual y está protegido por derechos de autor. No se permite la distribución, modificación o venta del contenido sin autorización.')}
              </p>
            </section>

            <section>
              <h4 className="font-montserrat text-lg font-bold text-dark-green mb-3">
                4. {t('terms.section4.title', 'Privacidad y Datos')}
              </h4>
              <p className="font-montserrat text-sm leading-relaxed">
                {t('terms.section4.content', 'Protegemos tu información personal de acuerdo con nuestra Política de Privacidad. Tus datos se utilizan únicamente para gestionar tu membresía y enviar contenido relevante.')}
              </p>
            </section>

            <section>
              <h4 className="font-montserrat text-lg font-bold text-dark-green mb-3">
                5. {t('terms.section5.title', 'Limitación de Responsabilidad')}
              </h4>
              <p className="font-montserrat text-sm leading-relaxed">
                {t('terms.section5.content', 'AKAHL CLUB no se hace responsable por decisiones de estilo personal tomadas por los miembros. Las recomendaciones son sugerencias y deben adaptarse al criterio personal de cada individuo.')}
              </p>
            </section>
          </div>
        </div>

        <div className="sticky bottom-0 bg-gray-50 p-6 border-t border-gray-200">
          <div className="flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-gold to-[#d4af37] text-dark-green font-montserrat font-bold rounded-lg hover:opacity-90 transition-opacity duration-300"
            >
              {t('terms.accept_button', 'Entendido')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsModal;