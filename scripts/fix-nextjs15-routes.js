#!/usr/bin/env node

/**
 * Script para buscar y corregir rutas API con formato de parámetros incompatible con Next.js 15
 * Busca archivos que usen { params: { id: string } } y los reemplaza con { params: Promise<{ id: string }> }
 */

const fs = require('fs');
const path = require('path');

// Directorio a buscar
const apiDir = path.join(__dirname, '../src/app/api');

// Patrón a buscar
const searchPattern = /{ params }:\s*{\s*params:\s*{\s*id:\s*string\s*}\s*}/g;

// Patrón de reemplazo
const replacePattern = '{ params }: { params: Promise<{ id: string }> }';

// Patrón para buscar desestructuración de params
const destructurePattern = /const\s*{\s*id\s*}\s*=\s*params\s*;?/g;

// Patrón para reemplazar desestructuración
const destructureReplace = 'const { id } = await params;';

// Función para buscar archivos recursivamente
function findFiles(dir, pattern) {
  const results = [];
  
  if (!fs.existsSync(dir)) {
    return results;
  }
  
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      results.push(...findFiles(filePath, pattern));
    } else if (pattern.test(file)) {
      results.push(filePath);
    }
  }
  
  return results;
}

// Función para procesar un archivo
function processFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Reemplazar el tipo de parámetros
    content = content.replace(searchPattern, replacePattern);
    
    // Reemplazar la desestructuración de params
    content = content.replace(destructurePattern, destructureReplace);
    
    // Si el contenido cambió, guardar el archivo
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✅ Fixed: ${filePath}`);
      return true;
    }
    
    return false;
  } catch (error) {
    console.error(`❌ Error processing ${filePath}:`, error.message);
    return false;
  }
}

// Función principal
function main() {
  console.log('🔍 Searching for API routes with Next.js 15 compatibility issues...');
  
  // Buscar todos los archivos route.ts en subdirectorios que contengan [id]
  const routeFiles = findFiles(apiDir, /\[.*\]/);
  const apiRouteFiles = routeFiles.filter(file => file.endsWith('route.ts'));
  
  console.log(`📁 Found ${apiRouteFiles.length} API route files to check`);
  
  let fixedCount = 0;
  
  for (const file of apiRouteFiles) {
    if (processFile(file)) {
      fixedCount++;
    }
  }
  
  console.log(`\n✨ Fixed ${fixedCount} files with Next.js 15 compatibility issues`);
  
  if (fixedCount > 0) {
    console.log('\n📝 Summary of changes:');
    console.log('  - Changed { params: { id: string } } to { params: Promise<{ id: string }> }');
    console.log('  - Changed const { id } = params; to const { id } = await params;');
  }
}

// Ejecutar el script
if (require.main === module) {
  main();
}

module.exports = { findFiles, processFile, main };