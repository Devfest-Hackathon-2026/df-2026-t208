"use strict";
/* なぞまちワールド MVP
   - 全シナリオは事前生成データ（待ち時間ゼロ）
   - 手がかりは「スポットに到達して調べる」と得られる設計。
     Street Viewの実写に細かい文字を読ませる作りにはしていない（画質・視点の制約のため）
   - 外部API・APIキー不使用。地図はキー不要の Google Maps Embed のみ
*/

const THEMES = [
  { id: "detective", label: "🕵️ 探偵もの" },
  { id: "school", label: "🎒 学園もの" },
  { id: "horror", label: "👻 ホラー風" },
];

const SCENARIOS = {
  /* ============ 大阪・梅田（Gemini設計ループ Round 1 で生成されたシナリオを採用） ============ */
  umeda: {
    id: "umeda",
    emoji: "🏙️",
    place: "大阪・梅田",
    title: "梅田迷宮と消えた水時計の設計図",
    desc: "止まった水時計と、街に散らばった5つの断片を追う。",
    intros: {
      detective:
        "JR大阪駅の駅前で、時刻を水で描く「水の時計」が止まった。時計を制御する幻の基盤データが何者かに抜き取られ、その断片が梅田の街の5つのランドマークに分散して隠されたという。\n日の入りまでに断片をすべて回収し、犯人を暴かなければ、水時計は二度と動かない。舞台は、高所と地下が立体に交差する迷宮都市・梅田だ。",
      school:
        "放課後、探偵部のグループチャットに謎の依頼が届いた。『大阪駅の水時計が止まった。制御データの断片が梅田の街に5つ隠されてる。日の入りまでに集めて、犯人を当てて！』\n制服のまま梅田へ直行。地下街、高層ビル、観覧車——放課後の梅田は、思ったよりずっと迷宮だった。",
      horror:
        "日の入りが迫る梅田。止まった水時計の水面に、自分のものではない人影が映った気がした。\n制御データの断片は、高所と地下、5つの場所に散らばっている。街のざわめきの向こうで、誰かがこちらの捜査を見ている——大丈夫、これは幽霊の事件じゃない。人間の手口が、必ずある。",
    },
    gmIntro:
      "やあ、探偵くん。私はゲームマスターのGM。消えたデータの断片は5つ。スポットを調べて手がかりを集めよう。手がかりは「スポットに着いて調べる」だけで手に入る——実写の細かい文字を読み取る必要はないから安心して。詰まったらヒントを出すよ。",
    spots: [
      {
        name: "JR大阪駅 サウスゲート「太陽の広場」",
        icon: "☀️",
        query: "大阪駅 太陽の広場",
        sv: "🗺️ Street View案内：大阪駅の南側、広場を見渡してみよう。ベンチが並ぶ一角が最初の捜査ポイントだ。",
        fact: "大阪ステーションシティには「時空（とき）の広場」「太陽の広場」など、テーマの異なる広場が点在し、待ち合わせや休憩の場所として親しまれている。",
        clue: "ベンチの裏に、丁寧に貼られたメモが残っていた。『川の流れていた場所を辿れ』——犯人が残した、次への道しるべだ。誰かがこの広場を「起点」に選んだことは間違いない。",
      },
      {
        name: "南ゲート広場「水の時計」",
        icon: "💧",
        query: "大阪駅 水の時計",
        sv: "🗺️ Street View案内：駅の南側の広場。水滴が文字を描く時計が見えるはずだ。点検口のあたりに注目しよう。",
        fact: "「水の時計」は、水滴を落として時刻や模様を描く噴水時計。大阪駅前のシンボルとして、写真を撮る観光客が絶えない。",
        clue: "点検口のそばに、青い塗料片が落ちていた。さらに時計の表示ログ（印字エラーの記録）を調べると、データが消えた時間帯だけ、きれいに記録が抜け落ちている。偶然ではありえない消え方だ。",
      },
      {
        name: "HEP FIVE 赤い観覧車",
        icon: "🎡",
        query: "HEP FIVE 観覧車 梅田",
        sv: "🗺️ Street View案内：梅田の空に赤い観覧車が見える。ビルの屋上にある観覧車で、ゴンドラからは梅田を一望できる。",
        fact: "HEP FIVEの屋上にある赤い観覧車は梅田のランドマーク。地上約106mの高さまで上がる、ビル一体型の観覧車だ。",
        clue: "ゴンドラの中に、『梅田ダンジョン立体マップ』の走り書きが残されていた。地下街と高所を結ぶエレベーターの位置に、赤い丸。犯人は「高い場所」と「低い場所」を意図的に行き来している。",
      },
      {
        name: "曾根崎お初天神通り・露天神社（お初天神）",
        icon: "⛩️",
        query: "露天神社 お初天神 大阪",
        sv: "🗺️ Street View案内：曾根崎の路地を入った先にある、小さな神社。絵馬がたくさん掛かる場所を探そう。",
        fact: "露天神社は「お初天神」の名で親しまれる神社。近松門左衛門の人形浄瑠璃『曽根崎心中』の舞台となり、お初と徳兵衛の物語で知られる縁結びの神社だ。",
        clue: "絵馬掛けの隅に、設備工具の形をしたキーホルダーが掛けられていた。裏には小さく「UMD」の刻印。これは手がかりの「置き土産」——犯人は見つけられることを前提に動いている。",
      },
      {
        name: "梅田スカイビル直下",
        icon: "🏙️",
        query: "梅田スカイビル",
        sv: "🗺️ Street View案内：2棟のビルが上部でつながった、空中庭園のあるビル。直下の広場や植え込みのあたりが捜査ポイントだ。",
        fact: "梅田スカイビルは1993年完成。2棟の高層ビルを上部で連結した珍しい構造で、空中庭園展望台は地上173m。設計は建築家の原広司。",
        clue: "植え込みの下から、防水ケースに入ったメモが見つかった。暗号文と、端末ID「UMD-GEO-88」。このIDは駅地下の設備管理室にある専用端末のもの——内部の人間しか知らないはずの番号だ。",
      },
    ],
    suspects: [
      {
        name: "三浦翔平",
        role: "34歳・都市開発コンサルタント",
        statement:
          "「梅田の再開発には長く関わってきました。水時計のデータ？　僕の仕事はもっと大きな絵を描くことです。設備の点検口なんて、触ったこともありませんよ。」",
      },
      {
        name: "水木麗子",
        role: "28歳・駅ビル設備エンジニア（水時計の保守担当）",
        statement:
          "「水時計の保守は私の担当です。あの水圧制御は、職人の勘と経験の結晶なんです。……データが消えた日、私はいつも通り点検をしていました。それだけです。」",
      },
      {
        name: "堂島宗一郎",
        role: "62歳・郷土史家",
        statement:
          "「梅田はもともと、川と田んぼの土地での。儂はその歴史を本に残すのが仕事じゃ。機械のデータなんぞに、用はないわい。」",
      },
    ],
    culprit: 1,
    tricks: [
      "点検を装って基盤データを抜き取り、高所と地下・路地の「ログが残りにくい場所」に手がかりを分散配置した",
      "観覧車のゴンドラからドローンを飛ばし、データをビル屋上へ運び出した",
      "郷土史家の蔵書の中にデータを紛れ込ませ、後日回収するつもりだった",
    ],
    correctTrick: 0,
    truth:
      "犯人は、水時計の保守担当エンジニア・水木麗子。\n彼女は点検に見せかけて基盤データを抜き取り、高所（HEP FIVEの観覧車）と地下・路地（お初天神通り、スカイビル直下）の「ログが残りにくいポイント」に、手がかりを分散して配置していた。\n決め手は2つ。水の時計の点検口に残った青い塗料片は、彼女の工具箱の塗料と一致したこと。そして端末ID「UMD-GEO-88」は、駅地下の設備管理室の専用端末——彼女の担当端末だったこと。\n動機は、悪意ではなかった。自動化の波の中で失われようとしていた「職人の水圧制御プログラム」の価値を、街全体を巻き込む謎解きで人々に再認識させたかったのだ。データは無事に戻り、水時計は日の入りとともに再び動き出した。",
    realStory:
      "梅田という地名の由来は「埋田」——もともと低湿地で、田を埋め立てた土地だったという説が有力です。川が流れ、田んぼが広がっていた土地に鉄道が集まり、軟弱な地盤の基礎工事と鉄道網の立体交差を乗り越えるうちに、地下街が発達しました。「梅田ダンジョン」と呼ばれる立体迷宮は、その歴史の産物です。\n水浸しの土地が日本有数のメガターミナルへ進化した、その象徴が駅前の「水の時計」。水を制してきた街・梅田は、いま水のプログラムで時を刻んでいます。",
    hints: [
      "まずは5つのスポットを全部まわって、手がかりを集めよう。最初のメモ——「川の流れていた場所を辿れ」が、犯人の道筋の始まりだ。",
      "青い塗料片に注目。青い作業着や工具と縁がある人物は、容疑者の中にいるかな？　そして手がかりは「高い場所」と「低い場所」に、意図的に散らばっている。",
      "端末ID「UMD-GEO-88」は、駅地下の設備管理室の専用端末のもの。水時計の保守を担当し、「点検」の名目でデータに触れられる人物は——もう1人しかいないはずだ。",
    ],
  },

  /* ============ 京都・祇園 ============ */
  gion: {
    id: "gion",
    emoji: "🌸",
    place: "京都・祇園",
    title: "消えた花簪（かんざし）",
    desc: "新作発表会の前夜、祇園に伝わる桜の簪が桐箱ごと消えた。",
    intros: {
      detective:
        "祇園の置屋に代々伝わる、花簪の新作。発表会を翌日に控えた夜、目玉の「桜の簪」が桐箱ごと工房から消えた。\n工房に入れたのは、ほんの数人だけ。舞台は花見小路から白川まで、祇園の5つの名所。石畳に残された痕跡を、ひとつずつ辿っていこう。",
      school:
        "修学旅行の自由行動中、クラスメイトの舞妓体験の付き添いで訪れた祇園で事件は起きた。『明日の発表会で使う桜の簪が、無くなっちゃったの！』\n探偵部の出番だ。舞台は祇園の5つの名所。夕方の石畳で、捜査開始！",
      horror:
        "夜の祇園は静かすぎる。白川の水音だけが聞こえる路地で、桐箱は音もなく消えた。\n簪の房飾りは、どこかで今も揺れているはずだ。——大丈夫、これは人間の仕業。必ず痕跡がある。提灯の明かりを頼りに、5つの名所を辿ろう。",
    },
    gmIntro:
      "ようこそ祇園へ、探偵くん。私はゲームマスター。桐箱が「どこへ運ばれたか」を追うのが、この事件の鍵だ。スポットで「調べる」を押せば手がかりが手に入る。石畳の細部を読み取る必要はないから、気楽に進めて。",
    spots: [
      {
        name: "花見小路通",
        icon: "🏮",
        query: "花見小路 京都",
        sv: "🗺️ Street View案内：石畳の通りの両側に茶屋が並ぶ、祇園のメインストリート。有名な一力亭の前あたりに注目。",
        fact: "花見小路通は祇園の中心を南北に走る石畳の通り。江戸時代からの茶屋建築が残り、老舗の茶屋・一力亭（いちりきてい）で知られる。",
        clue: "一力亭の前で、簪を包む和紙の切り端と、発表会スタッフ用の名札が落ちていた。名札の裏には、白川沿いの茶屋の電話番号が手書きされている。",
      },
      {
        name: "祇園白川・巽橋",
        icon: "🌉",
        query: "祇園白川 巽橋 京都",
        sv: "🗺️ Street View案内：柳の木と町家が川沿いに並ぶ一帯。小さな橋（巽橋）の欄干まわりをよく見てみよう。",
        fact: "祇園白川は、白川沿いに柳と町家が並ぶ情緒ある一帯。巽橋は写真撮影の名所で、ほとりには辰巳大明神が祀られている。",
        clue: "巽橋の欄干に、簪の房飾りのビーズが1粒引っかかっていた。さらに橋のたもとの茶屋の店員が証言した。『夕方、女将代理さんが桐箱を抱えて、うちの奥の金庫へ行きましたよ』",
      },
      {
        name: "八坂神社",
        icon: "⛩️",
        query: "八坂神社 京都",
        sv: "🗺️ Street View案内：四条通の突き当たり。朱い西楼門と石段が見えたら、そこが八坂神社だ。",
        fact: "八坂神社は祇園祭で知られる神社。もとは祇園社とも呼ばれ、全国の祇園神社の総本社。四条通に面した西楼門と石段が目印だ。",
        clue: "発表会の設営名簿のコピーを入手した。当日、簪の工房に入室できたのは職人の親方と、進行担当の女将代理だけ。見習いの北川の名前は、名簿にすらない。",
      },
      {
        name: "建仁寺",
        icon: "🐉",
        query: "建仁寺 京都",
        sv: "🗺️ Street View案内：花見小路の南の端にある、静かな大寺院。門をくぐった先の受付が捜査ポイントだ。",
        fact: "建仁寺は1202年に栄西が開いた、京都で最も古い禅寺。俵屋宗達の『風神雷神図屏風』（原本は博物館で保管され、寺では精巧な複製を展示）や、天井画『双龍図』で知られる。",
        clue: "受付の記録が残っていた。見習いの北川小春は、事件の時間帯ずっと、発表会の生け花の手伝いで境内にいた。参拝者3人が彼女を見ている——北川のアリバイは固い。",
      },
      {
        name: "円山公園",
        icon: "🌸",
        query: "円山公園 京都",
        sv: "🗺️ Street View案内：八坂神社の東側に広がる公園。有名な枝垂れ桜のあたりで聞き込みをしよう。",
        fact: "円山公園は1886年に開かれた、京都市で最も古い公園。一本の大きな枝垂れ桜は「祇園の夜桜」として知られる名物だ。",
        clue: "枝垂れ桜の近くで聞き込み。公園の常連客が教えてくれた。『女将代理さんが電話で、“明日は祇園中がこの話でもちきりになる”って笑っていたよ』",
      },
    ],
    suspects: [
      {
        name: "北川小春",
        role: "簪職人の見習い",
        statement:
          "「工房の鍵は持っていません。当日は建仁寺さんで、生け花のお手伝いをしていました。簪は……私も早く見つかってほしいです。」",
      },
      {
        name: "雨宮蓮",
        role: "観光写真家",
        statement:
          "「夕方、白川で夕景を撮っていました。桐箱を抱えた人？　見たような気もしますけど、私は運んでいません。写真のデータが全部、証拠です。」",
      },
      {
        name: "佐伯美津子",
        role: "茶屋の女将代理・発表会の進行担当",
        statement:
          "「私は進行の準備で頭がいっぱいで。簪が消えたのは本当に困ります。でも、おかげで……いえ、なんでもありません。」",
      },
    ],
    culprit: 2,
    tricks: [
      "白川に簪を沈めておき、夜のうちに回収するつもりだった",
      "狂言盗難。簪は白川沿いの茶屋の金庫に保管し、話題作りのために盗まれたように見せかけた",
      "舞妓に変装して工房から簪を持ち出した",
    ],
    correctTrick: 1,
    truth:
      "犯人は、発表会の進行担当・佐伯美津子。ただしこれは「狂言盗難」だった。\n簪は無事で、白川沿いの茶屋の金庫に保管されていた。佐伯は工房から桐箱を運び出し、盗まれたように見せかけた。運ぶ途中、巽橋で房飾りのビーズを1粒落としたのが、彼女の足跡になった。\n工房に入れたのは親方と佐伯の2人だけ。見習いの北川には建仁寺での確かなアリバイがある。そして円山公園での電話——「明日は祇園中がこの話でもちきりになる」。\n動機は、祇園に客足を呼び戻したい一心だった。簪は発表会当日に「無事発見」として披露され、佐伯は深く頭を下げたが、その熱意が伝わり、発表会は大盛況になったという。",
    realStory:
      "舞妓さんの花簪は、月ごとに花が変わるのを知っていますか。1月は松竹梅、4月は桜、7月は祇園祭の団扇の簪——簪を見れば今が何月か分かる、まさに「歩くカレンダー」です。\n祇園祭は八坂神社の祭礼で、7月の1か月をかけて行われます。建仁寺は1202年に栄西が開いた京都最古の禅寺。そして花見小路の町家並みは、国の重要伝統的建造物群保存地区に選ばれ、祇園の景観を守り続けています。",
    hints: [
      "まずは5つのスポットで手がかりを集めよう。桐箱が「どこへ運ばれたか」、落とし物は犯人の動いた道筋そのものだ。",
      "白川の茶屋の「金庫」という証言が出てきたね。本気で盗む人間が、大事な品を顔見知りの金庫に預けるだろうか？　動機の見方を変えてみよう。",
      "工房に入れたのは2人だけ。見習いにはアリバイがある。残る1人が電話で「明日は話題になる」と話していた——これは盗難ではなく、演出かもしれない。",
    ],
  },

  /* ============ 東京・浅草 ============ */
  asakusa: {
    id: "asakusa",
    emoji: "🏮",
    place: "東京・浅草",
    title: "提灯に消えた設計図",
    desc: "雷門の大提灯の設計図の写しが、準備室から忽然と消えた。",
    intros: {
      detective:
        "雷門の大提灯の新調を記念し、提灯職人の設計図の写しが一般公開されることになった。その前日、浅草文化観光センターの展示準備室から、図面が忽然と消えた。\n入室記録は3人分だけ。舞台は雷門から隅田川まで、浅草の5つの名所だ。",
      school:
        "社会科見学で訪れた浅草。探偵部のもとに、観光センターの職員さんからSOSが届いた。『明日公開の、提灯の設計図の写しが消えちゃったんです！』\n入室記録は3人分。舞台は浅草の5つの名所。放課後じゃない、社会科見学の続きで捜査開始！",
      horror:
        "浅草の夜。雷門の大提灯の明かりが、ふっと揺れた。設計図の写しは、準備室から音もなく消えている。\n提灯の中は真っ暗で、誰にも見えない。人間の嘘と秘密を隠すには、うってつけの場所だ——。5つの名所に残る痕跡を辿ろう。",
    },
    gmIntro:
      "浅草へようこそ、探偵くん。私はゲームマスター。まずは入室記録のある3人の「事件の時間にどこにいたか」から追っていこう。スポットで「調べる」を押せば手がかりが手に入るよ。",
    spots: [
      {
        name: "雷門（風雷神門）",
        icon: "🏮",
        query: "雷門 浅草",
        sv: "🗺️ Street View案内：浅草の玄関口。大きな赤い提灯が見えたら、その真下が捜査ポイントだ。",
        fact: "雷門の正式名称は風雷神門（ふうじんらいじんもん）。大提灯は高さ約3.9m、重さ約700kg。現在の提灯は1960年、パナソニックの創業者・松下幸之助の寄進によって復興したものだ。",
        clue: "提灯の真下で、設計図を留めていた和紙の帯と、提灯に使う竹骨の細い削り屑が見つかった。削り屑はまだ新しく、昨日の作業で出たものだ。",
      },
      {
        name: "仲見世通り",
        icon: "🛍️",
        query: "仲見世通り 浅草",
        sv: "🗺️ Street View案内：雷門から寺へ続く、店がびっしり並ぶ通り。人形焼の店の前で聞き込みをしよう。",
        fact: "仲見世通りは雷門から宝蔵門まで約250m、およそ90店が並ぶ、日本で最も古い商店街のひとつ。人形焼や雷おこしが名物だ。",
        clue: "人形焼の店主の証言。『閉店間際、職人の前掛けをした若い人が、細長い包みを持って、裏通りの提灯工房のほうへ歩いていったよ』",
      },
      {
        name: "浅草寺・本堂",
        icon: "🙏",
        query: "浅草寺 本堂",
        sv: "🗺️ Street View案内：仲見世を抜けた先の大きなお堂。お堂のわき、おみくじを結ぶ場所の近くが捜査ポイントだ。",
        fact: "浅草寺は、628年に隅田川で観音像が漁師の網にかかったという伝承から始まる、東京で最も古いお寺。観音様をまつる本堂は浅草の信仰の中心だ。",
        clue: "本堂のわきで、設計図のコピーの切れ端が落ちていた。隅には手書きの改良メモ。その筆跡は、見習い職人の作業ノートの字とそっくりだ。",
      },
      {
        name: "吾妻橋・隅田川",
        icon: "🌉",
        query: "吾妻橋 浅草",
        sv: "🗺️ Street View案内：隅田川にかかる橋。対岸に見える金色のオブジェが目印。橋のたもとの船着き場で聞き込みをしよう。",
        fact: "吾妻橋のたもとには、アサヒビール本社の金色の「炎のオブジェ」（フラムドール）がある。隅田川は古くから、江戸の水運の大動脈だった。",
        clue: "船着き場の作業員の話。『夕方、提灯の骨組みを工房へ運ぶ作業があった。積み込みを手伝ったのは、職人の若い衆だけだった』——提灯の「内側」に何かを隠せるのは、その作業に加わった者だけだ。",
      },
      {
        name: "浅草文化観光センター",
        icon: "🗼",
        query: "浅草文化観光センター",
        sv: "🗺️ Street View案内：雷門の向かいにある、木組みのような外観の建物。屋上の展望テラスからは仲見世を見下ろせる。",
        fact: "浅草文化観光センターは、建築家・隈研吾の設計。屋上の展望テラスからは、仲見世通りと東京スカイツリーを一望できる。事件の準備室と入室記録はここにある。",
        clue: "入室記録と展望テラスの案内記録を照合した。ガイドの墨田は事件の時間帯、展望テラスで観光客を案内中（目撃者多数）。アルバイトの鳥越は受付で記録係をしており、準備室の鍵は借りていない。",
      },
    ],
    suspects: [
      {
        name: "神谷宗太",
        role: "提灯職人の見習い",
        statement:
          "「設計図は親方の宝物です。僕は夕方、提灯の骨組みを工房に運ぶ作業をしていました。……図面にメモを書き足したのは、認めます。でも、それは盗むためじゃなくて——」",
      },
      {
        name: "墨田澄子",
        role: "観光ボランティアガイド",
        statement:
          "「その時間は、展望テラスで観光客をご案内していましたよ。浅草のことなら何でも聞いてください。図面のことなら、職人さんに聞くのが一番です。」",
      },
      {
        name: "鳥越隼人",
        role: "大学生アルバイト（受付・記録係）",
        statement:
          "「僕は受付で入室記録をつけていました。準備室の鍵は一度も借りていません。記録が全部残っています。」",
      },
    ],
    culprit: 0,
    tricks: [
      "仲見世の屋根伝いに逃走し、図面を持ち去った",
      "隅田川を泳いで対岸へ渡り、図面を運んだ",
      "張り替え作業中の大提灯の内側に図面を隠し、骨組みごと工房へ運び出した",
    ],
    correctTrick: 2,
    truth:
      "犯人は、提灯職人の見習い・神谷宗太。\n彼は提灯の軽量化について独自の改良案を考え、設計図のコピーの隅にメモを書き加えていた。親方に見せたいのに言い出せず、ついに図面を持ち出してしまったのだ。図面は、張り替え作業中の大提灯の内側に隠され、骨組みごと工房へ運ばれていた。\n決め手は、提灯の下に残った新しい竹骨の削り屑と、コピーの切れ端の筆跡、そして「提灯の内側に隠せるのは骨組みを運んだ者だけ」という事実。\n図面は無事に回収された。親方は宗太の改良案を認め、次の大提灯には、宗太の名前も職人の一人として刻まれることになった。",
    realStory:
      "雷門の大提灯は、1865年に焼失したあと、約95年間も姿を消していました。1960年、浅草にゆかりの深かった松下幸之助が寄進し、ようやく復興したのです。\n浅草寺は628年、隅田川で観音像が網にかかったという伝承で始まった、東京最古のお寺。仲見世は約250mの通りに約90店が並びます。吾妻橋の金色のオブジェは「炎」を表し、アサヒビールの本社ビルと並んで、浅草の新しい顔になっています。",
    hints: [
      "まずは5つのスポットで手がかり集め。入室記録のある3人のうち、「事件の時間にどこにいたか」が証明できない人を探そう。",
      "提灯の竹骨の削り屑と、手書きメモの筆跡。2つの手がかりは、どちらも「職人の手」を指している。",
      "提灯の内側に何かを隠せるのは、骨組みを運ぶ作業に加わった者だけだ。改良メモを書いた人物と、同一人物のはずだよ。",
    ],
  },
};

