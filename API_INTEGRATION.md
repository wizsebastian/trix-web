# 🚀 API Externa - Integración Completada

## ✅ Configuración Implementada

### 📊 Estructura de Datos Enviados

**URL:** `http://localhost:3000/send-email`  
**Método:** `POST`  
**Content-Type:** `application/json`  
**Headers:** `X-API-Key: gxtr_2024_secure_api_key_auth_mail_server_v1`

### 📋 Payload Enviado:

```json
{
  "email_type": "contact",
  "name": "Juan Pérez",
  "phone": "+521234567890",
  "email": "usuario@email.com",
  "message": "Mensaje del usuario...",
  "whatsapp_check": true,
  "meta": {
    "source": "website",
    "page": "contact",
    "utm_campaign": "trix_website_2025",
    "ip": "client-side",
    "user_agent": "Mozilla/5.0...",
    "browser": "Chrome",
    "os": "Windows",
    "device": "Escritorio",
    "screen_resolution": "1920x1080",
    "language": "es-MX",
    "timezone": "America/Mexico_City",
    "referrer": "https://google.com",
    "timestamp": "2025-10-29T07:30:00.000Z"
  }
}
```

## 🔧 Archivos Modificados

### 📁 `/src/utils/apiClient.ts`
- ✅ **Cliente API** completo para localhost:3000
- ✅ **Formato específico** según estructura requerida
- ✅ **Manejo de errores** robusto
- ✅ **TypeScript interfaces** para type safety
- ✅ **Metadata completa** incluida

### 📁 `/src/TrixLanding.tsx`
- ✅ **Doble guardado**: Firebase + API externa
- ✅ **Manejo de errores** independiente
- ✅ **Logs detallados** para debugging
- ✅ **No bloquea UX** si API externa falla

### 📁 `.env`
- ✅ **VITE_API_BASE_URL** configurada
- ✅ **Variable de entorno** para cambio fácil

## 🌐 Flujo de Datos

**1. Usuario envía formulario**
- Nombre, email, mensaje
- Teléfono con código de país  
- Checkbox WhatsApp

**2. Sistema captura metadata**
- 15+ campos automáticos
- Navegador, SO, dispositivo
- Geolocalización, tiempo, etc.

**3. Doble almacenamiento**
- ✅ **Firebase**: Formato TRIX original
- ✅ **API Externa**: Formato específico requerido

**4. Confirmación al usuario**
- Mensaje de éxito
- Logs en consola para debug

## 🧪 Testing

### Para probar la integración:

1. **Levantar API en localhost:3000**
2. **Llenar formulario** en http://localhost:5173/
3. **Revisar logs** en consola del navegador
4. **Verificar request** en API externa

### Logs esperados:
```
Sending contact data to API: {...}
Contact sent to external API successfully
```

## 🚨 Manejo de Errores

**Si API externa falla:**
- ✅ Se guarda en Firebase normalmente
- ✅ Se muestra mensaje de éxito al usuario
- ✅ Error se logea en consola
- ✅ No interrumpe experiencia del usuario

**Errores manejados:**
- Network failures
- API timeouts  
- HTTP error status
- Invalid JSON responses

## 📊 Datos Enviados a API

### Campos principales:
- `email_type`: "contact" (fijo)
- `name`: Nombre del usuario
- `phone`: Teléfono completo con código país
- `email`: Email del usuario
- `message`: Mensaje del usuario
- `whatsapp_check`: Boolean si tiene WhatsApp

### Metadata automática:
- `source`: "website" (fijo)
- `page`: "contact" (fijo)
- `utm_campaign`: "trix_website_2025"
- `user_agent`: User agent completo
- `browser`: Chrome, Firefox, Safari, etc.
- `os`: Windows, macOS, Linux, etc.
- `device`: Escritorio, móvil, tablet
- `screen_resolution`: 1920x1080, etc.
- `language`: es-MX, en-US, etc.
- `timezone`: America/Mexico_City, etc.
- `referrer`: URL de origen
- `timestamp`: ISO string con fecha/hora

## 🔄 Configuración de Desarrollo

**Cambiar URL de API:**
```bash
# En .env
VITE_API_BASE_URL=http://localhost:3000  # Desarrollo
VITE_X_API_KEY=gxtr_2024_secure_api_key_auth_mail_server_v1
# VITE_API_BASE_URL=https://api.trix.com  # Producción
```

**📋 Ejemplo de Request Completo:**
```bash
curl -X POST http://localhost:3000/send-email \
  -H "Content-Type: application/json" \
  -H "X-API-Key: gxtr_2024_secure_api_key_auth_mail_server_v1" \
  -d '{
    "email_type": "contact",
    "name": "Juan Pérez",
    "phone": "+521234567890",
    "email": "usuario@email.com",
    "message": "Mensaje del usuario...",
    "whatsapp_check": true,
    "meta": {
      "source": "website",
      "page": "contact",
      "utm_campaign": "trix_website_2025",
      "browser": "Chrome",
      "os": "Windows"
    }
  }'
```

---

✅ **El sistema ahora envía datos a Firebase Y a tu API externa simultáneamente**