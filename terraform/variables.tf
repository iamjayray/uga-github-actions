variable "region" {
  type        = string
  description = "Operating region of aws-provider"
}

variable "admin_role_arn" {
  type        = string
  description = "The AWS IAM Role ARN for provisioning product resources in a adms-aws-account."
}

variable "api_zone_r53_admin_role_arn" {
  type        = string
  description = "admin role arn for api hostname route53 zone"
}

variable "webapp_relative_hostname" {
  type        = string
  description = "relative hostname for webapp endpoint fqdn"
}

variable "webapp_hostname_zone" {
  type        = string
  description = "zone for webapp endpoint fqdn"
}

variable "app_lifecycle" {
  type        = string
  default     = ""
  description = "Describes what stage of the app's lifecycle the resource should be present for. For use with resource naming convention"
}

variable "tags" {
  type        = map(string)
  description = "Resource tags to attach to provisioned resources"
}
