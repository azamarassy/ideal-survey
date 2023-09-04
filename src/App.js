import React, { useState, useEffect } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css'; //bootstrapのインポート
//------------------------------------------------------------------------------------------
//フォーム、確定ボタン、送信ボタンのコンポーネントを別のファイルからインポート
import FormComponent from './form'; 
import DecideComponent from './decideButton';
import ResultComponent from './resultButton';

//index.jsのrootに渡される。そこからindex.htmlのrootに渡されてレンダリングされる。
//index.jsはアプリケーションの中で一番最初に呼び出される部分(エントリーポイント)
const App = () => {
  const [leftPt, setLeftPt] = useState(150);
  const [showComponents, setShowComponents] = useState(true);
  const [showComponents2, setShowComponents2] = useState(true);
  const [showComponents3, setShowComponents3] = useState(true);
  const [showDecideButton, setShowDecideButton] = useState(true);
  const [showAnswer2, setShowAnswer2] = useState(false);
  const [surveyData, setSurveyData] = useState({});
  //--------------------------------------------------------------------------------------------------------------------
  //useEffectを使ってリロードしたときにsettingが呼ばれるようにする。
  useEffect(() => {
    setting();
  }, []);
    
    const setting = () => {
      setShowComponents(true);//説明文やフォームを表示
      setShowComponents2(true);//リセットボタンの表示
      setShowComponents3(false);//送信ボタンを非表示
      setShowDecideButton(true);//確定ボタンを表示
      setShowAnswer2(false);//結果を非表示
    };
    //-------------------------------------------------------------------------------------------------------------------

    useEffect(() => {
      if (showComponents) {
        document.getElementById('js-question').textContent = "理想の異性アンケート";
    
        let koumoku = ['功績 : 肩書、学歴、大会成績など', '経済力 : 年収、貯蓄など', '知性 : 頭の回転,理解力,記憶力,柔軟性など', '価値観 : 金銭感覚や共通の趣味、常識など', '情緒 : 怒りやすさや動揺しやすさなど', '容姿 : 清潔感、服装を含む。あと臭いも含めます。',];
        let i = 0;
        while (i < koumoku.length) {
          document.getElementsByTagName('label')[i].textContent = koumoku[i];
          i++;
        }
      }
    }, [showComponents]);

  //----------------------------------------------------------------------------------------------------
  //propsで渡す関数
  const functions = {
      handleResetClick: () => {   
        setting();
        setLeftPt(150);//残りポイントを150にする

        if (showComponents) {
         document.getElementById('leftPt').textContent = "150";
        
         //フォームの入力内容を消してエラーメッセージも消す関数
        const clearForm = (i) => {
          const formControls = document.getElementsByClassName('form-control');
          formControls[i].value = "";
          const errorMessage = formControls[i].parentNode.querySelector('.error-message');//エラーメッセージを取得

          if (errorMessage) {
            errorMessage.remove();//エラーメッセージを削除
            formControls[i].classList.remove('is-invalid');///form-controlのclassname属性から'is-invalid'を削除。これによりフォームの赤枠が消える
        }
        };
    
        for (let i = 0; i < document.getElementsByClassName('clearButton').length; i++) {
            clearForm(i);
        }
       }
      },

      handleShowComponents: (newValue) => {
        setShowComponents(newValue); 
      },

      handleShowComponents2: (newValue) => {
        setShowComponents2(newValue); 
      },
      handleShowComponents3: (newValue) => {
        setShowComponents3(newValue); 
      },
      handleShowDecideButton: (newValue) => {
        setShowDecideButton(newValue); 
      },
        handleShowAnswer2: (newValue) => {
          setShowAnswer2(newValue); 
      },
      updateSurveyData: (index, newValue) => {
        const updatedSurveyData = [...surveyData];
        updatedSurveyData[index] = newValue;
        setSurveyData(updatedSurveyData);
      }
  };

  //---------------------------------------------------------------------------------------------------
  return (
    <div className="container">
      <div id="js-question" className="mt-3 alert alert-primary" role="alert" style={{ fontSize: '25px' }}>
        A simple primary alert—check it out!
      </div>

      <div className="card-deck">
        <div className="card">
          <div className="card-header">
            <h1 id="1pName" style={{ fontSize: '30px' }}>異性に求めるもの</h1>
          </div>

          {showComponents && (
          <div>
          <p style={{ fontSize: '20px' }} className="ms-2 mt-2 ml-4">残りポイントが0になるように各項目に1~50の数字を入力してください。</p>
          <p style={{ fontSize: '20px' }} className="ms-2 ml-4">大きい数字ほど自分の理想に近づきます。</p>

          <dl className="row text-center" >
            <dt style={{ fontSize: '25px' }} className=" mt-1 ">残りポイント</dt>
            <dd style={{ fontSize: '25px' }} className=" mt-1  " id="leftPt">{leftPt}</dd>
          </dl>

          <FormComponent />

          </div>
          )} 

        <div className="row">

    <DecideComponent 
      handleShowComponents={functions.handleShowComponents}
      handleShowComponents2={functions.handleShowComponents2}
      handleShowComponents3={functions.handleShowComponents3}
      handleShowDecideButton={functions.handleShowDecideButton}
      handleShowAnswer2={functions.handleShowAnswer2}
      showDecideButton={showDecideButton}
      showAnswer2={showAnswer2}
      surveyData={surveyData}
      updateSurveyData={functions.updateSurveyData}
    />


    {showComponents3 && (
      <div>
        <ResultComponent
          handleResetClick={functions.handleResetClick}
          handleShowComponents={functions.handleShowComponents}
          surveyData={surveyData}
        />
      </div>
    )}

    {showComponents2 && (
      <div>
        <button type="button" className="mx-2 my-1 btn btn-primary" id="resetButton" onClick={functions.handleResetClick} style={{width: '100px'}}>
          リセット
        </button>
      </div>
    )}
  </div>
</div>
            
      </div>
    </div>
  );
};

export default App;