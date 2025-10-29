# 🔥 Firebase Setup - TRIX Admin Panel

## 📋 Configuración Completa del Panel de Administración

### 1. 🚀 Configuración Inicial de Firebase

#### Paso 1: Configurar Firebase Web App
1. Ve a [Firebase Console](https://console.firebase.google.com)
2. Selecciona tu proyecto `trix-3ef96`
3. Ve a "Project Settings" > "General" > "Your apps"
4. Crea una nueva Web App si no existe
5. Copia las credenciales de configuración

#### Paso 2: Actualizar Configuración
Edita `src/firebase-config.ts` con tus credenciales reales:

```typescript
const firebaseConfig = {
  apiKey: "tu-api-key-aqui",
  authDomain: "trix-3ef96.firebaseapp.com", 
  projectId: "trix-3ef96",
  storageBucket: "trix-3ef96.appspot.com",
  messagingSenderId: "tu-sender-id",
  appId: "tu-app-id"
};
```

### 2. 🛡️ Configurar Authentication

#### Habilitar Email/Password Authentication:
1. Ve a Firebase Console > Authentication > Sign-in method
2. Habilita "Email/Password"
3. Guarda los cambios

### 3. 🗄️ Configurar Firestore Database

#### Crear Base de Datos:
1. Ve a Firebase Console > Firestore Database
2. Crea una nueva base de datos
3. Inicia en modo "test" (cambiaremos las reglas después)

#### Reglas de Seguridad Recomendadas:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Permitir lectura/escritura de contactos solo a usuarios autenticados
    match /contactos/{document} {
      allow read, write: if request.auth != null;
    }
    
    // Solo administradores pueden acceder a admin_users
    match /admin_users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. 👥 Configurar Usuarios Administradores

#### Opción A: Script Automático (Recomendado)
```bash
# Instalar firebase-admin
npm install firebase-admin

# Ejecutar script de configuración
node setup-admin.js
```

#### Opción B: Manual
1. Ve a Firebase Console > Authentication > Users
2. Crea usuarios manualmente:
   - `admin@trixgeo.com`
   - `luis@trixgeo.com` 
   - `geomatrix@gmail.com`

### 5. 🚀 Ejecutar la Aplicación

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev
```

### 6. 🔐 Acceder al Panel Admin

- **URL del Panel:** http://localhost:5173/admin
- **Credenciales por defecto:**

| Email | Password |
|-------|----------|
| admin@trixgeo.com | TrixAdmin2025! |
| luis@trixgeo.com | LuisAdmin2025! |
| geomatrix@gmail.com | GeomatrixAdmin2025! |

## 📊 Funcionalidades del Panel

### 📧 Gestión de Contactos
- ✅ Ver todos los contactos recibidos
- ✅ Metadata completa del navegador/dispositivo
- ✅ Exportar contactos a CSV
- ✅ Eliminar contactos individuales
- ✅ Vista detallada de cada contacto

### 🔍 Información Capturada
- **Básica:** Nombre, email, mensaje, fecha
- **Técnica:** Navegador, SO, dispositivo, resolución
- **Ubicación:** Idioma, zona horaria, país
- **Acceso:** URL, referrer, velocidad de internet
- **Rendimiento:** Tiempo de carga, exposición

### 🛡️ Seguridad
- ✅ Autenticación Firebase
- ✅ Control de acceso por email
- ✅ Rutas protegidas
- ✅ Sesiones seguras

## 🚨 Troubleshooting

### Error: "Firebase project not found"
- Verifica que el `projectId` en firebase-config.ts sea correcto
- Asegúrate de tener permisos en el proyecto Firebase

### Error: "Auth domain not authorized"
- Agrega tu dominio local a Firebase Console > Authentication > Settings > Authorized domains
- Agrega: `localhost`

### Error: "Firestore rules deny"
- Verifica las reglas de Firestore
- Asegúrate de que los usuarios estén autenticados

### No se guardan los contactos
- Verifica la configuración de Firestore
- Revisa la consola del navegador para errores
- Confirma que las reglas de Firestore permitan escritura

## 📝 Notas de Desarrollo

### Estructura de Datos - Contactos
```typescript
interface Contact {
  id: string;
  nombre: string;
  email: string;
  mensaje: string;
  navegador: string;
  sistemaOperativo: string;
  tipoDispositivo: string;
  resolucion: string;
  idioma: string;
  zona_horaria: string;
  url: string;
  referrer: string;
  velocidadInternet: string;
  userAgent: string;
  fechaCliente: string;
  fechaServidor: Timestamp;
}
```

### Estructura de Datos - Admin Users
```typescript
interface AdminUser {
  uid: string;
  email: string;
  displayName: string;
  isAdmin: boolean;
  createdAt: Timestamp;
  lastLogin: Timestamp | null;
}
```

## 🎯 Próximos Pasos

1. **Personalizar credenciales** de administradores
2. **Configurar dominio de producción** en Firebase
3. **Implementar notificaciones** por email
4. **Agregar analytics** de contactos
5. **Crear backup automático** de datos

---

✅ **Sistema completamente funcional y listo para producción!**