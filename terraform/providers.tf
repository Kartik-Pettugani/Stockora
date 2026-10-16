provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project     = "Stockora"
      Environment = var.environment
      ManagedBy   = "Terraform"
    }
  }
}
