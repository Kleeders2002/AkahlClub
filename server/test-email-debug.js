// test-email-debug.js - Script para diagnosticar problemas de email
const nodemailer = require('nodemailer');

console.log('🔧 Iniciando prueba de email...\n');

// Configuración actual
const config = {
  host: 'mail.akahlstyle.com',
  port: 465,
  secure: true,
  auth: {
    user: 'club@akahlstyle.com',
    pass: 'Akahlst2025*'
  }
};

console.log('📧 Configuración SMTP:');
console.log('  Host:', config.host);
console.log('  Puerto:', config.port);
console.log('  Secure:', config.secure);
console.log('  Usuario:', config.auth.user);
console.log('  Password:', '*'.repeat(config.auth.pass.length));

// Crear transporter
const transporter = nodemailer.createTransport(config);

// Probar conexión
console.log('\n🔍 Probando conexión al servidor SMTP...');

transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Error de conexión:', error.message);
    console.error('\nDetalles completos:', error);

    // Sugerencias
    console.log('\n💡 Posibles soluciones:');
    console.log('1. Verifica que el servidor SMTP sea correcto');
    console.log('2. Verifica que el puerto 465 esté abierto (firewall)');
    console.log('3. Verifica las credenciales de email');
    console.log('4. Prueba con puerto 587 y secure: false');

    // Intentar configuración alternativa
    console.log('\n🔄 Probando configuración alternativa (puerto 587)...');
    const altConfig = {
      host: 'mail.akahlstyle.com',
      port: 587,
      secure: false,
      auth: {
        user: 'club@akahlstyle.com',
        pass: 'Akahlst2025*'
      }
    };

    const altTransporter = nodemailer.createTransport(altConfig);
    altTransporter.verify((altError, altSuccess) => {
      if (altError) {
        console.error('❌ Configuración alternativa también falló:', altError.message);
      } else {
        console.log('✅ Configuración alternativa funcionó!');
        console.log('   Usa: port: 587, secure: false');
      }
      process.exit(1);
    });
  } else {
    console.log('✅ Conexión exitosa al servidor SMTP');

    // Probar envío real
    console.log('\n📨 Enviando email de prueba...');

    const mailOptions = {
      from: 'AKAHL Club <club@akahlstyle.com>',
      to: 'club@akahlstyle.com', // Enviar a uno mismo para probar
      subject: '🧪 Test Email - AKAHL Club',
      html: `
        <h2>Test Email</h2>
        <p>Si recibes este email, la configuración SMTP es correcta.</p>
        <p><strong>Fecha:</strong> ${new Date().toLocaleString()}</p>
      `
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('❌ Error al enviar email:', error.message);
        console.error('\nDetalles completos:', error);
        process.exit(1);
      } else {
        console.log('✅ Email enviado exitosamente!');
        console.log('   Message ID:', info.messageId);
        console.log('   Respuesta del servidor:', info.response);
        console.log('\n🎉 La configuración de email es correcta!');
        process.exit(0);
      }
    });
  }
});
