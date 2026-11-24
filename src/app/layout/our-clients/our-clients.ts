import { Component, computed, inject } from '@angular/core';
import { SiteContentService } from '../../services/site-content';

@Component({
  selector: 'app-our-clients',
  styleUrl: './our-clients.css',
  templateUrl: './our-clients.html',
})
export class OurClients {
  private content = inject(SiteContentService);
  data = computed(() => this.content.clients());
}
