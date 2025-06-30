# 🍽️ Too Good To Go – Sistema de Gestión de Ofertas y Pedidos con Microservicios

## 🧩 Descripción General

**Too Good To Go** es una plataforma que conecta restaurantes con clientes para vender alimentos no vendidos a precios reducidos, ayudando a reducir el desperdicio de comida. Este sistema fue desarrollado bajo el enfoque de **microservicios distribuidos**, permitiendo una arquitectura escalable, desacoplada y eficiente.

Esta es la evolución del proyecto del Primer Parcial, ahora con una arquitectura más robusta e interactiva que incluye un **API Gateway con GraphQL** y un **servicio de notificaciones en tiempo real** mediante WebSockets.

---

## 🎯 Objetivo General

Evolucionar un sistema backend REST a una arquitectura de **microservicios**, integrando:

- Un **API Gateway centralizado con GraphQL** como único punto de entrada.
- Un **servicio de notificaciones WebSocket** para emitir eventos importantes en tiempo real.
- Refactorización de los microservicios existentes en nuevos lenguajes asignados.

---

## 🧱 Arquitectura del Proyecto

```plaintext
                 Cliente Web o Móvil
                          │
                 ┌────────▼────────┐
                 │  API Gateway    │   ← GraphQL (TypeScript)
                 └────────┬────────┘
                          │
        ┌─────────────────┼─────────────────┐
        │                                     │
┌───────▼───────┐                 ┌──────────▼──────────┐
│ Servicio Ofertas│               │ Servicio Pedidos    │
│    (TypeScript) │               │     (Python)        │
└───────┬───────┘                 └──────────┬──────────┘
        │                                     │
        └──────────────┬──────────────┬──────┘
                       │              │
             ┌─────────▼──────────┐
             │ Servicio Notificaciones │ ← WebSockets (Python)
             └────────────────────┘
```

---

## 🧪 Microservicios

### 1. **Servicio de Ofertas** (TypeScript)
Gestión de:
- Entregas
- Inventario de productos
- Ofertas reducidas
- Repartidores
- Rutas de entrega

### 2. **Servicio de Pedidos** (Python)
Gestión de:
- Pedidos
- Usuarios
- Productos
- Detalles Pedidos
- Restaurantes

### 3. **API Gateway - GraphQL** (TypeScript)
- Punto central para consumo de datos
- Esquema unificado
- Encapsula la lógica de comunicación entre servicios

### 4. **Servicio de Notificaciones** (Python – WebSockets)
- Conexiones WebSocket en tiempo real
- Notifica eventos como creación de pedidos, reservas, cambios de estado, etc.


---

## 🛠️ Estructura de Carpetas

```
too-good-to-go/
├── api-gateway/              # GraphQL central
├── modulo-ofertas/         # Microservicio en TypeScript
├── modulo-pedidos/         # Microservicio en Python
├── servicio-notificaciones/  # WebSocket Server
└── README.md
```

---

## 👥 Integrantes del Grupo

- Senge Loor Odalia Michelle
- Garcia Guadamud Jhon Kenedy

---

## 🗓️ Proyecto Segundo Parcial – Aplicación para el Servidor Web