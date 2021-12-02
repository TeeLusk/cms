import {Component, OnInit} from '@angular/core';

import {Contact} from '../contact.model';
import {ContactService} from "../contact.service";
import {ActivatedRoute, Params, Router} from "@angular/router";
import {WindRefService} from "../../wind-ref.service";

@Component({
	selector: 'cms-contact-detail',
	templateUrl: './contact-detail.component.html',
	styleUrls: ['./contact-detail.component.css']
})
export class ContactDetailComponent implements OnInit {
	contact: Contact;

	constructor(private contactService: ContactService,
							private router: Router,
							private route: ActivatedRoute,
							private windRefService: WindRefService) {
	}

	ngOnInit() {
		this.route.params
			.subscribe(
				(params: Params) => {
					this.contactService.getContact(params['id'])
						.subscribe(
							response => {
								this.contact = response.contact;
							}
						)
				}
			)
	}

	onDelete() {
		this.contactService.deleteContact(this.contact);
		this.router.navigateByUrl('contacts');
	}
}
