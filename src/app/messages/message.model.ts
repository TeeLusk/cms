/*
id - the id of the message

subject - the subject of the message

msgText - the text of the message

sender - the sender of the message

*/

import {Contact} from "../contacts/contact.model";

export class Message {
	constructor(
		public _id: string,
		public id: string,
		public subject: string,
		public msgText: string,
		public sender: Contact
	) {
	}
}
