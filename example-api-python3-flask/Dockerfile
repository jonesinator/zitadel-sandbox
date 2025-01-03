FROM docker.io/library/python:3.13
RUN useradd --user-group --create-home --home-dir /opt/app --shell /bin/false runner
USER runner
WORKDIR /opt/app
COPY requirements.txt .
RUN python3 -m venv venv \
 && . venv/bin/activate \
 && pip install -r requirements.txt
COPY . .
ENTRYPOINT ["./entrypoint.sh"]
