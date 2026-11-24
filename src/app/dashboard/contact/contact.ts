import { DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { apiError } from '../../core/api';
import { ContactMessage } from '../../core/models/contact';
import { ContactService } from '../../services/contact';

@Component({
  selector: 'app-dashboard-contact',
  imports: [DatePipe],
  styleUrl: './contact.css',
  templateUrl: './contact.html',
})
export class DashboardContact implements OnInit {
  private api = inject(ContactService);

  messages = signal<ContactMessage[]>([]);
  loading = signal(true);
  error = signal('');
  deletingId = signal<string | null>(null);

  ngOnInit(): void {
    this.load();
  }

remove(m: ContactMessage): void {
  if (!m._id) return;
  if (!confirm(`Delete the message from ${m.name}?`)) return;

  this.deletingId.set(m._id);
  this.error.set('');

  this.api.deleteMessage(m._id).subscribe({
    next: () => {
      this.messages.update((list) => list.filter((x) => x._id !== m._id));
      this.deletingId.set(null);
    },
    error: (e) => {
      this.error.set(apiError(e, 'Failed to delete message.'));
      this.deletingId.set(null);
    },
  });
}

  load(): void {
    this.loading.set(true);
    this.error.set('');
    this.api.getMessages().subscribe({
      next: (list) => {
        this.messages.set(Array.isArray(list) ? list : []);
        this.loading.set(false);
      },
      error: (e) => {
        this.error.set(apiError(e, 'Failed to load messages.'));
        this.loading.set(false);
      },
    });
  }
}
