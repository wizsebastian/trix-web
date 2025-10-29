// Script para configurar usuarios administradores iniciales
// Ejecutar con: node setup-admin.js

import admin from 'firebase-admin';
import { readFileSync } from 'fs';

// Configurar Firebase Admin SDK
const serviceAccount = JSON.parse(readFileSync('./trix-3ef96-firebase-adminsdk-fbsvc-ed58cf48ac.json', 'utf8'));

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: 'trix-3ef96'
});

const db = admin.firestore();
const auth = admin.auth();

// Lista de administradores para crear
const adminUsers = [
  {
    email: 'admin@trixgeo.com',
    password: 'TrixAdmin2025!',
    displayName: 'Administrador TRIX'
  },
  {
    email: 'luis@trixgeo.com', 
    password: 'LuisAdmin2025!',
    displayName: 'Luis Vasquez'
  },
  {
    email: 'geomatrix@gmail.com',
    password: 'GeomatrixAdmin2025!',
    displayName: 'Geomatrix Admin'
  }
];

async function setupAdminUsers() {
  console.log('🚀 Configurando usuarios administradores...\n');

  for (const adminUser of adminUsers) {
    try {
      // Crear usuario en Firebase Authentication
      console.log(`📧 Creando usuario: ${adminUser.email}`);
      
      let userRecord;
      try {
        // Intentar obtener el usuario existente
        userRecord = await auth.getUserByEmail(adminUser.email);
        console.log(`✅ Usuario ya existe: ${adminUser.email}`);
      } catch (error) {
        // Si no existe, crearlo
        userRecord = await auth.createUser({
          email: adminUser.email,
          password: adminUser.password,
          displayName: adminUser.displayName,
          emailVerified: true
        });
        console.log(`✅ Usuario creado: ${adminUser.email}`);
      }

      // Crear/actualizar documento de administrador en Firestore
      await db.collection('admin_users').doc(userRecord.uid).set({
        email: adminUser.email,
        displayName: adminUser.displayName,
        isAdmin: true,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        lastLogin: null
      });

      console.log(`✅ Permisos de admin configurados para: ${adminUser.email}`);
      console.log(`📧 Email: ${adminUser.email}`);
      console.log(`🔑 Password: ${adminUser.password}\n`);

    } catch (error) {
      console.error(`❌ Error configurando ${adminUser.email}:`, error.message);
    }
  }

  console.log('🎉 Configuración completada!');
  console.log('\n📋 Resumen de administradores:');
  console.log('================================');
  
  adminUsers.forEach(admin => {
    console.log(`👤 ${admin.displayName}`);
    console.log(`   📧 Email: ${admin.email}`);
    console.log(`   🔑 Password: ${admin.password}`);
    console.log('');
  });

  console.log('🌐 Accede al panel admin en: http://localhost:5173/admin');
  console.log('');
  
  process.exit(0);
}

// Función para crear colecciones de ejemplo
async function setupCollections() {
  console.log('📁 Configurando colecciones de base de datos...');
  
  // Crear ejemplo de contacto (para testing)
  const ejemploContacto = {
    nombre: 'Usuario de Prueba',
    email: 'test@example.com',
    mensaje: 'Este es un contacto de prueba para verificar el funcionamiento del sistema.',
    navegador: 'Chrome',
    sistemaOperativo: 'Windows',
    tipoDispositivo: 'Escritorio',
    resolucion: '1920x1080',
    idioma: 'es-ES',
    zona_horaria: 'America/Mexico_City',
    url: 'http://localhost:5173',
    referrer: 'Directo',
    velocidadInternet: '4g',
    fechaCliente: new Date().toISOString(),
    fechaServidor: admin.firestore.FieldValue.serverTimestamp()
  };

  await db.collection('contactos').add(ejemploContacto);
  console.log('✅ Contacto de ejemplo creado');
}

// Ejecutar configuración
async function main() {
  try {
    await setupAdminUsers();
    await setupCollections();
  } catch (error) {
    console.error('❌ Error en la configuración:', error);
    process.exit(1);
  }
}

main();