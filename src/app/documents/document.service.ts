import {EventEmitter, Injectable} from '@angular/core';
import { MOCKDOCUMENTS } from "./MOCKDOCUMENTS";
import { Document } from "./document.model";

@Injectable({
  providedIn: 'root'
})
export class DocumentService {
	documents: Document[] = [];
	documentSelected = new EventEmitter<Document>();

  constructor() {
		this.documents = MOCKDOCUMENTS;
	}

	getDocuments(): Document[] {
		return this.documents.slice();
	}

	getDocument(id: string): Document {
		return this.documents.find(document => document.id == id);
	}
}
