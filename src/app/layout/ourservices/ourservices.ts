import { Component, computed, inject, signal } from '@angular/core';
import { SiteContentService } from '../../services/site-content';

@Component({
  selector: 'app-ourservices',
  styleUrl: './ourservices.css',
  templateUrl: './ourservices.html',
})
export class OurServices {
  private content = inject(SiteContentService);

  data = computed(() => this.content.services());
  items = computed(() => this.data().servicesList ?? []);

  selectedIndex = signal(0);
  active = computed(() => {
    const list = this.items();
    return list[this.selectedIndex()] ?? list[0];
  });

  counter = computed(() => {
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(Math.min(this.selectedIndex(), this.items().length - 1) + 1)} / ${pad(this.items().length)}`;
  });

  select(index: number): void {
    this.selectedIndex.set(index);
  }
}