/* ================= アプリの状態とロジック ================= */
const state = {
  place: null,        // 選択中の場所ID
  theme: "detective", // 選択中のテーマ
  collected: new Set(), // 集めた手がかり（スポットの番号）
  currentSpot: -1,
  hintLevel: 0,
  hintUsed: 0, // GMヒントの使用回数（探偵ランク判定用）
  selectedSuspect: -1,
  selectedTrick: -1,
  attempts: 0,
};

const $ = (id) => document.getElementById(id);

function showScreen(name) {
  ["home", "case", "investigate", "deduce", "result"].forEach((s) => {
    $("screen-" + s).classList.toggle("hidden", s !== name);
  });
  window.scrollTo({ top: 0 });
}

/* ---------- 画面1: 場所・テーマ選択 ---------- */
function renderHome() {
  const list = $("place-list");
  list.innerHTML = "";
  Object.values(SCENARIOS).forEach((sc) => {
    const btn = document.createElement("button");
    btn.className = "place-card" + (state.place === sc.id ? " selected" : "");
    btn.innerHTML =
      '<div class="place-emoji">' + sc.emoji + "</div>" +
      '<div class="place-name">' + sc.place + "</div>" +
      '<div class="place-case">『' + sc.title + "』</div>" +
      '<div class="place-desc">' + sc.desc + "</div>";
    btn.addEventListener("click", () => {
      state.place = sc.id;
      renderHome();
    });
    list.appendChild(btn);
  });

  const themes = $("theme-list");
  themes.innerHTML = "";
  THEMES.forEach((t) => {
    const btn = document.createElement("button");
    btn.className = "theme-chip" + (state.theme === t.id ? " selected" : "");
    btn.textContent = t.label;
    btn.addEventListener("click", () => {
      state.theme = t.id;
      renderHome();
    });
    themes.appendChild(btn);
  });

  $("btn-start").disabled = !state.place;
}

