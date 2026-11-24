export interface ClientCard {
  id: number;
  name:string;
  category:string;
}

export interface ClientTestimonial {
  quote: string;
  author: string;
}

export interface ClientsData {
  _id?: string;
  sectionTag: string;
  trustedLabel: string;
  title: string;
  clientsList: ClientCard[];
  testimonial: ClientTestimonial;
}
export type UpdateClientsPayload = Partial<ClientsData>;
export type UpdateClientCardPayload = Partial<ClientCard>;
