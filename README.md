# 🧑‍💼 Gestión de Personas - CRUD Web App

Este proyecto es una aplicación web para la gestión de personas, que implementa operaciones CRUD (Crear, Leer, Actualizar, Eliminar) sobre registros de usuarios. Está diseñada con una arquitectura moderna, escalable y segura, ideal para entornos empresariales o pruebas técnicas que requieren una base sólida y extensible.

## 🏗️ Arquitectura del Proyecto

### Frontend: Next.js (con TypeScript)

**Motivo principal:** productividad, tipado seguro y escalabilidad.

**Razones clave:**
- TypeScript reduce errores y mejora mantenibilidad.
- Next.js ofrece una arquitectura moderna y flexible (SSR/SPA) perfecta para interfaces CRUD.
- Amplia comunidad, documentación y ecosistema sólido.
- Permite crecer sin tener que reescribir el proyecto más adelante.

### Backend: ASP.NET Core Web API (.NET 8)

**Motivo principal:** alto rendimiento y arquitectura limpia.

**Razones clave:**
- .NET 8 es LTS, moderno, estable y optimizado.
- ASP.NET Core es ideal para APIs REST y microservicios.
- Ofrece DI, middlewares, pipeline configurable y soporte nativo para patrones por capas.
- Integración perfecta con Entity Framework Core.

### Base de datos: SQL Server

**Motivo principal:** compatibilidad natural con EF Core y estabilidad.

**Razones clave:**
- Mejor soporte oficial para Entity Framework Core.
- Herramientas profesionales y alta estabilidad.
- Amplio uso en entornos empresariales y fácil integración con .NET.
- Buen rendimiento y escalabilidad sin configuraciones complejas.

## 🧠 Diseño Conceptual del Dominio

El modelo de datos fue diseñado con enfoque en escalabilidad, seguridad y buenas prácticas arquitectónicas. Aunque la autenticación era opcional, se incorporó desde el inicio para:

- Presentar una arquitectura completa y lista para crecer.
- Preparar el proyecto para escenarios RBAC (Role-Based Access Control).
- Evitar rediseños futuros y soportar JWT de forma nativa.

### 🔐 Separación de entidades: `Persons` y `Users`

**Motivos:**
- **Responsabilidad Única (SOLID):** separación entre datos personales y credenciales.
- **Seguridad:** evita mezclar información sensible con datos demográficos.
- **Extensibilidad:** `Persons` puede usarse en módulos futuros (RRHH, auditoría, etc.).
- **Privacidad:** facilita cumplimiento de normativas como GDPR/LGPD.

### 🆔 Uso de `UserGuid`

El campo `UserGuid` permite exponer identificadores en URLs sin riesgo de enumeración de IDs.

**Ventajas:**
- Evita que se adivinen IDs de otros usuarios.
- Mejora la seguridad sin complejidad adicional.
- Estándar para recursos REST seguros.

### 🧑‍💼 Modelo de Roles independiente

Se implementó una tabla `Roles` en lugar de usar strings fijos.

**Ventajas:**
- Normaliza niveles de acceso.
- Permite agregar roles sin modificar `Users`.
- Mejora el diseño relacional.
- Prepara el sistema para RBAC avanzado.

### 🖼️ Campo `PhotoUrl` en `Persons`

Agregar una foto del usuario es útil en sistemas como:

- Recursos Humanos
- Gestión de clientes
- Portales de autoservicio

**Implementación recomendada:** almacenar solo la URL de la imagen.

**Ventajas:**
- Evita saturar la base de datos.
- Facilita uso de servicios externos (S3, Azure Blob).
- Mejora tiempos de carga y backups.

### 🔒 Seguridad: `PasswordHash` y `PasswordSalt`

**Buenas prácticas aplicadas:**
- Nunca se almacena la contraseña en texto plano.
- `PasswordHash` guarda el hash criptográfico.
- `PasswordSalt` asegura unicidad del hash incluso con contraseñas iguales.

**Protección contra:**
- Rainbow tables
- Credential stuffing
- Hash comparison attacks

## 👥 Usuarios de prueba

Estos usuarios están disponibles para realizar pruebas de autenticación y roles dentro del sistema.

### User 1
- **Email:** `carlos.perez@example.com`
- **Password:** `miguelnew%F`
- **Rol:** Admin

### User 2
- **Email:** `maria.lopez@example.com`
- **Password:** `coder!V8t`
- **Rol:** User

### User 3
- **Email:** `juan.garcia@example.com`
- **Password:** `alpha$M3g`
- **Rol:** User

### User 4
- **Email:** `luisa.martinez@example.com`
- **Password:** `newton%Q7z`
- **Rol:** User


## 🚀 Formas de arrancar el proyecto

Promero descargar no clonar el repositorio
   ```bash
 git clone https://github.com/MiguelAngelEPN/people-management-system.git
```
### ✅ Forma 1: Arrancar todo usando Docker Compose (recomendada)

1. **Levanta toda la solución completa: Frontend (Next.js), Backend (.NET API) y SQL Server con el script `init sql`.**

2. **Requisitos**
   - Docker  
   - Docker Compose
   - Puerto: 3000 disponible
   - Puerto: 1433 disponible
   - Puerto: 7000 disponible

3. **Cómo ejecutar todo el proyecto**
   ```bash
   docker compose up --build

front: http://localhost:3000
apis: http://localhost:7000/swagger/index.html


### ✅ Forma 2: Ejecutar sin docker.
#### ✅ Ejecutar el Backend manualmente (.NET 8)
1. **Ejecuta únicamente la API desde la CLI o Visual Studio.**

2. **Requisitos**
   - .NET SDK 8
   - Visual Studio 2022 (opcional)

3. **Cómo ejecutarlo**

   ```bash
   cd UserServiceAPI/UserServiceAPI
   dotnet run

#### ✅ jecutar el Frontend manualmente (Next.js)
1. **Ejecuta el proyecto frontperson**

2. **Requisitos**
   - Node.js >= 20.9
   - NPM

3. **Cómo ejecutarlo en modo desarrollo**

   ```bash
   cd frontperson
   npm install
   npm run dev

4. **Cómo ejecutarlo en modo produccipón**
   ```bash
   npm run build
   npm run start


#### ✅ Baase de datos:
 Copiar el archivo init.sql y ejecutarlo en SQLSERVER