import { environment } from '../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  ContactMessage,
  CreateContactPayload,
  CreateContactResponse,
} from '../core/models/contact';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/contact`;

  getMessages(): Observable<ContactMessage[]> {
    return this.http.get<ContactMessage[]>(this.apiUrl);
  }

  deleteMessage(id: string): Observable<{ message: string }> {
  return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
}
  sendMessage(payload: CreateContactPayload): Observable<CreateContactResponse> {
    return this.http.post<CreateContactResponse>(this.apiUrl, payload);
  }
}
