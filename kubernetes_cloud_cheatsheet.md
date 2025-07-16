# 🧠 Kubernetes en Cloud – Ayuda Memoria

## 📌 ¿Qué es Kubernetes?

**Kubernetes** es un orquestador de contenedores de código abierto que automatiza el despliegue, escalado y gestión de aplicaciones en contenedores (Docker, principalmente).

---

## 🛠️ Comandos básicos de Kubernetes (`kubectl`)

| Acción                        | Comando                                                          |
| ----------------------------- | ---------------------------------------------------------------- |
| Ver nodos del clúster         | `kubectl get nodes`                                              |
| Ver pods                      | `kubectl get pods`                                               |
| Ver servicios                 | `kubectl get svc`                                                |
| Ver despliegues (deployments) | `kubectl get deployments`                                        |
| Aplicar configuración YAML    | `kubectl apply -f archivo.yaml`                                  |
| Eliminar recurso              | `kubectl delete -f archivo.yaml`                                 |
| Describir un recurso          | `kubectl describe pod nombre-pod`                                |
| Logs de un pod                | `kubectl logs nombre-pod`                                        |
| Ingresar a un contenedor      | `kubectl exec -it nombre-pod -- /bin/bash`                       |
| Crear deployment              | `kubectl create deployment nombre --image=imagen`                |
| Exponer servicio              | `kubectl expose deployment nombre --type=LoadBalancer --port=80` |
| Escalar réplicas              | `kubectl scale deployment nombre --replicas=3`                   |
| Ver contexto actual           | `kubectl config current-context`                                 |
| Cambiar contexto              | `kubectl config use-context nombre-contexto`                     |

---

## 🧪 Comandos de Minikube (entorno local)

| Acción                        | Comando                            |
| ----------------------------- | ---------------------------------- |
| Iniciar clúster local         | `minikube start`                   |
| Detener clúster               | `minikube stop`                    |
| Eliminar clúster              | `minikube delete`                  |
| Ver IP del clúster            | `minikube ip`                      |
| Abrir dashboard               | `minikube dashboard`               |
| Habilitar addons              | `minikube addons enable ingress`   |
| Crear túnel para servicios LB | `minikube tunnel`                  |
| Acceder a servicio            | `minikube service nombre-servicio` |

---

## ☁️ Kubernetes en Google Cloud (GKE)

### Comandos básicos de GCP (`gcloud`)

> Asegurate de tener autenticado tu usuario con `gcloud auth login`

| Acción                       | Comando                                                                 |
| ---------------------------- | ----------------------------------------------------------------------- |
| Configurar proyecto          | `gcloud config set project [ID-PROYECTO]`                               |
| Listar clusters              | `gcloud container clusters list`                                        |
| Crear cluster                | `gcloud container clusters create nombre --zone=us-central1-a`          |
| Conectar cluster a `kubectl` | `gcloud container clusters get-credentials nombre --zone=us-central1-a` |
| Eliminar cluster             | `gcloud container clusters delete nombre --zone=us-central1-a`          |

---

## ☁️ Kubernetes en Amazon Web Services (EKS)

### Requisitos:

- AWS CLI
- `eksctl`
- `kubectl`

### Comandos con `eksctl`

| Acción           | Comando                                                            |
| ---------------- | ------------------------------------------------------------------ |
| Crear cluster    | `eksctl create cluster --name nombre --region us-west-2 --nodes 2` |
| Ver clusters     | `eksctl get cluster`                                               |
| Eliminar cluster | `eksctl delete cluster --name nombre`                              |

### Configurar acceso a `kubectl`

```bash
aws eks --region us-west-2 update-kubeconfig --name nombre
```

---

## 📂 Archivos comunes YAML

### Deployment básico

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mi-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: mi-app
  template:
    metadata:
      labels:
        app: mi-app
    spec:
      containers:
      - name: contenedor-app
        image: nginx
        ports:
        - containerPort: 80
```

### Servicio tipo LoadBalancer

```yaml
apiVersion: v1
kind: Service
metadata:
  name: mi-servicio
spec:
  type: LoadBalancer
  selector:
    app: mi-app
  ports:
    - port: 80
      targetPort: 80
```

---

## 🔀 Tips útiles

- Usá `kubectl get all` para ver todos los recursos activos.
- Si algo falla, revisá con `kubectl describe` y `kubectl logs`.
- Siempre versioná tus archivos YAML en Git.
- En producción, usá Ingress + TLS para exponer servicios.

