from os import environ as env
import os
import time
from typing import Dict

from authlib.oauth2.rfc7662 import IntrospectTokenValidator
import requests
from dotenv import load_dotenv, find_dotenv
from requests.auth import HTTPBasicAuth

load_dotenv()

ZITADEL_DOMAIN = os.getenv("ZITADEL_DOMAIN")
CLIENT_ID = os.getenv("CLIENT_ID")
CLIENT_SECRET = os.getenv("CLIENT_SECRET")

class ValidatorError(Exception):
    def __init__(self, error: Dict[str, str], status_code: int):
        super().__init__()
        self.error = error
        self.status_code = status_code

class ZitadelIntrospectTokenValidator(IntrospectTokenValidator):
    def introspect_token(self, token_string):
        url = f'{ZITADEL_DOMAIN}/oauth/v2/introspect'
        data = {'token': token_string, 'token_type_hint': 'access_token', 'scope': 'openid'}
        auth = HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)
        resp = requests.post(url, data=data, auth=auth)
        resp.raise_for_status()
        return resp.json()
    
    def match_token_scopes(self, token, or_scopes):
        if or_scopes is None: 
            return True
        roles = token["urn:zitadel:iam:org:project:roles"].keys()
        for and_scopes in or_scopes:
            scopes = and_scopes.split()
            if all(key in roles for key in scopes):
                return True
        return False

    def validate_token(self, token, scopes, request):
        now = int( time.time() )
        if not token:
            raise ValidatorError({
                "code": "invalid_token", 
                "description": "Invalid Token." }, 401)
        if not token["active"]: 
            raise ValidatorError({
                "code": "invalid_token", 
                "description": "Invalid token (active: false)" }, 401)
        if token["exp"] < now: 
            raise ValidatorError({
                "code": "invalid_token_expired", 
                "description": "Token has expired." }, 401)
        if not self.match_token_scopes(token, scopes):
            raise ValidatorError({
                "code": "insufficient_scope", 
                "description": f"Token has insufficient scope. Route requires: {scopes}" }, 401)

    def __call__(self, *args, **kwargs):
        res = self.introspect_token(*args, **kwargs)
        return res
