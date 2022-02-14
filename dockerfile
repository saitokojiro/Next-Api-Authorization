FROM node:latest

#WORKDIR /usr/src/app
WORKDIR /src/app/oauth-custom
 
COPY package*.json .
RUN npm install
RUN npm start

#  ADD ./../server-nextjs/oauth_custom .
#COPY /server-nextjs/oauth_custom /src/app/oauth-custom/


#RUN npm install
#COPY . .
 
#CMD [ "npm", "start" ]