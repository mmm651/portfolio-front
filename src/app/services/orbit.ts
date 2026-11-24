import { Injectable, signal } from '@angular/core';

/** Shared play/pause state for the orbit (used by the stage, the corner pill and the footer). */
@Injectable({ providedIn: 'root' })
export class OrbitService {
  readonly isPlaying = signal(true);

  toggle(): void {
    this.isPlaying.update((v) => !v);
  }
}
