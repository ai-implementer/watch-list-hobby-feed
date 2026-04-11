type ValidUrl = `${'http' | 'https'}://${string}.${string}`;

type FeedInfoTuple = [label: string, url: ValidUrl];

export interface FeedInfo {
  label: string;
  url: ValidUrl;
}

const createFeedInfoList = (feedInfoTuples: FeedInfoTuple[]) => {
  const feedInfoList: FeedInfo[] = [];

  for (const [label, url] of feedInfoTuples) {
    feedInfoList.push({
      label,
      url,
    });
  }

  return feedInfoList;
};

/**
 * フィード情報一覧。カテゴリ別
 * ラベルが被るとバリデーションエラーになるので別のラベルを設定してください
 */
// prettier-ignore
export const FEED_INFO_LIST: FeedInfo[] = createFeedInfoList([
  // --- 航空・旅行ニュースメディア ---
  ['TRAICY（トライシー）', 'https://www.traicy.com/feed/'],
  ['Aviation Wire', 'https://www.aviationwire.jp/feed'],
  ['AIRLINE web -月刊エアライン×航空旅行', 'https://airline.ikaros.jp/feed/'],
  ['sky-budget スカイバジェット', 'https://sky-budget.com/feed/'],
  ['航空新聞社', 'https://www.jwing.net/feed/'],
  ['トラベルボイス', 'https://www.travelvoice.jp/feed'],
  ['レスポンス 航空', 'https://response.jp/rss/airplane.rdf'],

  // --- マイル・陸マイラー ---
  ['理系マイラーとSFC修行', 'https://rikei-miler.com/feed/'],
  ['マイルの錬金術師アドバンス', 'https://haruwari.com/feed/'],
  ['平均年収陸マイラー', 'https://sasamiler.net/feed'],
  ['すけすけのマイル乞食', 'https://www.sukesuke-mile-kojiki.net/feed'],
  ['ピピノブのANAマイルで旅ブログ', 'https://www.pipinobu.com/feed'],
  ['マイル先生のブログ', 'https://www.mile-sensei.com/feed'],
  ['ゆる医師のマイルと旅ランニング', 'https://www.goutaro.com/feed'],
  ['JGCゆる陸マイラーの旅行備忘録', 'https://travelervega.hatenablog.com/feed'],
  ['sorakoge', 'https://sorakoge.net/feed'],
  ['JALマイルの鉄人', 'https://xn--u9jwf3g0b279u8x3f.com/feed'],
  ['AMEXとANAマイル', 'https://www.sk-free-journal.com/feed'],
  ['PENGUIN LIFE', 'https://penguin-life.net/feed'],
  ['スマイラーズナビ', 'https://omusubicororin.net/feed'],
  ['Happy Mi Life', 'https://www.happy-mi-life.net/feed/'],

  // --- 旅行・ホテル ---
  ['東京ラグジュアリースタイル', 'https://kuneruasobu1192.jp/feed/'],
  ['ヴォヤージャーズ', 'https://voyageurs.jp/feed/'],
  ['ステータスカード＆マイル攻略ログ', 'https://babyfirst.jp/feed/'],
  ['PrimeTravel', 'https://jprimetravel.com/feed/'],
  ['Halohalo Travel', 'https://halohalo.space/feed'],
  ['のりたの旅ブログ', 'https://nrtlog.com/feed'],
  ['のどかな一人旅のお話', 'https://nodoka-hitoritabi.com/feed'],
  ['旅中毒', 'https://www.tabichudoku.com/feed'],
  ['ゆみみの旅ブログ', 'https://yumimiblog.com/feed'],
  ['ぼちぼち旅行Blog sao散歩', 'https://www.saotrip.com/feed'],
  ['SAPPOROベースでマイレージ旅行', 'https://www.sapporo-base.net/feed'],
  ['ENOHARU HOTEL REPORTS', 'https://enoharus-hotel-reports.com/feed'],

  // --- クレジットカード・ポイント ---
  ['クレカで妄想トラベル', 'https://www.tokutakublog.com/feed'],
  ['SPGアメックスのすべて', 'https://www.monsterism.net/feed'],
  ['Creca-Style', 'https://gold-ax.hatenablog.jp/feed'],
  ['kimama日誌', 'https://kimamanisshi.com/feed'],

  // --- キーボード ---
  ['自作キーボード温泉街の歩き方', 'https://salicylic-acid3.hatenablog.com/feed'],
  ['TALPKEYBOARD BLOG', 'https://www.talpkeyboard.com/feed'],
  ['ぴろりのくせになまいきだ。', 'https://piroriblog.hatenablog.com/feed'],
  ['Keychron Blog', 'https://keychron.com/blogs/news.atom'],
  ['Kinetic Labs', 'https://kineticlabs.com/blog/feed'],
  ['Das Keyboard Blog', 'https://www.daskeyboard.com/blog/feed/'],

  // --- パソコンデスク ---
  ['ルイログ', 'https://rui-log.com/feed/'],
  ['デジスタ', 'https://digital-style.jp/feed/'],

  // --- 総合・その他 ---
  ['The Goal', 'https://matsunosuke.jp/feed'],
]);

