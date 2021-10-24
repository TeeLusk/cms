import {EventEmitter, Injectable, OnInit} from '@angular/core';
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";
import { Document } from "./document.model";
import {Message} from "../messages/message.model";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
	documents: Document[] = [];
	documentSelected = new EventEmitter<Document>();
	documentChangedEvent = new EventEmitter<Document[]>();

  constructor() {
		this.documents = MOCKDOCUMENTS;
	}

	getDocuments(): Document[] {
		return this.documents.slice();
	}

	getDocument(id: string): Document {
		return this.documents.find(document => document.id == id);
	}

	deleteDocument(document: Document) {
		if (!document) {
			return;
		}
		const pos = this.documents.indexOf(document);
		if (pos < 0) {
			return;
		}
		this.documents.splice(pos,1);
		this.documentChangedEvent.emit(this.documents.slice());
	}
}
