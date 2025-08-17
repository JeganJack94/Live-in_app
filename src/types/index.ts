export interface Transaction {
  id: string;
  amount: string;
  category: string;
  item: string;
  partner: string;
  addedBy: {
    uid: string;
    name?: string;
  };
  desc: string;
  timestamp: number;
}
