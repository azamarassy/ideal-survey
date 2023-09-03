import React from 'react';

const FormComponent = () => {
 //--------------------------------------------------------------------------------------------------------
 //フォームの入力値の判定、バリデーション
  //1以上50以下の整数か判定する関数
  const isValidNumber = (value) => {
    const numericValue = Number(value); //入力値を数値型に変換(文字列は変換結果がNaNになる)
    //1以上50以下の整数ならtrueを返す
    return Number.isInteger(numericValue) && numericValue >= 1 && numericValue <= 50;
     //Number.isInteger(numericValue):整数かどうか判定するメソッド。整数であればtrue,整数以外であればfalseを返す
     //numericValue >= 1 && numericValue <= 50:1以上50以下か判定する
  };

  //フォームに入力した値が1以上50以下の整数かどうかを確認し、不正な値を取り除く
  const restrictInputToNumbers = (evt) => {
    const inputElement = evt.target; //フォームの入力要素をinputElementに代入
    const inputValue = inputElement.value.trim(); //入力値の文字列を取得し、前後の余分な空白を削除

    if (inputValue === '') return; //入力値が空の場合、チェックを行わずに関数を終了

    const errorMessage = inputElement.parentNode.querySelector('.error-message');
     //.parentNode:要素の親要素にアクセスするためのプロパティ
     //.querySelector('.error-message'):親要素(form)内からクラスが'error-message'である要素を取得するためのメソッド
    if (!isValidNumber(inputValue)) {//入力された値が1以上50以下の整数でない場合にエラーメッセージを出す
      inputElement.classList.add('is-invalid');//form-controlのclassname属性に'is-invalid'を追加
      inputElement.value = '';//入力内容を消去
      if (!errorMessage) {//エラーメッセージが存在しない場合、エラーメッセージを追加する処理を実行
        const errorMessage = document.createElement('div');//新しい div 要素を作成
        errorMessage.classList.add('error-message'); //classname属性に'error-message'を追加
        errorMessage.textContent = '1~50の整数を入力してください'; //エラーメッセージの内容
        errorMessage.style.color = 'red'; //文字の色を赤にする
        inputElement.parentNode.appendChild(errorMessage);
        //.appendChild:指定された要素（この場合は errorMessage）を選択した親要素（inputElement の親要素）に追加するメソッド。
        //この操作により、エラーメッセージがフォームの下に追加され、ユーザーにエラー内容が表示される
      }
    } else {//入力された値が1以上50以下の整数の場合
      inputElement.classList.remove('is-invalid');//form-controlのclassname属性から'is-invalid'を削除
      if (errorMessage) {//エラーメッセージがすでに存在する場合、エラーメッセージを削除する処理を実行
        errorMessage.remove();//div 要素'error-message'を削除。これによってエラーメッセージが消える
      }
    }
  };
 //--------------------------------------------------------------------------------------------------------
  //6つのフォームの入力値の合計を計算する関数
  const calculateInput = () => {
    const formControls = document.getElementsByClassName('form-control');
    let input = 0;
    for (let i = 0; i < formControls.length; i++) {
      input += Number(formControls[i].value);
    }
    return input;
  };

  //残りポイントの計算,表示
  const getValue = () => {
    let input = calculateInput();
    let output = 150 - input;
    document.getElementById('leftPt').textContent = output;
  };

  //------------------------------------------------------------------------------------------------------------------------------------
  //各フォームの値を消去する関数(クリアボタンを押したときの処理)
  const clearForm = (i) => {
    const formControls = document.getElementsByClassName('form-control');
    formControls[i-1].value = "";
    const errorMessage = formControls[i-1].parentNode.querySelector('.error-message');//エラーメッセージを取得

    if (errorMessage) {
      errorMessage.remove();//エラーメッセージを削除
      formControls[i-1].classList.remove('is-invalid');//form-controlのclassname属性から'is-invalid'を削除。これによりフォームの赤枠が消える
    }
  };
  //----------------------------------------------------------------------------------------------------------------------------------


  //-----------------------------------------------------------------------------------------------------------------------------------
  //レンダリングする部分を配列で作成
  const formCount = 6;//フォームの数を指定
  const forms = [];

  for(let i = 1; i <= formCount; i++){
    forms.push(//.push:配列の末尾に新しい要素を追加するメソッド
      <form key={i} className="form-horizontal" onSubmit={(e) => e.preventDefault()}>
        {/* key={i}:要素を区別するために使用する識別子。リスト内で同じ要素が複数回レンダリングされる場合に必要 */}
        {/* onSubmit={(e) => e.preventDefault()}:フォームに値を入力してenterを押した時の処理をなくす */}
        <div className="form-group row ms-1 my-3">
          {/* プロパティ名 */}
          <label className="col-sm-4 control-label my-2 ml-3" style={{ fontSize: '20px' }}>プロパティ名</label>
          {/* フォーム */}
          <div className="col-sm-4">
            <input type="text" className="my-2 form-control" onChange={function(event){
              restrictInputToNumbers(event);
              getValue();        
            }}/>
          </div>
          {/* クリアボタン */}
          <div className="col-sm-4 d-flex align-items-center">
            <input type="reset" className="clearButton my-2 btn btn-primary" style={{ fontSize: '20px', marginLeft: '4px' }} value="クリア" onClick={() => {
              clearForm(i);//フォームの入力値を消す
              getValue();//残りポイントを計算
              }}/>
          </div>
        </div>
      </form>
    );
  }
  //---------------------------------------------------------------------------------------------------------------------------------

  return(<div>{forms}</div>);

};//FormComponent

export default FormComponent;