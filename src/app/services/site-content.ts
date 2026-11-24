import { Injectable, inject, signal } from '@angular/core';
import { catchError, forkJoin, of } from 'rxjs';
import { AboutData } from '../core/models/about';
import { ClientsData } from '../core/models/clients';
import { HomeData } from '../core/models/home';
import { ServicesData } from '../core/models/services';
import {
  DEFAULT_ABOUT,
  DEFAULT_CLIENTS,
  DEFAULT_HOME,
  DEFAULT_SERVICES,
} from '../core/site-defaults';
import { AboutService } from './about';
import { Clients } from './clients';
import { HomeService } from './home';
import { Services } from './services';

/** Drop null / undefined / empty-string / empty-array fields so they never overwrite a default. */
function clean<T extends object>(raw: unknown): Partial<T> {
  const src = (raw as any)?.data ?? raw;
  if (!src || typeof src !== 'object' || Array.isArray(src)) return {};
  const out: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(src)) {
    if (value === null || value === undefined || value === '') continue;
    if (Array.isArray(value) && value.length === 0) continue;
    out[key] = value;
  }
  return out as Partial<T>;
}

/**
 * Single source of content for the public pages.
 * Starts with the built-in copy, then merges whatever the API returns on top.
 */
@Injectable({ providedIn: 'root' })
export class SiteContentService {
  private homeApi = inject(HomeService);
  private aboutApi = inject(AboutService);
  private servicesApi = inject(Services);
  private clientsApi = inject(Clients);

  readonly home = signal<HomeData>(DEFAULT_HOME);
  readonly about = signal<AboutData>(DEFAULT_ABOUT);
  readonly services = signal<ServicesData>(DEFAULT_SERVICES);
  readonly clients = signal<ClientsData>(DEFAULT_CLIENTS);
  readonly isLive = signal(false);

  private loaded = false;

  load(force = false): void {
    if (this.loaded && !force) return;
    this.loaded = true;

    forkJoin({
      home: this.homeApi.getHome().pipe(catchError(() => of(null))),
      about: this.aboutApi.getAbout().pipe(catchError(() => of(null))),
      services: this.servicesApi.getServices().pipe(catchError(() => of(null))),
      clients: this.clientsApi.getClients().pipe(catchError(() => of(null))),
    }).subscribe((res) => {
      this.home.set({ ...DEFAULT_HOME, ...clean<HomeData>(res.home) });
      this.about.set({ ...DEFAULT_ABOUT, ...clean<AboutData>(res.about) });
      this.services.set({ ...DEFAULT_SERVICES, ...clean<ServicesData>(res.services) });
      this.clients.set({ ...DEFAULT_CLIENTS, ...clean<ClientsData>(res.clients) });
      this.isLive.set(Object.values(res).some((v) => v !== null));
    });
  }
}
