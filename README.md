# 📦 Stockora — Cloud-Native Inventory Management Platform

Stockora is a full-stack, production-grade inventory management system built to demonstrate modern DevOps practices end-to-end. It travels from a developer laptop through automated CI/CD pipelines, security scanning, infrastructure-as-code provisioning, container orchestration, and real-time observability — exactly how software ships in professional engineering teams.

> **Domain:** Inventory & Warehouse Management
> **Stack:** React · FastAPI · PostgreSQL · Docker · GitHub Actions · Terraform · AWS EKS · Helm · Prometheus · Grafana · Argo CD

---

## 📐 Architecture Overview

```
Developer Workstation
       │
       ▼
   Git / GitHub
       │
       ▼
 GitHub Actions CI/CD
   ├── pytest (unit tests)
   ├── npm build (frontend)
   ├── Docker build (backend + frontend)
   ├── Trivy security scan (HIGH/CRITICAL)
   └── Push images → GHCR (SHA-tagged)
              │
              ▼
        Terraform IaC
              │
       AWS VPC + EKS
              │
              ▼
     Helm Chart Deployment
              │
    ┌─────────┼──────────┐
    │         │          │
 Frontend  Backend   PostgreSQL
  (React)  (FastAPI)    (DB)
  Nginx     :8000     :5432
    │         │
    │    /metrics ──→ Prometheus ──→ Grafana
    │         │
    └─── Ingress (/ → frontend, /api → backend)
              │
         Argo CD (GitOps auto-sync)
```

---

## 🛠 Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 + Vite | Single-page inventory dashboard |
| **Styling** | Custom CSS | Responsive dark-themed UI |
| **Backend** | FastAPI (Python 3.12) | REST API server |
| **ORM** | SQLAlchemy 2.x | Database abstraction |
| **Migrations** | Alembic | Schema version control |
| **Database** | PostgreSQL 16 | Persistent data store |
| **Testing** | Pytest | Automated API testing |
| **Containers** | Docker + Docker Compose | Local development & packaging |
| **CI/CD** | GitHub Actions | Automated test → build → scan → push pipeline |
| **Security** | Trivy | Container vulnerability scanning |
| **Registry** | GitHub Container Registry (GHCR) | Docker image hosting |
| **IaC** | Terraform | AWS infrastructure provisioning |
| **Cloud** | AWS (VPC + EKS) | Production Kubernetes cluster |
| **Orchestration** | Kubernetes + Helm | Container orchestration & packaging |
| **Ingress** | NGINX Ingress Controller | External traffic routing |
| **Autoscaling** | HPA (Horizontal Pod Autoscaler) | CPU-based pod scaling |
| **Monitoring** | Prometheus | Metrics collection & alerting |
| **Visualization** | Grafana | Metrics dashboards |
| **GitOps** | Argo CD | Automated deployment sync |

---

## 📁 Repository Structure

```
Stockora/
├── frontend/                    # React + Vite application
│   ├── src/
│   │   ├── components/          # Sidebar, Header, StatCard, ProductForm, ProductTable
│   │   ├── pages/               # Dashboard, Products, Suppliers, StockHistory
│   │   ├── services/            # API client (fetch wrapper)
│   │   └── styles.css           # Global responsive stylesheet
│   ├── Dockerfile               # Multi-stage build (Node → Nginx)
│   └── nginx.conf               # Reverse proxy config
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app, CORS, Prometheus, health endpoints
│   │   ├── models.py            # SQLAlchemy models (Product, Supplier, StockMovement)
│   │   ├── schemas.py           # Pydantic validation schemas
│   │   ├── database.py          # Engine, session, Base
│   │   ├── config.py            # Settings from environment
│   │   └── routes/              # products, suppliers, stock, dashboard
│   ├── alembic/                 # Database migration scripts
│   ├── tests/                   # Pytest test suite
│   ├── Dockerfile               # Python 3.12-alpine, non-root
│   ├── requirements.txt         # Python dependencies
│   └── pytest.ini               # Test configuration
├── terraform/                   # AWS Infrastructure as Code
│   ├── main.tf                  # VPC + EKS modules
│   ├── variables.tf             # Configurable parameters
│   ├── outputs.tf               # Cluster endpoint, kubectl command
│   ├── providers.tf             # AWS provider config
│   ├── versions.tf              # Terraform version constraints
│   └── terraform.tfvars.example # Example variable values (no secrets)
├── helm/stockora/               # Helm chart
│   ├── Chart.yaml               # Chart metadata
│   ├── values.yaml              # Default values
│   └── templates/               # K8s manifest templates
│       ├── backend-deployment.yaml
│       ├── backend-service.yaml
│       ├── frontend-deployment.yaml
│       ├── frontend-service.yaml
│       ├── postgres.yaml
│       ├── ingress.yaml
│       ├── hpa.yaml
│       └── servicemonitor.yaml
├── k8s/
│   ├── namespace.yaml           # Kubernetes namespace
│   └── argocd-application.yaml  # Argo CD GitOps manifest
├── monitoring/
│   └── prometheus-values.yaml   # kube-prometheus-stack Helm values
├── .github/workflows/
│   └── ci-cd.yml                # GitHub Actions pipeline
├── docker-compose.yml           # Local development stack
├── demo/                        # Presentation video and slides
└── .gitignore                   # Excludes .env, __pycache__, node_modules, tfstate
```

