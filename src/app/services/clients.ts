import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Injectable,inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ClientCard, ClientsData, UpdateClientCardPayload, UpdateClientsPayload } from '../core/models/clients';

@Injectable({
  providedIn:'root',
})


export class Clients {
  private http = inject(HttpClient);
  private apiUrl= `${environment.apiUrl}/clients`;


getClients():Observable<ClientsData>{
  return this.http.get<ClientsData>(this.apiUrl);
}

updateClients(payload: UpdateClientsPayload): Observable<{ message: string; data: ClientsData }> {
  return this.http.patch<{ message: string; data: ClientsData }>(this.apiUrl, payload);
}

updateClientCard( clientId:number,
  payload:UpdateClientCardPayload): Observable<{message:string; client:ClientCard}>{
    return this.http.patch<{message:string; client:ClientCard}>(`${this.apiUrl}/card/${clientId}`,payload);


}
}
