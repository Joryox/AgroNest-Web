# AgroNest 🌾

**AgroNest** es una plataforma de finanzas descentralizadas (DeFi) diseñada para conectar a agricultores tradicionales con inversores globales. Permite a los agricultores tokenizar sus futuras cosechas para obtener financiamiento temprano, mientras que los inversores obtienen exposición a activos del mundo real (RWA) respaldados por la producción agrícola.

Este repositorio es un **monorepo** que contiene tanto el Backend (FastAPI + Smart Contracts) como el Frontend (React + Vite).

---

## 📁 Estructura del Repositorio

```
AgroNest-Web/
├── Backend/                      # API FastAPI + Smart Contracts
│   ├── App/
│   │   ├── core/                 # Configuración (settings.py)
│   │   ├── models/               # Modelos Tortoise ORM
│   │   ├── routers/              # Endpoints FastAPI
│   │   ├── schemas/              # Validación Pydantic
│   │   ├── services/             # Lógica de negocio (blockchain, etherfuse, marketplace)
│   │   └── utils/                # Auth JWT, logger
│   ├── contracts/
│   │   ├── abis/                 # ABIs de contratos inteligentes
│   │   ├── contracts/            # Código fuente Solidity
│   │   └── scripts/              # Scripts de despliegue Hardhat
│   ├── scripts/                  # Migraciones SQL
│   ├── main.py                   # Entry point FastAPI
│   └── requirements.txt
│
└── Frontend/                     # Aplicación Web React
    └── src/
        ├── features/             # Módulos por dominio
        │   ├── auth/             # Autenticación
        │   ├── cosechas/         # Gestión de cosechas
        │   ├── inversiones/      # Gestión de inversiones
        │   ├── boveda/           # Bóveda de rendimiento
        │   ├── marketplace/      # Marketplace NFT
        │   ├── etherfuse/        # CETES on-chain
        │   ├── oracle/           # Datos satelitales NDVI
        │   ├── wallet/           # Wallet management
        │   └── ai/               # Chat asistente agrícola
        ├── components/           # Componentes UI reutilizables
        └── pages/                # Páginas de la aplicación
```

---

## 🚀 Tecnologías y Sponsors Integrados

### 1. Arbitrum Sepolia — Blockchain Core

Toda la lógica de financiamiento, minteo de NFTs de cosechas y registro de inversiones ocurre en **Arbitrum**. Elegimos esta red (L2 de Ethereum) porque:

- **Micro-financiamiento viable:** Las bajísimas comisiones de gas hacen posible que cualquier inversor aporte pequeñas cantidades de USDC sin que las tarifas se coman su inversión.
- **Transparencia inmutable:** Los contratos inteligentes gestionan el ciclo de vida completo de cada inversión.

**Integración técnica:**
- Smart contracts en Solidity desplegados con **Hardhat** (carpeta `Backend/contracts/`)
- Backend conectado vía **web3.py 7** a la red Sepolia (Chain ID: `11155111`)
- Frontend conectado vía **ethers.js 6** para firma de transacciones desde el wallet del usuario
- Contratos clave: `AGRONEST_CONTRACT_ADDRESS` (minteo de NFTs y gestión de bóvedas) y `USDC_CONTRACT_ADDRESS`

---

### 2. Etherfuse — MXNb / CETES on-chain

Integramos los bonos tokenizados del gobierno mexicano **MXNb (CETES)** de **Etherfuse**.

- **Caso de uso:** Permite a agricultores e inversores resguardar su capital o ganancias en un activo estable respaldado por deuda soberana, mitigando la volatilidad cripto mientras los fondos están inactivos.

**Integración técnica:**
- Servicio dedicado `Backend/App/services/etherfuse.py` con cliente HTTP hacia `https://api.sand.etherfuse.com`
- Flujo completo: KYC (`/etherfuse/onboarding`) → activos disponibles → cotización → orden → webhook de confirmación
- **Modo mock automático:** cuando `ETHERFUSE_API_KEY` está vacía, todos los endpoints devuelven datos demo realistas sin llamar a la API real
- Endpoints expuestos: `/etherfuse/onboarding`, `/etherfuse/customer`, `/etherfuse/assets`, `/etherfuse/quote`, `/etherfuse/order`, `/etherfuse/orders`, `/etherfuse/webhook`

---

### 3. Rare Protocol — NFT Marketplace

Nuestro **Mercado Secundario** está impulsado por **Rare Protocol**.

- **Caso de uso:** Los NFTs de las cosechas (comprobantes de apoyo/inversión) pueden listarse y comercializarse en nuestro marketplace, aportando **liquidez inmediata** a inversores que necesiten salir de su posición antes de la fecha de cosecha.

**Integración técnica:**
- Servicio `Backend/App/services/rare_protocol.py` para interacción con el contrato `RARE_CONTRACT_ADDRESS`
- Red: **Base Sepolia** (`RARE_NETWORK=base-sepolia`)
- Ciclo de vida de un listing: publicar → confirmar on-chain → cancelar o marcar como vendido
- Endpoints expuestos: `GET/POST /marketplace`, `PUT /marketplace/{id}/confirm`, `POST /marketplace/{id}/cancel`, `POST /marketplace/{id}/sold`

