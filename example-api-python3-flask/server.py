from flask import Flask, jsonify, Response
from authlib.integrations.flask_oauth2 import ResourceProtector
from validator import ZitadelIntrospectTokenValidator, ValidatorError

require_auth = ResourceProtector()
require_auth.register_token_validator(ZitadelIntrospectTokenValidator())

app = Flask(__name__)

@app.errorhandler(ValidatorError)
def handle_auth_error(ex: ValidatorError) -> Response:
    response = jsonify(ex.error)
    response.status_code = ex.status_code
    return response

@app.route("/api/public")
def public():
    return jsonify(message="public")

@app.route("/api/private")
@require_auth(None)
def private():
    return jsonify(message="private")

@app.route("/api/private-scoped")
@require_auth(["read:messages"])
def private_scoped():
    return jsonify(message="private-scoped")

if __name__ == "__main__":
    APP.run()
