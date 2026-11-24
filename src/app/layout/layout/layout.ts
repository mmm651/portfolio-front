import { Component, OnInit, inject } from '@angular/core';
import { SiteContentService } from '../../services/site-content';
import { Footer } from '../../shared/footer/footer';
import { Theme } from '../../shared/theme/theme';
import { OrbitStage } from '../orbit-stage/orbit-stage';
import { Header } from '../shared/header/header';

@Component({
  selector: 'app-layout',
  imports: [Theme, Header, OrbitStage, Footer],
  styleUrl: './layout.css',
  templateUrl: './layout.html',
})
export class Layout implements OnInit {
  private content = inject(SiteContentService);

  ngOnInit(): void {
    this.content.load(true);
  }
}
