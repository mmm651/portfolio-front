import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface NavBubbleTitles {
  home?: string;
  about?: string;
  contact?: string;
  services?: string;
  clients?: string;
}

export interface ThemeData {
  brandTitle?: string;
  italicSerifStyle?: boolean;
  centerpieceTitleScale?: number;
  navBubbleTitles?: NavBubbleTitles;
}

export interface OrbData {
  ambientOrbsImages?: string[];
}

const DEFAULT_THEME: ThemeData = {
  brandTitle: 'mirror-house',
  italicSerifStyle: true,
  centerpieceTitleScale: 1,
  navBubbleTitles: {
    home: 'Home',
    about: 'About Us',
    contact: 'Contact Us',
    services: 'Our Services',
    clients: 'Our Clients',
  },
};

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private http = inject(HttpClient);
  private brandUrl = `${environment.apiUrl}/brand`;
  private orbsUrl = `${environment.apiUrl}/orbs`;

  private brandSubject = new BehaviorSubject<ThemeData>(DEFAULT_THEME);
  private orbsSubject = new BehaviorSubject<OrbData>({ ambientOrbsImages: [] });

  brand$ = this.brandSubject.asObservable();
  orbs$ = this.orbsSubject.asObservable();

  get brandSnapshot(): ThemeData {
    return this.brandSubject.value;
  }

  get orbsSnapshot(): OrbData {
    return this.orbsSubject.value;
  }

  private merge(base: ThemeData, raw: ThemeData): ThemeData {
    return {
      ...base,
      ...raw,
      navBubbleTitles: { ...base.navBubbleTitles, ...(raw.navBubbleTitles ?? {}) },
    };
  }

  fetchBrand(): Observable<any> {
    return this.http.get<any>(this.brandUrl).pipe(
      tap((res) => this.brandSubject.next(this.merge(DEFAULT_THEME, res?.data ?? res ?? {}))),
    );
  }

  updateBrand(payload: ThemeData): Observable<any> {
    return this.http.patch<any>(this.brandUrl, payload).pipe(
      tap((res) =>
        this.brandSubject.next(this.merge(this.brandSubject.value, res?.data ?? res ?? payload)),
      ),
    );
  }

  fetchOrbs(): Observable<any> {
    return this.http.get<any>(this.orbsUrl).pipe(
      tap((res) => this.setOrbs((res?.data ?? res)?.ambientOrbsImages)),
    );
  }

  /** POST /api/orbs  { imageUrl } */
  addOrb(imageUrl: string): Observable<any> {
    return this.http
      .post<any>(this.orbsUrl, { imageUrl })
      .pipe(tap((res) => this.setOrbs(res?.ambientOrbsImages)));
  }

  /** DELETE /api/orbs  { imageUrl } */
  removeOrb(imageUrl: string): Observable<any> {
    return this.http
      .delete<any>(this.orbsUrl, { body: { imageUrl } })
      .pipe(tap((res) => this.setOrbs(res?.ambientOrbsImages)));
  }

  private setOrbs(images: unknown): void {
    this.orbsSubject.next({ ambientOrbsImages: Array.isArray(images) ? images : [] });
  }
}
