export interface ContactMessage {
  _id?: string;
  name: string;
  email: string;
  projectVision: string;
  date?: string | Date;
}

export interface CreateContactPayload {
  name: string;
  email: string;
  projectVision: string;
}

export interface CreateContactResponse {
  success: boolean;
  message: string;
  data: ContactMessage; 
}
