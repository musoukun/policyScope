{
  "政党包括的調査レポート": {
    "速報セクション": {
      "最新選挙結果": {
        "選挙名": "string",
        "投開票日": "date",
        "獲得議席数": "number",
        "得票数": "number",
        "得票率": "number",
        "政党要件達成": "boolean",
        "代表者コメント": "string"
      },
      "直近の重要動向": ["string"]
    },
    
    "基本情報": {
      "政党名": "string",
      "略称": "string",
      "設立年月日": "date",
      "党首・代表": {
        "氏名": "string",
        "年齢": "number",
        "経歴": "string",
        "主な実績": ["string"]
      },
      "設立背景": "string",
      "本部所在地": "string",
      "党員数": "number",
      "国会議員数": {
        "衆議院": "number",
        "参議院": "number"
      }
    },
    
    "政策分析": {
      "基本理念": "string",
      "スローガン": "string",
      "重点政策": [
        {
          "政策名": "string",
          "概要": "string",
          "実現可能性評価": "1-5",
          "評価根拠": "string",
          "予算規模": "string",
          "実施時期": "string"
        }
      ],
      "政策カテゴリー別方針": {
        "経済政策": {
          "基本方針": "string",
          "具体的施策": ["string"],
          "財源": "string"
        },
        "社会保障": {
          "基本方針": "string",
          "具体的施策": ["string"],
          "対象者": "string"
        },
        "外交安全保障": {
          "基本方針": "string",
          "具体的施策": ["string"],
          "国際関係観": "string"
        },
        "教育": {
          "基本方針": "string",
          "具体的施策": ["string"],
          "予算配分": "string"
        },
        "環境エネルギー": {
          "基本方針": "string",
          "具体的施策": ["string"],
          "目標値": "string"
        }
      },
      "第三者評価": {
        "評価機関": "string",
        "評価点": "number",
        "評価コメント": "string",
        "他党との比較": "string"
      }
    },
    
    "支持基盤分析": {
      "支持率推移": [
        {
          "調査日": "date",
          "支持率": "number",
          "調査機関": "string"
        }
      ],
      "支持層の特徴": {
        "年齢層": {
          "20代以下": "percentage",
          "30-40代": "percentage",
          "50-60代": "percentage",
          "70代以上": "percentage"
        },
        "職業別": {
          "会社員": "percentage",
          "自営業": "percentage",
          "公務員": "percentage",
          "主婦": "percentage",
          "学生": "percentage",
          "その他": "percentage"
        },
        "地域別": {
          "都市部": "percentage",
          "地方": "percentage"
        },
        "支持理由": ["string"]
      },
      "組織基盤": {
        "支持団体": ["string"],
        "友好団体": ["string"],
        "資金力": "string",
        "地方組織": "string"
      }
    },
    
    "国際比較": {
      "類似政党": [
        {
          "国名": "string",
          "政党名": "string",
          "共通点": ["string"],
          "相違点": ["string"],
          "成功事例": "string",
          "失敗事例": "string"
        }
      ],
      "国際的評価": "string",
      "海外メディアの報道": ["string"]
    },
    
    "最新動向": {
      "直近3ヶ月の主な活動": [
        {
          "日付": "date",
          "活動内容": "string",
          "成果": "string"
        }
      ],
      "メディア露出": {
        "テレビ": "number",
        "新聞": "number",
        "ネット": "number",
        "SNS言及数": "number"
      },
      "話題の政策提案": ["string"],
      "党内動向": "string"
    },
    
    "多角的評価": {
      "支持する視点": [
        {
          "評価者": "string",
          "肩書き": "string",
          "評価内容": "string",
          "根拠": "string"
        }
      ],
      "批判的視点": [
        {
          "批判者": "string",
          "肩書き": "string",
          "批判内容": "string",
          "具体例": "string"
        }
      ],
      "中立的評価": [
        {
          "評価者": "string",
          "分析内容": "string",
          "長所": ["string"],
          "短所": ["string"]
        }
      ],
      "専門家による分析": {
        "政治学者": "string",
        "経済学者": "string",
        "社会学者": "string"
      }
    },
    
    "総合評価": {
      "達成事項": [
        {
          "項目": "string",
          "詳細": "string",
          "影響度": "高/中/低"
        }
      ],
      "課題": [
        {
          "課題名": "string",
          "詳細": "string",
          "緊急度": "高/中/低",
          "改善策": "string"
        }
      ],
      "将来展望": {
        "短期（1年以内）": "string",
        "中期（3年以内）": "string",
        "長期（5年以上）": "string"
      },
      "リスク要因": ["string"],
      "機会要因": ["string"],
      "総合的所見": "string"
    },
    
    "データソース": {
      "一次資料": [
        {
          "資料名": "string",
          "発行元": "string",
          "発行日": "date",
          "URL": "string"
        }
      ],
      "二次資料": [
        {
          "資料名": "string",
          "著者": "string",
          "出版社": "string",
          "発行日": "date"
        }
      ]
    },
  }
}