---

## 🚀 Local Setup

### Prerequisites

- Docker Desktop (or Docker Engine + Docker Compose)

### Quick Start

```bash
# Clone the repository
git clone https://github.com/Kartik-Pettugani/Stockora.git
cd Stockora

# Start all services (PostgreSQL + Backend + Frontend)
docker compose up --build

# Access the application
# Frontend:  http://localhost:3000
# Backend:   http://localhost:8000/docs
# Health:    http://localhost:8000/health
# Metrics:   http://localhost:8000/metrics
```

### Stop

```bash
docker compose down        # Stop containers
docker compose down -v     # Stop and delete database volume
```

### Run Backend Directly (Development)

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate          # Windows
# source .venv/bin/activate     # macOS/Linux

pip install -r requirements.txt
set DATABASE_URL=postgresql+psycopg://stockora:stockora@localhost:5432/stockora
alembic upgrade head
uvicorn app.main:app --reload --port 8000
```

### Run Tests

```bash
cd backend
pytest -v
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Service info |
| `GET` | `/health` | Liveness check |
| `GET` | `/ready` | Readiness check (verifies DB) |
| `GET` | `/metrics` | Prometheus metrics |
| `GET` | `/api/products` | List all products |
| `GET` | `/api/products/{id}` | Get product by ID |
| `POST` | `/api/products` | Create a product |
| `PUT` | `/api/products/{id}` | Update a product |
| `DELETE` | `/api/products/{id}` | Delete a product |
| `GET` | `/api/suppliers` | List all suppliers |
| `GET` | `/api/suppliers/{id}` | Get supplier by ID |
| `POST` | `/api/suppliers` | Create a supplier |
| `PUT` | `/api/suppliers/{id}` | Update a supplier |
| `GET` | `/api/stock` | List stock movements |
| `POST` | `/api/stock` | Record stock IN/OUT |
| `GET` | `/api/dashboard` | KPI summary |

Interactive API documentation: `http://localhost:8000/docs` (Swagger UI)

---

## 🐳 Docker

### Backend Image

- **Base:** `python:3.12-alpine` (minimal attack surface)
- **Security:** Runs as non-root user `app`
- **Entrypoint:** Runs Alembic migrations, then starts Uvicorn

### Frontend Image

- **Multi-stage build:**
  - Stage 1: `node:22-alpine` — builds the React app (`npm run build`)
  - Stage 2: `nginx:1.29-alpine` — serves static files
- **Security:** Runs as non-root user `nginx`
- **Proxy:** Nginx reverse-proxies `/api/` requests to the backend

---

## ⚙️ CI/CD Pipeline (GitHub Actions)

The pipeline runs on every push to `main` and consists of two jobs:

```
┌──────────────────────────────────┐
│         Job 1: test              │
│  ├── Checkout                    │
│  ├── Setup Python 3.12           │
│  ├── Install backend deps        │
│  ├── Run pytest                  │
│  ├── Setup Node.js 22            │
│  ├── Install frontend deps       │
│  ├── Lint frontend (ESLint)      │
│  └── Build frontend (Vite)       │
└──────────────┬───────────────────┘
               │ (on success)
┌──────────────▼───────────────────┐
│  Job 2: build-scan-publish       │
│  ├── Build backend Docker image  │
│  ├── Build frontend Docker image │
│  ├── Trivy scan backend (HIGH+)  │
│  ├── Trivy scan frontend (HIGH+) │
│  ├── Login to GHCR               │
│  ├── Push images (SHA tag)       │
│  └── Tag + push as :latest       │
└──────────────────────────────────┘
```

**Image tagging:** Every image is tagged with the full Git commit SHA for traceability:
```
ghcr.io/kartik-pettugani/stockora-backend:634aefd40eb89db91f7232a83d4bb7b371da189a
ghcr.io/kartik-pettugani/stockora-frontend:634aefd40eb89db91f7232a83d4bb7b371da189a
```

---

## 🛡 Security Scanning (Trivy)