/* ---------- 画面2: 導入 ---------- */
function startCase() {
  const sc = SCENARIOS[state.place];
  state.collected = new Set();
  state.hintLevel = 0;
  state.hintUsed = 0;
  state.currentSpot = -1;
  state.selectedSuspect = -1;
  state.selectedTrick = -1;
  state.attempts = 0;

  $("case-place").textContent = sc.emoji + " " + sc.place;
  $("case-title").textContent = "『" + sc.title + "』";
  $("case-intro").textContent = sc.intros[state.theme] || sc.intros.detective;
  $("case-gm").textContent = sc.gmIntro;
  showScreen("case");
}

/* ---------- 画面3: 捜査 ---------- */
function startInvestigate() {
  const sc = SCENARIOS[state.place];
  renderSpots();
  $("gm-chat").innerHTML = "";
  gmSay(sc.gmIntro);
  updateProgress();
  updateHintButton();
  $("spot-detail").classList.add("hidden");
  $("sv-note").textContent = "🗺️ まずは下のスポットを選んで、現場へ向かおう。";
  $("map-frame").removeAttribute("src");
  showScreen("investigate");
}

function renderSpots() {
  const sc = SCENARIOS[state.place];
  const list = $("spot-list");
  list.innerHTML = "";
  sc.spots.forEach((spot, i) => {
    const btn = document.createElement("button");
    const done = state.collected.has(i);
    btn.className = "spot-btn" + (done ? " done" : "") + (state.currentSpot === i ? " active" : "");
    btn.innerHTML =
      '<span class="spot-main"><span class="spot-icon">' + (spot.icon || "📍") + "</span><span>" + (i + 1) + ". " + spot.name + "</span></span>" +
      '<span class="spot-status">' + (done ? "✔ 手がかり入手" : "未捜査") + "</span>";
    btn.addEventListener("click", () => selectSpot(i));
    list.appendChild(btn);
  });
}

