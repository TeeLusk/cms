// id, name, description, url, children
export class Document {
  constructor(
    public id: string,
    public name: string,
    public email: string,
    public phone: string,
    public imageUrl: string,
    public children: Document[]
  ) { }
}
