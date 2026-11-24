import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { apiError } from '../../core/api';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-dashboard-brand',
  imports: [FormsModule],
  templateUrl: './brand.html',
})
export class DashboardBrand implements OnInit {
  private theme = inject(ThemeService);

  form = {
    brandTitle: '',
    italicSerifStyle: true,
    centerpieceTitleScale: 1,
    navBubbleTitles: { home: '', about: '', contact: '', services: '', clients: '' },
  };
  navFields: { key: 'home' | 'about' | 'contact' | 'services' | 'clients'; label: string }[] = [
    { key: 'home', label: 'Home' },
    { key: 'about', label: 'About' },
    { key: 'contact', label: 'Contact' },
    { key: 'services', label: 'Services' },
    { key: 'clients', label: 'Clients' },
  ];

  orbs = signal<string[]>([]);
  newOrb = '';

  loading = signal(true);
  saving = signal(false);
  message = signal('');
  error = signal('');

  ngOnInit(): void {
    this.theme.fetchBrand().subscribe({
      next: () => {
        const b = this.theme.brandSnapshot;
        this.form = {
          brandTitle: b.brandTitle ?? '',
          italicSerifStyle: b.italicSerifStyle !== false,
          centerpieceTitleScale: Number(b.centerpieceTitleScale) || 1,
          navBubbleTitles: {
            home: b.navBubbleTitles?.home ?? '',
            about: b.navBubbleTitles?.about ?? '',
            contact: b.navBubbleTitles?.contact ?? '',
            services: b.navBubbleTitles?.services ?? '',
            clients: b.navBubbleTitles?.clients ?? '',
          },
        };
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(apiError(e, 'Failed to load brand settings.'));
        this.loading.set(false);
      },
    });
    this.theme.fetchOrbs().subscribe({
      next: () => this.orbs.set(this.theme.orbsSnapshot.ambientOrbsImages ?? []),
      error: () => {},
    });
  }

  save(): void {
    this.saving.set(true);
    this.message.set('');
    this.error.set('');
    this.theme.updateBrand(this.form).subscribe({
      next: () => {
        this.saving.set(false);
        this.message.set('Brand & navigation saved.');
      },
      error: (e) => {
        this.saving.set(false);
        this.error.set(apiError(e, 'Failed to save brand settings.'));
      },
    });
  }

  addOrb(): void {
    const url = this.newOrb.trim();
    if (!url) return;
    this.theme.addOrb(url).subscribe({
      next: () => {
        this.orbs.set(this.theme.orbsSnapshot.ambientOrbsImages ?? []);
        this.newOrb = '';
      },
      error: (e) => this.error.set(apiError(e, 'Failed to add image.')),
    });
  }

  removeOrb(url: string): void {
    this.theme.removeOrb(url).subscribe({
      next: () => this.orbs.set(this.theme.orbsSnapshot.ambientOrbsImages ?? []),
      error: (e) => this.error.set(apiError(e, 'Failed to remove image.')),
    });
  }
}
