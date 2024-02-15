resource "aws_s3_bucket" "s3_bucket_logs" {
  bucket = "${local.bucket_name}-logs"

  tags = var.tags
}

resource "aws_s3_bucket_server_side_encryption_configuration" "s3_bucket_logs_encryption_configuration" {
  bucket = aws_s3_bucket.s3_bucket_logs.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "s3_bucket_logs_public_access_block" {
  bucket                  = aws_s3_bucket.s3_bucket_logs.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_ownership_controls" "s3_bucket_ownership_controls" {
  bucket = aws_s3_bucket.s3_bucket_logs.id

  rule {
    object_ownership = "ObjectWriter"
  }
}

resource "aws_s3_bucket" "s3_bucket" {
  bucket = local.bucket_name

  website {
    index_document = "index.html"
    error_document = "index.html"
  }

  cors_rule {
    allowed_headers = ["Authorization"]
    allowed_methods = ["GET"]
    allowed_origins = ["*"]
    max_age_seconds = 3000
  }

  logging {
    target_bucket = aws_s3_bucket.s3_bucket_logs.bucket
    target_prefix = "${local.bucket_name}/"
  }

  tags = var.tags
}

resource "aws_s3_bucket_server_side_encryption_configuration" "s3_bucket_encryption_configuration" {
  bucket = aws_s3_bucket.s3_bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

data "aws_iam_policy_document" "s3_bucket_policy" {
  version = "2012-10-17"

  statement {
    sid    = "CloudfrontListBucket"
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn]
    }

    actions = [
      "s3:ListBucket"
    ]

    resources = [
      "arn:aws:s3:::${local.bucket_name}"
    ]
  }

  statement {
    sid    = "CloudfrontGetObject"
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = [aws_cloudfront_origin_access_identity.origin_access_identity.iam_arn]
    }

    actions = [
      "s3:GetObject"
    ]

    resources = [
      "arn:aws:s3:::${local.bucket_name}/*"
    ]
  }

  statement {
    sid    = "AllowList"
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = [var.admin_role_arn]
    }

    actions = [
      "s3:ListBucket"
    ]

    resources = [aws_s3_bucket.s3_bucket.arn]
  }

  statement {
    sid    = "AllowPutObject"
    effect = "Allow"

    principals {
      type        = "AWS"
      identifiers = [var.admin_role_arn]
    }

    actions = [
      "s3:PutObject",
      "s3:PutObjectAcl"
    ]

    resources = [
      "${aws_s3_bucket.s3_bucket.arn}/*"
    ]
  }

  statement {
    sid    = "DenyInsecureTransport"
    effect = "Deny"
    actions = [
      "s3:*"
    ]

    resources = [
      "${aws_s3_bucket.s3_bucket.arn}/*"
    ]

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values = [
        "false",
      ]
    }
  }
}

resource "aws_s3_bucket_policy" "s3_bucket_policy" {
  bucket = aws_s3_bucket.s3_bucket.id
  policy = data.aws_iam_policy_document.s3_bucket_policy.json
}
