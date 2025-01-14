export interface IUser {
  userId: string;
  lastName: string;
  firstName: string;
  roles: { title: string; name: string }[];
  phone: string;
}
