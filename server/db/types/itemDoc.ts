export interface ItemDoc {
  itemId: string;
  userId: string;
  accessToken: string;
  needsAttention?: boolean;
  createdTimestamp: Date;
  institutionId: string;
  institutionName: string;
  cursor?: string;
}
