import { Component, computed, effect, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { DEFAULT_MIRROR_IMAGES } from '../../core/site-defaults';
import { ThemeService } from '../../services/theme';

interface AmbientSpec {
  size: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  dur: number;
  tx: string;
  ty: string;
  delay: string;
}

const AMBIENT_SPECS: AmbientSpec[] = [
  { size: 108, top: '6%', left: '6%', dur: 9, tx: '14px', ty: '-18px', delay: '0s' },
  { size: 68, top: '16%', left: '20%', dur: 7.5, tx: '-10px', ty: '14px', delay: '1s' },
  { size: 124, top: '7%', right: '6%', dur: 10.5, tx: '-16px', ty: '18px', delay: '0.5s' },
  { size: 62, top: '23%', right: '19%', dur: 8, tx: '12px', ty: '-10px', delay: '2s' },
  { size: 96, bottom: '10%', left: '7%', dur: 9.5, tx: '16px', ty: '-14px', delay: '1.2s' },
  { size: 56, bottom: '25%', left: '19%', dur: 7, tx: '-8px', ty: '-12px', delay: '0.4s' },
  { size: 116, bottom: '8%', right: '7%', dur: 10, tx: '-14px', ty: '-16px', delay: '1.8s' },
  { size: 64, bottom: '24%', right: '20%', dur: 8.5, tx: '10px', ty: '12px', delay: '0.8s' },
  { size: 48, top: '46%', left: '4%', dur: 6.8, tx: '8px', ty: '-10px', delay: '1.5s' },
  { size: 52, top: '50%', right: '4%', dur: 7.4, tx: '-10px', ty: '10px', delay: '2.2s' },
  { size: 42, top: '9%', left: '42%', dur: 6.5, tx: '7px', ty: '9px', delay: '0.3s' },
  { size: 44, bottom: '9%', right: '40%', dur: 7.2, tx: '-9px', ty: '-8px', delay: '1.1s' },
  { size: 58, top: '34%', left: '12%', dur: 8.2, tx: '11px', ty: '12px', delay: '0.7s' },
  { size: 60, top: '35%', right: '12%', dur: 8.6, tx: '-12px', ty: '-11px', delay: '1.4s' },
  { size: 50, bottom: '36%', left: '11%', dur: 7.8, tx: '9px', ty: '-9px', delay: '1.9s' },
  { size: 54, bottom: '35%', right: '11%', dur: 8.1, tx: '-10px', ty: '11px', delay: '0.9s' },
];

const FALLBACK_MIRROR_SVG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
<stop offset="0%" stop-color="#FFF8EB"/><stop offset="48%" stop-color="#FAD775"/><stop offset="100%" stop-color="#B85814"/>
</linearGradient></defs>
<circle cx="60" cy="60" r="60" fill="url(#g)"/>
<ellipse cx="60" cy="62" rx="28" ry="38" fill="#FFF8EB" fill-opacity="0.65" stroke="#3D2D00" stroke-width="2.5"/>
<path d="M44 42 L72 78 M52 36 L78 68" stroke="#CE9312" stroke-width="2.5" stroke-linecap="round" opacity="0.7"/>
</svg>`);

/**
 * Applies the brand/theme settings (CSS variables) and renders the floating
 * "ambient mirror" bubbles behind the orbit stage.
 * Brand + orb data is fetched once by <App>, this component only reacts to it.
 */
@Component({
  selector: 'app-theme',
  styleUrl: './theme.css',
  templateUrl: './theme.html',
})
export class Theme {
  private themeService = inject(ThemeService);

  private brand = toSignal(this.themeService.brand$, { initialValue: undefined });
  private orbs = toSignal(this.themeService.orbs$, { initialValue: undefined });

  readonly fallbackSrc = FALLBACK_MIRROR_SVG;

  bubbles = computed(() => {
    const fromApi = this.orbs()?.ambientOrbsImages ?? [];
    const images = fromApi.length ? fromApi : DEFAULT_MIRROR_IMAGES;
    return AMBIENT_SPECS.slice(0, 12).map((spec, i) => ({
      spec,
      src: images[i % images.length],
    }));
  });

  constructor() {
    effect(() => {
      const data = this.brand();
      if (!data) return;
      const root = document.documentElement;
      const scale = data.centerpieceTitleScale ?? 1;
      const style = data.italicSerifStyle === false ? 'normal' : 'italic';
      root.style.setProperty('--brand-scale', String(scale));
      root.style.setProperty('--centerpiece-scale', String(scale));
      root.style.setProperty('--brand-style', style);
      root.style.setProperty('--title-font-style', style);
    });
  }

  onImgError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img.src !== this.fallbackSrc) img.src = this.fallbackSrc;
  }
}
