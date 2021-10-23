import {Component, OnInit} from '@angular/core';
import {Document} from "../document.model";
import {DocumentService} from "../document.service";
import {ActivatedRoute, Params, Router} from "@angular/router";

@Component({
	selector: 'cms-document-detail',
	templateUrl: './document-detail.component.html',
	styleUrls: ['./document-detail.component.css']
})
export class DocumentDetailComponent implements OnInit {
	document: Document;

	constructor(private documentService: DocumentService,
							private router: Router,
							private route: ActivatedRoute) {
	}

	ngOnInit() {
		this.route.params
			.subscribe(
				(params: Params) => {
					this.document = this.documentService.getDocument(params['id']);
				}
			)
	}

}
