import { ViewRef } from './types';

// Plain strings have no Angular lifecycle, so this adapter exists purely to satisfy
// the ViewRef contract — letting callers treat all content types uniformly without
// special-casing strings throughout the codebase.
export class StringRef implements ViewRef {
  constructor(private value: string) {}

  getElement(): string {
    return this.value;
  }

  detectChanges() {
    return this;
  }

  updateContext() {
    return this;
  }

  destroy() {}
}
