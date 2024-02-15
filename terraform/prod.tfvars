# application
app_lifecycle = "prod"

# providers
region         = "us-west-2"
admin_role_arn = "arn:aws:iam::032571931100:role/Jenkins-ADMS"

# acct where webapp_hostname_zone route53 zone lives
api_zone_r53_admin_role_arn = "arn:aws:iam::973536734043:role/Jenkins-POP-DNS"

webapp_relative_hostname = "apply"

webapp_hostname_zone = "apps.asu.edu"

tags = {
  ProductCategory   = "Customer Applications"
  ProductFamily     = "Admissions"
  Product           = "Admissions Application"
  Lifecycle         = "prod"
  TechContact       = "aabdolla"
  AdminContact      = "wilken"
  BillingCostCenter = "CC1040"
  BillingProgram    = "PG06077"
  Repo              = "https://github.com/ASU/adms-admissions-applications-ui"
}