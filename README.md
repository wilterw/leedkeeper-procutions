# Lead Keeper SaaS - Guía de Acceso

Bienvenido al centro de mando de **Lead Keeper**. Sigue estas instrucciones para acceder y operar los sistemas tanto en entorno de desarrollo como en producción.

## 🚀 Acceso Rápido

### Frontend (Interfaz de Usuario)
- **URL Local**: [http://localhost:5173](http://localhost:5173)
- **Estado**: Operacional (Vite + React)

### Backend (Infraestructura de Datos)
- **URL Base**: [http://localhost:3000](http://localhost:3000)
- **API Health**: [http://localhost:3000/api/health](http://localhost:3000/api/health)
- **Estado**: Operacional (Node.js + Prisma)

---

## 🔑 Credenciales Predeterminadas

### Administrador del Sistema
Para gestionar autorizaciones y licencias:
- **Email**: `admin@econos.io`
- **Password**: `admin_password_123`
- **Panel de Control**: [http://localhost:5173/admin](http://localhost:5173/admin)

### Usuario Demo (Ejemplo)
- **Email**: `test@agency.io` (Requiere autorización en el Panel de Control)
- **Password**: `TestPass123!`

---

## 🛠️ Cómo Iniciar el Sistema

Si necesitas reiniciar los servicios manualmente, utiliza los siguientes comandos en terminales separadas:

### 1. Iniciar Infraestructura (Backend)
```powershell
cd backend
npm install
npx prisma migrate dev
node src/server.js
```

### 2. Iniciar Terminal (Frontend)
```powershell
cd frontend
npm install
npm run dev
```

---

## 📱 Notas sobre Responsividad
La plataforma ha sido optimizada para:
- **Desktop**: Gestión de datos de alta densidad.
- **Tablet**: Configuración fluida de agentes.
- **Mobile**: Monitoreo rápido y autorización de accesos.

> [!NOTE]
> Para probar la vista móvil en tu navegador, abre las herramientas de desarrollador (`F12`) y activa el **"Device Mode"**.
