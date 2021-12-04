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

	constructor(private client: HttpClient) {
	}

	sortAndSend() {
		this.contacts.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
		this.contactListChangedEvent.next(this.contacts.slice());
	}

	getContacts() {
		this.client.get<{ message: string, contacts: Contact[] }>(
			'http://localhost:3000/contacts'
		).subscribe(
			(responseData) => {
				this.contacts = responseData.contacts;
				this.sortAndSend()
			},
			(error: any) => {
				console.log(error);
			}
		)
	}

	getContact(id: string) {
		return this.client.get<{ message: string, contact: Contact }>('http://localhost:3000/contacts/' + id);
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
		console.log("PUT REQ", "ID", originalContact.id, "New Contact Object", newContact)
		this.client.put('http://localhost:3000/contacts/' + originalContact.id,
			newContact, {headers: headers})
			.subscribe(
				(response: Response) => {
					this.contacts[pos] = newContact;
					this.sortAndSend();
				}
			);
	}

}
