import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CONTACT_COPY } from '../../core/site-defaults';
import { apiError } from '../../core/api';
import { ContactService } from '../../services/contact';

@Component({
  selector: 'app-contact',
  imports: [ReactiveFormsModule],
  styleUrl: './contact.css',
  templateUrl: './contact.html',
})
export class Contact {
  private fb = inject(FormBuilder);
  private contactApi = inject(ContactService);

  copy = CONTACT_COPY;

  isSubmitting = signal(false);
  submitSuccess = signal(false);
  submitError = signal('');

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    projectVision: ['', [Validators.required, Validators.minLength(10)]],
  });

  invalid(name: 'name' | 'email' | 'projectVision'): boolean {
    const c = this.form.controls[name];
    return c.invalid && (c.touched || c.dirty);
  }

  onSubmit(): void {
    this.submitSuccess.set(false);
    this.submitError.set('');

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.contactApi.sendMessage(this.form.getRawValue()).subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.submitSuccess.set(true);
        this.form.reset();
      },
      error: (err) => {
        this.isSubmitting.set(false);
        this.submitError.set(apiError(err, 'Could not send your message. Please try again.'));
      },
    });
  }
}
