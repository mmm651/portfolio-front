import { Component, computed, inject } from '@angular/core';
import { SiteContentService } from '../../services/site-content';

@Component({
  selector: 'app-about',
  styleUrl: './about.css',
  templateUrl: './about.html',
})
export class About {
  private content = inject(SiteContentService);
  data = computed(() => this.content.about());
}
