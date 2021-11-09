import {Injectable} from '@angular/core';
import {Message} from "./message.model";
import {MOCKMESSAGES} from "./MOCKMESSAGES";
import {Subject} from "rxjs";

@Injectable({
	providedIn: 'root'
})
export class MessageService {
	messages: Message[] = [];
	messageSelected = new Subject<Message>();
	messageChangedEvent = new Subject<Message[]>();

	constructor() {
		this.messages = MOCKMESSAGES;
	}

	getMessages(): Message[] {
		return this.messages.slice();
	}

	getMessage(id: string): Message {
		return this.messages.find(message => message.id == id);
	}

	addMessage(message: Message) {
		this.messages.push(message);
		this.messageChangedEvent.next(this.messages.slice());
	}
}
