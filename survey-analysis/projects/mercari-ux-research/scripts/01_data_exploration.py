#!/usr/bin/env python3
"""
Phase 1: データ探索スクリプト
Mercari UXリサーチ調査データの基本構造と品質を分析
"""

import pandas as pd
import numpy as np
import json
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

def explore_data():
    """データの基本構造を探索し、重要な統計情報を出力"""

    # データ読み込み
    data_path = "/Users/y-nagakura/brown/Claude_Code/survey-analysis/UXR-1423follow subtab UXRインタビュー対象者募集調査 - 編集用.csv"
    df = pd.read_csv(data_path)

    print("=== Mercari UXリサーチデータ探索結果 ===\n")

    # 基本情報
    print(f"データ形状: {df.shape}")
    print(f"回答数: {df.shape[0]:,}件")
    print(f"質問数: {df.shape[1]:,}項目\n")

    # カラム名の確認
    print("=== カラム一覧（先頭20項目） ===")
    for i, col in enumerate(df.columns[:20], 1):
        print(f"{i:2d}: {col}")
    print(f"... (他 {len(df.columns)-20} 項目)\n")

    # セグメント関連カラムの特定
    segment_columns = []
    follow_columns = []

    for col in df.columns:
        if 'segment' in str(col).lower() or 'buyer' in str(col).lower():
            segment_columns.append(col)
        if 'follow' in str(col).lower() or 'フォロー' in str(col):
            follow_columns.append(col)

    print("=== 重要カラムの特定 ===")
    print(f"セグメント関連カラム: {len(segment_columns)}個")
    for col in segment_columns[:5]:  # 先頭5個表示
        print(f"  - {col}")

    print(f"\nフォロー関連カラム: {len(follow_columns)}個")
    for col in follow_columns[:5]:  # 先頭5個表示
        print(f"  - {col}")

    # データ型の分析
    print("\n=== データ型分析 ===")
    dtype_summary = df.dtypes.value_counts()
    for dtype, count in dtype_summary.items():
        print(f"{dtype}: {count}カラム")

    # 欠損値の確認
    print("\n=== 欠損値分析 ===")
    missing_summary = df.isnull().sum()
    missing_cols = missing_summary[missing_summary > 0].sort_values(ascending=False)

    print(f"欠損値を含むカラム: {len(missing_cols)}個")
    if len(missing_cols) > 0:
        print("主な欠損カラム（上位10個）:")
        for col, missing_count in missing_cols.head(10).items():
            missing_rate = (missing_count / len(df)) * 100
            print(f"  {col}: {missing_count}件 ({missing_rate:.1f}%)")

    # 重要カラムの詳細分析
    print("\n=== 重要カラムの詳細分析 ===")

    # セグメントカラムの分析
    for col in segment_columns[:3]:  # 上位3個を詳細分析
        if col in df.columns:
            print(f"\n【{col}】")
            value_counts = df[col].value_counts()
            print(f"  ユニーク値数: {value_counts.shape[0]}")
            print("  上位5値:")
            for val, count in value_counts.head(5).items():
                rate = (count / len(df)) * 100
                print(f"    {val}: {count}件 ({rate:.1f}%)")

    # フォローカラムの分析
    for col in follow_columns[:3]:  # 上位3個を詳細分析
        if col in df.columns:
            print(f"\n【{col}】")
            if df[col].dtype == 'object':
                value_counts = df[col].value_counts()
                print(f"  ユニーク値数: {value_counts.shape[0]}")
                print("  上位5値:")
                for val, count in value_counts.head(5).items():
                    rate = (count / len(df)) * 100
                    print(f"    {val}: {count}件 ({rate:.1f}%)")
            else:
                print(f"  数値統計:")
                print(f"    平均: {df[col].mean():.2f}")
                print(f"    中央値: {df[col].median():.2f}")
                print(f"    最小値: {df[col].min()}")
                print(f"    最大値: {df[col].max()}")

    # 結果の保存用辞書作成
    exploration_results = {
        "data_shape": df.shape,
        "total_responses": df.shape[0],
        "total_questions": df.shape[1],
        "segment_columns": segment_columns,
        "follow_columns": follow_columns,
        "missing_columns": missing_cols.head(20).to_dict(),
        "data_types": dtype_summary.to_dict()
    }

    # 結果をJSONファイルに保存
    results_dir = Path("results")
    results_dir.mkdir(exist_ok=True)

    with open(results_dir / "exploration_results.json", "w", encoding="utf-8") as f:
        json.dump(exploration_results, f, ensure_ascii=False, indent=2, default=str)

    print(f"\n=== 探索結果を保存しました ===")
    print(f"ファイル: {results_dir / 'exploration_results.json'}")

    return df, exploration_results

if __name__ == "__main__":
    try:
        df, results = explore_data()
        print("\n✅ データ探索が完了しました")

        # 要約統計の出力
        print(f"\n【要約】")
        print(f"- 回答数: {results['total_responses']:,}件")
        print(f"- 質問数: {results['total_questions']:,}項目")
        print(f"- セグメント関連項目: {len(results['segment_columns'])}個")
        print(f"- フォロー関連項目: {len(results['follow_columns'])}個")
        print(f"- 欠損値のある項目: {len(results['missing_columns'])}個")

    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")
        import traceback
        traceback.print_exc()