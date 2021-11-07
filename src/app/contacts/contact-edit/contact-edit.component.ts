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
					this.originalContact = this.contactService.getContact(id);

					if (!this.originalContact) {
						return;
					}
					this.editMode = true;
					this.contact = JSON.parse(JSON.stringify(this.originalContact))
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
			[]
		);
		if (this.editMode) {
			this.contactService.updateContact(this.originalContact, newContact);
		} else {
			this.contactService.addContact(newContact);
		}
		this.router.navigateByUrl('contacts');
	}

	onRemoveItem(item: any) {

	}

	onCancel() {

	}

}
