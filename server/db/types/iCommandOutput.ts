import {
  DeleteCommandOutput,
  GetCommandOutput,
  PutCommandOutput,
  QueryCommandOutput,
  ScanCommandOutput,
  UpdateCommandOutput,
} from "@aws-sdk/lib-dynamodb";

export type IScanCommandOutput<T> = Omit<ScanCommandOutput, "Items"> & {
  Items?: T[];
};

export type IQueryCommandOutput<T> = Omit<QueryCommandOutput, "Items"> & {
  Items?: T[];
};

export type IGetCommandOutput<T> = Omit<GetCommandOutput, "Item"> & {
  Item?: T;
};

export type IPutCommandOutput<T> = Omit<PutCommandOutput, "Attributes"> & {
  Attributes?: T;
};

export type IDeleteCommandOutput<T> = Omit<
  DeleteCommandOutput,
  "Attributes"
> & {
  Attributes?: T;
};

export type IUpdateCommandOutput<T> = Omit<
  UpdateCommandOutput,
  "Attributes"
> & {
  Attributes?: T;
};
