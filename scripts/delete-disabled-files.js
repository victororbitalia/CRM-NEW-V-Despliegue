#!/usr/bin/env node

/**
 * Script para eliminar archivos deshabilitados que causan errores de compilación
 */

const fs = require('fs');
const path = require('path');

// Archivos a eliminar
const filesToDelete = [
  'src/components/tables/_disabled_ImprovedTableLayout.tsx',
];

// Función para eliminar un archivo
function deleteFile(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`✅ Deleted: ${filePath}`);
      return true;
    } else {
      console.log(`⚠️ File not found: ${filePath}`);
      return false;
    }
  } catch (error) {
    console.error(`❌ Error deleting ${filePath}:`, error.message);
    return false;
  }
}

// Función principal
function main() {
  console.log('🗑️ Deleting disabled files that cause compilation errors...');
  
  let deletedCount = 0;
  
  for (const file of filesToDelete) {
    if (deleteFile(file)) {
      deletedCount++;
    }
  }
  
  console.log(`\n✨ Deleted ${deletedCount} files`);
  
  if (deletedCount > 0) {
    console.log('\n📝 Next steps:');
    console.log('  1. git add .');
    console.log('  2. git commit -m "Remove disabled files causing compilation errors"');
    console.log('  3. git push origin main');
    console.log('  4. Trigger a new deployment in EasyPanel');
  }
}

// Ejecutar el script
if (require.main === module) {
  main();
}

module.exports = { deleteFile, main };