import { environment } from '../../environments/environment';
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  AboutData,
  AboutStat,
  UpdateAboutPayload,
  UpdateStatPayload,
} from '../core/models/about';

@Injectable({
  providedIn: 'root',
})
export class AboutService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/about`;

  getAbout(): Observable<AboutData> {
    return this.http.get<AboutData>(this.apiUrl);
  }

  updateAbout(payload: UpdateAboutPayload): Observable<{ message: string; data: AboutData }> {
    return this.http.patch<{ message: string; data: AboutData }>(this.apiUrl, payload);
  }

  updateStat(
    statId: number,
    payload: UpdateStatPayload
  ): Observable<{ message: string; stat: AboutStat }> {
    return this.http.patch<{ message: string; stat: AboutStat }>(
      `${this.apiUrl}/stats/${statId}`,
      payload
    );
  }
}