---

### 4. Chainlink / NASA Satellites — Oráculo NDVI

Utilizamos validación satelital de coordenadas geográficas reales del cultivo.

- **Caso de uso:** Cada cosecha registrada incluye latitud/longitud. El oráculo calcula el índice **NDVI** (Normalized Difference Vegetation Index) mediante imágenes satelitales NASA para verificar que el terreno declarado existe y tiene vegetación activa.
- Endpoint expuesto: `GET /oracle/ndvi?lat=...&lon=...`

---

## 🛠️ Stack Tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | React 19, Vite 6, TypeScript, Tailwind CSS 4 |
| **Web3 (frontend)** | Ethers.js 6 |
| **Estado y datos** | TanStack Query, Zustand |
| **UI / Animaciones** | Framer Motion, MapLibre GL, Recharts |
| **Backend** | FastAPI 0.111, Python 3.11+ |
| **ORM / Base de datos** | Tortoise ORM 0.21 + asyncpg + PostgreSQL 14+ |
| **Caché / Sesiones** | Redis 5 (opcional — degradación elegante) |
| **Autenticación** | JWT (PyJWT 2.8) — access + refresh tokens |
| **Blockchain (backend)** | web3.py 7 — Sepolia (Chain ID 11155111) |
| **AI** | Google Gemini (`google-genai`) con fallback demo sin credenciales |
| **Smart Contracts** | Solidity + Hardhat + OpenZeppelin + Chainlink |
| **Servidor** | Uvicorn 0.30 |

---

## ⚡ Inicio Rápido

### Backend

**Prerrequisitos:**
- Python 3.11+
- PostgreSQL corriendo en `localhost:5432`
- (Opcional) Redis en `localhost:6379`

```bash
cd Backend

# Crear y activar entorno virtual
python -m venv venv
venv\Scripts\activate          # Windows
# source venv/bin/activate     # Linux/Mac

# Instalar dependencias
pip install -r requirements.txt
```

