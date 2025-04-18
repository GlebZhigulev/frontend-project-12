install:
	npm ci
	cd frontend && npm ci
	cd frontend && npm run build

start-frontend:
	make -C frontend start

start-backend:
	npm start

start:
	make start-backend

local-start:
	make start-backend & make start-frontend

build:
	rm -rf frontend/dist
	npm run build