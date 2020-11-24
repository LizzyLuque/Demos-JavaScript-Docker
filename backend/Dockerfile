FROM node:latest

# Crear el directorio de la aplicación
WORKDIR /usr/src/app

# Instalar las dependencias 
COPY package*.json ./

RUN npm install
# Si se esta compilando para producción
#RUN npm ci --only=production

# Copia todo el código de la aplicación
COPY dist/ .

EXPOSE 5000
CMD npm start
