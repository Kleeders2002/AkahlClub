import React from 'react';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="bg-dark-green text-white">
      <div className="max-w-7xl mx-auto px-4 md:px-8 lg:px-16 xl:px-20">
        {/* Contenido principal del footer */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          {/* Logo y descripción */}
          <div className="lg:col-span-5">
            <div className="mb-6">
              <img 
                src="https://i.ibb.co/mFRJ8DWJ/Brutalist-Webzine-Blog-Post-Bold-Instagram-Post-Renaissance-CD-Cover-Art-2.png" 
                alt="Akahl Club" 
                className="h-12 w-auto transition-opacity duration-300 hover:opacity-80"
              />
            </div>
            <p className="font-montserrat text-light-cream/70 text-sm leading-relaxed max-w-md">
              {t('footer.description', 'Una comunidad exclusiva donde el estilo atemporal se encuentra con la vida moderna. Transformamos tu relación con la moda en una expresión auténtica y duradera.')}
            </p>
          </div>

          {/* Enlaces rápidos */}
          <div className="lg:col-span-3 lg:col-start-7">
            <h4 className="font-montserrat font-semibold text-sm mb-6 uppercase tracking-widest text-light-cream">
              {t('footer.quick_links', 'Enlaces Rápidos')}
            </h4>
            <ul className="space-y-3">
              {[
                { key: 'home', href: '/' },
                { key: 'comparative', href: '/comparative' }
              ].map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="font-montserrat text-light-cream/60 hover:text-gold text-sm transition-all duration-300 inline-block hover:translate-x-1"
                  >
                    {t(`footer.${link.key}`)}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contacto */}
          <div className="lg:col-span-4">
            <h4 className="font-montserrat font-semibold text-sm mb-6 uppercase tracking-widest text-light-cream">
              {t('footer.contact', 'Contacto')}
            </h4>
            <ul className="space-y-4">
              <li>
                <a 
                  href="mailto:info@akahlstyle.com" 
                  className="font-montserrat text-light-cream/60 hover:text-gold text-sm transition-colors duration-300 flex items-center gap-3 group"
                >
                  <span className="w-1 h-1 bg-gold rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                  info@akahlstyle.com
                </a>
              </li>
              <li>
                <a 
                  href="https://wa.me/+17868658511" 
                  className="font-montserrat text-light-cream/60 hover:text-gold text-sm transition-colors duration-300 flex items-center gap-3 group"
                >
                  <span className="w-1 h-1 bg-gold rounded-full group-hover:scale-150 transition-transform duration-300"></span>
                  WhatsApp
                </a>
              </li>
              <li className="font-montserrat text-light-cream/60 text-sm flex items-center gap-3">
                <span className="w-1 h-1 bg-gold rounded-full"></span>
                {t('footer.location', 'Buenos Aires, Argentina')}
              </li>
            </ul>
          </div>
        </div>

        {/* Línea divisoria con gradiente */}
        <div className="relative h-px">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-light-cream/20 to-transparent"></div>
        </div>

        {/* Copyright y redes sociales */}
        <div className="py-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="font-montserrat text-light-cream/50 text-xs tracking-wide">
            © {new Date().getFullYear()} Akahl Club · {t('footer.copyright', 'Todos los derechos reservados.')}
          </p>
          
          <div className="flex items-center gap-5">
            {[
              {
                name: 'Instagram',
                href: 'https://instagram.com',
                path: 'M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.467.398.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.672 0 2.988-.01 4.042-.058.975-.045 1.504-.207 1.857-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.672-.01-2.988-.058-4.042-.045-.975-.207-1.504-.344-1.857a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z'
              },
              {
                name: 'Facebook',
                href: 'https://facebook.com',
                path: 'M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z'
              },
              {
                name: 'Twitter',
                href: 'https://twitter.com',
                path: 'M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84'
              }
            ].map((social) => (
              <a
                key={social.name}
                href={social.href}
                className="text-light-cream/50 hover:text-gold transition-all duration-300 hover:scale-110 group"
                aria-label={social.name}
              >
                <svg 
                  className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12" 
                  fill="currentColor" 
                  viewBox="0 0 24 24" 
                  aria-hidden="true"
                >
                  <path fillRule="evenodd" d={social.path} clipRule="evenodd" />
                </svg>
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;