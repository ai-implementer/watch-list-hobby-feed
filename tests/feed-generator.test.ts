import { describe, expect, it } from 'vitest';
import type { CustomRssParserItem, OgObjectMap } from '../src/feed/feed-crawler';
import { FeedGenerator } from '../src/feed/feed-generator';
import { FeedValidator } from '../src/feed/feed-validator';

describe('FeedGenerator', () => {
  it('不正なOG画像URLは画像なしとしてフィード生成できる', () => {
    const feedItem = {
      title: 'テスト記事',
      link: 'https://example.com/test-article/',
      guid: 'https://example.com/?p=1',
      isoDate: '2026-06-09T04:03:10.000Z',
      blogTitle: 'Example Tech Blog',
      blogLink: 'https://example.com',
    } as CustomRssParserItem;
    const ogObjectMap = new Map([
      [
        feedItem.link,
        {
          // ホスト名に %20 を含むURLは new URL() が throw する
          customOgImage: {
            url: 'http://Invalid%20Og%20Image',
          },
        },
      ],
    ]) as OgObjectMap;
    const feedGenerator = new FeedGenerator();

    const result = feedGenerator.generateFeeds([feedItem], ogObjectMap, new Map(), 200, 500);

    expect(result.aggregatedFeed.items[0].image).toBeUndefined();
    expect(result.feedDistributionSet.atom).toContain('<feed');
  });
});

describe('FeedGenerator OG由来の不正な文字', () => {
  const feedItem = {
    title: 'テスト記事',
    link: 'https://example.com/test-article/',
    guid: 'https://example.com/?p=1',
    isoDate: '2026-06-09T04:03:10.000Z',
    blogTitle: 'Example Tech Blog',
    blogLink: 'https://example.com',
  } as CustomRssParserItem;
  const ogObjectMap = new Map([
    [
      feedItem.link,
      {
        // The Verge の og:image:alt に含まれていた U+0092（Windows-1252 の ’ の誤エンコード）
        customOgImage: {
          url: 'https://example.com/image.png',
          width: 1200,
          alt: 'Close Up Of Man\u{0092}S Hands On The Steering Wheel Of A Car.',
        },
        favicon: 'https://example.com/fav\u{000b}icon.ico',
      },
    ],
  ]) as OgObjectMap;

  it('OG画像のaltとfaviconから制御文字が除去され、RSS/Atomがバリデーションを通る', async () => {
    const feedGenerator = new FeedGenerator();
    const feedValidator = new FeedValidator();

    const result = feedGenerator.generateFeeds([feedItem], ogObjectMap, new Map(), 200, 500);

    expect(result.feedDistributionSet.rss).toContain('alt="Close Up Of ManS Hands On The Steering Wheel Of A Car."');
    expect(result.feedDistributionSet.rss).toContain('<favicon>https://example.com/favicon.ico</favicon>');
    expect(feedValidator.findInvalidControlChars(result.feedDistributionSet.rss)).toEqual([]);
    await expect(feedValidator.assertXmlFeed('rss', result.feedDistributionSet.rss)).resolves.toBeUndefined();
    await expect(feedValidator.assertXmlFeed('atom', result.feedDistributionSet.atom)).resolves.toBeUndefined();
  });
});
