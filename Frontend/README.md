# AgroNest 🌾

**AgroNest** es una plataforma de finanzas descentralizadas (DeFi) diseñada para conectar a agricultores tradicionales con inversores globales. Permite a los agricultores tokenizar sus futuras cosechas para obtener financiamiento temprano, mientras que los inversores obtienen exposición a activos del mundo real (RWA) respaldados por la producción agrícola.

Este repositorio contiene la **Aplicación Web (Frontend)**. 
👉 **[Ver Repositorio del Backend y Smart Contracts aquí](https://github.com/Sw4rcoAGB/Argos-Net-Api)**

---

## 🚀 Tecnologías y Sponsors Integrados

Este proyecto fue desarrollado utilizando las mejores herramientas del ecosistema Web3 para garantizar escalabilidad, seguridad y bajos costos:

### 1. Arbitrum Sepolia (Blockchain Core)
Toda la lógica de financiamiento, minteo de NFTs de cosechas y registro de inversiones ocurre en **Arbitrum**. Elegimos esta red (L2 de Ethereum) porque permite:
- **Micro-financiamiento viable:** Las bajísimas comisiones de gas (fees) hacen posible que cualquier inversor aporte pequeñas cantidades de USDC sin que las tarifas se coman su inversión.
- **Transparencia Inmutable:** Los contratos inteligentes gestionan el ciclo de vida de la inversión.

### 2. Etherfuse (MXNb)
Integramos los bonos tokenizados del gobierno mexicano **MXNb (CETES)** de **Etherfuse**.
- **Casos de uso:** Permite a los agricultores e inversores resguardar su capital o ganancias en un activo estable respaldado por deuda soberana, mitigando la volatilidad del ecosistema cripto mientras sus fondos están inactivos.

### 3. Rare Protocol
Nuestro **Mercado Secundario** está impulsado por **Rare Protocol**.
- Los NFTs de las cosechas (que representan los comprobantes de apoyo) pueden listarse y comercializarse en nuestro marketplace. Esto aporta **liquidez inmediata** a los inversores que necesiten salir de su posición antes de la fecha de cosecha.

### 4. Chainlink / NASA Satellites (Oráculo Visual)
Utilizamos validación de coordenadas geográficas reales del cultivo para validación satelital (NDVI).

---

## 🛠️ Stack Tecnológico

- **Frontend:** React, Vite, Tailwind CSS, TypeScript
- **Web3:** Ethers.js
- **Backend:** Python, FastAPI, PostgreSQL
- **Smart Contracts:** Solidity, Hardhat

## 🏃 Cómo ejecutar localmente

1. Clonar el repositorio:
```bash
git clone https://github.com/Joryox/AgroNest-Web.git
```
2. Instalar dependencias e iniciar:
```bash
pnpm install
pnpm dev
```
