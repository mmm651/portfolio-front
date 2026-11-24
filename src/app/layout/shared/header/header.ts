import { Component, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { ThemeService } from '../../../services/theme';
import { ViewKey } from '../../../core/site-defaults';

interface NavItem {
  key: ViewKey;
  path: string;
  fallback: string;
}

@Component({
  selector: 'app-header',
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './header.css',
  templateUrl: './header.html',
})
export class Header {
  private theme = inject(ThemeService);
  private brandData = toSignal(this.theme.brand$, { initialValue: undefined });

  menuOpen = signal(false);

  brandTitle = computed(() => this.brandData()?.brandTitle || 'mirror-house');

  private items: NavItem[] = [
    { key: 'home', path: '/home', fallback: 'Home' },
    { key: 'about', path: '/about', fallback: 'About Us' },
    { key: 'contact', path: '/contact', fallback: 'Contact Us' },
    { key: 'services', path: '/services', fallback: 'Our Services' },
    { key: 'clients', path: '/clients', fallback: 'Our Clients' },
  ];

  navItems = computed(() => {
    const titles = this.brandData()?.navBubbleTitles ?? {};
    return this.items.map((i) => ({ path: i.path, label: titles[i.key] || i.fallback }));
  });

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
  }

  closeMenu(): void {
    this.menuOpen.set(false);
  }
}
