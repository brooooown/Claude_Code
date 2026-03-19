#!/usr/bin/env python3
"""
Phase 3: テキスト分析スクリプト
フォロー理由の自由回答からインサイトを抽出
"""

import pandas as pd
import numpy as np
import json
import re
from collections import Counter, defaultdict
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

def analyze_follow_text():
    """フォロー理由のテキスト分析を実行"""

    # 元データから直接読み込み（テキストデータのため）
    results_dir = Path("results")
    original_data_path = "/Users/y-nagakura/brown/Claude_Code/survey-analysis/UXR-1423follow subtab UXRインタビュー対象者募集調査 - 編集用.csv"
    cleaned_data_path = results_dir / "cleaned_data.csv"

    # 元データ（テキスト用）
    df_original = pd.read_csv(original_data_path)

    # クリーニング済みデータ（セグメント情報用）
    if cleaned_data_path.exists():
        df_clean = pd.read_csv(cleaned_data_path)
    else:
        print("⚠️ クリーニング済みデータが見つかりません。セグメント分析はスキップします。")
        df_clean = None
    print("=== Mercari フォローテキスト分析開始 ===\n")

    # フォロー理由の自由記述カラムを特定
    text_column = None
    for col in df_original.columns:
        if '理由' in str(col) and 'フォロー' in str(col):
            text_column = col
            break

    if not text_column:
        print("❌ フォロー理由のテキストカラムが見つかりません。")
        return

    print(f"分析対象カラム: {text_column}")

    # 有効な回答を抽出
    valid_responses = df_original[text_column].dropna()
    valid_responses = valid_responses[valid_responses.str.strip() != '']
    # ヘッダー行や無効値を除去
    valid_responses = valid_responses[~valid_responses.str.contains(text_column, na=False)]

    print(f"有効回答数: {len(valid_responses):,}件")

    if len(valid_responses) == 0:
        print("❌ 分析可能なテキストデータがありません。")
        return

    # 1. 基本的なテキスト統計
    print(f"\n=== 1. テキスト基本統計 ===")

    # 文字数分析
    char_counts = valid_responses.str.len()
    print(f"平均文字数: {char_counts.mean():.1f}文字")
    print(f"最短回答: {char_counts.min()}文字")
    print(f"最長回答: {char_counts.max()}文字")
    print(f"中央値: {char_counts.median():.1f}文字")

    # 2. キーワード頻度分析
    print(f"\n=== 2. フォロー動機キーワード分析 ===")

    # フォロー動機に関連する日本語キーワード辞書
    motivation_keywords = {
        '新着・最新情報': [
            '新着', '最新', '新しい', '更新', 'アップデート', '新商品',
            '新入荷', '出品', '追加', '新作'
        ],
        '気に入り・好み': [
            '気に入', 'お気に入り', '好き', '好み', '気になる', '興味',
            'いいね', '魅力', '素敵', 'かわいい', 'おしゃれ'
        ],
        '購入意向・買い物': [
            '購入', '買い', '欲しい', 'ほしい', '買う', '購買',
            'ショッピング', '買い物', '狙い', 'ゲット'
        ],
        '価格・お得情報': [
            '価格', '値段', '安い', 'お得', 'セール', '特価',
            '割引', '値下げ', '激安', 'プライス', '料金'
        ],
        'ブランド・ショップ': [
            'ブランド', 'ショップ', '店舗', 'メーカー', '出品者',
            'セラー', '販売者', '業者', 'アカウント'
        ],
        '情報収集・チェック': [
            '情報', 'チェック', '確認', '見る', '監視', '追跡',
            '把握', '観察', 'ウォッチ', 'フォロー'
        ],
        '効率・便利': [
            '効率', '便利', '楽', '簡単', '手軽', '時短',
            '効果的', '使いやすい', '便利性'
        ],
        '見逃し防止': [
            '見逃し', '見落とし', '逃す', '見つからない', '発見',
            '見つける', '検索', '探す', 'ヒット'
        ]
    }

    # キーワードマッチング分析
    keyword_results = {}
    for category, keywords in motivation_keywords.items():
        matches = 0
        matched_responses = []

        for response in valid_responses:
            response_str = str(response).lower()
            for keyword in keywords:
                if keyword in response_str:
                    matches += 1
                    matched_responses.append(response)
                    break  # 1つの回答につき1カテゴリ1回のみカウント

        percentage = (matches / len(valid_responses)) * 100
        keyword_results[category] = {
            'count': matches,
            'percentage': percentage,
            'sample_responses': matched_responses[:3]  # サンプル3件
        }

        print(f"{category}: {matches}件 ({percentage:.1f}%)")

    # 3. 頻出単語分析（簡易版）
    print(f"\n=== 3. 頻出単語分析 ===")

    # 全テキストを結合してシンプルな単語分割
    all_text = ' '.join(valid_responses.astype(str))

    # 日本語の区切り文字で分割（簡易版）
    words = re.findall(r'[ぁ-んァ-ヶー一-龠a-zA-Z0-9]+', all_text)

    # 意味のある単語をフィルタリング（3文字以上）
    meaningful_words = [word for word in words if len(word) >= 3]

    # 頻出単語トップ20
    word_freq = Counter(meaningful_words)
    top_words = word_freq.most_common(20)

    print("頻出単語トップ20:")
    for i, (word, count) in enumerate(top_words, 1):
        percentage = (count / len(meaningful_words)) * 100
        print(f"  {i:2d}. {word}: {count}回 ({percentage:.1f}%)")

    # 4. セグメント別テキスト特徴（簡易版では省略）
    print(f"\n=== 4. セグメント別フォロー動機分析 ===")
    print("セグメント別分析は省略します（基本分析優先）")

    segment_text_analysis = {}

    # セグメント別分析は簡易版では省略
    if False:  # 一時的に無効化
        # respondent_idでマージ
        df_original_with_id = df_original.copy()
        df_original_with_id['has_valid_follow_reason'] = df_original_with_id[text_column].isin(valid_responses)

        # IDでマージ
        df_merged = pd.merge(
            df_clean[['respondent_id', 'Buyer segment', 'Follow segment']],
            df_original_with_id[['respondent_id', text_column, 'has_valid_follow_reason']],
            on='respondent_id',
            how='inner'
        )

        df_with_text = df_merged[df_merged['has_valid_follow_reason']].copy()

        # Buyerセグメント別分析
        if 'Buyer segment' in df_with_text.columns:
            print("【Buyerセグメント別動機】")
        buyer_segments = df_with_text['Buyer segment'].unique()

        buyer_motivation = {}
        for segment in buyer_segments:
            if pd.isna(segment) or segment == 'Buyer segment':
                continue

            segment_responses = df_with_text[df_with_text['Buyer segment'] == segment][text_column]

            # 各セグメントでの動機カテゴリ分析
            segment_motivations = {}
            for category, keywords in motivation_keywords.items():
                matches = 0
                for response in segment_responses:
                    response_str = str(response).lower()
                    for keyword in keywords:
                        if keyword in response_str:
                            matches += 1
                            break

                if len(segment_responses) > 0:
                    percentage = (matches / len(segment_responses)) * 100
                    segment_motivations[category] = percentage

            # トップ動機を特定
            if segment_motivations:
                top_motivation = max(segment_motivations.items(), key=lambda x: x[1])
                print(f"  {segment}: {top_motivation[0]} ({top_motivation[1]:.1f}%)")
                buyer_motivation[segment] = segment_motivations

        segment_text_analysis['buyer_motivations'] = buyer_motivation

        # Followセグメント別分析は簡易版では省略
        pass
    else:
        print("セグメント別分析は省略します（クリーニング済みデータなし）")
        print(f"\n【Followセグメント別動機】")
        follow_segments = df_with_text['Follow segment'].unique()

        follow_motivation = {}
        for segment in follow_segments:
            if pd.isna(segment) or segment == 'Follow segment':
                continue

            segment_responses = df_with_text[df_with_text['Follow segment'] == segment][text_column]

            segment_motivations = {}
            for category, keywords in motivation_keywords.items():
                matches = 0
                for response in segment_responses:
                    response_str = str(response).lower()
                    for keyword in keywords:
                        if keyword in response_str:
                            matches += 1
                            break

                if len(segment_responses) > 0:
                    percentage = (matches / len(segment_responses)) * 100
                    segment_motivations[category] = percentage

            if segment_motivations:
                top_motivation = max(segment_motivations.items(), key=lambda x: x[1])
                print(f"  {segment}: {top_motivation[0]} ({top_motivation[1]:.1f}%)")
                follow_motivation[segment] = segment_motivations

        segment_text_analysis['follow_motivations'] = follow_motivation

    # 5. 感情・態度分析（簡易版）
    print(f"\n=== 5. 感情・態度分析 ===")

    sentiment_keywords = {
        'ポジティブ': ['好き', '気に入', '楽しい', '便利', '良い', '素晴らしい', '満足', 'いい'],
        'ネガティブ': ['困る', '面倒', '大変', 'だめ', '悪い', 'いやだ', '不便'],
        'ニュートラル': ['普通', 'まあまあ', 'そこそこ', 'それなり']
    }

    sentiment_analysis = {}
    for sentiment, keywords in sentiment_keywords.items():
        matches = 0
        for response in valid_responses:
            response_str = str(response).lower()
            for keyword in keywords:
                if keyword in response_str:
                    matches += 1
                    break

        percentage = (matches / len(valid_responses)) * 100
        sentiment_analysis[sentiment] = {
            'count': matches,
            'percentage': percentage
        }
        print(f"{sentiment}: {matches}件 ({percentage:.1f}%)")

    # 6. 結果保存
    print(f"\n=== 結果保存 ===")

    text_analysis_results = {
        'analysis_date': pd.Timestamp.now().isoformat(),
        'total_valid_responses': len(valid_responses),
        'text_statistics': {
            'avg_length': char_counts.mean(),
            'min_length': char_counts.min(),
            'max_length': char_counts.max(),
            'median_length': char_counts.median()
        },
        'keyword_analysis': keyword_results,
        'top_words': dict(top_words),
        'segment_analysis': segment_text_analysis,
        'sentiment_analysis': sentiment_analysis
    }

    # JSON保存
    with open(results_dir / "text_analysis_results.json", "w", encoding="utf-8") as f:
        json.dump(text_analysis_results, f, ensure_ascii=False, indent=2, default=str)

    # インサイトMarkdown作成
    with open(results_dir / "text_insights.md", "w", encoding="utf-8") as f:
        f.write("# フォロー動機テキスト分析インサイト\n\n")
        f.write(f"**分析日時**: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M')}\n")
        f.write(f"**分析対象**: {len(valid_responses):,}件の自由回答\n\n")

        f.write("## 主要なフォロー動機（上位5位）\n")
        sorted_motivations = sorted(keyword_results.items(), key=lambda x: x[1]['percentage'], reverse=True)
        for i, (category, data) in enumerate(sorted_motivations[:5], 1):
            f.write(f"{i}. **{category}**: {data['count']}件 ({data['percentage']:.1f}%)\n")
        f.write("\n")

        f.write("## セグメント別特徴的動機\n")
        if 'buyer_motivations' in segment_text_analysis:
            f.write("### Buyerセグメント\n")
            for segment, motivations in segment_text_analysis['buyer_motivations'].items():
                if motivations:
                    top_mot = max(motivations.items(), key=lambda x: x[1])
                    f.write(f"- **{segment}**: {top_mot[0]} ({top_mot[1]:.1f}%)\n")
            f.write("\n")

        if 'follow_motivations' in segment_text_analysis:
            f.write("### Followセグメント\n")
            for segment, motivations in segment_text_analysis['follow_motivations'].items():
                if motivations:
                    top_mot = max(motivations.items(), key=lambda x: x[1])
                    f.write(f"- **{segment}**: {top_mot[0]} ({top_mot[1]:.1f}%)\n")

    print(f"✅ テキスト分析完了")
    print(f"   - 詳細結果: {results_dir / 'text_analysis_results.json'}")
    print(f"   - インサイト: {results_dir / 'text_insights.md'}")

    return text_analysis_results

if __name__ == "__main__":
    try:
        results = analyze_follow_text()

        if results:
            print(f"\n=== テキスト分析サマリー ===")
            print(f"有効回答: {results['total_valid_responses']:,}件")
            print(f"平均文字数: {results['text_statistics']['avg_length']:.1f}文字")

            # トップ動機の表示
            keyword_analysis = results['keyword_analysis']
            sorted_motivations = sorted(keyword_analysis.items(), key=lambda x: x[1]['percentage'], reverse=True)

            print(f"\nトップ3動機:")
            for i, (category, data) in enumerate(sorted_motivations[:3], 1):
                print(f"  {i}. {category}: {data['percentage']:.1f}%")

    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")
        import traceback
        traceback.print_exc()