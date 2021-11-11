import {Injectable} from '@angular/core';
import {Message} from "./message.model";
import {Subject} from "rxjs";
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
	providedIn: 'root'
})
export class MessageService {
	messages: Message[] = [];
	messageSelected = new Subject<Message>();
	messageChangedEvent = new Subject<Message[]>();
	maxMessageId: number;

	constructor(private client: HttpClient) {
		// this.messages = MOCKMESSAGES;
		this.maxMessageId = this.getMaxId();
	}

	getMessages() {
		this.client.get<Message[]>(
			'https://wdd-430-cms-10db2-default-rtdb.firebaseio.com/messages.json'
		).subscribe(
			(messages: Message[]) => {
				this.messages = messages;
				this.maxMessageId = this.getMaxId();
				this.messages.sort((a, b) => (a.sender > b.sender) ? 1 : ((b.sender > a.sender) ? -1 : 0));
				this.messageChangedEvent.next(this.messages.slice());
			},
			(error: any) => {
				console.log(error)
			}
		);
	}

	getMessage(id: string): Message {
		return this.messages.find(message => message.id == id);
	}

	addMessage(message: Message) {
		this.messages.push(message);
		// this.messageChangedEvent.next(this.messages.slice());
		this.storeMessages();
	}

	getMaxId(): number {
		let maxId = 0;
		this.messages.forEach(m => {
			let currentId = parseInt(m.id);
			if (currentId > maxId) {
				maxId = currentId;
			}
		});
		return maxId
	}

	storeMessages() {
		let messages = JSON.stringify(this.messages)
		const headers = new HttpHeaders({'Content-Type': 'application/json'});
		this.client.put('https://wdd-430-cms-10db2-default-rtdb.firebaseio.com/messages.json'
			, messages
			, {headers: headers})
			.subscribe(
				() => {
					this.messageChangedEvent.next(this.messages.slice());
				}
			)
	}
}
