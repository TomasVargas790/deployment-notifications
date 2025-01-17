# 1. Imagen base de Node, ajusta la versión que necesites
FROM node:22

# 2. Creamos y definimos el directorio de trabajo
WORKDIR /.

# 3. Copiamos los archivos de definición de dependencias
COPY package*.json ./

# 4. Instalamos dependencias
RUN npm install

# 5. Copiamos el resto del código
COPY . .

# 6. Compilamos TypeScript (si tu proyecto lo requiere).
# Si no tienes un paso de build, puedes omitir esto.
# RUN npm run build

# 7. Exponemos el puerto (ajusta según necesites)
EXPOSE 3001

# 8. Comando para arrancar la app (ajusta si tu script se llama distinto)
CMD ["npm", "run", "start"]
