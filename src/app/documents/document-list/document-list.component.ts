import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';

import {Document} from "../document.model";
import {DocumentService} from "../document.service";
import {Subscription} from "rxjs";

@Component({
	selector: 'cms-document-list',
	templateUrl: './document-list.component.html',
	styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit, OnDestroy {
	@Output() documentWasSelected = new EventEmitter<Document>();
	documents: Document[] = [];
	private subscription: Subscription;

	constructor(private documentService: DocumentService) {
	}

	ngOnInit() {
		this.subscription = this.documentService.documentListChangedEvent
			.subscribe(
				(documents: Document[]) => {
					this.documents = documents;
				}
			);
		this.documentService.getDocuments();
	}

	ngOnDestroy() {
		this.subscription.unsubscribe();
	}
}
