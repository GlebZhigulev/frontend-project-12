install:
	npm ci

start-frontend:
	make -C frontend start

start-backend:
	npm start

start:
	make start-backend

local-start:
	make start-backend & make start-frontend

build:
	rmdir /s /q frontend\dist
	npm run build