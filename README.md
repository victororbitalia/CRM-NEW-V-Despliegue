# CRM Restaurante

Sistema de gestión de reservas para restaurantes construido con Next.js 15, TypeScript, Tailwind CSS y Prisma ORM.

## Características

- 🏪 Gestión completa del perfil del restaurante
- 🪑 Gestión de mesas y visualización de layout
- 📅 Sistema completo de reservas con estados y notificaciones
- 🔐 Autenticación basada en JWT con control de roles y permisos
- 👥 Gestión de clientes con historial y preferencias
- 📱 Diseño responsivo optimizado para móviles
- 🎨 Sistema de diseño personalizado con Tailwind CSS
- 🌍 Soporte para español y zona horaria Europa/Madrid
- 📊 Analytics y reportes de ocupación
- 🔄 Sistema de notificaciones por email y SMS

## Stack Tecnológico

- **Frontend**: Next.js 15 con App Router, React 19, TypeScript
- **Backend**: Next.js API routes con middleware de autenticación
- **Base de datos**: Prisma ORM con SQLite (desarrollo) / PostgreSQL (producción)
- **Estilos**: Tailwind CSS con sistema de diseño personalizado
- **Autenticación**: JWT con refresh tokens y bcryptjs
- **Validación**: Zod para validación de datos
- **Calidad de código**: ESLint, Prettier

## Requisitos Previos

- Node.js 18+ recomendado
- npm o yarn

## Instalación

1. Clonar el repositorio:
   ```bash
   git clone <repository-url>
   cd crm-restaurant
   ```

2. Instalar dependencias:
   ```bash
   npm install
   ```

3. Configurar variables de entorno:
   ```bash
   cp .env.example .env.local
   ```
   
   Editar `.env.local` con tus configuraciones específicas.

4. Inicializar la base de datos:
   ```bash
   npm run db:migrate
   npm run db:seed
   ```

5. Iniciar el servidor de desarrollo:
   ```bash
   npm run dev
   ```

