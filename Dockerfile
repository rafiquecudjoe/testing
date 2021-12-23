FROM node:14

# アプリケーションディレクトリを作成する
WORKDIR /usr/src/app
COPY package.json ./
COPY yarn.lock ./

RUN yarn --frozen-lockfile

COPY . .
# schemaをコピーしてからgenerateする
RUN yarn prisma generate 

# Fargateではportマッピングできないので80で動かす
EXPOSE 80

CMD yarn start