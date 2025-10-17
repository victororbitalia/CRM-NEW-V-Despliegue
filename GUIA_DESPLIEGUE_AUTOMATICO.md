# Guía de Despliegue Automático con Contenedores Docker

Has elegido la opción más fácil para desplegar tu CRM en EasyPanel. Con esta configuración, todo se creará automáticamente, incluyendo la base de datos.

## ¿Qué pasará automáticamente?

✅ **Base de datos PostgreSQL** se creará automáticamente
✅ **Redis para caché** se creará automáticamente  
✅ **Migraciones de base de datos** se ejecutarán solas
✅ **Datos iniciales** se cargarán automáticamente
✅ **Puertos dinámicos** se asignarán sin conflictos
✅ **Volúmenes persistentes** se crearán para los datos

## Pasos previos (solo una vez)

### 1. Actualiza las variables de entorno

Edita el archivo [`.env.easypanel`](.env.easypanel):

```bash
# Reemplaza con tu URL real de EasyPanel
NEXTAUTH_URL=https://tu-app.easypanel.io
NEXT_PUBLIC_APP_URL=https://tu-app.easypanel.io

# Genera contraseñas seguras (mínimo 20 caracteres)
POSTGRES_PASSWORD=tu-contraseña-segura-para-postgres-aqui
REDIS_PASSWORD=tu-contraseña-segura-para-redis-aqui

# Genera secretos seguros (mínimo 32 caracteres)
JWT_SECRET=jwt-super-secreto-aqui-minimo-32-caracteres
REFRESH_TOKEN_SECRET=refresh-super-secreto-aqui-minimo-32-caracteres
NEXTAUTH_SECRET=nextauth-super-secreto-aqui-minimo-32-caracteres

# Configura tu email
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-contraseña-de-aplicacion-de-google
EMAIL_FROM=noreply@tu-dominio.com
```

### 2. Actualiza el dominio en Next.js

Edita [`next.config.ts`](next.config.ts):

```typescript
images: {
  domains: [
    'localhost',
    'tu-app.easypanel.io', // Reemplaza con tu URL real
  ],
  unoptimized: true,
},
```

## Despliegue en EasyPanel

### 1. Sube todo a GitHub

```bash
git add .
git commit -m "Prepare for EasyPanel deployment with Docker containers"
git push origin main
```

### 2. Crea la aplicación en EasyPanel

1. **Inicia sesión en tu dashboard de EasyPanel**
2. **Crea nueva aplicación**
3. **Conecta tu repositorio de GitHub**
4. **Configura los ajustes de build**:
   - Build Command: `npm run build`
   - Start Command: `npm start`
   - Node Version: `20.x`
   - Docker Compose File: `docker-compose.easypanel.yml`

### 3. Configura las variables de entorno

Copia todas las variables de [`.env.easypanel`](.env.easypanel) al dashboard de EasyPanel:

```bash
NODE_ENV=production
DATABASE_URL=postgresql://postgres:tu-contraseña-segura@postgres:5432/restaurant_crm
REDIS_URL=redis://redis:6379
POSTGRES_PASSWORD=tu-contraseña-segura-para-postgres-aqui
REDIS_PASSWORD=tu-contraseña-segura-para-redis-aqui
NEXTAUTH_URL=https://tu-app.easypanel.io
NEXT_PUBLIC_APP_URL=https://tu-app.easypanel.io
JWT_SECRET=jwt-super-secreto-aqui-minimo-32-caracteres
REFRESH_TOKEN_SECRET=refresh-super-secreto-aqui-minimo-32-caracteres
NEXTAUTH_SECRET=nextauth-super-secreto-aqui-minimo-32-caracteres
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=tu-email@gmail.com
EMAIL_PASSWORD=tu-contraseña-de-aplicacion-de-google
EMAIL_FROM=noreply@tu-dominio.com
```

### 4. Inicia el despliegue

1. **Haz clic en "Deploy"** en el dashboard de EasyPanel
2. **Espera a que termine el proceso de build**
3. **EasyPanel creará automáticamente**:
   - Contenedor de tu aplicación
   - Contenedor de PostgreSQL
   - Contenedor de Redis
   - Volúmenes para datos persistentes

### 5. Verificación automática

El script [`scripts/easypanel-init-db.sh`](scripts/easypanel-init-db.sh) se ejecutará automáticamente y:

1. **Esperará a que PostgreSQL esté listo**
2. **Generará el cliente de Prisma**
3. **Ejecutará todas las migraciones**
4. **Verificará si necesita datos iniciales**
5. **Cargará los datos iniciales automáticamente**

## ¿Qué esperar después del despliegue?

### Inmediatamente después del despliegue:

- ✅ Aplicación corriendo en tu URL de EasyPanel
- ✅ Base de datos creada con todas las tablas
- ✅ Usuario administrador creado (si está configurado en el seed)
- ✅ Configuración inicial del restaurante cargada

### Para verificar:

1. **Abre tu URL**: `https://tu-app.easypanel.io`
2. **Prueba el registro** de un nuevo usuario
3. **Prueba el inicio de sesión**
4. **Crea una reserva de prueba**
5. **Verifica que lleguen los emails** (si configuraste email)

## Mantenimiento automático

### Backups automáticos:

El script [`scripts/easypanel-backup.sh`](scripts/easypanel-backup.sh) creará automáticamente:

- **Backups de base de datos** diarios
- **Backups de archivos subidos** semanales
- **Limpieza de backups antiguos** (mantiene últimos 30 días)

### Monitoreo:

- **Health checks** automáticos cada 30 segundos
- **Reinicios automáticos** si algo falla
- **Logs centralizados** en el dashboard de EasyPanel

## Si necesitas acceder a la base de datos

Puedes conectarte a la base de datos usando:

```bash
# Desde el terminal de EasyPanel
npx prisma studio

# O con cualquier cliente PostgreSQL
# Host: postgres
# Puerto: 5432
# Usuario: postgres
# Password: tu-contraseña-segura-para-postgres-aqui
# Base de datos: restaurant_crm
```

## Solución de problemas comunes

### Si la aplicación no inicia:

1. **Revisa los logs** en el dashboard de EasyPanel
2. **Verifica que todas las variables de entorno** estén configuradas
3. **Asegúrate de que las contraseñas** sean seguras y coincidan

### Si hay errores de base de datos:

1. **Espera unos minutos** a que la base de datos se inicialice completamente
2. **Revisa los logs del contenedor postgres**
3. **Verifica que el script de inicialización** se ejecutó correctamente

### Si los emails no funcionan:

1. **Verifica las credenciales de email**
2. **Asegúrate de usar una contraseña de aplicación** de Google
3. **Revisa la carpeta de spam** si no llegan los emails

## Resumen del flujo automático

```
GitHub Push → EasyPanel Build → Contenedores Docker → Base de Datos Lista → Migraciones → Datos Iniciales → Aplicación Lista
```

¡Y listo! Con esta configuración, todo se crea y configura automáticamente. Solo necesitas configurar tus variables de entorno y EasyPanel se encarga del resto.