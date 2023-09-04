import React from 'react';
import { addDoc, collection, getDocs } from 'firebase/firestore';
import { firestore } from './firebase';
import { useState, useEffect } from 'react';

// const ResultComponent = ({ handleResetClick }) => {//propsで別のファイルの関数を使う方法を知りたい
//フォーム内容をfirebaseに送信した後、入力内容をリセットする処理をしたい。
//リセットの処理はhandleResetClickを使ってやりたい。
      const ResultComponent = ( props ) => {
        //状態変数および状態関数を定義
        //状態変数が変わったときに再レンダリングされる。
        //状態関数を呼び出して状態変数を更新する。   
        const [averages, setAverages] = useState({});
        const [answerCount, setAnswerCount] = useState({});
        const surveyData = props.surveyData;

        //----------------------------------------------------------------------------------------------------------------------
        //FireStoreに保存されたパラメータの平均値を求める処理
        const calculateAverages = async () => {
          const paramLabels = ['功績', '経済力', '知性', '価値観', '情緒', '容姿'];

          //Firestore データベースからの取得結果を格納する変数
          const querySnapshot = await getDocs(collection(firestore, 'results'));
          //await:非同期操作として実行され、データベースからのデータ取得が完了するのを待つ
          //collection:Firestore のコレクションへの参照を作成するために使用。
          //第一引数には Firestore インスタンス（firestore）を指定し、第二引数には対象のコレクション名（この場合は 'results'）を指定
          //getDocs:Firestore からドキュメントを取得するための関数。この関数は、指定されたコレクション内のすべてのドキュメントを取得

          const sums = {};//ラベルごとの合計値を保持するためのオブジェクトを初期化
          const counts = {};//ドキュメントの数を取得するためのオブジェクトを初期化
          
          //Firestoreからデータを取得
          querySnapshot.forEach((doc) => {
            //querySnapshot:Firebase Firestore クエリの結果を表すオブジェクト
            //データベースからドキュメントやコレクションを取得するために使用
            //querySnapshot.forEach((doc) : querySnapshot オブジェクトに含まれる docs プロパティに格納されている各ドキュメントに対して、指定された関数（この場合、アロー関数）を呼び出す
            for (let label of paramLabels) {//paramLabels 配列内の各ラベルに対して繰り返し処理を行う
              //paramLabelsの各要素'功績', '経済力'などと対応するフィールド名に対して処理を行う
              sums[label] = (sums[label] || 0) + Number(doc.data()[label]);
              //この行では、各ラベルごとにそのラベルに対応する値を合計
              //[label]:ドキュメント内のプロパティ（フィールド）の名前を表す変数。Firestore ドキュメント内のデータから取得。

              //doc.data() : Firestore ドキュメントからデータを取得するメソッド。このメソッドは、Firestore ドキュメント内のすべてのデータをオブジェクトとして返す
              //doc.data()はquerySnapshot.forEach() などのメソッドを使用して、複数のドキュメントに対する操作を実行することが一般的
              //例えばFirestore ドキュメントが{HP:4, MP:5}というデータを持っているとすると
              //doc.data() を呼び出すと{HP:4, MP:5}というオブジェクトが得られる

              //Number(doc.data()[label]) は、取得した値を数値に変換する操作。Firestore から取得されるデータは通常文字列型なので、合計を計算するために数値に変換
              //sums オブジェクトは、各ラベルの合計を保持するためのオブジェクトであり、label をキーとして値を格納
              //特定のラベルに関連付けられた値を sums オブジェクト内の対応するラベルの合計値に加算し、その結果を sums[label] に代入。これにより、ラベルごとのデータの合計が更新される

              //(sums[label] || 0)
              //1.sums オブジェクト内で label という名前のプロパティ（またはキー）が存在するかどうかを確認
              //2.もし label という名前のプロパティが存在すれば、その値を使用(sums[label] の部分)
              //3.もし label という名前のプロパティが存在しなければ、代わりに 0 を使用(|| 0 の部分)
              //変数やプロパティが存在しない場合にエラーを回避し、代わりにデフォルトの値を使用することができる
              //例.const myVariable = someObject.property || 'default';
              //上記のコードは、someObject が property というプロパティを持っている場合にはその値を myVariable に代入し、存在しない場合には 'default' を代入。

              //結論.sums[label] = (sums[label] || 0) + Number(doc.data()[label]):label という名前のプロパティが sums オブジェクト内に存在する場合、
              //その値に Number(doc.data()[label]) を加算。存在しない場合、デフォルト値として 0 に Number(doc.data()[label]) を加算。

              //ドキュメントの数を取得
              counts[label] = (counts[label] || 0) + 1;
              //label という名前のプロパティが countsオブジェクト内に存在する場合、その値に1を加算存在しない場合、デフォルト値として 0 に 1を加算
            }
          });   

          //---------------------------------------------------------------------------------
          //Firestoreからデータを取得する処理の具体例
          // querySnapshot.forEach((doc) => {
          //   for (let label of paramLabels) {
          //     sums[label] = (sums[label] || 0) + Number(doc.data()[label]);  
          //     counts[label] = (counts[label] || 0) + 1;  
          // }
          // }); 

          //上記のコードはfirestoreに{HP:4, MP:5},{HP:6, MP:2}というドキュメントがあるとすると、

          //1つ目の Firestore ドキュメント {HP:4, MP:5} に対して：
          // HP ラベルを見つけ、sums[HP] に 0+4 を代入。
          // MP ラベルを見つけ、sums[MP] に 0+5 を代入。
          // 各ラベルごとに counts が 1 ずつ増加。
          // 2つ目の Firestore ドキュメント {HP:6, MP:2} に対して：
          // HP ラベルを見つけ、sums[HP] に 4+6 を代入。
          // MP ラベルを見つけ、sums[MP] に 5+2 を代入。
          // 各ラベルごとに counts が 1 ずつ増加。
          //という処理を行う
          //---------------------------------------------------------------------------------


         //各プロパティ(経済力、価値観など)の平均値を求める
         //FireStoreのドキュメントから取得した値が sums[label]とcounts[label]に入っているのでその値を使って計算
          const newAverages = {};
          for (let label of paramLabels) {
            newAverages[label] = sums[label] / counts[label];
          }
          //ここで求めた各プロパティの平均値(newAverages)を、setAverages(状態関数)を使って状態変数(averages)に保存する
          setAverages(newAverages);
    
          //これまでの回答者数を取得し、状態変数に保存する
          const answerCount = querySnapshot.size;
          setAnswerCount(answerCount);

        };//calculateAverages
        //----------------------------------------------------------------------------------------------------------------------  

        //ページ更新したときにcalculateAverages()が呼ばれる
        useEffect(() => {
          calculateAverages();
        }, []);
        
        //---------------------------------------------------------------------------------------------------------------------- 
        //Firestoreにデータを保存する処理
        const saveToFirestore = async () => {
          try {
            //try { ... } catch (error) { ... }: JavaScriptの例外処理構文。
            //tryブロック内のコードを実行し、エラーが発生した場合はcatchブロック内のコードが実行される。
            //エラーが発生しない場合は、catchブロックはスキップされる。
            await addDoc(collection(firestore, 'results'), {
              //addDoc()関数:Firestoreのデータベースにドキュメントを追加するための関数
              //collection()関数:指定されたFirestoreのコレクションへの参照を取得
              //'results'というコレクションに新しいドキュメントを追加

              //surveyDataオブジェクトに含まれるデータを...（スプレッド構文）を使用して展開し、新しいドキュメントとしてFirestoreに保存
              //...surveyDataというようにスプレッド構文を使うことでfirestoreにドキュメント : serveydata,フィールド : 経済力: 15って感じで保存できる
              //surveyDataオブジェクトのプロパティを直接ドキュメントの階層に持たせる
              ...surveyData, //surveyData[paramLabels[i]] = kekkaText[i];({ 経済力: 15 }って感じのオブジェクト)

              //送信した時間
              timestamp: new Date(),
            });
            window.alert("データが保存されました");
            calculateAverages();
          } catch (error) {//エラーが発生した時の処理
            window.alert("データの保存に失敗しました: " + error);
          }
        };//saveToFirestore
        //----------------------------------------------------------------------------------------------------------------------
    
        //平均値と送信ボタンを表示/非表示するための状態変数と更新関数を定義する
        const [showAverage, setShowAverage] = useState(false);
        const [showSendButton, setShowSendButton] = useState(true);

        //--------------------------------------------------------------------------
        //各パラメータの順位を計算する処理
        //
        const calculateRank = (property, rankSetter) => {
          const dataValues = [];
          getDocs(collection(firestore, 'results')).then((querySnapshot) => {
            //firestore: Firestore データベースの参照。Firestore を使うには、Firebase プロジェクトの設定から取得した firebase オブジェクトを介してアクセスする
            //collection(firestore, 'results'): Firestore 内の特定のコレクションを指定するためのコード
            //getDocs:指定されたコレクション内のすべてのドキュメントを取得するメソッド
            //getDocsメソッドは非同期操作を返すため、.then() メソッドを使用して操作が完了した後の処理を指定

            const docArray = Array.from(querySnapshot.docs);
            //querySnapshot.docs:クエリで取得したすべてのドキュメントの配列(オブジェクトが連なった配列)
            //Array.from(querySnapshot.docs): querySnapshot.docs のドキュメントコレクションを JavaScript 配列に変換
            
            docArray.forEach((doc) => {//docArray配列内の各ドキュメントに対して処理を実行
              dataValues.push(doc.data()[property]);
              //doc.data(): 各ドキュメントのデータを取得
              //[property]: property はドキュメント内のプロパティ（フィールド）の名前を表す変数
              //dataValues.push(): doc.data()[property] から取得した特定のプロパティの値を dataValues 配列に追加
              //各ドキュメントから特定のプロパティの値を取り出して、それを dataValues 配列に追加
              //.push() メソッドはjavascriptに元々あるメソッドで新しい要素を配列の末尾に追加するために使用される
            });

            dataValues.push(surveyData[property]);
            //surveyDataから取得したプロパティの値(フォームの入力値)を dataValues 配列に追加
            dataValues.sort((a, b) => b - a);//dataValue 配列を降順にソート

            const index = dataValues.indexOf(surveyData[property]);
            //配列（Array）内で特定の値（surveyData[property]で表される値）が最初に出現する位置（インデックス）を取得
            //各フォームの入力値がforestoreに保存されたデータの中で何番目に大きいか取得
            rankSetter(index + 1);
            //順位なので+1をして補正
            //状態関数の引数に入れて状態変数を更新
          });
        };//calculateRank
        //--------------------------------------------------------------------------

        //各パラメータの順位を状態で管理
        const [AchievementsRank, setAchievementsRank] = useState(null);
        const [moneyRank, setMoneyRank] = useState(null);
        const [intelligenceRank, setIntelligenceRank] = useState(null);
        const [valueRank, setValueRank] = useState(null);
        const [emotionRank, setEmotionRank] = useState(null);
        const [looksRank, setLooksRank] = useState(null);

        useEffect(() => {//surveyData({ 経済力: 15 }って感じのオブジェクト,フォームの入力値})が変更されるたびに特定の処理を実行
          calculateRank("功績", setAchievementsRank);
          calculateRank("経済力", setMoneyRank);
          calculateRank("知性", setIntelligenceRank);
          calculateRank("価値観", setValueRank);
          calculateRank("情緒", setEmotionRank);
          calculateRank("容姿", setLooksRank);
        }, [surveyData]);

        //---------------------------------------------------------------------------------------
          //結果ボタンを押したときの処理      
          const handleResultClick = () => {
            saveToFirestore();//結果をfirebaseに保存
            setShowAverage(true);//結果をfirestoreに送信したら平均値を表示
            setShowSendButton(false);//送信ボタンは非表示にする
          };
          //-----------------------------------------------------------------------------------------
          //順位を表示するコンポーネントを定義
          const RankDisplay = ({ property, rank }) => (
            <div className="text-center my-2">{property}の順位{rank}位</div>
          );
        //-------------------------------------------------------------------------------------------
          //---------------------------------------------------------------------------------------

          return (
            <div>
                {showAverage && (
                  <div>
                    <RankDisplay property="功績" rank={AchievementsRank} />
                    <RankDisplay property="経済力" rank={moneyRank} />
                    <RankDisplay property="知性" rank={intelligenceRank} />
                    <RankDisplay property="価値観" rank={valueRank} />
                    <RankDisplay property="情緒" rank={emotionRank} />
                    <RankDisplay property="容姿" rank={looksRank} />

                    <div className="text-center my-4">これまでの回答者{answerCount}人の平均値</div>
                      <ul>
                        {Object.keys(averages).map((label) => (
                          <div className="text-center my-3" key={label}>{label} : {averages[label].toFixed(1)}</div>
                        ))}
                      </ul>
                  </div>
                  )}

                  {showSendButton && (
                    <div>
                    <button type="button" id="resultButton" className="mx-2 my-2 btn btn-primary" onClick={handleResultClick} style={{width: '100px'}}>
                      結果
                    </button>
                  </div>
                  )}
            </div>
          );
        };//ResultComponent

export default ResultComponent;