function selectSpot(i) {
  const sc = SCENARIOS[state.place];
  const spot = sc.spots[i];
  state.currentSpot = i;
  $("map-frame").src =
    "https://maps.google.com/maps?q=" + encodeURIComponent(spot.query) + "&z=17&output=embed";
  $("sv-note").textContent = spot.sv;
  $("spot-name").textContent = spot.name;
  $("spot-fact").textContent = "📍 " + spot.fact;
  const already = state.collected.has(i);
  $("spot-analyzing").classList.add("hidden");
  $("spot-clue").classList.toggle("hidden", !already);
  if (already) $("spot-clue-text").textContent = spot.clue;
  $("btn-collect").textContent = already ? "✔ 調査済み" : "🔍 現場検証する";
  $("btn-collect").disabled = already;
  $("spot-detail").classList.remove("hidden");
  renderSpots();
  $("spot-detail").scrollIntoView({ behavior: "smooth", block: "start" });
}

let collecting = false; // 現場検証の解析中フラグ（二重クリック防止）
function collectClue() {
  const i = state.currentSpot;
  if (i < 0 || state.collected.has(i) || collecting) return;
  collecting = true;
  const sc = SCENARIOS[state.place];
  const btn = $("btn-collect");
  btn.disabled = true;
  btn.textContent = "解析中…";
  $("spot-clue").classList.add("hidden");
  $("spot-analyzing").classList.remove("hidden");
  setTimeout(() => {
    collecting = false;
    state.collected.add(i);
    // 詳細パネルがそのままこのスポットを表示している場合だけ、手がかりを見せる
    if (state.currentSpot === i) {
      $("spot-analyzing").classList.add("hidden");
      $("spot-clue-text").textContent = sc.spots[i].clue;
      const clueBox = $("spot-clue");
      clueBox.classList.remove("hidden");
      clueBox.classList.remove("fade-in");
      void clueBox.offsetWidth; // アニメーションを再発火させる
      clueBox.classList.add("fade-in");
      btn.textContent = "✔ 調査済み";
      btn.disabled = true;
    }
    renderSpots();
    updateProgress();
    if (state.collected.size === sc.spots.length) {
      gmSay("すごい！ 手がかりが全部そろったね。あとは推理だ。下の「推理する」ボタンから進んでくれ。外してもペナルティはないから、自信を持って当ててみよう。");
      $("btn-deduce").textContent = "推理する 🔍";
    } else {
      gmSay("手がかりを1つ手に入れた（" + state.collected.size + " / " + sc.spots.length + "）。残りのスポットもまわってみよう。");
    }
  }, 900);
}

