# Building Control

## reqirments

- Node v20.14.0
- npm v10.7.0

## installation

Update your environment veriables, There is an example environment file in the server/ and frontend/
Rename the file from .env.example to .env

this script will cd into the server and frontend to do npm install

```bash
npm run install:all
```

## Setup database with Docker Compose

```bash
docker compose up -d
```

## Migrations

```bash
$ npm run migration:run
```

## Running the server

```bash
# development (watch mode)
$ npm run start:server
```

## Build the server

```bash
# development (watch mode)
$ npm run build:server
```

## Running the frontend

```bash
# development (watch mode)
$ npm run start:frontend
```

## build the frontend

```bash
# development (watch mode)
$ npm run build:frontend
```
