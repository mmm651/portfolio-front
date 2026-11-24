import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { ThemeService, ThemeData } from '../../../services/theme';

export interface DashboardNavItem {
  label: string;
  path: string;
}

@Component({
  selector: 'app-dashboard-header',
  imports: [RouterLink, RouterLinkActive],
  styleUrl: './dashboard-header.css',
  templateUrl: './dashboard-header.html',
})
export class DashboardHeader implements OnInit, OnDestroy {
  private themeService = inject(ThemeService);
  private subs = new Subscription();

  brandTitle = 'mirror-house';

  navItems: DashboardNavItem[] = [
    { label: 'Home', path: '/dashboard/home' },
    { label: 'Brand', path: '/dashboard/brand' },
    { label: 'About', path: '/dashboard/about' },
    { label: 'Services', path: '/dashboard/our-services' },
    { label: 'Clients', path: '/dashboard/our-clients' },
    { label: 'Contact', path: '/dashboard/contact' },
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