function updateProgress() {
  const sc = SCENARIOS[state.place];
  const n = state.collected.size;
  $("clue-count").textContent = n;
  $("progress-fill").style.width = (n / sc.spots.length) * 100 + "%";
  const ready = n === sc.spots.length;
  $("btn-deduce").disabled = !ready;
  if (!ready) $("btn-deduce").textContent = "推理する（手がかりを全部集めると押せます）";
}

/* ---------- AIゲームマスター（ルールベースの段階ヒント） ---------- */
function gmSay(text) {
  const chat = $("gm-chat");
  const div = document.createElement("div");
  div.className = "chat-msg gm";
  div.textContent = "🎩 " + text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}
function meSay(text) {
  const chat = $("gm-chat");
  const div = document.createElement("div");
  div.className = "chat-msg me";
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}
function updateHintButton() {
  const btn = $("btn-hint");
  if (state.hintLevel >= 3) {
    btn.textContent = "ヒントはここまで（あとは君の推理だ！）";
    btn.disabled = true;
  } else {
    btn.textContent = "ヒントをもらう（Lv." + (state.hintLevel + 1) + " / 3）";
    btn.disabled = false;
  }
}
function giveHint() {
  const sc = SCENARIOS[state.place];
  if (state.hintLevel >= 3) return;
  meSay("ヒントをください（Lv." + (state.hintLevel + 1) + "）");
  gmSay(sc.hints[state.hintLevel]);
  state.hintLevel++;
  state.hintUsed++;
  updateHintButton();
}

