FROM node:22.9-alpine as compiler
WORKDIR /opt/app
COPY package*.json ./
COPY jsconfig*.json ./
RUN npm install
COPY . ./
RUN npm run build


FROM node:22.9-alpine as remover
WORKDIR /opt/app
COPY vite.config.js /opt/app/
COPY --from=compiler /opt/app/package*.json ./
COPY --from=compiler /opt/app/dist ./dist

ENV NODE_ENV = production
RUN npm ci --omit=dev

CMD ["npm", "run", "preview"]
