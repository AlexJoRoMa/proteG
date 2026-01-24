/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

const environment = process.argv[2] || 'local';
const envFile = `.env.${environment}`;
const targetFile = '.env.local'; // Cambiado para tener mayor prioridad

// Función para verificar si el archivo existe
if (!fs.existsSync(envFile)) {
  console.error(`❌ El archivo ${envFile} no existe`);
  console.log(`📁 Archivos .env disponibles:`);
  
  // Mostrar archivos .env disponibles
  const envFiles = fs.readdirSync('.').filter(file => file.startsWith('.env.'));
  if (envFiles.length === 0) {
    console.log(`   No se encontraron archivos .env.*`);
  } else {
    envFiles.forEach(file => console.log(`   - ${file}`));
  }
  
  process.exit(1);
}

try {
  // Copiar el archivo
  fs.copyFileSync(envFile, targetFile);
  console.log(`✅ Variables de entorno cargadas desde ${envFile}`);
  console.log(`📄 Archivo copiado a ${targetFile} (alta prioridad)`);
  
  // Mostrar las variables que se cargaron (sin valores por seguridad)
  const envContent = fs.readFileSync(targetFile, 'utf8');
  const envVars = envContent.split('\n')
    .filter(line => line.trim() && !line.startsWith('#'))
    .map(line => line.split('=')[0]);
    
  if (envVars.length > 0) {
    console.log(`🔧 Variables configuradas: ${envVars.join(', ')}`);
  }
  
} catch (error) {
  console.error(`❌ Error al copiar el archivo: ${error.message}`);
  process.exit(1);
}
