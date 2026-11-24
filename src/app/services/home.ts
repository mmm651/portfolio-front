import { environment } from '../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HomeData, UpdateHomePayload } from '../core/models/home';

@Injectable({
  providedIn: 'root',
})
export class HomeService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/home`;

  getHome(): Observable<HomeData> {
    return this.http.get<HomeData>(this.apiUrl);
  }

  updateHome(payload: UpdateHomePayload): Observable<{ message: string; data: HomeData }> {
    return this.http.patch<{ message: string; data: HomeData }>(this.apiUrl, payload);
  }
}
