import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import {Injectable,inject} from '@angular/core';
import { Observable } from 'rxjs';
import { ServiceItem, ServicesData, UpdateServicesItemPayload, UpdateServicesPayload } from '../core/models/services';
@Injectable({
  providedIn:'root'
})

export class Services {
  private http= inject(HttpClient);
  private apiUrl= `${environment.apiUrl}/services`;

getServices(): Observable<ServicesData>{
  return this.http.get<ServicesData>(this.apiUrl);
}

updateServices(payload:UpdateServicesPayload):Observable<{message:string; data:ServicesData}>{
  return this.http.patch<{message:string; data:ServicesData}>(this.apiUrl,payload);
}

updateServicesItem(serviceId: number,payload: UpdateServicesItemPayload): Observable<{ message: string; service: ServiceItem }> {
  return this.http.patch<{ message: string; service: ServiceItem }>(`${this.apiUrl}/item/${serviceId}`,payload);
}

}
