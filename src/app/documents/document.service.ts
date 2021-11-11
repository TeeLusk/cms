import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Subject} from "rxjs";
import {Document} from "./document.model";

@Injectable({
	providedIn: 'root'
})
export class DocumentService {
	documents: Document[] = [];
	documentSelected = new Subject<Document>();
	documentListChangedEvent = new Subject<Document[]>();
	maxDocumentId: number;

	constructor(private client: HttpClient) {
		// this.documents = MOCKDOCUMENTS;
		this.maxDocumentId = this.getMaxId();
	}

	getDocuments() {
		this.client.get<Document[]>(
			'https://wdd-430-cms-10db2-default-rtdb.firebaseio.com/documents.json'
		).subscribe(
			// success method
			(documents: Document[]) => {
				this.documents = documents;
				this.maxDocumentId = this.getMaxId();
				this.documents.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
				this.documentListChangedEvent.next(this.documents.slice());
			},
			// error method
			(error: any) => {
				console.log(error);
			}
		);
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

		this.documents.splice(pos, 1);
		// this.documentListChangedEvent.next(this.documents.slice());
		this.storeDocuments();
	}

	getMaxId(): number {
		let maxId = 0;

		this.documents.forEach(document => {
			let currentId = parseInt(document.id);
			if (currentId > maxId) {
				maxId = currentId
			}
		})
		return maxId;
	}

	addDocument(newDocument: Document) {
		if (!newDocument) {
			return
		}
		this.maxDocumentId++;
		newDocument.id = String(this.maxDocumentId);
		this.documents.push(newDocument);
		let documentsListClone = this.documents.slice();
		// this.documentListChangedEvent.next(documentsListClone)
		this.storeDocuments();
	}

	updateDocument(originalDocument: Document, newDocument: Document) {
		if (!originalDocument || !newDocument) {
			return
		}

		let pos = this.documents.indexOf(originalDocument);
		if (pos < 0) {
			return
		}

		newDocument.id = originalDocument.id;
		this.documents[pos] = newDocument;
		let documentsListClone = this.documents.slice();
		this.storeDocuments();
	}

	storeDocuments() {
		let documents = JSON.stringify(this.documents)

		const headers = new HttpHeaders({'Content-Type': 'application/json'});

		this.client.put('https://wdd-430-cms-10db2-default-rtdb.firebaseio.com/documents.json', documents
			, {headers: headers})
			.subscribe(
				() => {
					this.documentListChangedEvent.next(this.documents.slice());
				}
			);
	}
}
