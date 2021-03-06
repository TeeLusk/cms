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

	constructor(private client: HttpClient) {
	}

	sortAndSend() {
		this.messages.sort((a, b) => (a.sender > b.sender) ? 1 : ((b.sender > a.sender) ? -1 : 0));
		this.messageChangedEvent.next(this.messages.slice());
	}

	getMessages() {
		this.client.get<{ message: string, messages: Message[] }>(
			'http://localhost:3000/messages'
		).subscribe(
			(responseBody) => {
				this.messages = responseBody.messages;
				this.sortAndSend()
			},
			(error: any) => {
				console.log(error)
			}
		);
	}

	// getMessage(id: string): Message {
	// 	return this.messages.find(message => message.id == id);
	// }

	addMessage(message: Message) {
		if (!message) {
			return;
		}
		message.id = '';
		const headers = new HttpHeaders({'Content-Type': 'application/json'});
		this.client.post<{ message: string, messageObj: Message }>('http://localhost:3000/messages',
			message,
			{headers: headers})
			.subscribe(
				(responseData) => {
					message._id = responseData.messageObj._id;
					this.messages.push(responseData.messageObj);
					this.sortAndSend();
				}
			);
	}
	
	// getMaxId(): number {
	// 	let maxId = 0;
	// 	this.messages.forEach(m => {
	// 		let currentId = parseInt(m.id);
	// 		if (currentId > maxId) {
	// 			maxId = currentId;
	// 		}
	// 	});
	// 	return maxId
	// }

	// storeMessages() {
	// 	let messages = JSON.stringify(this.messages)
	// 	const headers = new HttpHeaders({'Content-Type': 'application/json'});
	// 	this.client.put('http://localhost:3000/messages'
	// 		, messages
	// 		, {headers: headers})
	// 		.subscribe(
	// 			() => {
	// 				this.messageChangedEvent.next(this.messages.slice());
	// 			}
	// 		)
	// }
}