Both container images are scanned by [Trivy](https://trivy.dev/) in the CI pipeline:

- **Severity threshold:** HIGH and CRITICAL
- **Pipeline behavior:** `exit-code: 1` — any HIGH/CRITICAL CVE **fails the build**
- **Result:** Both Alpine-based images (Python 3.12-alpine, Nginx 1.29-alpine) pass cleanly due to their minimal package footprint

Trivy provides container-level vulnerability scanning as one layer of a defense-in-depth security strategy alongside SAST, dependency scanning, and secret scanning.

---

## 🏗 Terraform — AWS Infrastructure

Terraform provisions the foundational AWS infrastructure:

| Resource | Details |
|----------|---------|
| **VPC** | `10.20.0.0/16` CIDR with DNS support |
| **Public Subnets** | 2 subnets across 2 AZs (`10.20.101.0/24`, `10.20.102.0/24`) |
| **Private Subnets** | 2 subnets across 2 AZs (`10.20.1.0/24`, `10.20.2.0/24`) |
| **NAT Gateway** | Single NAT for private subnet internet access |
| **EKS Cluster** | `stockora-eks`, Kubernetes v1.31 |
| **Worker Nodes** | Managed node group, 2–4 × `t3.small` instances |
| **Region** | `ap-southeast-2` (Sydney) |

### Usage

```bash
cd terraform
cp terraform.tfvars.example terraform.tfvars   # Customize if needed
terraform init
terraform plan
terraform apply

# Configure kubectl
aws eks --region ap-southeast-2 update-kubeconfig --name stockora-eks

# Tear down when done
terraform destroy
```

> ⚠️ No AWS credentials are stored in the repository. Use environment variables or AWS CLI profiles.

---

## ☸️ Kubernetes + Helm Deployment

### Namespace

```bash
kubectl apply -f k8s/namespace.yaml
```

### Helm Chart Deployment

```bash
helm upgrade --install stockora ./helm/stockora \
  --namespace stockora \
  --create-namespace
```

### What Gets Deployed

| Resource | Kind | Replicas | Details |
|----------|------|----------|---------|
| `stockora-backend` | Deployment | 2 | FastAPI, health/readiness probes |
| `stockora-frontend` | Deployment | 2 | Nginx + React SPA |
| `stockora-postgres` | Deployment | 1 | PostgreSQL 16 |
| `stockora-backend` | Service (ClusterIP) | — | Port 8000 |
| `backend` | Service (ClusterIP) | — | Alias for Nginx upstream resolution |
| `stockora-frontend` | Service (ClusterIP) | — | Port 80 → 8080 |
| `stockora` | Ingress | — | `/` → frontend, `/api` → backend |
| `stockora-backend` | HPA | 2–6 | CPU target 60% |
| `stockora-backend` | ServiceMonitor | — | Prometheus scrape `/metrics` every 15s |

### Verify

```bash
kubectl get pods -n stockora
kubectl get svc -n stockora
kubectl get ingress -n stockora
kubectl get hpa -n stockora
helm list -n stockora
```

---

## 📊 Observability — Prometheus + Grafana

### Metrics Endpoint

The FastAPI backend exposes `/metrics` in Prometheus format using `prometheus-fastapi-instrumentator`, providing:

- HTTP request counts by method, endpoint, and status code
- Request latency histograms
- In-progress request gauges

### Prometheus

Installed via `kube-prometheus-stack` Helm chart with a lightweight configuration:

```bash
helm install kube-prometheus-stack prometheus-community/kube-prometheus-stack \
  --namespace monitoring --create-namespace \
  -f monitoring/prometheus-values.yaml
```

A `ServiceMonitor` CRD (deployed as part of the Stockora Helm chart) tells Prometheus to scrape the backend's `/metrics` endpoint every 15 seconds.

### Grafana

- Deployed alongside Prometheus
- Datasource: Prometheus (auto-configured)
- Dashboard: Custom panel showing HTTP request rate, latency, and error metrics

### Access (via port-forward)

```bash
# Prometheus
kubectl port-forward svc/kube-prometheus-stack-prometheus -n monitoring 9090:9090

# Grafana (default: admin / admin)
kubectl port-forward svc/kube-prometheus-stack-grafana -n monitoring 3000:80
```

---

## 🔄 GitOps — Argo CD

Argo CD is installed in the cluster and configured to watch the GitHub repository for changes:

```bash
# Install Argo CD
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

# Apply the Stockora application manifest
kubectl apply -f k8s/argocd-application.yaml
```

The Argo CD Application (`k8s/argocd-application.yaml`) is configured with:

- **Source:** `https://github.com/Kartik-Pettugani/Stockora.git` (branch: `main`, path: `helm/stockora`)
- **Destination:** `stockora` namespace on the in-cluster API server
- **Sync Policy:** Automated with pruning and self-healing

Every push to `main` triggers Argo CD to automatically reconcile the cluster state with the repository.

---

## ⚠️ Known Issues & Limitations

1. **PostgreSQL in-cluster:** For this capstone, PostgreSQL runs inside the Kubernetes cluster with `emptyDir` storage. In production, a managed database (e.g., Amazon RDS) with persistent storage would be used.
2. **IRSA disabled:** The AWS Organization SCP blocks `iam:CreateOpenIDConnectProvider`, so IAM Roles for Service Accounts (IRSA) is disabled. Node-level IAM roles are used instead.
3. **Ingress Controller required:** The Ingress resource requires an NGINX Ingress Controller to be installed in the cluster for external access.
4. **No HTTPS/TLS:** The current setup uses HTTP. Production deployments should add TLS termination via cert-manager.

---

## 📸 Submission Evidence & Screenshots

All visual verification artifacts, terminal outputs, and cloud console evidence required by the grading rubric are documented with high-resolution captures in:

👉 **[SCREENSHOTS.md](demo/SCREENSHOTS.md)**
---

