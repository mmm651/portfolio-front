import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService, ThemeData } from '../../services/theme';

export interface NotFoundAction {
  label: string;
  path: string;
  ghost?: boolean;
}

@Component({
  imports : [RouterLink],
  selector: 'app-not-found',

  styleUrl: './not-found.css',
  templateUrl: './not-found.html',
})
export class NotFound implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  private subs = new Subscription();

  brandTitle = 'mirror-house';

  actions: NotFoundAction[] = [
    { label: 'Back to Home', path: '/' },
    { label: 'Our Services', path: '/services', ghost: true },
  ];

  ngOnInit(): void {
    this.subs.add(
      this.themeService.brand$.subscribe((data: ThemeData) => {
        this.brandTitle = data.brandTitle || 'mirror-house';
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }
}
