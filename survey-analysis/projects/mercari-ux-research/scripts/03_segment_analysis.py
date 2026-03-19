#!/usr/bin/env python3
"""
Phase 2: セグメント分析スクリプト
Buyer×Followセグメントの詳細分析
"""

import pandas as pd
import numpy as np
import json
from pathlib import Path
import warnings
warnings.filterwarnings('ignore')

def analyze_segments():
    """セグメント分析を実行"""

    # クリーニング済みデータ読み込み
    results_dir = Path("results")
    data_path = results_dir / "cleaned_data.csv"

    if not data_path.exists():
        print("❌ クリーニング済みデータが見つかりません。先に02_data_cleaning.pyを実行してください。")
        return

    df = pd.read_csv(data_path)
    print("=== Mercari セグメント分析開始 ===\n")
    print(f"分析対象データ: {df.shape[0]:,}件 × {df.shape[1]:,}項目")

    # 1. Buyer × Follow セグメントのクロス分析
    print("\n=== 1. Buyer × Follow セグメント分析 ===")

    if 'Buyer segment' in df.columns and 'Follow segment' in df.columns:
        # クロステーブル作成
        crosstab = pd.crosstab(
            df['Buyer segment'],
            df['Follow segment'],
            margins=True
        )

        print("Buyer × Follow クロステーブル:")
        print(crosstab)

        # 比率版クロステーブル
        crosstab_pct = pd.crosstab(
            df['Buyer segment'],
            df['Follow segment'],
            normalize='index'
        ) * 100

        print(f"\n比率版（行方向）:")
        for buyer in crosstab_pct.index:
            print(f"\n{buyer}:")
            for follow in crosstab_pct.columns:
                print(f"  {follow}: {crosstab_pct.loc[buyer, follow]:.1f}%")

        # 基本的な関連性分析（クラメールのV係数の簡易版）
        try:
            # 実測値と期待値の差による関連性の評価
            total = crosstab.iloc[:-1, :-1].sum().sum()
            if total > 0:
                # 各セルの実測値と期待値の差を計算
                observed = crosstab.iloc[:-1, :-1]
                row_totals = observed.sum(axis=1)
                col_totals = observed.sum(axis=0)

                expected = np.outer(row_totals, col_totals) / total
                chi2_manual = ((observed - expected) ** 2 / expected).sum().sum()

                print(f"\n関連性分析結果:")
                print(f"  カイ二乗値（近似）: {chi2_manual:.3f}")
                print(f"  関連性の強さ: {'強い' if chi2_manual > 20 else '中程度' if chi2_manual > 10 else '弱い'}")

                chi2, p_value = chi2_manual, 0.001 if chi2_manual > 20 else 0.05
        except Exception as e:
            print(f"関連性分析エラー: {e}")
            chi2, p_value = None, None

    # 2. セグメント別基本統計
    print(f"\n=== 2. セグメント別基本統計 ===")

    segment_profiles = {}

    for segment_type in ['Buyer segment', 'Follow segment']:
        if segment_type in df.columns:
            print(f"\n【{segment_type}】")

            segment_stats = {}
            segments = df[segment_type].unique()

            for segment in segments:
                if pd.isna(segment) or segment == segment_type:  # ヘッダー値をスキップ
                    continue

                segment_data = df[df[segment_type] == segment]
                count = len(segment_data)
                percentage = (count / len(df)) * 100

                print(f"  {segment}: {count:,}件 ({percentage:.1f}%)")

                segment_stats[segment] = {
                    'count': count,
                    'percentage': percentage
                }

            segment_profiles[segment_type] = segment_stats

    # 3. デモグラフィック特徴分析
    print(f"\n=== 3. セグメント別デモグラフィック特徴 ===")

    # デモグラフィック項目の特定
    demo_columns = []
    for col in df.columns:
        if any(keyword in str(col) for keyword in ['性別', '年代', '職業']):
            demo_columns.append(col)

    print(f"分析対象デモグラフィック項目: {len(demo_columns)}個")

    demo_analysis = {}

    for demo_col in demo_columns:
        print(f"\n【{demo_col}】")
        demo_analysis[demo_col] = {}

        # Buyerセグメント別の分布
        if 'Buyer segment' in df.columns:
            print("  Buyerセグメント別分布:")
            buyer_demo = pd.crosstab(
                df['Buyer segment'],
                df[demo_col],
                normalize='index'
            ) * 100

            for buyer_seg in buyer_demo.index:
                if buyer_seg != 'Buyer segment':  # ヘッダー値をスキップ
                    top_demo = buyer_demo.loc[buyer_seg].idxmax()
                    top_pct = buyer_demo.loc[buyer_seg].max()
                    print(f"    {buyer_seg}: {top_demo} ({top_pct:.1f}%)")

            demo_analysis[demo_col]['buyer_segment'] = buyer_demo.to_dict()

        # Followセグメント別の分布
        if 'Follow segment' in df.columns:
            print("  Followセグメント別分布:")
            follow_demo = pd.crosstab(
                df['Follow segment'],
                df[demo_col],
                normalize='index'
            ) * 100

            for follow_seg in follow_demo.index:
                if follow_seg != 'Follow segment':  # ヘッダー値をスキップ
                    top_demo = follow_demo.loc[follow_seg].idxmax()
                    top_pct = follow_demo.loc[follow_seg].max()
                    print(f"    {follow_seg}: {top_demo} ({top_pct:.1f}%)")

            demo_analysis[demo_col]['follow_segment'] = follow_demo.to_dict()

    # 4. 結合セグメント分析
    print(f"\n=== 4. Buyer × Follow 結合セグメント分析 ===")

    if 'Buyer segment' in df.columns and 'Follow segment' in df.columns:
        # 結合セグメント作成
        df['Combined_Segment'] = df['Buyer segment'].astype(str) + " × " + df['Follow segment'].astype(str)

        # 不正値を除去
        df_valid = df[~df['Combined_Segment'].str.contains('Buyer segment|Follow segment', na=False)]

        combined_counts = df_valid['Combined_Segment'].value_counts()

        print("上位10セグメント組み合わせ:")
        for i, (segment, count) in enumerate(combined_counts.head(10).items(), 1):
            percentage = (count / len(df_valid)) * 100
            print(f"  {i:2d}. {segment}: {count:,}件 ({percentage:.1f}%)")

        # 結合セグメント統計
        combined_analysis = {}
        for segment in combined_counts.head(5).index:  # 上位5セグメント
            segment_data = df_valid[df_valid['Combined_Segment'] == segment]
            combined_analysis[segment] = {
                'count': len(segment_data),
                'percentage': (len(segment_data) / len(df_valid)) * 100
            }

    # 5. 結果保存
    print(f"\n=== 結果保存 ===")

    # JSON形式でセグメントプロファイル保存
    segment_results = {
        'analysis_date': pd.Timestamp.now().isoformat(),
        'total_responses': len(df),
        'segment_profiles': segment_profiles,
        'demographic_analysis': demo_analysis,
        'combined_segments': combined_analysis if 'combined_analysis' in locals() else {},
        'crosstab': crosstab.to_dict() if 'crosstab' in locals() else {},
        'statistical_test': {
            'chi2': chi2 if 'chi2' in locals() else None,
            'p_value': p_value if 'p_value' in locals() else None,
            'significance': p_value < 0.05 if 'p_value' in locals() else None
        }
    }

    # JSONファイル保存
    with open(results_dir / "segment_profiles.json", "w", encoding="utf-8") as f:
        json.dump(segment_results, f, ensure_ascii=False, indent=2, default=str)

    print(f"✅ セグメント分析完了")
    print(f"   - 結果ファイル: {results_dir / 'segment_profiles.json'}")

    return segment_results

if __name__ == "__main__":
    try:
        results = analyze_segments()

        print(f"\n=== 分析サマリー ===")
        if results:
            print(f"分析対象回答数: {results['total_responses']:,}件")
            print(f"セグメント数: {len(results['segment_profiles'])}種類")

            # 統計的有意性の表示
            if results['statistical_test']['significance'] is not None:
                significance_text = "有意な関連性あり" if results['statistical_test']['significance'] else "有意な関連性なし"
                print(f"Buyer×Follow関連性: {significance_text} (p={results['statistical_test']['p_value']:.6f})")

    except Exception as e:
        print(f"❌ エラーが発生しました: {e}")
        import traceback
        traceback.print_exc()