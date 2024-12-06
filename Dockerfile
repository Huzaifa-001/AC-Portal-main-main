FROM node:latest as build
WORKDIR /app
COPY . . 
RUN npm install -f
RUN npm run build --prod


# Stage 1: serve app with nginx server
FROM nginx:latest
COPY --from=build /app/dist/prime  /usr/share/nginx/html
EXPOSE 80
