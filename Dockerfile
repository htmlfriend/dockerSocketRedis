FROM node:13
WORKDIR /
COPY / /home/node/app
RUN npm install
CMD npm run app
