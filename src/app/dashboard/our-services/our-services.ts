import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { apiError } from '../../core/api';
import { Services } from '../../services/services';

interface ServiceForm {
  id: number;
  category: string;
  title: string;
  description: string;
  featuresText: string; // one feature per line
}

@Component({
  selector: 'app-dashboard-our-services',
  imports: [FormsModule],
  styleUrl: './our-services.css',
  templateUrl: './our-services.html',
})
export class DashboardOurServices implements OnInit {
  private api = inject(Services);

  form = { sectionTag: '', title: '' };
  items: ServiceForm[] = [];

  loading = signal(true);
  saving = signal(false);
  message = signal('');
  error = signal('');

  ngOnInit(): void {
    this.api.getServices().subscribe({
      next: (d) => {
        this.form = { sectionTag: d.sectionTag ?? '', title: d.title ?? '' };
        this.items = (d.servicesList ?? []).map((s, i) => ({
          id: s.id ?? i + 1,
          category: s.category ?? '',
          title: s.title ?? '',
          description: s.description ?? '',
          featuresText: (s.features ?? []).join('\n'),
        }));
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(apiError(e, 'Failed to load services.'));
        this.loading.set(false);
      },
    });
  }

  add(): void {
    const id = this.items.reduce((m, s) => Math.max(m, s.id), 0) + 1;
    this.items = [...this.items, { id, category: '', title: '', description: '', featuresText: '' }];
  }

  remove(index: number): void {
    this.items = this.items.filter((_, i) => i !== index);
  }

  move(index: number, delta: -1 | 1): void {
    const to = index + delta;
    if (to < 0 || to >= this.items.length) return;
    const copy = [...this.items];
    [copy[index], copy[to]] = [copy[to], copy[index]];
    this.items = copy;
  }

  save(): void {
    this.saving.set(true);
    this.message.set('');
    this.error.set('');
    const servicesList = this.items.map((s) => ({
      id: s.id,
      category: s.category.trim(),
      title: s.title.trim(),
      description: s.description.trim(),
      features: s.featuresText.split('\n').map((f) => f.trim()).filter(Boolean),
    }));
    this.api.updateServices({ ...this.form, servicesList }).subscribe({
      next: () => {
        this.saving.set(false);
        this.message.set('Services saved.');
      },
      error: (e) => {
        this.saving.set(false);
        this.error.set(apiError(e, 'Failed to save services.'));
      },
    });
  }
}
