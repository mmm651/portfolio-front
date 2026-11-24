export interface HomeData {
  _id?: string;
  tag:string;
  title:string;
  subtitle: string;
}
export type UpdateHomePayload = Partial<HomeData>;
