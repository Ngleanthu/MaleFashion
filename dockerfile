FROM node:16-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Thêm biến môi trường
ENV MONGO_URI=mongodb+srv://ngleanthu:ngleanthu@cluster0.jxr73.mongodb.net/test?retryWrites=true&w=majority
ENV SESSION_SECRET=ngleanthu
ENV ADMIN_KEY=38yejdqw$

COPY . .

EXPOSE 3000

CMD ["node", "app.js"]
