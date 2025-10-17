# Configuración de Puertos Dinámicos en EasyPanel

## ¿Cómo maneja EasyPanel los puertos dinámicos?

EasyPanel está diseñado para manejar automáticamente la asignación de puertos cuando tienes múltiples aplicaciones corriendo en el mismo servidor. Esto evita conflictos de puertos y permite que varias aplicaciones coexistan sin problemas.

## Configuración Implementada

### 1. Docker Compose para EasyPanel

He actualizado [`docker-compose.easypanel.yml`](docker-compose.easypanel.yml) para usar puertos dinámicos:

```yaml
# En lugar de mapear puertos fijos:
# ports:
#   - "3000:3000"

# Usamos expose para que EasyPanel maneje los puertos:
expose:
  - "3000"
```

### 2. Configuración de Servicio EasyPanel

He creado [`easypanel-service.json`](easypanel-service.json) con configuración específica para puertos dinámicos:

```json
"ports": {
  "3000": "0"  // EasyPanel asignará un puerto dinámico automáticamente
}
```

El valor `"0"` indica a EasyPanel que asigne automáticamente un puerto disponible.

## ¿Cómo funciona en la práctica?

1. **EasyPanel detecta automáticamente** los puertos disponibles en tu servidor
2. **Asigna un puerto único** para tu aplicación CRM
3. **Configura el proxy inverso** (generalmente Nginx) para redirigir el tráfico
4. **Maneja el SSL/TLS** automáticamente para tu dominio

## Lo que no necesitas preocuparte

- ❌ No necesitas especificar puertos manualmente
- ❌ No necesitas configurar el proxy inverso
- ❌ No necesitas manejar conflictos de puertos
- ❌ No necesitas configurar SSL manualmente

## Lo que EasyPanel hace por ti

- ✅ Asigna puertos dinámicamente
- ✅ Configura el proxy inverso automáticamente
- ✅ Gestiona los certificados SSL/TLS
- ✅ Balancea la carga si es necesario
- ✅ Maneja el enrutamiento basado en dominio

## Flujo de Despliegue con Puertos Dinámicos

1. **Subes tu código a GitHub**
2. **Conectas tu repositorio en EasyPanel**
3. **EasyPanel builda tu aplicación Docker**
4. **EasyPanel asigna un puerto dinámico automáticamente**
5. **EasyPanel configura el proxy inverso para tu dominio**
6. **Tu aplicación queda accesible via HTTPS en tu dominio**

## Ejemplo de Configuración Final

Cuando completes el despliegue, tu configuración se verá así:

```
Tu dominio: https://crm-restaurante.easypanel.io
├── EasyPanel Proxy (HTTPS, puerto 443)
├── Nginx Reverse Proxy (interno)
├── Tu aplicación (puerto dinámico, ej: 30012)
└── Base de datos (puerto dinámico, ej: 30013)
```

## Verificación del Despliegue

Para verificar que todo funciona correctamente:

1. **Accede a tu dominio** (ej: https://crm-restaurante.easypanel.io)
2. **Verifica que carga HTTPS** correctamente
3. **Prueba la funcionalidad básica** de la aplicación
4. **Revisa los logs** en el dashboard de EasyPanel

## Si Usas Dominio Personalizado

Si configuras un dominio personalizado más tarde:

1. **Configura el dominio** en EasyPanel
2. **Actualiza las variables de entorno**:
   ```bash
   NEXTAUTH_URL=https://tu-dominio.com
   NEXT_PUBLIC_APP_URL=https://tu-dominio.com
   ```
3. **EasyPanel actualizará automáticamente** la configuración del proxy

## Solución de Problemas

Si tienes problemas con los puertos:

1. **Revisa los logs de EasyPanel** para ver si hay errores de puerto
2. **Verifica que tu aplicación escuche en el puerto 3000** (interno)
3. **Confirma que no tienes otras aplicaciones usando el mismo puerto interno**
4. **Reinicia el servicio** desde el dashboard de EasyPanel

## Resumen

Con la configuración que he preparado:

- ✅ EasyPanel manejará automáticamente los puertos dinámicos
- ✅ No tendrás conflictos con otras aplicaciones
- ✅ Tu aplicación será accesible via HTTPS en tu dominio
- ✅ Todo el enrutamiento y proxy será configurado automáticamente

Solo necesitas preocuparte por configurar tus variables de entorno y subir tu código a GitHub. ¡EasyPanel se encarga del resto!