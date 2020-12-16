import { ViewRef } from './types';

export class StringRef implements ViewRef {
  constructor(private value: string) {}

  getElement(): string {
    return this.value;
  }

  detectChanges() {}

  destroy() {}
}
