import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { apiError } from '../../core/api';
import { AboutStat } from '../../core/models/about';
import { AboutService } from '../../services/about';

@Component({
  selector: 'app-dashboard-about',
  imports: [FormsModule],
  styleUrl: './about.css',
  templateUrl: './about.html',
})
export class DashboardAbout implements OnInit {
  private api = inject(AboutService);

  form = { sectionTag: '', title: '', description: '' };
  stats: AboutStat[] = [];

  loading = signal(true);
  saving = signal(false);
  message = signal('');
  error = signal('');

  ngOnInit(): void {
    this.api.getAbout().subscribe({
      next: (d) => {
        this.form = { sectionTag: d.sectionTag ?? '', title: d.title ?? '', description: d.description ?? '' };
        this.stats = (d.stats ?? []).map((s) => ({ id: s.id, value: s.value, label: s.label }));
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(apiError(e, 'Failed to load the About section.'));
        this.loading.set(false);
      },
    });
  }

  addStat(): void {
    const id = this.stats.reduce((m, s) => Math.max(m, s.id ?? 0), 0) + 1;
    this.stats = [...this.stats, { id, value: '', label: '' }];
  }

  removeStat(index: number): void {
    this.stats = this.stats.filter((_, i) => i !== index);
  }

  save(): void {
    this.saving.set(true);
    this.message.set('');
    this.error.set('');
    this.api.updateAbout({ ...this.form, stats: this.stats }).subscribe({
      next: () => {
        this.saving.set(false);
        this.message.set('About section saved.');
      },
      error: (e) => {
        this.saving.set(false);
        this.error.set(apiError(e, 'Failed to save the About section.'));
      },
    });
  }
}
