const nodemailer = require('nodemailer');

// Configurar transporter
const transporter = nodemailer.createTransport({
  host: 'mail.akahlstyle.com',
  port: 465,
  secure: true,
  auth: {
    user: 'club@akahlstyle.com',
    pass: 'Akahlst2025*',
  },
});

// Email de prueba
const mailOptions = {
  from: 'AKAHL Club <club@akahlstyle.com>',
  to: 'club@akahlstyle.com', // Enviado a ti mismo para probar
  subject: '🧪 Prueba de Email - AKAHL Club',
  html: `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; }
        .header { background: #152821; padding: 30px; text-align: center; }
        .content { padding: 30px; }
        .success { color: #4caf50; font-size: 18px; text-align: center; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1 style="color: #c1ad48; margin: 0;">✅ EMAIL DE PRUEBA</h1>
        </div>
        <div class="content">
          <p class="success">¡El email se envió correctamente!</p>
          <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
          <p><strong>Servidor:</strong> mail.akahlstyle.com:465</p>
          <p><strong>Remitente:</strong> club@akahlstyle.com</p>
          <hr style="margin: 20px 0; border: none; border-top: 1px solid #eee;">
          <p style="color: #666; font-size: 14px;">Si recibes este email, la configuración SMTP está funcionando correctamente.</p>
        </div>
      </div>
    </body>
    </html>
  `
};

console.log('📧 Enviando email de prueba...');

transporter.sendMail(mailOptions)
  .then((info) => {
    console.log('✅ Email enviado exitosamente!');
    console.log('📨 Message ID:', info.messageId);
    console.log('📨 Respuesta del servidor:', info.response);
  })
  .catch((error) => {
    console.error('❌ Error al enviar email:', error);
    console.log('\nSi falla, probaremos con puerto 587 (TLS)...');
  });
