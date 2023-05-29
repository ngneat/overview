import { TemplateRef, Type } from '@angular/core';
import { CompRef } from './comp-ref';
import { StringRef } from './string-ref';
import { TplRef } from './template-ref';

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
export type ResolveViewRef<T> = T extends Type<infer Instance> ? CompRef<Instance>
  : T extends TemplateRef<infer Context> ? TplRef<Context> : StringRef;

export function isTemplateRef(value: any): value is TemplateRef<any> {
  return value instanceof TemplateRef;
}

export function isComponent(value: any): value is Type<any> {
  return typeof value === 'function';
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

export function getViewRef<T>(value: CompRef<T> | TplRef<T>) {
  return value instanceof CompRef ? value.ref.hostView : value.ref;
}

export function isTplRef(value: any): value is TplRef<any> {
  return value instanceof TplRef;
}
