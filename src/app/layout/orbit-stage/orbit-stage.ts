import {
  AfterViewInit,
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  QueryList,
  ViewChildren,
  computed,
  inject,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterLink, RouterOutlet } from '@angular/router';
import { filter, map } from 'rxjs';
import { BUBBLE_EYEBROW, BUBBLE_MAP, ViewKey } from '../../core/site-defaults';
import { OrbitService } from '../../services/orbit';
import { ThemeService } from '../../services/theme';

type Slot = 'top' | 'right' | 'bottom' | 'left';

/** Motion settings (same defaults as the original HTML admin panel). */
const MOTION = {
  speed: 0.14, // radians / second
  direction: 1, // 1 = clockwise
  radiusScale: 1,
  bubbleScale: 1,
  pauseOnHover: true,
};

const SLOTS: { slot: Slot; offset: number }[] = [
  { slot: 'top', offset: -Math.PI / 2 },
  { slot: 'right', offset: 0 },
  { slot: 'bottom', offset: Math.PI / 2 },
  { slot: 'left', offset: Math.PI },
];

@Component({
  selector: 'app-orbit-stage',
  imports: [RouterLink, RouterOutlet],
  styleUrl: './orbit-stage.css',
  templateUrl: './orbit-stage.html',
})
export class OrbitStage implements AfterViewInit, OnDestroy {
  private router = inject(Router);
  private zone = inject(NgZone);
  private theme = inject(ThemeService);
  readonly orbit = inject(OrbitService);

  @ViewChildren('bubble') private bubbleEls!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('stage') private stageRef!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('trackOuter') private outerRef!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('trackInner') private innerRef!: QueryList<ElementRef<HTMLElement>>;

  private brand = toSignal(this.theme.brand$, { initialValue: undefined });

  private url = toSignal(
    this.router.events.pipe(
      filter((e): e is NavigationEnd => e instanceof NavigationEnd),
      map((e) => e.urlAfterRedirects),
    ),
    { initialValue: this.router.url },
  );

  /** current page key derived from the URL (/about -> 'about', anything else -> 'home') */
  view = computed<ViewKey>(() => {
    const seg = this.url().split(/[?#]/)[0].split('/').filter(Boolean)[0] as ViewKey | undefined;
    return seg && seg in BUBBLE_MAP ? seg : 'home';
  });

  bubbles = computed(() => {
    const titles = this.brand()?.navBubbleTitles ?? {};
    const fallback: Record<ViewKey, string> = {
      home: 'Home',
      about: 'About Us',
      contact: 'Contact Us',
      services: 'Our Services',
      clients: 'Our Clients',
    };
    const map = BUBBLE_MAP[this.view()];
    return SLOTS.map(({ slot }) => {
      const target = map[slot];
      return {
        slot,
        path: '/' + target,
        eyebrow: BUBBLE_EYEBROW[slot],
        label: titles[target] || fallback[target],
      };
    });
  });

  // ---- animation state (kept outside Angular change detection) ----
  private rafId = 0;
  private lastTs: number | null = null;
  private angle = 0;
  private speed: number = MOTION.speed * MOTION.direction;
  private hovered: Slot | null = null;
  private scales: Record<Slot, number> = { top: 1, right: 1, bottom: 1, left: 1 };
  private radiusX = 340;
  private radiusY = 340;
  private resizeObs?: ResizeObserver;
  private onResize = () => this.updateDimensions();

  ngAfterViewInit(): void {
    this.updateDimensions();
    window.addEventListener('resize', this.onResize);
    const stage = this.stageRef.first?.nativeElement;
    if (stage && typeof ResizeObserver !== 'undefined') {
      this.resizeObs = new ResizeObserver(() => this.updateDimensions());
      this.resizeObs.observe(stage);
    }
    this.zone.runOutsideAngular(() => {
      this.rafId = requestAnimationFrame((t) => this.tick(t));
    });
  }

  ngOnDestroy(): void {
    cancelAnimationFrame(this.rafId);
    window.removeEventListener('resize', this.onResize);
    this.resizeObs?.disconnect();
  }

  setHover(slot: Slot | null): void {
    this.hovered = slot;
  }

  private updateDimensions(): void {
    const stage = this.stageRef.first?.nativeElement;
    if (!stage) return;
    const rect = stage.getBoundingClientRect();
    const vw = window.innerWidth;
    const isPhone = vw < 640;
    const bubbleDiameter = isPhone ? 72 : vw < 1024 ? 128 : 144;
    const padding = isPhone ? 6 : 18;

    const maxX = rect.width / 2 - bubbleDiameter / 2 - padding;
    const maxY = rect.height / 2 - bubbleDiameter / 2 - padding;

    if (isPhone) {
      // phones are narrow but tall: use an ellipse so the bubbles stay clear of the center card
      this.radiusX = Math.max(100, maxX * MOTION.radiusScale);
      this.radiusY = Math.max(160, Math.min(maxY, 300) * MOTION.radiusScale);
    } else {
      const base = Math.max(150, Math.min(maxX, maxY, 360));
      const r = Math.max(120, Math.min(base * MOTION.radiusScale, Math.min(maxX, maxY) + 12));
      this.radiusX = this.radiusY = r;
    }

    const outer = this.outerRef.first?.nativeElement;
    const inner = this.innerRef.first?.nativeElement;
    if (outer) {
      outer.style.width = `${this.radiusX * 2}px`;
      outer.style.height = `${this.radiusY * 2}px`;
    }
    if (inner) {
      const shrink = bubbleDiameter * 0.85;
      inner.style.width = `${Math.max(140, this.radiusX * 2 - shrink)}px`;
      inner.style.height = `${Math.max(140, this.radiusY * 2 - shrink)}px`;
    }
  }

  private tick(ts: number): void {
    if (this.lastTs === null) this.lastTs = ts;
    const dt = Math.min((ts - this.lastTs) / 1000, 0.1);
    this.lastTs = ts;

    const paused = !this.orbit.isPlaying() || (MOTION.pauseOnHover && this.hovered !== null);
    const target = paused ? 0 : MOTION.speed * MOTION.direction;
    this.speed += (target - this.speed) * 0.1;
    this.angle = (this.angle + this.speed * dt) % (Math.PI * 2);

    const els = this.bubbleEls?.toArray() ?? [];
    for (let i = 0; i < els.length; i++) {
      const { slot, offset } = SLOTS[i];
      const theta = this.angle + offset;
      const x = Math.cos(theta) * this.radiusX;
      const y = Math.sin(theta) * this.radiusY;

      const goal = (this.hovered === slot ? 1.1 : 1) * MOTION.bubbleScale;
      this.scales[slot] += (goal - this.scales[slot]) * 0.16;

      els[i].nativeElement.style.transform =
        `translate3d(calc(-50% + ${x.toFixed(2)}px), calc(-50% + ${y.toFixed(2)}px), 0) scale(${this.scales[slot].toFixed(3)})`;
    }

    this.rafId = requestAnimationFrame((t) => this.tick(t));
  }
}
