import React from 'react';
import { useState } from 'react';

const DecideComponent = ( props ) => {
  const [dataArray, setDataArray] = useState([]);
  const surveyData = props.surveyData;
  const calculateInput = () => {
    const formControls = document.getElementsByClassName('form-control');
    let input = 0;
    for (let i = 0; i < formControls.length; i++) {
      input += Number(formControls[i].value);
    }
    return input;
  };

  const showText = () => {
    let input = calculateInput();
    let output = 150 - input;

    if (output !== 0) {
      alert("合計値が0でありません。");
      return;
    }
    //paramLabelsとkekkaTextという2つの配列を使用して、surveyDataという新しいオブジェクトを生成
    // const surveyData = {}; //surveyDataというオブジェクトを定義
    const paramLabels = ['功績', '経済力', '知性', '価値観', '情緒', '容姿'];
    const kekkaText = Array.from(document.getElementsByClassName('form-control')).map((control) => {
      //Array.from:配列のようなオブジェクトを新しい配列に変換するための関数
      //document.getElementsByClassName('form-control')):form-controlというクラス名を持つすべての要素を取得
      //.map((control) => ...): 取得した要素のリストに対してmap()関数を実行
      return control.value;
      //form-controlsに含まれるinput要素のvalueを取得して、それらの値を新しい配列として取得
    })

    for (let i = 0; i < paramLabels.length; i++) {//iがparamLabelsという配列の要素の数より小さい間処理を実行。一回実行するごとにiを1プラス
      //オブジェクトを作成
      surveyData[paramLabels[i]] = kekkaText[i];
      //javascriptのオブジェクトの作成の仕方の1つ(ブラケット法)-------------------------------------
       //↑↑の場合は{ paramLabels[i]: 'kekkaText[i]' }というオブジェクトができる。
       // const person = {};
       // const key = 'name';
       // const value = 'John';

       // // プロパティを設定する
       // person[key] = value;

       // console.log(person);
       // // 出力: { name: 'John' }
       //------------------------------------------------------------------------------------
    }
    setDataArray(Object.entries(surveyData));
    if(output === 0){
      props.handleShowComponents(false);
      props.handleShowComponents2(true);
      props.handleShowComponents3(true);
      props.handleShowAnswer2(true);
      props.handleShowDecideButton(false);
    }
  };

  const handleDecideClick = (event) => {
    event.preventDefault();
    showText();
  };

  return (
    
    <div className="text-center">
      {props.showDecideButton && (
        <button type="button" id="decideButton" className="btn btn-primary" onClick={handleDecideClick}>
          確定
        </button>
      )}
        {props.showAnswer2 && (
          <div>
            <div className="mx-2 my-2">あなたの回答</div>
            <ul>
              {dataArray.map(([key, value], index) => (
                <p key={index}>
                  {key} : {value}
                </p>
              ))}
            </ul>
          </div>
        )}
        
    </div>

    
  );
};

export default DecideComponent;