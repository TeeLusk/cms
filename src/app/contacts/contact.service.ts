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

	getContacts() {
		this.client.get<Contact[]>(
			'https://wdd-430-cms-10db2-default-rtdb.firebaseio.com/contacts.json'
		).subscribe(
			(contacts: Contact[]) => {
				this.contacts = contacts;
				this.maxContactId = this.getMaxId();
				this.contacts.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
				this.contactListChangedEvent.next(this.contacts.slice());
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
		const pos = this.contacts.indexOf(contact);
		if (pos < 0) {
			return;
		}
		this.contacts.splice(pos, 1);
		// this.contactListChangedEvent.next(this.contacts.slice());
		this.storeContacts();
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

	addContact(newContact: Contact) {
		if (!newContact) {
			return
		}
		this.maxContactId++;
		newContact.id = String(this.maxContactId);
		this.contacts.push(newContact);
		let contactsListClone = this.contacts.slice();
		// this.contactListChangedEvent.next(contactsListClone);
		this.storeContacts();
	}

	updateContact(originalContact: Contact, newContact: Contact) {
		if (!originalContact || !newContact) {
			return;
		}

		let pos = this.contacts.indexOf(originalContact);
		if (pos < 0) {
			return
		}

		newContact.id = originalContact.id;
		this.contacts[pos] = newContact;
		let contactsListClone = this.contacts.slice();
		this.storeContacts();
	}

	storeContacts() {
		let contacts = JSON.stringify(this.contacts);
		const headers = new HttpHeaders({'Content-Type': 'application/json'});
		this.client.put('https://wdd-430-cms-10db2-default-rtdb.firebaseio.com/contacts.json', contacts
			, {headers: headers})
			.subscribe(
				() => {
					this.contactListChangedEvent.next(this.contacts.slice());
				}
			)
	}
}
