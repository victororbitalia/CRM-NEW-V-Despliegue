#!/bin/bash

# Script para ejecutar la corrección de rutas API de Next.js 15

echo "🔧 Ejecutando script para corregir rutas API de Next.js 15..."

# Verificar si Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Error: Node.js no está instalado o no está en el PATH"
    exit 1
fi

# Ejecutar el script de corrección
node scripts/fix-nextjs15-routes.js

echo "✅ Script de corrección ejecutado"
echo ""
echo "📝 Resumen de cambios realizados:"
echo "  - Cambiado { params: { id: string } } a { params: Promise<{ id: string }> }"
echo "  - Cambiado const { id } = params; a const { id } = await params;"
echo ""
echo "🚀 Ahora puedes subir los cambios a GitHub:"
echo "  git add ."
echo "  git commit -m \"Fix Next.js 15 compatibility: API routes params\""
echo "  git push origin main"