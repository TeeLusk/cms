import {Component, Input, OnInit} from '@angular/core';

import {Message} from '../message.model';
import {ContactService} from "../../contacts/contact.service";
import {Contact} from "../../contacts/contact.model";

@Component({
	selector: 'cms-message-item',
	templateUrl: './message-item.component.html',
	styleUrls: ['./message-item.component.css']
})
export class MessageItemComponent implements OnInit {
	@Input() message: Message;
	messageSender: Contact;
	contact;

	constructor(private contactService: ContactService) {
	}

	ngOnInit() {
		this.contactService.getContact('107')
			.subscribe(
				response => {
					this.contact = response.contact;
					this.messageSender = this.contact;
				}
			)

	}
}
