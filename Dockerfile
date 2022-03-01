FROM node:lts-alpine

WORKDIR /server

#ファイルのコピー
COPY ./ /server/

#依存関係のインストール
RUN apk add --no-cache ffmpeg && \
    yarn install && \
    yarn build && \
    yarn cache clean && \
    rm -rf /root/.npm

CMD /usr/local/bin/yarn start