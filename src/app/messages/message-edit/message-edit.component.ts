import {Component, ElementRef, EventEmitter, OnInit, Output, ViewChild} from '@angular/core';
import {Message} from "../message.model";
import {MessageService} from "../message.service";
import {Contact} from "../../contacts/contact.model";
import {ContactService} from "../../contacts/contact.service";

@Component({
	selector: 'cms-message-edit',
	templateUrl: './message-edit.component.html',
	styleUrls: ['./message-edit.component.css']
})
export class MessageEditComponent implements OnInit {
	@ViewChild('subject', {static: false}) subjectInputRef: ElementRef;
	@ViewChild('msgText', {static: false}) messageInputRef: ElementRef;
	@Output() messageAdded = new EventEmitter<Message>();
	currentSender: Contact;

	constructor(private messageService: MessageService,
							private contactService: ContactService) {
	}

	ngOnInit() {
		this.contactService.getContact('107')
			.subscribe(
				response => {
					this.currentSender = response.contact;
				}
			)
	}

	onSendMessage() {
		const msgSubject = this.subjectInputRef.nativeElement.value;
		const msgText = this.messageInputRef.nativeElement.value;
		const newMessage = new Message(
			'',
			'',
			msgSubject,
			msgText,
			this.currentSender);
		this.messageService.addMessage(newMessage);
		this.onClear()
	}

	onClear() {
		this.subjectInputRef.nativeElement.value = '';
		this.messageInputRef.nativeElement.value = '';
	}

}
