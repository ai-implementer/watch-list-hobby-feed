import { to } from 'await-to-js';
import { XMLValidator } from 'fast-xml-parser';
import type { Feed } from 'feed';
import RssParser from 'rss-parser';

// 不正な制御文字（改行・タブ・スペース以外の制御文字）
// biome-ignore lint/suspicious/noControlCharactersInRegex: この正規表現は制御文字を検出するために使用しています
const INVALID_CONTROL_CHARS_REGEX = /[\x00-\x08\x0B-\x0C\x0E-\x1F\x7F-\x9F]/g;

// エラーメッセージに含める検出箇所の最大数
const MAX_REPORTED_CONTROL_CHARS = 5;

// エラーメッセージに含める前後の文字数
const CONTEXT_BEFORE_LENGTH = 120;
const CONTEXT_AFTER_LENGTH = 60;

interface InvalidControlCharLocation {
  codePoint: string;
  index: number;
  link: string | undefined;
  context: string;
}

const toCodePointLabel = (char: string): string => {
  return `U+${(char.codePointAt(0) ?? 0).toString(16).toUpperCase().padStart(4, '0')}`;
};

// ログ上で制御文字が見えるように可視化する（改行・タブも含めて全て置換）
const visualizeControlChars = (text: string): string => {
  // biome-ignore lint/suspicious/noControlCharactersInRegex: 制御文字を可視化するために使用しています
  return text.replace(/[\x00-\x1F\x7F-\x9F]/g, (char) => `<${toCodePointLabel(char)}>`);
};

// 検出位置が属する item/entry の link を探す（どの記事が原因かを特定しやすくするため）
const findNearestItemLink = (feedXml: string, index: number): string | undefined => {
  const itemStartIndex = Math.max(feedXml.lastIndexOf('<item>', index), feedXml.lastIndexOf('<entry>', index));
  if (itemStartIndex < 0) {
    return undefined;
  }

  const itemXml = feedXml.slice(itemStartIndex, index);
  // RSS: <link>URL</link> / Atom: <link href="URL"/>
  const match = itemXml.match(/<link>([^<]*)<\/link>|<link\s[^>]*href="([^"]*)"/);
  return match?.[1] ?? match?.[2];
};

/**
 * フィードのバリデーション
 */
export class FeedValidator {
  public async assertFeed(feed: Feed): Promise<void> {
    // 一つでもimageがあればok
    let isImageFound = false;
    for (const item of feed.items) {
      if (item.image) {
        isImageFound = true;
        break;
      }
    }
    if (!isImageFound) {
      throw new Error('フィードに画像情報が一つもありません');
    }
  }

  public async assertXmlFeed(label: string, feedXml: string): Promise<void> {
    const rssParser = new RssParser();

    // rss-parser で変換してみてエラーが出ないか確認
    const [rssParserError] = await to(rssParser.parseString(feedXml));
    if (rssParserError) {
      throw new Error(
        `rss-parserによるフィードのバリデーションエラーです。 label: ${label}, error: ${rssParserError}}`,
        {
          cause: rssParserError,
        },
      );
    }

    // fast-xml-parser XMLValidator でバリデーション
    const atomValidateResult = XMLValidator.validate(feedXml);
    if (atomValidateResult !== true) {
      throw new Error(
        `fast-xml-parser XMLValidatorによるフィードのバリデーションエラーです。 label: ${label}, result: ${atomValidateResult}`,
        {
          cause: atomValidateResult,
        },
      );
    }

    // 不正な制御文字のチェック
    const locations = this.findInvalidControlChars(feedXml);
    if (locations.length > 0) {
      const details = locations
        .slice(0, MAX_REPORTED_CONTROL_CHARS)
        .map((location, i) => {
          return [
            `  [${i + 1}] ${location.codePoint} at index ${location.index}`,
            `      link: ${location.link ?? '(不明)'}`,
            `      context: ${location.context}`,
          ].join('\n');
        })
        .join('\n');

      throw new Error(
        `フィードに不正な制御文字が含まれています。 label: ${label}, count: ${locations.length}\n${details}`,
      );
    }
  }

  /**
   * 不正な制御文字の検出箇所を返す
   */
  public findInvalidControlChars(feedXml: string): InvalidControlCharLocation[] {
    const locations: InvalidControlCharLocation[] = [];

    for (const match of feedXml.matchAll(INVALID_CONTROL_CHARS_REGEX)) {
      const index = match.index;
      const contextStart = Math.max(0, index - CONTEXT_BEFORE_LENGTH);
      const contextEnd = Math.min(feedXml.length, index + CONTEXT_AFTER_LENGTH);

      locations.push({
        codePoint: toCodePointLabel(match[0]),
        index,
        link: findNearestItemLink(feedXml, index),
        context: visualizeControlChars(feedXml.slice(contextStart, contextEnd)),
      });
    }

    return locations;
  }
}
