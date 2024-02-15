provider "aws" {
  alias  = "acm_provider"
  region = "us-east-1"

  assume_role {
    role_arn = var.admin_role_arn
  }
}

resource "aws_acm_certificate" "acm_certificate" {
  provider = aws.acm_provider

  domain_name       = "${var.webapp_relative_hostname}.${var.webapp_hostname_zone}"
  validation_method = "DNS"
  tags              = var.tags

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_acm_certificate_validation" "acm_certificate_validation" {
  provider = aws.acm_provider

  certificate_arn         = aws_acm_certificate.acm_certificate.arn
  validation_record_fqdns = [for record in aws_route53_record.cert_validation : record.fqdn]
}
