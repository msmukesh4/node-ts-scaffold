import {Connection, Document, Model, Schema} from "mongoose";

export class BaseModel<T> {
	private readonly _model: Model<any>;

	constructor (
		public connection: Connection,
		public id: string,
		public schema: Schema
	) {
		this._model = this.connection.model<any>(this.id, this.schema);
	}

	getModel (): Model<any> {
		return this._model;
	}
}