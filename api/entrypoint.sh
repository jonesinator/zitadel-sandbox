#!/usr/bin/env bash
set -euxo pipefail
source ./venv/bin/activate
uvicorn server:app  --host 0.0.0.0 --port 8000 --interface wsgi "${@}"
