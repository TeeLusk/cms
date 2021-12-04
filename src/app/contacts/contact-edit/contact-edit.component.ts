import {Component, OnInit} from '@angular/core';
import {Contact} from "../contact.model";
import {NgForm} from "@angular/forms";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {ContactService} from "../contact.service";

@Component({
	selector: 'cms-contact-edit',
	templateUrl: './contact-edit.component.html',
	styleUrls: ['./contact-edit.component.css']
})
export class ContactEditComponent implements OnInit {
	originalContact: Contact;
	contact: Contact;
	groupContacts: Contact[] = [];
	editMode: boolean = false;
	id: string;
	msgText: string;

	constructor(private contactService: ContactService,
							private router: Router,
							private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.route.params
			.subscribe(
				(params: Params) => {
					let id = params['id'];
					if (!id) {
						this.editMode = false;
						return;
					}
					this.contactService.getContact(id)
						.subscribe(
							response => {
								this.originalContact = response.contact;
								this.contact = response.contact;
							}
						)

					if (!this.originalContact) {
						return;
					}
					this.editMode = true;
					this.contact = JSON.parse(JSON.stringify(this.originalContact));

					if (this.contact.group) {
						this.groupContacts = JSON.parse(JSON.stringify(this.contact.group));
					}
				}
			)
	}

	onSubmit(form: NgForm) {
		let value = form.value;
		let newContact = new Contact(
			value.id,
			value.name,
			value.email,
			value.phone,
			value.imageUrl,
			this.groupContacts
		);
		if (this.editMode) {
			this.contactService.updateContact(this.originalContact, newContact);
		} else {
			this.contactService.addContact(newContact);
		}
		this.router.navigateByUrl('contacts');
	}

	isInvalidContact(newContact: Contact) {
		if (!newContact) {// newContact has no value
			return true;
		}
		if (this.contact && newContact.id === this.contact.id) {
			return true;
		}
		for (let i = 0; i < this.groupContacts.length; i++) {
			if (newContact.id === this.groupContacts[i].id) {
				return true;
			}
		}
		return false;

	}

	addToGroup($event: any) {
		const selectedContact: Contact = $event.dragData;
		const invalidGroupContact = this.isInvalidContact(selectedContact);
		if (invalidGroupContact) {
			this.msgText = 'Contact cannot be added to the current group. It is already in the group or is the current contact.'
			return;
		}
		this.msgText = '';
		this.groupContacts.push(selectedContact);
		console.log("Contact Added: ", this.groupContacts)
	}


	onRemoveItem(index: number) {
		if (index < 0 || index >= this.groupContacts.length) {
			return;
		}
		this.groupContacts.splice(index, 1);
	}

	onCancel() {
		this.router.navigateByUrl('contacts');
	}
}
