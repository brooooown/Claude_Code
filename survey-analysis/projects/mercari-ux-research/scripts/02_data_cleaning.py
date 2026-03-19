#!/usr/bin/env python3
"""
Phase 1: データクリーニングスクリプト
Mercari UXリサーチ調査データの前処理
"""

import pandas as pd
import numpy as np
import re
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

def clean_data():
    """データクリーニングを実行し、分析用データセットを作成"""

    # データ読み込み
    data_path = "/Users/y-nagakura/brown/Claude_Code/survey-analysis/UXR-1423follow subtab UXRインタビュー対象者募集調査 - 編集用.csv"
    df = pd.read_csv(data_path)

    print("=== Mercari UXリサーチデータクリーニング開始 ===\n")
    print(f"元データ形状: {df.shape}")

    # 1. 重要カラムの特定と保持
    important_columns = [
        'respondent_id',
        'Buyer segment',
        'Follow segment'
    ]

    # デモグラフィック項目の特定
    demographic_columns = []
    for col in df.columns:
        if any(keyword in str(col) for keyword in ['性別', '年代', '都道府県', '職業']):
            demographic_columns.append(col)

    # フォロー関連項目の特定
    follow_columns = []
    for col in df.columns:
        if any(keyword in str(col).lower() for keyword in ['follow', 'フォロー']):
            follow_columns.append(col)

    # 「いいね」関連項目
    like_columns = []
    for col in df.columns:
        if 'いいね' in str(col):
            like_columns.append(col)

    # ショッピング行動関連
    shopping_columns = []
    for col in df.columns:
        if any(keyword in str(col) for keyword in ['購入', '買い物', 'メルカリ', 'ショッピング', '商品']):
            shopping_columns.append(col)

    # インタビュー関連
    interview_columns = []
    for col in df.columns:
        if any(keyword in str(col) for keyword in ['インタビュー', 'ビデオ通話', 'Google Meet']):
            interview_columns.append(col)

    # 分析対象カラムを統合
    analysis_columns = list(set(
        important_columns +
        demographic_columns +
        follow_columns +
        like_columns +
        shopping_columns[:10] +  # ショッピング関連は最大10個
        interview_columns
    ))

    # 存在するカラムのみに限定
    analysis_columns = [col for col in analysis_columns if col in df.columns]

    print(f"分析対象カラム数: {len(analysis_columns)}")
    print("カテゴリ別内訳:")
    print(f"  - 重要項目: {len(important_columns)}")
    print(f"  - デモグラフィック: {len(demographic_columns)}")
    print(f"  - フォロー関連: {len(follow_columns)}")
    print(f"  - いいね関連: {len(like_columns)}")
    print(f"  - ショッピング関連: {len([col for col in shopping_columns[:10] if col in df.columns])}")
    print(f"  - インタビュー関連: {len(interview_columns)}")

    # 2. 分析用データフレーム作成
    df_clean = df[analysis_columns].copy()

    print(f"\nクリーニング後データ形状: {df_clean.shape}")

    # 3. 欠損値処理
    print("\n=== 欠損値処理 ===")

    # 完全に欠損しているカラムを除去
    completely_missing = df_clean.columns[df_clean.isnull().all()]
    if len(completely_missing) > 0:
        print(f"完全欠損カラムを除去: {len(completely_missing)}個")
        df_clean = df_clean.drop(columns=completely_missing)

    # 欠損率90%以上のカラムを除去
    missing_rates = df_clean.isnull().sum() / len(df_clean)
    high_missing_cols = missing_rates[missing_rates > 0.9].index
    if len(high_missing_cols) > 0:
        print(f"高欠損率カラムを除去: {len(high_missing_cols)}個 (欠損率90%超)")
        df_clean = df_clean.drop(columns=high_missing_cols)

    print(f"欠損値処理後データ形状: {df_clean.shape}")

    # 4. セグメント変数のクリーニング
    print("\n=== セグメント変数クリーニング ===")

    for segment_col in ['Buyer segment', 'Follow segment']:
        if segment_col in df_clean.columns:
            # ヘッダー行などの不正値を除去
            valid_mask = ~df_clean[segment_col].str.contains(segment_col, na=False)
            before_count = len(df_clean)
            df_clean = df_clean[valid_mask]
            after_count = len(df_clean)
            print(f"{segment_col}: {before_count - after_count}件の不正値を除去")

    # 5. カテゴリカル変数の統合
    print("\n=== カテゴリ統合処理 ===")

    categorical_cols = df_clean.select_dtypes(include=['object']).columns
    for col in categorical_cols:
        if col not in ['respondent_id', 'Buyer segment', 'Follow segment']:
            value_counts = df_clean[col].value_counts()
            total_responses = value_counts.sum()

            # 頻度5%未満のカテゴリを「その他」に統合
            low_freq_values = value_counts[value_counts / total_responses < 0.05].index
            if len(low_freq_values) > 1:  # 複数の低頻度カテゴリがある場合のみ統合
                df_clean[col] = df_clean[col].replace(low_freq_values.tolist(), 'その他')
                print(f"{col}: {len(low_freq_values)}個の低頻度カテゴリを「その他」に統合")

    # 6. データサマリー作成
    print("\n=== データサマリー作成 ===")

    summary_stats = {
        'total_responses': len(df_clean),
        'total_columns': len(df_clean.columns),
        'segment_distributions': {},
        'missing_summary': {}
    }

    # セグメント分布
    for segment_col in ['Buyer segment', 'Follow segment']:
        if segment_col in df_clean.columns:
            distribution = df_clean[segment_col].value_counts()
            summary_stats['segment_distributions'][segment_col] = distribution.to_dict()

    # 欠損値サマリー
    missing_summary = df_clean.isnull().sum()
    summary_stats['missing_summary'] = missing_summary[missing_summary > 0].to_dict()

    # 7. 結果保存
    results_dir = Path("results")
    results_dir.mkdir(exist_ok=True)

    # クリーニング済みデータ保存
    cleaned_data_path = results_dir / "cleaned_data.csv"
    df_clean.to_csv(cleaned_data_path, index=False, encoding='utf-8')

    # サマリー保存
    summary_path = results_dir / "data_summary.md"
    with open(summary_path, 'w', encoding='utf-8') as f:
        f.write("# Mercari UXリサーチデータ - クリーニング結果\n\n")
        f.write(f"**処理日時**: {pd.Timestamp.now().strftime('%Y-%m-%d %H:%M')}\n\n")
        f.write("## データ概要\n")
        f.write(f"- **回答数**: {summary_stats['total_responses']:,}件\n")
        f.write(f"- **分析項目数**: {summary_stats['total_columns']:,}項目\n\n")

        f.write("## セグメント分布\n")
        for segment, dist in summary_stats['segment_distributions'].items():
            f.write(f"### {segment}\n")
            for category, count in dist.items():
                rate = (count / summary_stats['total_responses']) * 100
                f.write(f"- {category}: {count:,}件 ({rate:.1f}%)\n")
            f.write("\n")

        if summary_stats['missing_summary']:
            f.write("## 欠損値状況\n")
            for col, missing_count in summary_stats['missing_summary'].items():
                missing_rate = (missing_count / summary_stats['total_responses']) * 100
                f.write(f"- {col}: {missing_count}件 ({missing_rate:.1f}%)\n")
        else:
            f.write("## 欠損値状況\n欠損値なし\n")

    print(f"✅ クリーニング完了")
    print(f"   - クリーニング済みデータ: {cleaned_data_path}")
    print(f"   - データサマリー: {summary_path}")

    return df_clean, summary_stats

if __name__ == "__main__":
    try:
        df_clean, summary = clean_data()

        print(f"\n=== 最終結果 ===")
        print(f"処理済み回答数: {summary['total_responses']:,}件")
        print(f"分析項目数: {summary['total_columns']:,}項目")

        # セグメント分布の表示
        for segment, dist in summary['segment_distributions'].items():
            print(f"\n【{segment}】")
            for category, count in dist.items():
                rate = (count / summary['total_responses']) * 100
                print(f"  {category}: {count:,}件 ({rate:.1f}%)")

    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")
        import traceback
        traceback.print_exc()