/* ---------- 画面4: 推理 ---------- */
function renderNotebook() {
  const sc = SCENARIOS[state.place];
  const items = [...state.collected].sort((a, b) => a - b);
  $("notebook-summary").textContent =
    "📋 捜査手帳（集めた手がかり " + items.length + "件）";
  const list = $("notebook-list");
  list.innerHTML = "";
  items.forEach((i) => {
    const spot = sc.spots[i];
    const div = document.createElement("div");
    div.className = "notebook-item";
    const head = document.createElement("h4");
    head.textContent = (spot.icon || "📍") + " " + spot.name;
    const body = document.createElement("p");
    body.textContent = spot.clue;
    div.appendChild(head);
    div.appendChild(body);
    list.appendChild(div);
  });
  $("notebook").open = false;
}

function startDeduce() {
  const sc = SCENARIOS[state.place];
  state.selectedSuspect = -1;
  state.selectedTrick = -1;
  $("deduce-error").classList.add("hidden");
  renderNotebook();

  const sl = $("suspect-list");
  sl.innerHTML = "";
  sc.suspects.forEach((s, i) => {
    const div = document.createElement("div");
    div.className = "option-card";
    div.innerHTML =
      '<div class="opt-name">' + s.name + '</div>' +
      '<div class="opt-role">' + s.role + "</div>" +
      '<div class="opt-statement">' + s.statement + "</div>";
    div.addEventListener("click", () => {
      state.selectedSuspect = i;
      sl.querySelectorAll(".option-card").forEach((el, j) =>
        el.classList.toggle("selected", j === i)
      );
    });
    sl.appendChild(div);
  });

  const tl = $("trick-list");
  tl.innerHTML = "";
  sc.tricks.forEach((t, i) => {
    const div = document.createElement("div");
    div.className = "option-card";
    div.innerHTML = '<div class="opt-name">' + t + "</div>";
    div.addEventListener("click", () => {
      state.selectedTrick = i;
      tl.querySelectorAll(".option-card").forEach((el, j) =>
        el.classList.toggle("selected", j === i)
      );
    });
    tl.appendChild(div);
  });

  showScreen("deduce");
}

