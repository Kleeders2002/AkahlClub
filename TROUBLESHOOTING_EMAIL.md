# 🔧 Guía de Diagnóstico - Problemas con Email

Si los correos no se están enviando, sigue estos pasos:

---

## 🧪 Paso 1: Probar el Servicio de Email

Ejecuta el script de prueba que creé:

```bash
cd server
node test-email-debug.js
```

Este script te dirá exactamente qué está mal con la configuración SMTP.

---

## 🔍 Posibles Problemas y Soluciones

### Problema 1: Credenciales Incorrectas

**Síntomas:** Error de autenticación

**Solución:**
1. Verifica que `club@akahlstyle.com` y la contraseña sean correctos
2. En cPanel, verifica la contraseña del email:
   - Mail → Email Accounts → club@akahlstyle.com → Change Password

### Problema 2: Puerto Bloqueado

**Síntomas:** Timeout o "Connection refused"

**Solución:**
1. Prueba con puerto 587 en lugar de 465
2. Verifica que tu firewall permita conexiones salientes al puerto 465

**Configuración alternativa:**
```javascript
const transporter = nodemailer.createTransport({
  host: 'mail.akahlstyle.com',
  port: 587,              // ← Cambiar a 587
  secure: false,          // ← Cambiar a false
  auth: {
    user: 'club@akahlstyle.com',
    pass: 'Akahlst2025*'
  }
});
```

### Problema 3: Host Incorrecto

**Síntomas:** "Hostname doesn't match certificate"

**Solución:**
Prueba con el host correcto de cPanel:
```javascript
host: 'localhost',  // Si estás en el mismo servidor
// O
host: 'mail.akahlstyle.com',
// O
host: 'akahlstyle.com',
```

### Problema 4: SSL/TLS Issues

**Síntomas:** "Self-signed certificate"

**Solución:**
```javascript
const transporter = nodemailer.createTransport({
  host: 'mail.akahlstyle.com',
  port: 465,
  secure: false,  // ← Cambiar a false
  auth: { ... }
});
```

---

## 📋 Configuración Correcta para cPanel

La configuración estándar para cPanel es:

```javascript
const transporter = nodemailer.createTransport({
  host: 'mail.akahlstyle.com',
  port: 465,
  secure: true,  // SSL
  auth: {
    user: 'club@akahlstyle.com',
    pass: 'TU_CONTRASEÑA'
  },
  tls: {
    rejectUnauthorized: false  // Si hay problemas de certificado
  }
});
```

---

## 🔧 Verificar Configuración en cPanel

1. Entra a cPanel: `https://akahlstyle.com:2083`
2. Ve a **Mail → Email Accounts**
3. Busca `club@akahlstyle.com`
4. Click en **Connect Devices**
5. Verifica la configuración SMTP:

**Manual Settings:**
```
Incoming Server: mail.akahlstyle.com
Outgoing Server (SMTP): mail.akahlstyle.com
Port: 465 (SSL/TLS)
Authentication: Normal
```

---

## 🧪 Verificación en Vivo

Mira los logs de tu servidor cuando alguien se registra:

```bash
# En Render, ve a "Logs" en tu dashboard
# O localmente:
tail -f server.log
```

Deberías ver:
```
📧 Enviando email a: usuario@email.com
🔑 Contraseña temporal: xK9$mP2#Lq5
🌐 Idioma: es
✅ Email enviado exitosamente: <message-id>
```

O si falla:
```
⚠️ Email falló: error message
❌ Error al enviar email: error details
```

---

## 📧 Configuración Actual (en emailService.js)

```javascript
host: 'mail.akahlstyle.com'
port: 465
secure: true
auth: {
  user: 'club@akahlstyle.com',
  pass: 'Akahlst2025*'
}
```

---

## 🚀 Prueba Completa del Sistema

1. **Prueba Email:**
   ```bash
   cd server
   node test-email-debug.js
   ```

2. **Prueba Registro:**
   - Ve a `/membership`
   - Regístrate con tu email real
   - Revisa tu carpeta de SPAM

3. **Ver Logs:**
   - En Render: Logs tab
   - Local: `tail -f server.log`

---

## ✅ Checklist

- [ ] Ejecuté `test-email-debug.js` y funcionó
- [ ] Verifiqué credenciales en cPanel
- [ ] Probé con puerto 587 si 465 falló
- [ ] Revisé carpeta de SPAM
- [ ] Verifiqué logs del servidor
- [ ] Probé con diferentes emails (Gmail, Outlook)

---

## 📞 Si Nada Funciona

Opciones alternativas:

1. **Usar Gmail SMTP** (más confiable):
   ```javascript
   host: 'smtp.gmail.com',
   port: 587,
   secure: false,
   auth: {
     user: 'tu-email@gmail.com',
     pass: 'tu-app-password'
   }
   ```

2. **Usar SendGrid** (recomendado para producción):
   ```javascript
   const sgMail = require('@sendgrid/mail');
   sgMail.setApiKey(process.env.SENDGRID_API_KEY);
   ```

3. **Usar Mailgun** (alternativa enterprise):
   ```javascript
   const mailgun = require('mailgun-js');
   const mg = mailgun({apiKey: process.env.MAILGUN_API_KEY, domain: 'akahlstyle.com'});
   ```

---

## 🔗 Recursos Útiles

- [Nodemailer Documentation](https://nodemailer.com/)
- [cPanel Email Configuration](https://docs.cpanel.net/cpanel/email/how-to-configure-email-settings/)
- [Gmail App Passwords](https://support.google.com/accounts/answer/185833)
