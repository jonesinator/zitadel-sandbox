FROM docker.io/library/node:23 as build
ARG VITE_AUTH_URL
ARG VITE_AUTH_CLIENT_ID
ARG VITE_AUTH_REDIRECT_URI
RUN useradd --user-group --create-home --home-dir /build --shell /bin/false builder
USER builder
WORKDIR /build
COPY package.json package-lock.json ./
RUN npm ci
COPY . ./
RUN npm run build

FROM docker.io/library/caddy:2 as run
COPY --from=build /build/dist /srv
COPY Caddyfile /etc/caddy/
