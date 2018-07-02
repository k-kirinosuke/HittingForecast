"use strict";
const Alexa = require('alexa-sdk');

// 占い結果の定義
const fortunes = [
    {'score':'good','description':'天気は雨か晴れか曇りか雪でしょう' },
    {'score':'normal', 'description':'降水確率はゼロ%から100%のどれかでしょう' },
    {'score':'good','description':'湿度はゼロ%から100%の間をさまようでしょう' },
    {'score':'good','description':'積雪はゼロmから20mでしょう' },
    {'score':'good','description':'風速はゼロm/sから120m/sでしょう' },
    {'score':'good','description':'気圧は800hPaから1,200hPaでしょう' },
    {'score':'bad','description':'気温は-100℃から60℃の間でしょう' }
];

// Lambda関数のメイン処理
exports.handler = function(event, context, callback) {
    var alexa = Alexa.handler(event, context); // Alexaオブジェクトのインスタンス生成
    alexa.appId = process.env.APP_ID;
    alexa.registerHandlers(handlers); // ハンドラの登録
    alexa.execute();                  // インスタンスの実行
};

var handlers = {
    // インテントに紐付かないリクエスト
    'LaunchRequest': function () {
    this.emit('AMAZON.HelpIntent'); // AMAZON.HelpIntentの呼び出し
    },
    // スキルの使い方を尋ねるインテント
    'AMAZON.HelpIntent': function () {
        this.emit(':ask', '絶対に当たる天気予報をします。' +
            'たとえば、東京の天気を教えてと聞いてください。どうしますか？', "どうしますか？");
    },
    // 対話モデルで定義した、占いを実行するインテント
    'PlaceIntent': function () {
        var place = this.event.request.intent.slots.Place.value; // スロットPlaceを参照
        var when = this.event.request.intent.slots.When.value;
        var fortune = fortunes[Math.floor(Math.random()*7)];       // ランダムに占い結果を取得
        if(!when){
            when = '';
        } else{
            when = when + 'の';
        }
        if(!place){
            place = '';
        }else if(place == '天'){
            place = '';
        }else{
            if(place.slice(-1)=='天'){
                place = place.slice(0, -1);
            }else if(place.slice(-2)=='天気'){
                place = place.slice(0, -2);
            }
            place = place + 'の';
        }
        var message = when + place + fortune.description;
        this.emit(':tell', message); // レスポンスの生成
        console.log(message);
    },
     'SessionEndedRequest': function () { 
    },
    'AMAZON.CancelIntent': function () {
        this.emit(':tell', 'スキルを終了します');
    },
    'AMAZON.StopIntent': function () {
        this.emit(':tell', 'スキルを終了します');
    }
};
