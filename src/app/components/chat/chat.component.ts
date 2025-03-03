import { SignalrService } from 'src/app/services/signalr.service';
import { SocialmediaService } from 'src/app/services/socialmedia.service';
import { SocialmediaComponent } from './../socialmedia/socialmedia.component';
import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { IChat } from 'src/app/interfaces/IChat';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  @Input() currentUser!: { id: number, name: string, image: string };
  @Input() chatUser!: { id: number, name: string, image: string };

  @Output() closeChatEvent = new EventEmitter();
  @ViewChild('chatContainer') chatContainer!: ElementRef;
  messages: { senderId: number, senderImg: string, senderName: string, message: string }[] = [];
  messageText: string = '';

  constructor(private socialmediaService: SocialmediaService, private signalrService: SignalrService) { }
  ngOnInit(): void {
    this.loadChatData();
    this.signalrService.startConnection();
    this.signalrService.onPrivateMessageReceived((message: IChat) => {
      this.messages.push({
        senderId: message.fSenderId,
        senderImg: message.fSenderId === this.currentUser.id ? this.currentUser.image : this.chatUser.image,
        senderName: message.fSenderId === this.currentUser.id ? this.currentUser.name : this.chatUser.name,
        message: message.fMessageText
      })
      this.scrollToBottom();
    });
  }
  ngAfterViewInit(): void {
    this.scrollToBottom();
  }
  loadChatData() {
    this.socialmediaService.getChatbyID(this.chatUser.id).subscribe((datas: IChat[]) => {
      this.messages = datas.map((chat: IChat) => ({
        senderId: chat.fSenderId,
        senderImg: chat.fSenderId === this.currentUser.id ? this.currentUser.image : this.chatUser.image,
        senderName: chat.fSenderId === this.currentUser.id ? this.currentUser.name : this.chatUser.name,
        message: chat.fMessageText
      }))
    }
    );
  }
  closeChat() {
    this.closeChatEvent.emit(this.chatUser.id);
  }
  sendMessage() {
    this.socialmediaService.postChat({
      FReceiverId: this.chatUser.id,
      FMessageText: this.messageText
    }).subscribe(() => {
      this.messageText = '';
    })
  }

  scrollToBottom() {
    setTimeout(() => {
      if (this.chatContainer) {
        this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
      }
    }, 100);
  }

  defaultMessage() {
    this.messageText = '你是說 RIWAWA行李箱?';
  }
}
