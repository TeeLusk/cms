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
		this.maxDocumentId = this.getMaxId();
	}

	sortAndSend() {
		this.documents.sort((a, b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
		this.documentListChangedEvent.next(this.documents.slice());
	}

	getDocuments() {
		this.client.get<{ message: string, documents: Document[] }>(
			'http://localhost:3000/documents'
		).subscribe(
			// success method
			(responseData) => {
				this.documents = responseData.documents;
				this.sortAndSend();
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

		const pos = this.documents.findIndex(d => d.id === document.id);

		if (pos < 0) {
			return;
		}

		// delete from database
		this.client.delete('http://localhost:3000/documents/' + document.id)
			.subscribe(
				(response: Response) => {
					this.documents.splice(pos, 1);
					this.sortAndSend();
				}
			);
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

	addDocument(document: Document) {
		if (!document) {
			return;
		}
		// make sure id of the new Document is empty
		document.id = '';
		const headers = new HttpHeaders({'Content-Type': 'application/json'});
		// add to database
		this.client.post<{ message: string, document: Document }>('http://localhost:3000/documents',
			document,
			{headers: headers})
			.subscribe(
				(responseData) => {
					// add new document to documents
					this.documents.push(responseData.document);
					this.sortAndSend();
				}
			);
	}

	updateDocument(originalDocument: Document, newDocument: Document) {
		if (!originalDocument || !newDocument) {
			return;
		}
		const pos = this.documents.findIndex(d => d.id === originalDocument.id);
		if (pos < 0) {
			return;
		}
		// set the id of the new Document to the id of the old Document
		newDocument.id = originalDocument.id;
		// newDocument._id = originalDocument._id;
		const headers = new HttpHeaders({'Content-Type': 'application/json'});
		// update database
		this.client.put('http://localhost:3000/documents/' + originalDocument.id,
			newDocument, {headers: headers})
			.subscribe(
				(response: Response) => {
					this.documents[pos] = newDocument;
					this.sortAndSend();
				}
			);
	};

	// storeDocuments() {
	// 	let documents = JSON.stringify(this.documents)
	// 	const headers = new HttpHeaders({'Content-Type': 'application/json'});
	// 	this.client.put('http://localhost:3000/documents', documents
	// 		, {headers: headers})
	// 		.subscribe(
	// 			() => {
	// 				this.documentListChangedEvent.next(this.documents.slice());
	// 			}
	// 		);
	// }
}
