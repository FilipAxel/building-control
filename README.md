# Building Control

## reqirments

- Node v20.14.0
- npm v10.7.0

## installation

Update your environment veriables, There is an example environment file in the server/
Rename the file from .env.example to .env

```bash
cd /server && npm run install
```

## Setup database with Docker Compose

```bash
docker compose up -d
```

## Running the app

change directory to /server

```bash
# development (watch mode)
$ npm run start:server

# production mode
$ npm run start:prod
```
