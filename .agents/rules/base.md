---
alwaysApply: true
---

# プロジェクト概要

README.md を読んで理解してください

## Project Overview

企業テックブログのRSS/Atomフィードを集約し、まとめフィードとして配信するサイト。[yamadashy/tech-blog-rss-feed](https://github.com/yamadashy/tech-blog-rss-feed) のフォーク。

- サイト: https://hobeeds.implementer.net/
- GitHub Actions で定期更新（平日1時間おき、休日2時間おき）
- サイト生成に [Eleventy](https://www.11ty.dev/) を使用

## Commands

```bash
npm install              # パッケージインストール
npm run feed-generate    # フィード取得・生成
npm run site-serve       # localhost:8080 で開発サーバー起動
npm run site-build       # サイトビルド
npm run build            # feed-generate + site-build
npm run lint             # biome check + tsc --noEmit + secretlint
npm run test             # vitest run（全テスト）
npm run test-internal    # 外部テスト除外
npm run test-external    # 外部テストのみ（フィードの疎通確認など）
```

## Architecture

### Feed Pipeline (`src/cli/generate-feed-command.ts`)
1. **FeedCrawler** (`src/feed/feed-crawler.ts`) - 各ブログのRSSフィードを並列取得、OG情報も取得
2. **FeedGenerator** (`src/feed/feed-generator.ts`) - 取得した記事をまとめフィード（Atom/RSS/JSON）に変換
3. **FeedStorer** (`src/feed/feed-storer.ts`) - 生成したフィードを `src/site/feeds/` に出力
4. **FeedValidator** (`src/feed/feed-validator.ts`) - 生成フィードのバリデーション

### Site (`src/site/`)
- Eleventy (Nunjucks テンプレート) でサイト生成、出力先は `public/`
- `_data/` ディレクトリの JS ファイルがデータソース（blogFeeds, feedItemsChunks など）

### Key Files
- `src/resources/feed-info-list.ts` - フィード一覧（`[ラベル, URL]` のタプル配列）。ラベルは一意である必要あり
- `src/common/constants.ts` - サイトURL、フィード設定、並列数などの定数
- `eleventy.config.ts` - Eleventy 設定

## Tech Stack
- Node.js >= 20, TypeScript, tsx (実行), Eleventy v3 (SSG)
- Linting: Biome, secretlint
- Testing: Vitest

## Testing

単一テストファイルの実行:
```bash
npx vitest run tests/feed-info-list.test.ts
```

`test-internal` はネットワークアクセス不要のテスト、`test-external` はフィードURLへの疎通確認テスト。フィード追加後は最低限 `npm run test-internal` でラベル重複チェックを通すこと。

## Feed Addition Workflow

ユーザーにフィードを追加してと言われたら、以下の手順でフィードを追加してください。
すべての手順は都度ユーザーに同意を得て進めてください。

1. フィード追加の最低限の情報をユーザーに聞く
   - 企業名
   - RSSフィードURL
2. ブランチ作成
   `git checkout -b chore/new-feed-<企業名の英語>`
3. `src/resources/feed-info-list.ts` の `FEED_INFO_LIST` に `['企業名', 'フィードURL']` を追加
4. コミット
   `git commit -am 'chore(feed): <企業名など> 追加'`
5. プッシュ
   `git push origin chore/new-feed-<企業名の英語>`
6. プルリク作成（`.github/pull_request_template.md` を参考に、ghコマンドがあれば使用）
