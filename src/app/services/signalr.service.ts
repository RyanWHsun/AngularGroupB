import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
@Injectable({
  providedIn: 'root'
})
export class SignalrService {
  private hubConnection!: signalR.HubConnection;
  constructor() { }
  public startConnection() {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl('https://localhost:7112/chatHub', { withCredentials: true })
      .withAutomaticReconnect()
      .build();

    this.hubConnection
      .start()
      .then(() => console.log('SignalR 連線成功'))
      .catch(err => console.log('SignalR 連線失敗: ', err));
  }
  public onMessageReceived(callback: (comment: any) => void) {
    this.hubConnection.on('ReceiveMessage', (comment) => {
      callback(comment);
    });
  }
  public onPrivateMessageReceived(callback: (message: any) => void) {
    this.hubConnection.on('ReceivePrivateMessage', (message) => {
      callback(message);
    });
  }
}
