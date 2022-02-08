FROM node:14.15.0-alpine as build
ENV NODE_ENV=.env
WORKDIR /
COPY package*.json ./
RUN yarn cache clean && yarn --update-checksums
COPY . ./
RUN yarn && yarn build

# Stage - Production
FROM nginx:1.17-alpine
COPY --from=build /build /usr/share/nginx/html
EXPOSE 80
RUN react-app-env --env-file=.env build
CMD ["nginx", "-g", "daemon off;"]
