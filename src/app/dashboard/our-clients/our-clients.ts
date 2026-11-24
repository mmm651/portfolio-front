import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { apiError } from '../../core/api';
import { ClientCard } from '../../core/models/clients';
import { Clients } from '../../services/clients';

@Component({
  selector: 'app-dashboard-our-clients',
  imports: [FormsModule],
  styleUrl: './our-clients.css',
  templateUrl: './our-clients.html',
})
export class DashboardOurClients implements OnInit {
  private api = inject(Clients);

  form = { sectionTag: '', trustedLabel: '', title: '' };
  testimonial = { quote: '', author: '' };
  clients: ClientCard[] = [];

  loading = signal(true);
  saving = signal(false);
  message = signal('');
  error = signal('');

  ngOnInit(): void {
    this.api.getClients().subscribe({
      next: (d) => {
        this.form = { sectionTag: d.sectionTag ?? '', trustedLabel: d.trustedLabel ?? '', title: d.title ?? '' };
        this.testimonial = { quote: d.testimonial?.quote ?? '', author: d.testimonial?.author ?? '' };
        this.clients = (d.clientsList ?? []).map((c, i) => ({ id: c.id ?? i + 1, name: c.name ?? '', category: c.category ?? '' }));
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(apiError(e, 'Failed to load clients.'));
        this.loading.set(false);
      },
    });
  }

  add(): void {
    const id = this.clients.reduce((m, c) => Math.max(m, c.id), 0) + 1;
    this.clients = [...this.clients, { id, name: '', category: '' }];
  }

  remove(index: number): void {
    this.clients = this.clients.filter((_, i) => i !== index);
  }

  save(): void {
    this.saving.set(true);
    this.message.set('');
    this.error.set('');
    this.api
      .updateClients({
        ...this.form,
        clientsList: this.clients.map((c) => ({ id: c.id, name: c.name.trim(), category: c.category.trim() })),
        testimonial: this.testimonial,
      })
      .subscribe({
        next: () => {
          this.saving.set(false);
          this.message.set('Clients saved.');
        },
        error: (e) => {
          this.saving.set(false);
          this.error.set(apiError(e, 'Failed to save clients.'));
        },
      });
  }
}
