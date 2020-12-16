import { TemplateRef, Type } from '@angular/core';

export interface ViewRef {
  getElement(): Element | string;

  detectChanges(): void;

  destroy(): void;
}

type ExcludeFunctionPropertyNames<T> = {
  [Key in keyof T]: T[Key] extends Function ? never : Key;
}[keyof T];

export type ExcludeFunctions<T> = Pick<T, ExcludeFunctionPropertyNames<T>>;
export type Content = string | TemplateRef<any> | Type<any>;
