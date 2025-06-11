export interface Doc<T extends string>
  extends PouchDB.Core.IdMeta,
    Partial<PouchDB.Core.RevisionIdMeta> {
  type: T;
}