function answer() {
  const sc = SCENARIOS[state.place];
  const err = $("deduce-error");
  if (state.selectedSuspect < 0 || state.selectedTrick < 0) {
    err.textContent = "Q1（犯人）とQ2（トリック）の両方を選んでから、推理を告げてください。";
    err.classList.remove("hidden");
    return;
  }
  state.attempts++;
  const culpritOk = state.selectedSuspect === sc.culprit;
  const trickOk = state.selectedTrick === sc.correctTrick;
  if (culpritOk && trickOk) {
    showResult();
    return;
  }
  let msg = "🎩 GM：惜しい！ その推理には、手がかりと合わない点がある。\n";
  if (!culpritOk && !trickOk) {
    msg += "犯人もトリックも、もう一度手がかりと照らし合わせてみよう。捜査に戻って手がかりを読み直すのも有効だ。";
  } else if (!culpritOk) {
    msg += "トリックの見立ては筋が通っている。でも、そのトリックを実行できた人物は誰だろう？ アリバイと「できたかどうか」を比べ直してみて。";
  } else {
    msg += "犯人の目星は正しい方向だ。あとは、その人物が「どうやって」やったか。手がかりが指す手段と結びつけてみよう。";
  }
  msg += "\n（挑戦 " + state.attempts + " 回目 / 何度でも挑戦できます）";
  err.textContent = msg;
  err.classList.remove("hidden");
}

