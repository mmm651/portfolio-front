import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { apiError } from '../../core/api';
import { HomeService } from '../../services/home';

@Component({
  selector: 'app-dashboard-home',
  imports: [FormsModule],
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class DashboardHome implements OnInit {
  private api = inject(HomeService);

  form = { tag: '', title: '', subtitle: '' };
  loading = signal(true);
  saving = signal(false);
  message = signal('');
  error = signal('');

  ngOnInit(): void {
    this.api.getHome().subscribe({
      next: (d) => {
        this.form = { tag: d.tag ?? '', title: d.title ?? '', subtitle: d.subtitle ?? '' };
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(apiError(e, 'Failed to load home settings.'));
        this.loading.set(false);
      },
    });
  }

  save(): void {
    this.saving.set(true);
    this.message.set('');
    this.error.set('');
    this.api.updateHome(this.form).subscribe({
      next: () => {
        this.saving.set(false);
        this.message.set('Home section saved.');
      },
      error: (e) => {
        this.saving.set(false);
        this.error.set(apiError(e, 'Failed to save home section.'));
      },
    });
  }
}
