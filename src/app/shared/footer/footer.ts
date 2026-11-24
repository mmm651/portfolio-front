import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { FOOTER_TAGLINE, ViewKey } from '../../core/site-defaults';
import { OrbitService } from '../../services/orbit';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-footer',
  imports: [RouterLink],
  styleUrl: './footer.css',
  templateUrl: './footer.html',
})
export class Footer {
  private theme = inject(ThemeService);
  orbit = inject(OrbitService);

  private brandData = toSignal(this.theme.brand$, { initialValue: undefined });

  brandTitle = computed(() => this.brandData()?.brandTitle || 'mirror-house');
  tagline = FOOTER_TAGLINE;
  currentYear = new Date().getFullYear();

  private items: { key: ViewKey; path: string; fallback: string }[] = [
    { key: 'home', path: '/home', fallback: 'Home' },
    { key: 'about', path: '/about', fallback: 'About Us' },
    { key: 'services', path: '/services', fallback: 'Our Services' },
    { key: 'clients', path: '/clients', fallback: 'Our Clients' },
    { key: 'contact', path: '/contact', fallback: 'Contact Us' },
  ];

  navItems = computed(() => {
    const titles = this.brandData()?.navBubbleTitles ?? {};
    return this.items.map((i) => ({ path: i.path, label: titles[i.key] || i.fallback }));
  });
}
