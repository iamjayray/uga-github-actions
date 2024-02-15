output "s3_bucket_name" {
  value       = aws_s3_bucket.s3_bucket.id
  description = "S3 bucket name"
}

output "distribution_id" {
  value       = aws_cloudfront_distribution.cloudfront_distribution.id
  description = "Cloudfront distribution id"
}
