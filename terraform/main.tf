terraform {
  backend "s3" {
  }
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.0"
    }
  }
}

provider "aws" {
  region = var.region

  assume_role {
    role_arn = var.admin_role_arn
  }
}

provider "aws" {
  alias  = "r53_provider"
  region = var.region

  assume_role {
    role_arn = var.api_zone_r53_admin_role_arn
  }
}