/* ---------- 画面5: 解決編 ---------- */
function showResult() {
  const sc = SCENARIOS[state.place];

  // 探偵ランク（GMヒントの使用回数で判定）
  const used = state.hintUsed;
  let rank, rankName;
  if (used === 0) { rank = "S"; rankName = "名探偵"; }
  else if (used <= 2) { rank = "A"; rankName = "腕利き探偵"; }
  else if (used <= 4) { rank = "B"; rankName = "一人前探偵"; }
  else { rank = "C"; rankName = "見習い探偵"; }
  $("result-rank").innerHTML =
    '<div class="rank-circle">' + rank + "</div>" +
    '<div class="rank-label">探偵ランク ' + rank + " ― " + rankName + "</div>" +
    '<div class="rank-sub">GMヒント使用 ' + used + " 回</div>";

  $("result-title").textContent = "『" + sc.title + "』解決！";
  $("result-truth").textContent = sc.truth;
  $("result-realstory").textContent = sc.realStory;

  const base = location.href.split("?")[0].split("#")[0];
  const url =
    base +
    "?case=" + encodeURIComponent(sc.id) +
    "&theme=" + encodeURIComponent(state.theme) +
    "&result=solved";
  $("share-url").value = url;
  $("copy-done").classList.add("hidden");
  showScreen("result");
}

async function copyShareUrl() {
  const input = $("share-url");
  try {
    await navigator.clipboard.writeText(input.value);
  } catch (e) {
    input.select();
    document.execCommand("copy");
  }
  $("copy-done").classList.remove("hidden");
}

/* ---------- 起動処理 ---------- */
function init() {
  // 共有リンクのパラメータ
  const params = new URLSearchParams(location.search);
  const sharedCase = params.get("case");
  const sharedTheme = params.get("theme");
  if (sharedCase && SCENARIOS[sharedCase]) {
    state.place = sharedCase;
    if (sharedTheme && THEMES.some((t) => t.id === sharedTheme)) {
      state.theme = sharedTheme;
    }
    const sc = SCENARIOS[sharedCase];
    if (params.get("result") === "solved") {
      $("share-banner-text").textContent =
        "🔗 友だちが「" + sc.place + "」の事件『" + sc.title + "』を解決しました！ あなたも同じ事件に挑戦してみよう。";
    } else {
      $("share-banner-text").textContent =
        "🔗 シェアされた事件『" + sc.title + "』（" + sc.place + "）が届いています。";
    }
    $("share-banner").classList.remove("hidden");
    $("btn-share-challenge").classList.remove("hidden");
  }

  renderHome();
  $("btn-share-challenge").addEventListener("click", startCase);
  $("btn-start").addEventListener("click", startCase);
  $("btn-investigate").addEventListener("click", startInvestigate);
  $("btn-collect").addEventListener("click", collectClue);
  $("btn-hint").addEventListener("click", giveHint);
  $("btn-deduce").addEventListener("click", startDeduce);
  $("btn-back-investigate").addEventListener("click", () => showScreen("investigate"));
  $("btn-answer").addEventListener("click", answer);
  $("btn-copy").addEventListener("click", copyShareUrl);
  $("btn-again").addEventListener("click", () => {
    state.place = null;
    renderHome();
    showScreen("home");
  });
}

document.addEventListener("DOMContentLoaded", init);
