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

resource "zitadel_application_api" "default" {
  org_id           = zitadel_org.default.id
  project_id       = zitadel_project.default.id
  name             = "terraform-test-api"
  auth_method_type = "API_AUTH_METHOD_TYPE_BASIC"
}

resource "zitadel_application_oidc" "default" {
  org_id            = zitadel_org.default.id
  project_id        = zitadel_project.default.id
  name              = "terraform-test-web"
  redirect_uris     = ["https://app.example.tld/login-callback"]
  response_types    = ["OIDC_RESPONSE_TYPE_CODE"]
  grant_types       = ["OIDC_GRANT_TYPE_AUTHORIZATION_CODE"]
  app_type          = "OIDC_APP_TYPE_USER_AGENT"
  auth_method_type  = "OIDC_AUTH_METHOD_TYPE_NONE"
  version           = "OIDC_VERSION_1_0"
  access_token_type = "OIDC_TOKEN_TYPE_BEARER"
}

resource "zitadel_machine_user" "default" {
  org_id      = zitadel_org.default.id
  user_name   = "api.user@example.tld"
  name        = "API User"
  description = "Terraform Test API User"
  with_secret = false
}

resource "zitadel_personal_access_token" "default" {
  org_id          = zitadel_org.default.id
  user_id         = zitadel_machine_user.default.id
  expiration_date = "2026-01-01T00:40:00Z"
}

output "web_client_id" {
  value = zitadel_application_oidc.default.client_id
  sensitive = true
}

output "api_client_id" {
  value = zitadel_application_api.default.client_id
  sensitive = true
}

output "api_client_secret" {
  value = zitadel_application_api.default.client_secret
  sensitive = true
}

output "api_token" {
  value = zitadel_personal_access_token.default.token
  sensitive = true
}