**Configuración:** copia `.env.example` a `.env` y completa las variables (ver tabla completa en la sección [Configuración del Backend](#configuración-del-backend)).

**Migración de base de datos** (antes del primer arranque):

```bash
psql -U postgres -d <nombre_db> -f scripts/migrate_v2.sql
```

**Arranque:**

```bash
# Desarrollo (recarga automática)
uvicorn main:app --host 127.0.0.1 --port 8001 --reload

# Producción
uvicorn main:app --host 0.0.0.0 --port 8001 --workers 4
```

La API queda disponible en `http://localhost:8001`.

| URL | Descripción |
|---|---|
| `http://localhost:8001/docs` | Swagger UI (requiere Basic Auth del `.env`) |
| `http://localhost:8001/redoc` | ReDoc |
| `http://localhost:8001/openapi.json` | Esquema OpenAPI |

---

### Frontend

**Prerrequisitos:** Node.js 18+, pnpm

```bash
cd Frontend

pnpm install
pnpm dev
```

La aplicación queda disponible en `http://localhost:5173`.

---

## 📡 API — Endpoints

### Autenticación — `/token`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/token` | Login — devuelve `access_token` y `refresh_token` (form-urlencoded) |
| POST | `/token/renovacion` | Renueva el access token usando el refresh token |
| POST | `/token/revocacion` | Revoca (logout) el token activo |

### Usuarios — `/usuarios`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/usuarios` | Registro de nuevo usuario |
| GET | `/usuarios/mi_info` | Perfil del usuario autenticado |
| PUT | `/usuarios/{id}` | Editar perfil |

### Cosechas — `/cosechas`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/cosechas` | Registrar cosecha y mintear NFT en Sepolia |
| GET | `/cosechas` | Listar todas las cosechas (paginado) |
| GET | `/cosechas/mis_cosechas` | Cosechas del usuario autenticado |
| GET | `/cosechas/{id}` | Detalle de una cosecha |
| POST | `/cosechas/{id}/eliminar` | Eliminar cosecha (soft delete) |

### Bóveda — `/boveda`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/boveda` | Abrir bóveda para una cosecha |
| GET | `/boveda` | Listar bóvedas (filtro por estado) |
| GET | `/boveda/{id}` | Detalle de bóveda |
| GET | `/boveda/cosecha/{cosecha_id}` | Bóveda por cosecha |
| GET | `/boveda/{id}/chain` | Estado on-chain de la bóveda |

### Inversiones — `/inversiones`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/inversiones` | Crear inversión en una cosecha |
| GET | `/inversiones` | Mis inversiones |
| GET | `/inversiones/{id}` | Detalle de inversión |

### Blockchain — `/blockchain`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/blockchain/wallet` | Dirección y balances del wallet custodial |
| GET | `/blockchain/balance/{address}` | Balances ETH + USDC + bCROP de cualquier address |
| GET | `/blockchain/tx/{tx_hash}` | Estado de una transacción |

### Etherfuse CETES — `/etherfuse`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/etherfuse/onboarding` | KYC — crea cliente Etherfuse |
| GET | `/etherfuse/customer` | Datos del cliente KYC |
| PUT | `/etherfuse/customer/wallet` | Actualizar wallet address |
| GET | `/etherfuse/assets` | Activos CETES disponibles |
| POST | `/etherfuse/quote` | Cotizar onramp / offramp |
| POST | `/etherfuse/order` | Crear orden de conversión |
| POST | `/etherfuse/order/{id}/simulate` | Simular recepción de fiat (sandbox) |
| GET | `/etherfuse/orders` | Historial de órdenes |
| GET | `/etherfuse/orders/{id}` | Detalle de orden |
| POST | `/etherfuse/webhook` | Webhook para eventos de Etherfuse |

> **Modo mock:** cuando `ETHERFUSE_API_KEY` está vacía, todos los endpoints devuelven datos demo realistas sin llamar a la API real.

### Marketplace NFT — `/marketplace`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/marketplace` | Listar NFTs en venta |
| GET | `/marketplace/{id}` | Detalle de listing |
| POST | `/marketplace` | Publicar NFT de cosecha |
| PUT | `/marketplace/{id}/confirm` | Confirmar listing on-chain |
| POST | `/marketplace/{id}/cancel` | Cancelar listing |
| POST | `/marketplace/{id}/sold` | Marcar como vendido |

### Oracle / Satélite — `/oracle`

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/oracle/ndvi` | Índice de vegetación NDVI por coordenadas |

### AI Chat — `/ai`

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/ai/chat` | Chat con asistente agrícola (Gemini) |

---

## ⚙️ Configuración del Backend

Variables de entorno requeridas en `Backend/.env`:

```env
# API
API_BASE_URL=http://localhost:8001
API_BASE_DESCRIPTION="Entorno Local"
ENVIRONMENT_BASE_URL='{"LOCAL": "http://localhost:8001/"}'

# Swagger Basic Auth
SWAGGER_USERNAME=<usuario-swagger>
SWAGGER_PASSWORD=<contraseña-swagger>
SKIP_SETUP=False
SECRET_KEY=<cadena-aleatoria-secreta>

# JWT
JWT_SECRET=<hex-64-chars>
JWT_SECRET_RENEW=<hex-64-chars>
JWT_TOKEN_EXPIRATION=200       # minutos
JWT_RENEW_EXPIRATION=9         # minutos
ALGORITHM=HS256

# Logs
LOG_ROUTE=log/
LOG_LEVEL=DEBUG
LOG_FILE_SIZE=21600000
LOG_BACKUP_COUNT=30
LOG_NOMENCLATURE=log

# Base de datos
DB_SERVER=localhost
DB_SERVER_PORT=5432
DB_USER=<usuario-postgres>
DB_PASSWORD=<contraseña-postgres>
DB_DATABASE=<nombre-base-de-datos>

# Redis (opcional — la API funciona sin él)
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_DB=0
REDIS_EXP=86400

# SMTP (recuperación de contraseña)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<correo>
SMTP_PASSWORD=<app-password>
VCODE_EXP_MIN=3
ML_EXP_MIN=30

CREATE_CONFIGURATION=True

# Blockchain — Arbitrum Sepolia (Chain ID 11155111)
RPC_URL=https://sepolia.drpc.org
CHAIN_ID=11155111
API_PRIVATE_KEY=<clave-privada-dev>      # NUNCA en producción
CONTRACT_ABI_DIR=./contracts/abis
AGRONEST_CONTRACT_ADDRESS=<address>
USDC_CONTRACT_ADDRESS=<address>

# Google Gemini AI (dejar vacío activa respuestas demo)
GEMINI_API_KEY=

# Etherfuse CETES (dejar vacío activa modo mock con datos demo)
ETHERFUSE_API_KEY=
ETHERFUSE_BASE_URL=https://api.sand.etherfuse.com

# Rare Protocol / NFT Marketplace (Base Sepolia)
RARE_CONTRACT_ADDRESS=
RARE_NETWORK=base-sepolia
```

---

## 📝 Notas de Desarrollo

- **Redis no requerido:** la API opera sin Redis. La revocación de tokens se salta silenciosamente con un warning en log; los tokens expiran por TTL del JWT.
- **Blockchain Sepolia:** el mint de NFTs requiere ETH de testnet en `API_PRIVATE_KEY`. Obtener en [sepoliafaucet.com](https://sepoliafaucet.com).
- **Gemini AI:** sin API key, el chat responde con datos demo agrícolas. Obtener key en [aistudio.google.com](https://aistudio.google.com).
- **Etherfuse:** sin API key, todos los endpoints CETES devuelven datos mock. Obtener key en [dashboard.etherfuse.com](https://dashboard.etherfuse.com).
