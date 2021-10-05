import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Message} from "../message.model";

@Component({
  selector: 'cms-message-list',
  templateUrl: './message-list.component.html',
  styleUrls: ['./message-list.component.css']
})
export class MessageListComponent implements OnInit {
  messages: Message[] = [
    new Message(
      '1',
      'Very Important Message',
      'This is an important message',
      'Tyler'
    ),
    new Message(
      '2',
      'Very Important Message 2',
      'This is more important message',
      'Tyler'
    ),
    new Message(
      '3',
      'Very Important Message 3',
      'This is an even more important message',
      'Tyler'
    ),
    new Message(
      '4',
      'Very Important Message 4',
      'This is the most important message',
      'Tyler'
    ),
  ]

  constructor() {
  }

  ngOnInit(): void {
  }

  onAddMessage(message: Message) {
    this.messages.push(message);
  }

}
