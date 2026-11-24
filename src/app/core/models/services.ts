export interface ServiceItem {
  _id?: string;
  id?: number;
  category?: string;
  title: string;
  description?: string;
  features?: string[];
}

export interface ServicesData {
  _id?: string;
  sectionTag: string;
  title: string;
  servicesList: ServiceItem[];
}

export type UpdateServicesItemPayload = Partial<ServiceItem>;

export interface UpdateServicesPayload {
  sectionTag?: string;
  title?: string;
  servicesList?: ServiceItem[];
}
