import to from 'await-to-js';
import { describe, expect, it } from 'vitest';
import { FeedValidator } from '../src/feed/feed-validator';

describe('FeedValidator', () => {
  it('正しいXMLフィード1', async () => {
    const feedValidator = new FeedValidator();
    const [error] = await to(
      feedValidator.assertXmlFeed(
        'test',
        `<?xml version="1.0" encoding="utf-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <id>https://hobeeds.implementer.net/</id>
        <title>企業テックブログRSS</title>
      </feed>`,
      ),
    );
    expect(error).toBeNull();
  });

  it('正しいXMLフィード', async () => {
    const feedValidator = new FeedValidator();
    const [error] = await to(
      feedValidator.assertXmlFeed(
        'test',
        `<?xml version="1.0" encoding="utf-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <id>https://hobeeds.implementer.net/</id>
        <title>企業テックブログRSS</title>
        <updated>2023-10-20T15:11:49.708Z</updated>
        <entry>
          <title type="html"><![CDATA[test]]></title>
          <summary type="html"><![CDATA[test]]></summary>
        </entry>
      </feed>`,
      ),
    );
    console.log(error);
    expect(error).toBeNull();
  });

  it('正しくないXMLフィード', async () => {
    const feedValidator = new FeedValidator();
    const [error] = await to(
      feedValidator.assertXmlFeed(
        'test',
        `<?xml version="1.0" encoding="UTF-8"?>
      <rss version="2.0">`,
      ),
    );
    expect(error).not.toBeNull();
  });

  it('不正な文字を含む', async () => {
    const feedValidator = new FeedValidator();
    const [error] = await to(
      feedValidator.assertXmlFeed(
        'test',
        `<?xml version="1.0" encoding="utf-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <id>https://hobeeds.implementer.net/</id>
        <title>企業テックブログ\u{0010}RSS</title>
      </feed>`,
      ),
    );
    expect(error).not.toBeNull();
  });

  it('不正な文字を含む', async () => {
    const feedValidator = new FeedValidator();
    const [error] = await to(
      feedValidator.assertXmlFeed(
        'test',
        `<?xml version="1.0" encoding="utf-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <id>https://hobeeds.implementer.net/</id>
        <title>企業テックブログRSS</title>
        <updated>2023-10-20T15:11:49.708Z</updated>
        <entry>
          <title type="html"><![CDATA[te\u{000b}st]]></title>
          <summary type="html"><![CDATA[test]]></summary>
        </entry>
      </feed>`,
      ),
    );
    expect(error).not.toBeNull();
  });
});

describe('FeedValidator 制御文字の検出箇所レポート', () => {
  it('エラーメッセージに文字コード・記事のlink・前後の文脈が含まれる（RSS）', async () => {
    const feedValidator = new FeedValidator();
    const [error] = await to(
      feedValidator.assertXmlFeed(
        'rss',
        `<?xml version="1.0" encoding="utf-8"?>
      <rss version="2.0">
        <channel>
          <title>企業テックブログRSS</title>
          <link>https://hobeeds.implementer.net/</link>
          <description>test</description>
          <item>
            <title><![CDATA[記事1]]></title>
            <link>https://example.com/entry/1</link>
            <_custom><favicon>https://example.com/favicon.ico</favicon></_custom>
          </item>
          <item>
            <title><![CDATA[記事2]]></title>
            <link>https://example.com/entry/2</link>
            <_custom><favicon>https://example.com/fav\u{000b}icon.ico</favicon></_custom>
          </item>
        </channel>
      </rss>`,
      ),
    );
    expect(error).not.toBeNull();
    expect(error?.message).toContain('label: rss, count: 1');
    expect(error?.message).toContain('U+000B');
    expect(error?.message).toContain('link: https://example.com/entry/2');
    expect(error?.message).toContain('https://example.com/fav<U+000B>icon.ico');
  });

  it('エラーメッセージに記事のlinkが含まれる（Atom）', async () => {
    const feedValidator = new FeedValidator();
    const [error] = await to(
      feedValidator.assertXmlFeed(
        'atom',
        `<?xml version="1.0" encoding="utf-8"?>
      <feed xmlns="http://www.w3.org/2005/Atom">
        <id>https://hobeeds.implementer.net/</id>
        <title>企業テックブログRSS</title>
        <updated>2023-10-20T15:11:49.708Z</updated>
        <entry>
          <title type="html"><![CDATA[記事1]]></title>
          <link href="https://example.com/entry/1"/>
          <link rel="enclosure" href="https://example.com/image.png" type="image/png"/>
          <summary type="html"><![CDATA[te\u{0085}st]]></summary>
        </entry>
      </feed>`,
      ),
    );
    expect(error).not.toBeNull();
    expect(error?.message).toContain('U+0085');
    expect(error?.message).toContain('link: https://example.com/entry/1');
  });

  it('findInvalidControlChars は全ての検出箇所を返す', () => {
    const feedValidator = new FeedValidator();
    const locations = feedValidator.findInvalidControlChars('a\u{0001}b\u{0002}c\u{0003}d');
    expect(locations).toHaveLength(3);
    expect(locations.map((l) => l.codePoint)).toEqual(['U+0001', 'U+0002', 'U+0003']);
    expect(locations[0].link).toBeUndefined();
  });
});
