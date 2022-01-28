const webSocket = require('ws');
const { v1: uuidv1 } = require('uuid'); // v1: 타임스탬프(시간) 기준으로 생성

module.exports = () => {
    const wss = new webSocket.Server({ port: 8001 }); // 웹 소켓의 포트는 별도로 변경이 가능하다.

    // 클라이언트가 접속 시
    wss.on('connection', function connection(ws) {

        // 클라이언트가 메시지를 보내면 실행될 함수
        ws.on('message', function message(data) {
            let userData = JSON.parse(data);
            if (userData.type === "participation") { // 최초 접속
                ws.uuid = uuidv1();
                ws.name = userData.userinfo.name;
                ws.room = userData.userinfo.room;

                userData.message = "님이 참가하였습니다.";

                wss.clients.forEach(function (client) {
                    if (client.room === ws.room) {
                        client.send(JSON.stringify(userData)); // json으로 변환
                    }
                })
            } else if (userData.type === "message") { // 같은 방의 클라이언트에게 메시지를 전송
                wss.clients.forEach(function (client) {
                    if (client.room === ws.room) {
                        client.send(JSON.stringify(userData)); // json으로 변환
                    }
                })
            } else if (userData.type === "close") { // 종료 시
                wss.clients.forEach(function (client) {
                    if (client.room === ws.room) {
                        client.send(JSON.stringify(userData)); // json으로 변환
                    }
                })
            }

        });

        // 클라이언트가 연결을 종료하면 실행될 함수
        ws.on('close', function () {
            console.log("[" + ws.name + "] 사용자 접속 종료");

            let userData = { type: "close", userinfo: { name: ws.name, room: ws.room }, message: "님이 종료하였습니다." };
            
            wss.clients.forEach(function (client) {
                if (client.room === ws.room) {
                    client.send(JSON.stringify(userData)); // json으로 변환
                }
            })
        });
    });
};