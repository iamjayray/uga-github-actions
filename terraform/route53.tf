data "aws_route53_zone" "zone_public" {
  provider     = aws.r53_provider
  name         = "${var.webapp_hostname_zone}."
  private_zone = false
}

data "aws_route53_zone" "zone_private" {
  provider     = aws.r53_provider
  name         = "${var.webapp_hostname_zone}."
  private_zone = true
}

resource "aws_route53_record" "route53_record_public_a" {
  provider = aws.r53_provider
  zone_id  = data.aws_route53_zone.zone_public.id
  name     = "${var.webapp_relative_hostname}.${var.webapp_hostname_zone}"
  type     = "A"

  alias {
    name                   = aws_cloudfront_distribution.cloudfront_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.cloudfront_distribution.hosted_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "route53_record_public_aaaa" {
  provider = aws.r53_provider
  zone_id  = data.aws_route53_zone.zone_public.id
  name     = "${var.webapp_relative_hostname}.${var.webapp_hostname_zone}"
  type     = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.cloudfront_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.cloudfront_distribution.hosted_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "route53_record_private_a" {
  provider = aws.r53_provider
  zone_id  = data.aws_route53_zone.zone_private.id
  name     = "${var.webapp_relative_hostname}.${var.webapp_hostname_zone}"
  type     = "A"

  alias {
    name                   = aws_cloudfront_distribution.cloudfront_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.cloudfront_distribution.hosted_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "route53_record_private_aaaa" {
  provider = aws.r53_provider
  zone_id  = data.aws_route53_zone.zone_private.id
  name     = "${var.webapp_relative_hostname}.${var.webapp_hostname_zone}"
  type     = "AAAA"

  alias {
    name                   = aws_cloudfront_distribution.cloudfront_distribution.domain_name
    zone_id                = aws_cloudfront_distribution.cloudfront_distribution.hosted_zone_id
    evaluate_target_health = true
  }
}

resource "aws_route53_record" "cert_validation" {
  provider = aws.r53_provider
  for_each = {
    for dvo in aws_acm_certificate.acm_certificate.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  name    = each.value.name
  type    = each.value.type
  zone_id = data.aws_route53_zone.zone_public.zone_id
  records = [each.value.record]
  ttl     = 60
}