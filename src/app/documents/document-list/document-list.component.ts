import { Component, OnInit, EventEmitter, Output } from '@angular/core';

import { Document } from "../document.model";

@Component({
  selector: 'cms-document-list',
  templateUrl: './document-list.component.html',
  styleUrls: ['./document-list.component.css']
})
export class DocumentListComponent implements OnInit {
  @Output() documentWasSelected = new EventEmitter<Document>();
  documents: Document[] = [
    new Document(
      '1',
      'Document1',
      'Document containing important things',
      'https://exampledoc.com',
      []
    ),
    new Document(
      '2',
      'Document2',
      'Document containing important things',
      'https://exampledoc.com',
      []
    ),
    new Document(
      '3',
      'Document3',
      'Document containing important things',
      'https://exampledoc.com',
      []
    ),
    new Document(
      '4',
      'Document4',
      'Document containing important things',
      'https://exampledoc.com',
      []
    ),
  ]

  constructor() { }

  ngOnInit(){
  }

  onDocumentSelected(document: Document) {
    this.documentWasSelected.emit(document);
  }

}
