# 開発を始める際に読む

![example workflow](https://github.com/ncdcdev/TeamPlanet/actions/workflows/testOnPush.yml/badge.svg)

## 開発のやり方

- UserStory 駆動で開発を行う
- UserStory は trello に記載する
  - [trello](https://trello.com/b/lToehoqg/)
- UserStory は PO(Product Owner)が完了条件を記載する
- 各 Story にアサインされた開発者は Story に必要なタスクを github の issue にする
- issue には各タスクの完了条件を記載する
  - タスクの完了条件が Story に準じているかレビューを行う
- issue にて詳細な仕様の議論を行う
- 決定した仕様は code とともに git にコミットする
- 上記 issue に紐付けた PR を作成する

## 報告

- 作業開始前に予定タスクの報告を slack に記載
- 作業完了後に完了タスクの報告を slack に記載
- 作業報告時に draft PR を作成する

## PR レビューの基準

- ビルド、単体テストが通っていること
- 各 issue の完了条件を満たしていること
- 変更しやすい設計になっていること

## システムアーキテクチャ

- メインリソースは AWS クラウド上に存在する
- ECS 上で nodejs サーバーが起動している
- フロントエンドは Amplify Console
- 感情分析のために GCP の自然言語解析 API を呼び出している

![アーキテクチャ図](./doc/architecture.dio.svg)

- dev 環境では default VPC 上の RDS を外部アクセス可能にしている

## 環境について

- dev 環境
  - デプロイ先: https://dev.api.teamplanet.net
  - [開発環境](./doc/環境情報.md)

### 環境構築

- db の作成は IaC でやっていない

## ローカル環境での実行

[ドキュメント](https://api.slack.com/tutorials/tunneling-with-ngrok)を参照

1. GCP のサービスアカウントキー JSON をもらってどこかに設置する
1. `.env.example` をコピーして `.env` を用意する
1. Slack の[Application 管理ページ](https://api.slack.com/apps)を開き、ワークスペースに追加するためのアプリを新しく作成するか既存のアプリを編集する
1. `.env`の`SLACK_CLIENT_ID`, `SLACK_CLIENT_SECRET`, `SLACK_SIGNING_SECRET`, `GOOGLE_APPLICATION_CREDENTIALS`を前ステップで選択したアプリの情報で埋める
1. docker で DB を立ち上げる。
   ```shell
   docker-compose up -d
   ```
1. DB を初期化する
   ```shell
   yarn prisma db push
   ```
1. ローカル環境で API を起動させる。
   ```shell
   yarn dev
   ```
1. [ngrok](https://ngrok.com/) でサーバーのポートを公開
   ```
   ngrok http 8080
   ```
1. Slack アプリのマニフェストを更新する
   - アプリ管理画面の Edit Manifest ボタンから設定できる
     - ![Edit Manifest ボタンの場所](https://user-images.githubusercontent.com/3516343/141087265-6eb2c6e3-32cc-4f26-9765-138a9e4c0363.png)
   - アプリが古く場合（青いバナーが出る場合）はバナー内の**Try it out now**を押して新しいアプリ管理画面に移行する
     - ![新しいアプリ管理画面に移行する](https://user-images.githubusercontent.com/3516343/141087444-1984feed-b947-4adc-a844-0b0bb7b66110.png)
   - 設定するマニフェストサンプル
   ```yaml
   _metadata:
     major_version: 1
     minor_version: 1
   display_information:
     name: teamplanet-takahashi-local
   features:
     bot_user:
       display_name: teamplanet-takahashi-local
       always_online: false
   oauth_config:
     redirect_urls:
       - https://9e44-240d-1a-980-4700-f077-ecc7-ef5f-d097.ngrok.io/slack/callback
     scopes:
       bot: # /src/controller/login/index.ts で登録しているものと揃える
         - channels:history
         - chat:write
         - channels:join
         - channels:read
         - groups:read
         - mpim:read
         - im:read
         - users.profile:read
         - users:read
         - team:read
   settings:
     event_subscriptions:
       request_url: https://9e44-240d-1a-980-4700-f077-ecc7-ef5f-d097.ngrok.io/slack/events
       bot_events:
         - message.channels
     org_deploy_enabled: false
     socket_mode_enabled: false
     token_rotation_enabled: false
   ```
1. `display_information.name`, `features.bot_user.display_name` を誰のか分かる様に書き換える
1. （ngrok の URL が変更されたなら）マニフェスト内の URL のドメインを今の ngrok の Forwarding URL（xxx.ngrok.io）に書き換える
   - save changes 時に verify しろと言われるので verify する
1. Token Rotation を有効にしていない場合は、 **OAuth & Permissions** から有効にする
   - ![](https://user-images.githubusercontent.com/3516343/144366764-202df91e-a312-4c23-9e4f-fad908dc2b93.png)
   - この表示が **OAuth & Permissions** ページにない場合は既に有効になっている
1. `ngrokのforwarding URL/login` を開いてワークスペースへアプリ追加
1. アプリ追加後、ログに出力される（あるいはリダイレクト先の URL パラメータに含まれる）Bearer トークンを用いて API にアクセスできる

※ 作成したワークスペース以外に追加する場合は Public Distribution が必要

- Distribution -> Manage Distribution

### DB を直接覗く

```shell
docker-compose exec db bash
```

でコンテナのシェルに入り、

```
mysql -u kitkat -ppassword
```

で mysql に入れる

`docker-compose.yml`に記載されている内容で Sequel Ace などのクライアントで接続することもできる

Prisma なので [Prisma Studio](https://www.prisma.io/studio)で [schema.prisma](./prisma/schema.prisma) を開くなどでも可

## AWS へのデプロイ

GitHub Actions で ECR への push, ECS のタスク定義更新を行っている

## Prisma client の作成

`yarn prisma generate`