6. Abrir [http://localhost:3000](http://localhost:3000) en tu navegador.

## Scripts Disponibles

### Desarrollo
- `npm run dev` - Iniciar servidor de desarrollo
- `npm run build` - Construir aplicación para producción
- `npm run start` - Iniciar servidor de producción

### Base de Datos
- `npm run db:generate` - Generar el cliente de Prisma
- `npm run db:migrate` - Crear y aplicar migraciones
- `npm run db:studio` - Abrir Prisma Studio
- `npm run db:seed` - Poblar la base de datos con datos de prueba
- `npm run db:reset` - Resetea la base de datos

### Calidad de Código
- `npm run lint` - Ejecutar ESLint
- `npm run lint:fix` - Ejecutar ESLint con auto-corrección
- `npm run format` - Formatear código con Prettier
- `npm run format:check` - Verificar formato del código
- `npm run type-check` - Verificar tipos de TypeScript

## Usuarios de Prueba

Después de ejecutar el seed, puedes usar estos usuarios para probar:

- **Admin**: `admin@restaurant.com` / `admin123`
- **Manager**: `manager@restaurant.com` / `manager123`

## Estructura del Proyecto

```
src/
├── app/                 # Páginas y layouts de Next.js 13+ App Router
│   ├── api/            # Rutas de la API
│   │   ├── auth/       # Endpoints de autenticación
│   │   ├── restaurants/ # Endpoints de restaurantes
│   │   └── reservations/ # Endpoints de reservas
│   ├── auth/           # Páginas de autenticación
│   ├── dashboard/      # Dashboard principal
│   ├── reservations/   # Gestión de reservas
│   ├── tables/         # Gestión de mesas
│   ├── restaurant/     # Configuración del restaurante
│   └── settings/       # Configuración general
├── components/         # Componentes de React
│   ├── ui/            # Componentes UI reutilizables
│   ├── forms/         # Formularios
│   └── layout/        # Componentes de layout
├── lib/               # Utilidades y configuración
│   ├── utils/         # Funciones utilitarias
│   ├── auth/          # Sistema de autenticación
│   └── db/            # Cliente de Prisma y helpers
├── types/             # Definiciones de tipos TypeScript
├── hooks/             # Custom hooks de React
└── store/             # Gestión de estado (si es necesario)
```

## Modelo de Datos

El sistema incluye las siguientes entidades principales:

### Autenticación y Usuarios
- **Users**: Información de usuarios del sistema
- **Roles**: Definición de roles con permisos
- **UserRoles**: Asociación entre usuarios y roles
- **UserSessions**: Gestión de sesiones activas
- **ActivityLogs**: Registro de actividades del sistema

### Restaurante
- **Restaurants**: Configuración principal del restaurante
- **OperatingHours**: Horarios de operación
- **RestaurantSettings**: Configuraciones específicas
- **BusinessRules**: Reglas de negocio personalizables

### Gestión de Mesas
- **Areas**: Áreas del restaurante (interior, terraza, etc.)
- **Tables**: Configuración de mesas individuales
- **TableMaintenance**: Registro de mantenimientos

### Sistema de Reservas
- **Customers**: Gestión de clientes
- **Reservations**: Reservas con estados y seguimiento
- **WaitlistEntries**: Lista de espera
- **ReservationNotifications**: Sistema de notificaciones

## API

La API sigue una estructura RESTful y está protegida con middleware de autenticación:

### Autenticación
- `POST /api/auth/login` - Iniciar sesión
- `POST /api/auth/logout` - Cerrar sesión
- `POST /api/auth/register` - Registrar nuevo usuario
- `POST /api/auth/refresh` - Refrescar token

### Restaurantes
- `GET /api/restaurants` - Obtener restaurantes
- `POST /api/restaurants` - Crear restaurante
- `GET /api/restaurants/[id]` - Obtener restaurante específico
- `PUT /api/restaurants/[id]` - Actualizar restaurante

### Reservas
- `GET /api/reservations` - Obtener reservas con filtros
- `POST /api/reservations` - Crear nueva reserva
- `GET /api/reservations/[id]` - Obtener reserva específica
- `PUT /api/reservations/[id]` - Actualizar reserva
- `DELETE /api/reservations/[id]` - Cancelar reserva

### Clientes
- `GET /api/customers` - Obtener clientes
- `POST /api/customers` - Crear nuevo cliente
- `GET /api/customers/[id]` - Obtener cliente específico
- `PUT /api/customers/[id]` - Actualizar cliente

## Variables de Entorno

Las siguientes variables de entorno están disponibles:

- `DATABASE_URL` - URL de conexión a la base de datos
- `NEXTAUTH_URL` - URL para NextAuth.js
- `NEXTAUTH_SECRET` - Secreto para NextAuth.js
- `JWT_SECRET` - Secreto para tokens JWT
- `JWT_EXPIRES_IN` - Tiempo de expiración del token JWT
- `REFRESH_TOKEN_SECRET` - Secreto para refresh tokens
- `DEFAULT_TIMEZONE` - Zona horaria por defecto (Europe/Madrid)

Ver `.env.example` para una lista completa de variables.

## Desarrollo

### Código Limpio

El proyecto incluye configuración para ESLint y Prettier. Antes de hacer commit:

```bash
npm run lint:fix
npm run format
```

### Tipos de TypeScript

El proyecto utiliza TypeScript estricto. Para verificar tipos:

```bash
npm run type-check
```

### Base de Datos

Para interactuar con la base de datos durante el desarrollo:

```bash
# Ver y editar datos
npm run db:studio

# Resetear base de datos
npm run db:reset

# Generar cliente después de cambios en el esquema
npm run db:generate
```

## Despliegue

El proyecto está preparado para despliegue con Docker y EasyPanel.

### Construcción Docker

```bash
docker build -t crm-restaurant .
```

### Ejecución con Docker Compose (por configurar)

```bash
docker-compose up -d
```

## Contribuir

1. Hacer fork del proyecto
2. Crear una rama para tu feature (`git checkout -b feature/amazing-feature`)
3. Hacer commit de tus cambios (`git commit -m 'Add some amazing feature'`)
4. Hacer push a la rama (`git push origin feature/amazing-feature`)
5. Abrir un Pull Request

## Licencia

Este proyecto está licenciado bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

## Soporte

Para soporte, contacta a support@restaurant.com o abre un issue en el repositorio.

## Estado del Proyecto

Este es un proyecto en desarrollo. Las siguientes funcionalidades han sido completadas:

- [x] Configuración inicial del proyecto
- [x] Sistema de diseño con Tailwind CSS
- [x] Configuración de base de datos con Prisma
- [x] Sistema de autenticación con JWT
- [x] API endpoints básicos para restaurantes y reservas
- [x] Hooks personalizados para interactuar con Prisma
- [x] Sistema de roles y permisos
- [x] Datos de prueba para desarrollo

Las siguientes funcionalidades están pendientes de implementación:

- [ ] Interfaz de usuario completa para todas las funcionalidades
- [ ] Dashboard con analytics y métricas
- [ ] Sistema de notificaciones por email y SMS
- [ ] Gestión completa de mesas con layout visual
- [ ] Configuración avanzada del restaurante
- [ ] Pruebas unitarias y de integración
- [] Configuración de Docker para producción

Ver [start-from-scratch/tasks.md](./start-from-scratch/tasks.md) para una lista detallada de tareas pendientes.
