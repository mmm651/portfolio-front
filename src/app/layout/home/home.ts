import { Component, computed, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { SiteContentService } from '../../services/site-content';
import { ThemeService } from '../../services/theme';

@Component({
  selector: 'app-home',
  styleUrl: './home.css',
  templateUrl: './home.html',
})
export class Home {
  private content = inject(SiteContentService);
  private theme = inject(ThemeService);
  private brand = toSignal(this.theme.brand$, { initialValue: undefined });

  tag = computed(() => this.content.home().tag);
  subtitle = computed(() => this.content.home().subtitle);
  brandTitle = computed(() => this.brand()?.brandTitle || this.content.home().title || 'mirror-house');
}
