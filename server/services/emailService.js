const nodemailer = require('nodemailer');

// Configurar transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verificar conexión
transporter.verify(function (error, success) {
  if (error) {
    console.error('❌ Error en configuración de email:', error);
  } else {
    console.log('✅ Servidor de email listo');
  }
});

// 📧 EMAIL 1: Bienvenida LEAD (Sin acceso al portal) - MULTIIDIOMA
async function enviarEmailBienvenidaGratis(email, nombre, password, language = 'es') {
  
  // Traducciones para LEADS (sin portal access)
  const translations = {
    en: {
      subject: '🎉 Welcome to the AKAHL VIP Circle!',
      greeting: 'Hello',
      welcomeTitle: "You're now part of our exclusive VIP circle!",
      welcomeText: "We're excited to have you with us. You'll be the first to know about new launches, exclusive content, and special benefits reserved only for our VIP members.",
      whatToExpect: '✨ What to expect:',
      benefits: [
        '🚀 Early access to new collections and products',
        '📰 Exclusive news and updates before anyone else',
        '🎁 Special discounts and VIP promotions',
        '💎 Premium content and behind-the-scenes',
        '🎯 Personalized recommendations based on your interests'
      ],
      stayTuned: "Stay tuned for our next email with exclusive content just for you.",
      connectText: "Follow us on social media to not miss anything:",
      footerText: '© 2025 AKAHL. All rights reserved.',
      unsubscribeText: "Don't want to receive these emails?",
      unsubscribeLink: 'Unsubscribe here'
    },
    es: {
      subject: '🎉 ¡Bienvenido al Círculo VIP de AKAHL!',
      greeting: 'Hola',
      welcomeTitle: '¡Ya formas parte de nuestro círculo exclusivo VIP!',
      welcomeText: 'Estamos emocionados de tenerte con nosotros. Serás el primero en enterarte de nuevos lanzamientos, contenido exclusivo y beneficios especiales reservados solo para nuestros miembros VIP.',
      whatToExpect: '✨ Qué esperar:',
      benefits: [
        '🚀 Acceso anticipado a nuevas colecciones y productos',
        '📰 Noticias y novedades exclusivas antes que nadie',
        '🎁 Descuentos especiales y promociones VIP',
        '💎 Contenido premium y detrás de cámaras',
        '🎯 Recomendaciones personalizadas según tus intereses'
      ],
      stayTuned: 'Estate atento a nuestro próximo email con contenido exclusivo solo para ti.',
      connectText: 'Síguenos en redes sociales para no perderte nada:',
      footerText: '© 2025 AKAHL. Todos los derechos reservados.',
      unsubscribeText: '¿No quieres recibir estos correos?',
      unsubscribeLink: 'Dar de baja aquí'
    }
  };

  const t = translations[language] || translations.es;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: t.subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #152821 0%, #1a3329 100%); padding: 40px 30px; text-align: center; }
          .logo-img { max-width: 200px; height: auto; }
          .content { padding: 40px 30px; }
          .title { color: #152821; font-size: 24px; font-weight: bold; margin-bottom: 20px; text-align: center; }
          .text { color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
          .benefits-box { background: #f8f9fa; border-left: 4px solid #c1ad48; padding: 25px; margin: 30px 0; border-radius: 8px; }
          .benefit-item { margin: 12px 0; color: #333; font-size: 15px; line-height: 1.5; }
          .highlight-box { background: linear-gradient(135deg, rgba(193, 173, 72, 0.1), rgba(212, 191, 90, 0.1)); border: 2px solid rgba(193, 173, 72, 0.3); padding: 20px; border-radius: 8px; text-align: center; margin: 30px 0; }
          .social-links { text-align: center; margin: 30px 0; }
          .social-link { display: inline-block; margin: 0 10px; color: #c1ad48; text-decoration: none; font-weight: 600; }
          .footer { background: #f8f9fa; padding: 20px 30px; text-align: center; color: #666; font-size: 14px; }
          .footer-link { color: #c1ad48; text-decoration: none; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://i.ibb.co/mFRJ8DWJ/Brutalist-Webzine-Blog-Post-Bold-Instagram-Post-Renaissance-CD-Cover-Art-2.png" alt="AKAHL" class="logo-img">
          </div>
          <div class="content">
            <div class="title">${t.greeting} ${nombre}! 🎉</div>
            
            <p class="text" style="font-size: 18px; color: #c1ad48; font-weight: 600; text-align: center;">
              ${t.welcomeTitle}
            </p>
            
            <p class="text">
              ${t.welcomeText}
            </p>
            
            <div class="benefits-box">
              <strong style="color:#152821; font-size:18px; display:block; margin-bottom:15px;">${t.whatToExpect}</strong>
              ${t.benefits.map(benefit => `<div class="benefit-item">${benefit}</div>`).join('')}
            </div>
            
            <div class="highlight-box">
              <p style="margin:0; color:#152821; font-weight:600; font-size:16px;">
                ${t.stayTuned}
              </p>
            </div>
            
            <p class="text" style="text-align:center; margin-top:30px;">
              <strong>${t.connectText}</strong>
            </p>
            
            <div class="social-links">
              <a href="#" class="social-link">Instagram</a>
              <a href="#" class="social-link">Facebook</a>
              <a href="#" class="social-link">Twitter</a>
              <a href="#" class="social-link">TikTok</a>
            </div>
            
          </div>
          <div class="footer">
            <p>${t.footerText}</p>
            <p style="margin-top:15px; font-size:12px;">
              ${t.unsubscribeText} <a href="#" class="footer-link">${t.unsubscribeLink}</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de bienvenida LEAD enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return { success: false, error: error.message };
  }
}

// 📧 EMAIL 2: Pago Pendiente Plan ORO - MULTIIDIOMA
async function enviarEmailPagoPendiente(email, nombre, password, checkoutUrl, language = 'es') {
  
  const translations = {
    en: {
      subject: '⏳ Complete Your GOLD Membership - AKAHL Club',
      greeting: 'Hello',
      mainText: 'Your account has been successfully created. To activate your <strong>GOLD Membership</strong> and access all exclusive benefits, you need to complete payment.',
      pendingPayment: '⚠️ Pending Payment',
      pendingText: 'Your portal access will be available once you complete the payment.',
      benefitsTitle: '✨ GOLD Membership Benefits:',
      benefits: [
        'All SILVER benefits',
        'Advanced style guides',
        'Personalized consultations',
        'Access to exclusive events',
        'Discounts on collaborations'
      ],
      buttonText: '💳 Complete Payment Now',
      credentialsNote: '📌 Your login credentials (use them after payment):',
      emailLabel: 'Email',
      passwordLabel: 'Temporary Password',
      confirmationText: 'Once payment is completed, you will receive confirmation and can immediately access the portal.',
      footerText: '© 2025 AKAHL Club. All rights reserved.',
      problemsText: 'Problems?',
      contactText: 'Contact us'
    },
    es: {
      subject: '⏳ Completa tu Membresía ORO - AKAHL Club',
      greeting: 'Hola',
      mainText: 'Tu cuenta ha sido creada exitosamente. Para activar tu <strong>Membresía ORO</strong> y acceder a todos los beneficios exclusivos, necesitas completar el pago.',
      pendingPayment: '⚠️ Pago Pendiente',
      pendingText: 'Tu acceso al portal estará disponible una vez que completes el pago.',
      benefitsTitle: '✨ Beneficios Membresía ORO:',
      benefits: [
        'Todos los beneficios PLATA',
        'Guías de estilo avanzadas',
        'Consultas personalizadas',
        'Acceso a eventos exclusivos',
        'Descuentos en colaboraciones'
      ],
      buttonText: '💳 Completar Pago Ahora',
      credentialsNote: '📌 Tus credenciales de acceso (úsalas después del pago):',
      emailLabel: 'Email',
      passwordLabel: 'Contraseña temporal',
      confirmationText: 'Una vez completado el pago, recibirás una confirmación y podrás acceder inmediatamente al portal.',
      footerText: '© 2025 AKAHL Club. Todos los derechos reservados.',
      problemsText: '¿Problemas?',
      contactText: 'Contáctanos'
    }
  };

  const t = translations[language] || translations.es;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: t.subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #c1ad48 0%, #d4bf5a 100%); padding: 40px 30px; text-align: center; }
          .logo-img { max-width: 200px; height: auto; }
          .content { padding: 40px 30px; }
          .title { color: #152821; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
          .text { color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
          .warning-box { background: #fff9e6; border-left: 4px solid #ffc107; padding: 20px; margin: 30px 0; border-radius: 8px; }
          .credentials-box { background: #f8f9fa; border-left: 4px solid #c1ad48; padding: 20px; margin: 30px 0; border-radius: 8px; }
          .button { display: inline-block; background: linear-gradient(135deg, #c1ad48 0%, #d4bf5a 100%); color: #152821; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; margin-top: 20px; font-size: 18px; }
          .benefits { background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .benefit-item { padding: 10px 0; color: #333; }
          .footer { background: #f8f9fa; padding: 20px 30px; text-align: center; color: #666; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://i.ibb.co/mFRJ8DWJ/Brutalist-Webzine-Blog-Post-Bold-Instagram-Post-Renaissance-CD-Cover-Art-2.png" alt="AKAHL" class="logo-img">
            <p style="color:#152821;margin-top:15px;font-weight:600;">Membresía ORO / GOLD Membership</p>
          </div>
          <div class="content">
            <div class="title">${t.greeting} ${nombre}! 🌟</div>
            <p class="text">
              ${t.mainText}
            </p>
            
            <div class="warning-box">
              <strong>${t.pendingPayment}</strong><br>
              ${t.pendingText}
            </div>
            
            <div class="benefits">
              <strong style="color:#152821;font-size:18px;">${t.benefitsTitle}</strong>
              ${t.benefits.map(benefit => `<div class="benefit-item">✅ ${benefit}</div>`).join('')}
            </div>
            
            <center>
              <a href="${checkoutUrl}" class="button">
                ${t.buttonText}
              </a>
            </center>
            
            <div class="credentials-box" style="margin-top:30px;">
              <strong>${t.credentialsNote}</strong><br><br>
              <strong>📧 ${t.emailLabel}:</strong> ${email}<br>
              <strong>🔑 ${t.passwordLabel}:</strong> <code style="background:#fff;padding:5px 10px;border-radius:4px;font-size:14px;">${password}</code>
            </div>
            
            <p class="text" style="font-size:14px;color:#666;">
              ${t.confirmationText}
            </p>
          </div>
          <div class="footer">
            <p>${t.footerText}</p>
            <p style="margin-top:10px;">
              ${t.problemsText} <a href="mailto:soporte@akahl.com" style="color:#c1ad48;text-decoration:none;">${t.contactText}</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de pago pendiente enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return { success: false, error: error.message };
  }
}

// 📧 EMAIL 3: Confirmación de Pago - MULTIIDIOMA
async function enviarEmailPagoConfirmado(email, nombre, tempPassword, language = 'es') {

  const translations = {
    en: {
      subject: '🎉 Payment Confirmed! Your Access is Now Active',
      greeting: 'Congratulations',
      paymentConfirmed: '✅ Payment Confirmed',
      confirmText: 'Your membership has been successfully activated. Welcome to AKAHL Club!',
      welcomeText: 'You now have full access to all exclusive AKAHL Club benefits. We are excited to have you as a member.',
      accessIncludes: '🌟 Your access includes:',
      benefits: [
        'Unlimited premium content',
        'Personalized consultations',
        'Exclusive events',
        'Special discounts',
        'Priority support'
      ],
      credentialsTitle: '🔑 Your Login Credentials',
      credentialsNote: 'Save this information to access the portal:',
      emailLabel: 'Email',
      passwordLabel: 'Temporary Password',
      passwordWarning: '⚠️ Please change your password after your first login for security.',
      buttonText: '🚀 Access Portal Now',
      questionsText: 'If you have any questions, our team is here to help you.',
      footerText: '© 2025 AKAHL Club. All rights reserved.',
      contactLink: 'Contact',
      portalLink: 'Portal'
    },
    es: {
      subject: '🎉 ¡Pago Confirmado! Tu Acceso ya está Activo',
      greeting: 'Felicidades',
      paymentConfirmed: '✅ Pago Confirmado',
      confirmText: 'Tu membresía ha sido activada exitosamente. ¡Bienvenido a AKAHL Club!',
      welcomeText: 'Ya tienes acceso completo a todos los beneficios exclusivos de AKAHL Club. Estamos emocionados de tenerte como miembro.',
      accessIncludes: '🌟 Tu acceso incluye:',
      benefits: [
        'Contenido premium ilimitado',
        'Consultas personalizadas',
        'Eventos exclusivos',
        'Descuentos especiales',
        'Soporte prioritario'
      ],
      credentialsTitle: '🔑 Tus Credenciales de Acceso',
      credentialsNote: 'Guarda esta información para acceder al portal:',
      emailLabel: 'Email',
      passwordLabel: 'Contraseña Temporal',
      passwordWarning: '⚠️ Por favor cambia tu contraseña después del primer inicio de sesión por seguridad.',
      buttonText: '🚀 Acceder al Portal Ahora',
      questionsText: 'Si tienes alguna pregunta, nuestro equipo está aquí para ayudarte.',
      footerText: '© 2025 AKAHL Club. Todos los derechos reservados.',
      contactLink: 'Contacto',
      portalLink: 'Portal'
    }
  };

  const t = translations[language] || translations.es;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: email,
    subject: t.subject,
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: 'Helvetica Neue', Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
          .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
          .header { background: linear-gradient(135deg, #152821 0%, #1a332b 100%); padding: 40px 30px; text-align: center; }
          .logo-img { max-width: 200px; height: auto; }
          .content { padding: 40px 30px; }
          .title { color: #152821; font-size: 24px; font-weight: bold; margin-bottom: 20px; }
          .text { color: #333; font-size: 16px; line-height: 1.6; margin-bottom: 20px; }
          .success-box { background: #e8f5e9; border-left: 4px solid #4caf50; padding: 20px; margin: 30px 0; border-radius: 8px; }
          .credentials-box { background: #f8f9fa; border-left: 4px solid #c1ad48; padding: 20px; margin: 30px 0; border-radius: 8px; }
          .warning-box { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 20px 0; border-radius: 8px; font-size: 14px; }
          .button { display: inline-block; background: linear-gradient(135deg, #c1ad48 0%, #d4bf5a 100%); color: #152821; text-decoration: none; padding: 15px 40px; border-radius: 8px; font-weight: bold; margin-top: 20px; font-size: 18px; }
          .footer { background: #f8f9fa; padding: 20px 30px; text-align: center; color: #666; font-size: 14px; }
          .benefit-item { margin: 8px 0; }
          .code-display { background: #fff; padding: 8px 12px; border-radius: 4px; font-family: monospace; font-size: 14px; color: #152821; border: 1px solid #ddd; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <img src="https://i.ibb.co/mFRJ8DWJ/Brutalist-Webzine-Blog-Post-Bold-Instagram-Post-Renaissance-CD-Cover-Art-2.png" alt="AKAHL" class="logo-img">
            <p style="color:#c1ad48;margin-top:15px;font-weight:600;font-size:20px;">✨ GOLD Membership / Membresía ORO ✨</p>
          </div>
          <div class="content">
            <div class="title">¡${t.greeting} ${nombre}! 🎊</div>

            <div class="success-box">
              <strong style="font-size:18px;">${t.paymentConfirmed}</strong><br>
              ${t.confirmText}
            </div>

            <p class="text">
              ${t.welcomeText}
            </p>

            <p class="text">
              <strong>${t.accessIncludes}</strong><br>
              ${t.benefits.map(benefit => `<div class="benefit-item">✅ ${benefit}</div>`).join('')}
            </p>

            <div class="credentials-box">
              <strong style="color:#152821;font-size:18px;display:block;margin-bottom:15px;">${t.credentialsTitle}</strong>
              <p style="margin:0 0 10px 0;color:#666;">${t.credentialsNote}</p>

              <p style="margin:5px 0;color:#333;"><strong>📧 ${t.emailLabel}:</strong> ${email}</p>
              <p style="margin:5px 0;color:#333;"><strong>🔑 ${t.passwordLabel}:</strong></p>
              <code class="code-display">${tempPassword}</code>

              <div class="warning-box">
                ${t.passwordWarning}
              </div>
            </div>

            <center>
              <a href="${process.env.PORTAL_URL || 'https://akahl-club.vercel.app/login'}" class="button">
                ${t.buttonText}
              </a>
            </center>

            <p class="text" style="margin-top:30px;font-size:14px;color:#666;">
              ${t.questionsText}
            </p>
          </div>
          <div class="footer">
            <p>${t.footerText}</p>
            <p style="margin-top:10px;">
              <a href="mailto:soporte@akahl.com" style="color:#c1ad48;text-decoration:none;">${t.contactLink}</a> |
              <a href="#" style="color:#c1ad48;text-decoration:none;">${t.portalLink}</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `
  };
  
  try {
    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Email de confirmación enviado:', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('❌ Error enviando email:', error);
    return { success: false, error: error.message };
  }
}

module.exports = {
  enviarEmailBienvenidaGratis,
  enviarEmailPagoPendiente,
  enviarEmailPagoConfirmado
};