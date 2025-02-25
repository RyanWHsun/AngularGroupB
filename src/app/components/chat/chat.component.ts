import { SocialmediaService } from 'src/app/services/socialmedia.service';
import { SocialmediaComponent } from './../socialmedia/socialmedia.component';
import { Component, EventEmitter, Input, Output } from '@angular/core';
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

  messages: { senderId: number, receiverId: number, message: string }[] = [];
  messageText: string = '';

  constructor(private socialmediaService: SocialmediaService) { }
  ngOnInit(): void {
    // this.socialmediaService.getChatbyID(this.chatUser.id).subscribe((datas:IChat[])=>this.messages=datas.map(chat=>({
    //   senderId:chat.senderId,
    // })))
  }
  closeChat() {
    this.closeChatEvent.emit(this.chatUser.id);
  }
  sendMessage() {

  }
}
