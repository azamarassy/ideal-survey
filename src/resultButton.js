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
        //FireStoreに保存されたパラメータの平均値を求める処理
        const calculateAverages = async () => {
          const paramLabels = ['功績', '経済力', '知性', '価値観', '情緒', '容姿'];
          const querySnapshot = await getDocs(collection(firestore, 'results'));   
          const sums = {};
          const counts = {};
          
          //Firestoreからデータを取得
          querySnapshot.forEach((doc) => {
            for (let label of paramLabels) {
              sums[label] = (sums[label] || 0) + Number(doc.data()[label]);
              counts[label] = (counts[label] || 0) + 1;
            }
          });   

          const newAverages = {};
          for (let label of paramLabels) {
            newAverages[label] = sums[label] / counts[label];
          }
          setAverages(newAverages);
    
          // これまでの回答者の数を取得し、状態変数に保存する
          const answerCount = querySnapshot.size;
          setAnswerCount(answerCount);
        };  

        //ページ更新したときにcalculateAverages()が呼ばれる
        useEffect(() => {
          calculateAverages();
        }, []);
         
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
              //...surveyDataというようにスプレッド構文を使うことでfirestoreにドキュメント : serveydata,フィールド : 顔: 15って感じで保存できる
              //surveyDataオブジェクトのプロパティを直接ドキュメントの階層に持たせる
              ...surveyData, //surveyData[paramLabels[i]] = kekkaText[i];({ 顔: 15 }って感じのオブジェクト)

              //送信した時間
              timestamp: new Date(),
            });
            window.alert("データが送信されました");
            calculateAverages();
          } catch (error) {//エラーが発生した時の処理
            window.alert("データの保存に失敗しました: " + error);
          }
        };
    
        // 平均値を表示するための状態変数と更新関数を定義する
        const [showAverage, setShowAverage] = useState(false);
        const [showSendButton, setShowSendButton] = useState(true);

//--------------------------------------------------------------------------

//--------------------------------------------------------------------------------------
//各パラメータの順位を計算
const calculateRank = (property, surveyValue, rankSetter) => {
  const dataValues = [];
  getDocs(collection(firestore, 'results')).then((querySnapshot) => {
    const docArray = Array.from(querySnapshot.docs);
    
    docArray.forEach((doc) => {
      dataValues.push(doc.data()[property]);
    });

    dataValues.push(surveyValue);
    dataValues.sort((a, b) => a - b);

    const index = dataValues.indexOf(surveyValue);
    rankSetter(index + 1);
  });
};

const [AchievementsRank, setAchievementsRank] = useState(null);
const [moneyRank, setMoneyRank] = useState(null);
// const [funRank, setFunRank] = useState(null);
const [intelligenceRank, setIntelligenceRank] = useState(null);
const [valueRank, setValueRank] = useState(null);
const [emotionRank, setEmotionRank] = useState(null);
const [looksRank, setLooksRank] = useState(null);
// const [loveRank, setLoveRank] = useState(null);

useEffect(() => {
  calculateRank("功績", surveyData["功績"], setAchievementsRank);
  calculateRank("経済力", surveyData["経済力"], setMoneyRank);
  // calculateRank("楽しさ", surveyData["楽しさ"], setFunRank);
  calculateRank("知性", surveyData["知性"], setIntelligenceRank);
  calculateRank("価値観", surveyData["価値観"], setValueRank);
  calculateRank("情緒", surveyData["情緒"], setEmotionRank);
  calculateRank("容姿", surveyData["容姿"], setLooksRank);
  // calculateRank("好意", surveyData["好意"], setLoveRank);
}, [surveyData]);

//----------------------------------------------------------------------------------

//---------------------------------------------------------------------------------------
        
  const handleResultClick = (event) => {
    event.preventDefault();
    saveToFirestore();
    setShowAverage(true);
    setShowSendButton(false);
  };
  //-----------------------------------------------------------------------------------------
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
            {/* <RankDisplay property="楽しさ" rank={funRank} /> */}
            <RankDisplay property="知性" rank={intelligenceRank} />
            <RankDisplay property="価値観" rank={valueRank} />
            <RankDisplay property="情緒" rank={emotionRank} />
            <RankDisplay property="容姿" rank={looksRank} />
            {/* <RankDisplay property="好意" rank={loveRank} /> */}

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
};

export default ResultComponent;
