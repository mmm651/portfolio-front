import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './services/theme';

@Component({
  imports: [RouterOutlet],
  selector: 'app-root',
  styleUrl: './app.css',
  templateUrl: './app.html',
})
export class App implements OnInit {
  private theme = inject(ThemeService);

  ngOnInit(): void {
    // Brand + ambient images are shared by the site and the dashboard, so load them once here.
    this.theme.fetchBrand().subscribe({ error: () => {} });
    this.theme.fetchOrbs().subscribe({ error: () => {} });
  }
}
