#!/usr/bin/env python3
"""
Phase 2: フォロー行動分析スクリプト
フォロー動機、利用頻度、購買パターンの詳細分析
"""

import pandas as pd
import numpy as np
import json
from pathlib import Path
import re
from collections import Counter
import warnings
warnings.filterwarnings('ignore')

def analyze_follow_behavior():
    """フォロー行動の詳細分析を実行"""

    # データ読み込み
    results_dir = Path("results")
    data_path = results_dir / "cleaned_data.csv"

    if not data_path.exists():
        print("❌ クリーニング済みデータが見つかりません。")
        return

    df = pd.read_csv(data_path)
    print("=== Mercari フォロー行動分析開始 ===\n")
    print(f"分析対象データ: {df.shape[0]:,}件")

    # フォロー関連カラムを特定
    follow_cols = []
    for col in df.columns:
        if any(keyword in str(col).lower() for keyword in ['follow', 'フォロー']):
            follow_cols.append(col)

    print(f"フォロー関連項目: {len(follow_cols)}個")

    # 1. フォロー利用状況分析
    print(f"\n=== 1. フォロー機能利用状況分析 ===")

    # フォロー機能の利用状況カラム特定
    usage_col = None
    importance_col = None

    for col in follow_cols:
        if '利用状況' in str(col):
            usage_col = col
        elif '重要度' in str(col):
            importance_col = col

    follow_analysis = {}

    if usage_col:
        print(f"【利用状況】")
        usage_stats = df[usage_col].value_counts()
        print("フォロー機能利用状況:")
        for status, count in usage_stats.items():
            if pd.notna(status):
                percentage = (count / len(df)) * 100
                print(f"  {status}: {count:,}件 ({percentage:.1f}%)")

        follow_analysis['usage_distribution'] = usage_stats.to_dict()

    if importance_col:
        print(f"\n【重要度】")
        importance_stats = df[importance_col].value_counts()
        print("フォロー機能重要度:")
        for importance, count in importance_stats.items():
            if pd.notna(importance):
                percentage = (count / len(df)) * 100
                print(f"  {importance}: {count:,}件 ({percentage:.1f}%)")

        follow_analysis['importance_distribution'] = importance_stats.to_dict()

    # 2. セグメント別フォロー利用状況
    print(f"\n=== 2. セグメント別フォロー利用分析 ===")

    segment_follow_analysis = {}

    if usage_col and 'Buyer segment' in df.columns:
        print(f"【Buyerセグメント別利用状況】")
        buyer_usage = pd.crosstab(df['Buyer segment'], df[usage_col], normalize='index') * 100

        for buyer_seg in buyer_usage.index:
            if buyer_seg != 'Buyer segment':
                print(f"\n{buyer_seg}:")
                for status in buyer_usage.columns:
                    if pd.notna(status):
                        percentage = buyer_usage.loc[buyer_seg, status]
                        print(f"  {status}: {percentage:.1f}%")

        segment_follow_analysis['buyer_usage'] = buyer_usage.to_dict()

    if usage_col and 'Follow segment' in df.columns:
        print(f"\n【Followセグメント別利用状況】")
        follow_usage = pd.crosstab(df['Follow segment'], df[usage_col], normalize='index') * 100

        for follow_seg in follow_usage.index:
            if follow_seg != 'Follow segment':
                print(f"\n{follow_seg}:")
                for status in follow_usage.columns:
                    if pd.notna(status):
                        percentage = follow_usage.loc[follow_seg, status]
                        print(f"  {status}: {percentage:.1f}%")

        segment_follow_analysis['follow_usage'] = follow_usage.to_dict()

    # 3. フォロー頻度分析
    print(f"\n=== 3. フォロー頻度・利用パターン分析 ===")

    frequency_analysis = {}

    # フォロー頻度カラムを探す
    frequency_col = None
    for col in follow_cols:
        if '頻度' in str(col) and 'フォロー' in str(col):
            frequency_col = col
            break

    if frequency_col:
        print(f"【{frequency_col}】")
        freq_stats = df[frequency_col].value_counts()

        print("フォロー機能利用頻度:")
        for freq, count in freq_stats.items():
            if pd.notna(freq):
                percentage = (count / len(df)) * 100
                print(f"  {freq}: {count:,}件 ({percentage:.1f}%)")

        frequency_analysis['distribution'] = freq_stats.to_dict()

    # 4. フォロー動機・目的分析（自由記述）
    print(f"\n=== 4. フォロー動機・目的分析 ===")

    motivation_col = None
    for col in follow_cols:
        if '理由' in str(col) or '目的' in str(col):
            motivation_col = col
            break

    motivation_analysis = {}

    if motivation_col:
        print(f"【{motivation_col}】")

        # 有効な回答の抽出
        valid_responses = df[motivation_col].dropna()
        valid_responses = valid_responses[valid_responses != '']

        print(f"有効回答数: {len(valid_responses):,}件")

        if len(valid_responses) > 0:
            # 頻出フレーズの抽出（簡易版）
            all_text = ' '.join(valid_responses.astype(str))

            # よくあるフォロー動機のキーワード検出
            motivation_keywords = {
                '新着確認': ['新着', '新しい', '最新'],
                '気に入り': ['気に入', 'お気に入り', '好き'],
                '購入意向': ['購入', '買い', '欲しい'],
                '情報収集': ['情報', 'チェック', '見る'],
                '価格確認': ['価格', '値段', '安い'],
                'ブランド・ショップ': ['ブランド', 'ショップ', '店舗'],
                'セール・特価': ['セール', '特価', '安く']
            }

            keyword_counts = {}
            for category, keywords in motivation_keywords.items():
                count = sum(1 for text in valid_responses for keyword in keywords if keyword in str(text))
                if count > 0:
                    percentage = (count / len(valid_responses)) * 100
                    keyword_counts[category] = count
                    print(f"  {category}: {count}件 ({percentage:.1f}%)")

            motivation_analysis = {
                'total_responses': len(valid_responses),
                'keyword_analysis': keyword_counts
            }

    # 5. YouTube等他プラットフォームとの比較
    print(f"\n=== 5. 他プラットフォーム利用状況 ===")

    youtube_col = None
    for col in df.columns:
        if 'YouTube' in str(col) and '頻度' in str(col):
            youtube_col = col
            break

    platform_analysis = {}

    if youtube_col:
        print(f"【YouTube登録チャンネル確認頻度】")
        youtube_stats = df[youtube_col].value_counts()

        for freq, count in youtube_stats.items():
            if pd.notna(freq):
                percentage = (count / len(df)) * 100
                print(f"  {freq}: {count:,}件 ({percentage:.1f}%)")

        platform_analysis['youtube_frequency'] = youtube_stats.to_dict()

        # YouTube利用頻度とMercariフォローセグメントとの関係
        if 'Follow segment' in df.columns:
            print(f"\nYouTube利用 × Mercariフォローセグメント関係:")
            yt_follow_cross = pd.crosstab(df[youtube_col], df['Follow segment'], normalize='index') * 100

            # Follow Super Heavy セグメントの比率を表示
            if '1.Follow Super Heavy (80+)' in yt_follow_cross.columns:
                print("YouTube利用頻度別のMercari Follow Super Heavy比率:")
                for yt_freq in yt_follow_cross.index:
                    if pd.notna(yt_freq):
                        super_heavy_pct = yt_follow_cross.loc[yt_freq, '1.Follow Super Heavy (80+)']
                        print(f"  {yt_freq}: {super_heavy_pct:.1f}%")

    # 6. 結果保存
    print(f"\n=== 結果保存 ===")

    follow_behavior_results = {
        'analysis_date': pd.Timestamp.now().isoformat(),
        'total_responses': len(df),
        'follow_usage_analysis': follow_analysis,
        'segment_follow_analysis': segment_follow_analysis,
        'frequency_analysis': frequency_analysis,
        'motivation_analysis': motivation_analysis,
        'platform_comparison': platform_analysis
    }

    # JSON保存
    with open(results_dir / "follow_behavior_analysis.json", "w", encoding="utf-8") as f:
        json.dump(follow_behavior_results, f, ensure_ascii=False, indent=2, default=str)

    # Markdownサマリー作成
    with open(results_dir / "follow_behavior_summary.md", "w", encoding="utf-8") as f:
        f.write("# Mercari フォロー行動分析サマリー\n\n")
        f.write(f"**分析日時**: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M')}\n")
        f.write(f"**分析対象**: {len(df):,}件\n\n")

        if follow_analysis:
            f.write("## フォロー機能利用状況\n")
            if 'usage_distribution' in follow_analysis:
                f.write("### 利用状況\n")
                for status, count in follow_analysis['usage_distribution'].items():
                    if pd.notna(status):
                        percentage = (count / len(df)) * 100
                        f.write(f"- {status}: {count:,}件 ({percentage:.1f}%)\n")
                f.write("\n")

        if motivation_analysis and 'keyword_analysis' in motivation_analysis:
            f.write("## フォロー動機分析\n")
            for category, count in motivation_analysis['keyword_analysis'].items():
                percentage = (count / motivation_analysis['total_responses']) * 100
                f.write(f"- {category}: {count}件 ({percentage:.1f}%)\n")
            f.write("\n")

    print(f"✅ フォロー行動分析完了")
    print(f"   - 詳細結果: {results_dir / 'follow_behavior_analysis.json'}")
    print(f"   - サマリー: {results_dir / 'follow_behavior_summary.md'}")

    return follow_behavior_results

if __name__ == "__main__":
    try:
        results = analyze_follow_behavior()

        if results:
            print(f"\n=== フォロー行動分析サマリー ===")
            print(f"分析対象: {results['total_responses']:,}件")

            # 利用状況のサマリー
            if 'follow_usage_analysis' in results and 'usage_distribution' in results['follow_usage_analysis']:
                usage_dist = results['follow_usage_analysis']['usage_distribution']
                print(f"フォロー機能利用者数: {sum([count for status, count in usage_dist.items() if '利用している' in str(status)]):,}件")

    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")
        import traceback
        traceback.print_exc()