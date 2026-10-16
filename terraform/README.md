# Stockora Infrastructure as Code (Terraform)

This directory provisions the complete AWS cloud infrastructure required to host the Stockora Kubernetes application stack in region `ap-south-1`.

## Provisioned Architecture

- **AWS VPC:**
  - Dedicated CIDR: `10.20.0.0/16`
  - 2 Public Subnets across 2 Availability Zones (`10.20.101.0/24`, `10.20.102.0/24`)
  - 2 Private Subnets across 2 Availability Zones (`10.20.1.0/24`, `10.20.2.0/24`)
  - 1 NAT Gateway for secure outbound internet connectivity from private nodes
  - Standard Kubernetes ELB tags on subnets for automatic LoadBalancer ingress binding
- **AWS EKS Cluster:**
  - Cluster version: 1.31
  - Public endpoint enabled for administrative access
  - Cluster creator admin permissions enabled
  - Managed Node Group with `t3.medium` instances (min: 2, max: 4, desired: 2)

## Step-by-Step Execution Guide

### 1. Initialize Working Directory
Downloads the AWS provider and community VPC/EKS modules:
```bash
terraform init
```

### 2. Format and Validate
Ensures canonical style and syntactical correctness:
```bash
terraform fmt -check
terraform validate
```

### 3. Review Plan
Generates an execution plan showing all AWS resources to be created:
```bash
terraform plan
```
> **Evidence:** Capture terminal output of `terraform plan` as screenshot `screenshots/08-terraform-plan.png`.

### 4. Apply Infrastructure
Provisions the live AWS resources:
```bash
terraform apply
```
Type `yes` when prompted. Provisioning EKS usually takes 10–15 minutes.
> **Evidence:** Capture the AWS Console showing the VPC and EKS cluster in `ap-south-1` as `screenshots/09-aws-infrastructure.png`.

### 5. Configure Kubectl Context
Once provisioned, configure your local kubectl to interact with the new cluster:
```bash
aws eks --region ap-south-1 update-kubeconfig --name stockora-eks
kubectl get nodes
```

### 6. Clean Up (Destroy)
**Crucial:** To avoid unexpected AWS charges, destroy all provisioned resources after evaluation:
```bash
terraform destroy
```
Type `yes` when prompted.
> **Evidence:** Capture the terminal output showing clean teardown as `screenshots/10-terraform-destroy.png`.
