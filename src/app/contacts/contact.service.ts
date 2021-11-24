import {Subject} from "rxjs";

import {Injectable} from '@angular/core';
import {Contact} from './contact.model';
import {HttpClient, HttpHeaders} from "@angular/common/http";

@Injectable({
	providedIn: 'root'
})
export class ContactService {
	contacts: Contact [] = [];
	contactSelected = new Subject<Contact>();
	contactListChangedEvent = new Subject<Contact[]>();
	maxContactId: number;

	constructor(private client: HttpClient) {
		// this.contacts = MOCKCONTACTS;
	}

	sortAndSend() {
		this.contacts.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
		this.contactListChangedEvent.next(this.contacts.slice());
	}

	getContacts() {
		this.client.get<Contact[]>(
			'http://localhost:3000/contacts'
		).subscribe(
			(contacts: Contact[]) => {
				this.contacts = contacts;
				this.maxContactId = this.getMaxId();
				this.sortAndSend()
			},
			(error: any) => {
				console.log(error);
			}
		)
	}

	getContact(id: string): Contact {
		return this.contacts.find(contact => contact.id == id);
	}

	deleteContact(contact: Contact) {
		if (!contact) {
			return;
		}
		const pos = this.contacts.findIndex(c => c.id === contact.id);

		if (pos < 0) {
			return;
		}

		this.client.delete('http://localhost:3000/contacts/' + contact.id)
			.subscribe(
				(response: Response) => {
					this.contacts.splice(pos, 1);
					this.sortAndSend();
				}
			)

	}

	getMaxId(): number {
		let maxId = 0;
		this.contacts.forEach(contact => {
			let currentId = parseInt(contact.id);
			if (currentId > maxId) {
				maxId = currentId
			}
		})
		return maxId;
	}

	addContact(contact: Contact) {
		if (!contact) {
			return;
		}

		// make sure id of the new Document is empty
		contact.id = '';

		const headers = new HttpHeaders({'Content-Type': 'application/json'});

		// add to database
		this.client.post<{ message: string, contact: Contact }>('http://localhost:3000/contacts',
			contact,
			{headers: headers})
			.subscribe(
				(responseData) => {
					// add new contact to contacts
					this.contacts.push(responseData.contact);
					this.sortAndSend();
				}
			);
	}

	updateContact(originalContact: Contact, newContact: Contact) {
		if (!originalContact || !newContact) {
			return;
		}

		let pos = this.contacts.findIndex(c => c.id === originalContact.id);

		if (pos < 0) {
			return
		}

		newContact.id = originalContact.id;
		const headers = new HttpHeaders({'Content-Type': 'application/json'});
		// update database
		this.client.put('http://localhost:3000/contacts/' + originalContact.id,
			newContact, {headers: headers})
			.subscribe(
				(response: Response) => {
					this.contacts[pos] = newContact;
					this.sortAndSend();
				}
			);
	}

	storeContacts() {
		let contacts = JSON.stringify(this.contacts);
		const headers = new HttpHeaders({'Content-Type': 'application/json'});
		this.client.put('http://localhost:3000/contacts', contacts
			, {headers: headers})
			.subscribe(
				() => {
					this.contactListChangedEvent.next(this.contacts.slice());
				}
			)
	}
}