/**
 * その他候補
 *
 * RSSがなくなった。復活したら入れたい
 * https://blog.gmo.media/
 * ['ココネ', 'https://engineering.cocone.io/feed/'],
 *
 * リニューアルされてフィードが消えたのでしばらくしたら確認
 * ['divx', 'https://engineering.divx.co.jp/feed'],
 *
 * 技術のカテゴリ切られてないので悩ましい
 * ['Ragate', 'https://www.ragate.co.jp/blog/'],
 *
 * 会社解散・合併・倒産
 * ['GRIPHONE', 'https://tech.griphone.co.jp/feed/'],
 * ['トップゲート', 'https://www.topgate.co.jp/category/engineer/feed'],
 * ['ロコガイド', 'https://techblog.locoguide.co.jp/feed'],
 * ['トラーナ', 'https://tech.torana.co.jp/feed'],
 * ['ハンズラボ', 'https://www.hands-lab.com/feed/'],
 *
 * ブランド統合でブログ移行
 * ['ニフクラ', 'https://blog.pfs.nifcloud.com/feed'],
 *
 * サイト終了
 * ['iCARE', 'https://dev.icare.jpn.com/feed/'],
 *
 * ブログ移行でフィードURLが変更。新フィードURL未確認
 * ['DROBE', 'https://tech.drobe.co.jp/feed'],
 * ['HireRoo', 'https://hireroo.io/rss/IJhPN95WMIcPni1r59Tt'],
 *
 * 403 Forbidden
 * ['Cygames', 'https://tech.cygames.co.jp/feed/'],
 * ['BRANU', 'https://tech.branu.jp/feed'],
 * ['i-plug', 'https://itbl.hatenablog.com/feed'],
 * ['UUUM', 'https://system.blog.uuum.jp/feed'],
 * ['CROOZ SHOPLIST', encodeURI('https://crooz.co.jp/recruit_group/blog/category/テックブログ/feed/')],
 * ['マクロミル', 'https://techblog.macromill.com/feed'],
 *
 * 404
 * ['リクルートデータ', 'https://blog.recruit.co.jp/data/index.json'],
 * ['Findy Teams', 'https://engineering-org.findy-teams.com/feed.xml'],
 * ['KINTOテクノロジーズ', 'https://blog.kinto-technologies.com/feed.xml'],
 * ['テリロジー', 'https://terilogy-tech.hatenablog.com/feed'],
 * ['ヘイ データチーム', 'https://data.hey.jp/feed'],
 * ['FLINTERS', 'https://labs.septeni.co.jp/feed'],
 * ['crispy', 'https://blog.crispy-inc.com/feed'],
 * ['スタートアップテクノロジー', 'https://startup-technology.com/feed'],
 * ['JBCC', 'https://jbcc-tech.hatenablog.com/feed'],
 * ['UnReact', 'https://zenn.dev/unreact/feed'],
 * ['Zeals', 'https://tech.zeals.co.jp/feed'],
 * ['hokan', 'https://medium.com/feed/@hokan_dev'],
 * ['Filot', 'https://filot-nextd2.hatenablog.com/feed'],
 * ['Supership', 'https://www.wantedly.com/stories/s/Supership/rss.xml'],
 * ['Wiz', 'https://tech.012grp.co.jp/feed'],
 * ['intage', 'https://www.intage-ts.com/feed'],
 * ['NAXA', 'https://blog.naxa.co.jp/feed'],
 * ['Reigle', 'https://www.reigle.info/feed'],
 * ['HiTTO', 'https://product-blog.hitto.co.jp/feed'],
 * ['グッドワークス', 'https://zenn.dev/goodworks/feed'],
 * ['Croooober', 'https://tech.croooober.co.jp/feed'],
 * ['トライステージ', 'https://blog.ddm.tri-stage.jp/feed/'],
 * ['ヒュープロ', 'https://hupro-techblog.hatenablog.com/feed'],
 * ['ファンコミュニケーションズ', 'https://tech-blog.fancs.com/feed'],
 * ['HiCustomer', 'https://tech.hicustomer.jp/index.xml'],
 * ['シタテル', 'https://tech-blog.sitateru.com/feeds/posts/default'],
 * ['Salesforce', 'https://developer.salesforce.com/jpblogs/feed/'],
 * ['ホクソエム', 'https://blog.hoxo-m.com/feed'],
 * ['メンテモ', 'https://engineering.mentemo.com/feed'],
 * ['ダンクハーツ', 'https://dhe.dank-hearts.net/m/m18705e344ee6/rss'],
 * ['パトコア', 'https://tech.patcore.com/feed'],
 * ['ジークレスト', 'https://blog.gcrest.com/feed'],
 *
 * unable to verify the first certificate
 * ['エムアールピー', 'https://mrp-net.co.jp/tech_blog/feed'],
 *
 * certificate has expired
 * ['キャスレーコンサルティング', 'https://www.casleyconsulting.co.jp/blog/engineer/feed/'],
 *
 * pubDate なし
 * ['リクルート', 'https://engineers.recruit-jinji.jp/techblog/feed/']
 *
 * フィードなし。スクレイピング？
 * https://lab.mo-t.com/blog
 * https://tech-blog.sweeep.ai/
 * https://minedia-engineer-hub-minedia.vercel.app/
 * https://segaxd.co.jp/news/?category=blog
 * https://tech.smartshopping.co.jp/
 * https://olaris.jp/category/technology
 * https://licensecounter.jp/engineer-voice/blog/
 * https://tech.ilovex.co.jp/
 * https://developer.nvidia.com/ja-jp/blog/
 * https://www.vision-c.co.jp/engineerblog
 * https://www.cresco.co.jp/blog/
 * https://blog.genda.jp/creators/
 * https://lab.hokadoko.com/news/RTEPiK54
 * https://subthread.co.jp/blog/
 * ['QualiArts', 'https://technote.qualiarts.jp/rss.xml'],
 * https://securesky-plus.com/engineerblog/
 * https://www.monolithsoft.co.jp/techblog/
 * ['リクルートテクノロジーズ', 'https://techblog.recruit.co.jp/rss.xml'],
 *
 * 日本語以外
 * https://medium.com/feed/mcdonalds-technical-blog
 * https://netflixtechblog.com/
 * https://discord.com/blog/
 * https://www.twilio.com/blog
 * https://engineering.monstar-lab.com/en/
 *
 * TODO: スライド系も追加？
 * https://speakerdeck.com/line_developers
 */
