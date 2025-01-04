export interface IUser{
  name: string;
  mobileNumber: number;
  address: string;
  postCount: number;
  incrementPostCount: () => Promise<void>;
}
