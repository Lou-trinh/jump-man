const URL = 'ws://192.168.1.184:8080';

const webSocket = {
    getWebSocket(uri: string): WebSocket {
        return new WebSocket(URL + uri);
    },
    
    send(uri: string, data: any) {
        const ws = this.getWebSocket(uri);

        ws.onopen = () => {
            console.log('Game Connected');
            ws.send(data);
        }
    },
};

export default webSocket;