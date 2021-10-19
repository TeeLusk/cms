import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Message} from "../message.model";
import {MessageService} from "../message.service";

@Component({
  selector: 'cms-message-edit',
  templateUrl: './message-edit.component.html',
  styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
  @ViewChild('subject', { static: false }) subjectInputRef: ElementRef;
  @ViewChild('message', { static: false }) messageInputRef: ElementRef;
  @Output() messageAdded = new EventEmitter<Message>();

  constructor(private messageService: MessageService) { }

  ngOnInit() {
  }

  onSendMessage() {
    const currentSender = '7';
    const msgSubject = this.subjectInputRef.nativeElement.value;
    const msgText = this.messageInputRef.nativeElement.value;
    const newMessage = new Message(
      '2',
      msgSubject,
      msgText,
      currentSender);
    this.messageService.addMessage(newMessage);
		this.onClear()
  }

  onClear() {
    this.subjectInputRef.nativeElement.value = '';
    this.messageInputRef.nativeElement.value = '';
  }

}
