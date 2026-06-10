const nodemailer = require('nodemailer');

console.log('🔄 Probando con puerto 587 (TLS)...');

// Configurar transporter - ALTERNATIVA (puerto 587)
const transporter = nodemailer.createTransport({
  host: 'mail.akahlstyle.com',
  port: 587,        // TLS en lugar de SSL
  secure: false,    // false para TLS
  auth: {
    user: 'club@akahlstyle.com',
    pass: 'Akahlst2025*',
  },
  tls: {
    rejectUnauthorized: false  // Para certificados self-signed
  }
});

const mailOptions = {
  from: 'AKAHL Club <club@akahlstyle.com>',
  to: 'club@akahlstyle.com',
  subject: '🧪 Prueba Email (Alt) - Puerto 587',
  html: `
    <!DOCTYPE html>
    <html>
    <body style="font-family: Arial; padding: 20px; background: #f4f4f4;">
      <div style="max-width: 600px; margin: auto; background: #fff; padding: 30px; border-radius: 10px;">
        <h2 style="color: #152821;">🧪 PRUEBA ALTERNATIVA</h2>
        <p><strong>Puerto:</strong> 587 (TLS)</p>
        <p><strong>Secure:</strong> false</p>
        <p style="color: green;">✅ Si recibes esto, usamos puerto 587</p>
      </div>
    </body>
    </html>
  `
};

transporter.sendMail(mailOptions)
  .then((info) => {
    console.log('✅ Email enviado (puerto 587)!');
    console.log('📨 Message ID:', info.messageId);
    console.log('📨 Respuesta:', info.response);
    console.log('\n🎉 ¡Revisá tu correo!');
  })
  .catch((error) => {
    console.error('❌ Error:', error.message);
  });
