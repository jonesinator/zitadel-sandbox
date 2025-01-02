variable "zitadel_address" {
  description = "Address of the Zitadel instance."
  type        = string
}

variable "redirect_address" {
  description = "OIDC Redirect URI"
  type        = string
}

terraform {
  required_providers {
    zitadel = {
      source  = "zitadel/zitadel"
      version = "2.0.2"
    }
  }
}

provider "zitadel" {
  domain           = var.zitadel_address
  jwt_profile_file = "zitadel-admin-sa.json"
}

resource "zitadel_org" "default" {
  name = "terraform-test-organiztion"
}

resource "zitadel_project" "default" {
  name   = "terraform-test-project"
  org_id = zitadel_org.default.id
}

resource "zitadel_application_oidc" "default" {
  org_id                    = zitadel_org.default.id
  project_id                = zitadel_project.default.id
  name                      = "terraform-test-application"
  redirect_uris             = ["https://${var.redirect_address}/login-redirect"]
  post_logout_redirect_uris = ["https://${var.redirect_address}/logout"]
  app_type                  = "OIDC_APP_TYPE_WEB"
  auth_method_type          = "OIDC_AUTH_METHOD_TYPE_NONE"
  access_token_type         = "OIDC_TOKEN_TYPE_BEARER"
  response_types            = ["OIDC_RESPONSE_TYPE_CODE"]
  grant_types               = ["OIDC_GRANT_TYPE_AUTHORIZATION_CODE"]
}
