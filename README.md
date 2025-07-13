# Evend Driven K8S

Este repositorio presenta un ejemplo práctico y completo de una arquitectura de microservicios *políglota* desplegada en **Kubernetes**, con comunicación orientada a eventos a través de **Apache Kafka** y un pipeline de **CI/CD** automatizado con **GitHub Actions**.

---

## 📚 Tabla de Contenidos

- [Descripción del Proyecto](#descripción-del-proyecto)
- [Arquitectura del Sistema](#arquitectura-del-sistema)
- [Tecnologías Utilizadas](#tecnologías-utilizadas)
- [Estructura del Repositorio](#estructura-del-repositorio)
- [Configuración del Entorno Local](#configuración-del-entorno-local)
- [Ejecución Local con Minikube](#ejecución-local-con-minikube)
- [Despliegue con GitHub Actions (CI/CD)](#despliegue-con-github-actions-cicd)
- [Endpoints de la API](#endpoints-de-la-api)
- [Próximos Pasos / Mejoras Futuras](#próximos-pasos--mejoras-futuras)
- [Licencia](#licencia)

---

## 📌 Descripción del Proyecto

Este proyecto simula un sistema de gestión de usuarios y pedidos con notificaciones asíncronas. El objetivo principal es demostrar una arquitectura de **microservicios políglota**, promoviendo la interoperabilidad y el uso de herramientas específicas por servicio:

- **`users-service`** (Java/Spring Boot): Gestiona usuarios y publica eventos `user-created-topic`.
- **`orders-service`** (Node.js/Express): Gestiona pedidos y publica eventos `order-created-topic`.
- **`notifications-service`** (Python/FastAPI): Consume ambos eventos para enviar notificaciones simuladas.

Cada servicio tiene su **base de datos PostgreSQL independiente**, comunicación vía **Apache Kafka**, orquestación con **Kubernetes** y despliegue automatizado con **GitHub Actions**.

---

## 🏗️ Arquitectura del Sistema

<img width="608" height="664" alt="{4A45F8F5-EE3A-4FE6-A76D-F2FBA35C73CD}" src="https://github.com/user-attachments/assets/2231886e-b102-49e2-8d5e-6f0f9a43413a" />


---

## ⚙️ Tecnologías Utilizadas

- **Backend Frameworks:**
  - Java 17+ (Spring Boot)
  - Node.js 20+ (Express)
  - Python 3.10+ (FastAPI)
- **Base de Datos:** PostgreSQL
- **Mensajería Asíncrona:** Apache Kafka
- **Contenerización:** Docker
- **Orquestación:** Kubernetes
- **CI/CD:** GitHub Actions
- **Registro de Imágenes:** GitHub Container Registry (GHCR)
- **API Gateway:** NGINX Ingress

---

## 📁 Estructura del Repositorio

<img width="682" height="718" alt="{34A12F96-AB2E-4D1D-B0EA-1571FA04E456}" src="https://github.com/user-attachments/assets/f41c1700-5fb9-4777-ada0-751b036191ec" />


---

## 🧪 Configuración del Entorno Local

### Requisitos

- Java 17+, Maven
- Node.js 20+, npm
- Python 3.10+, pip
- Docker Desktop + Kubernetes
- kubectl
- Minikube
- Git

### Instalación (Ejemplo para Debian/Ubuntu)

```bash
sudo apt update && sudo apt install git maven openjdk-17-jdk python3.10 python3.10-venv python3-pip
# Instalar Node.js (vía NVM recomendado)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
nvm install 20
# kubectl
curl -LO "https://dl.k8s.io/release/$(curl -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install -o root -g root -m 0755 kubectl /usr/local/bin/kubectl
# Minikube
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube

