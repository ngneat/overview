import {  InputSignal, InputSignalWithTransform, TemplateRef, Type } from '@angular/core';
import { CompRef } from './comp-ref';
import { StringRef } from './string-ref';
import { TplRef } from './template-ref';

export interface ViewRef {
  getElement(): Element | string;

  detectChanges(): ViewRef;

  updateContext(context: any): ViewRef;

  destroy(): void;
}

type ExcludeFunctionPropertyNames<T> = {
  // Allow inferring keys that have the type `InputSignal`, as it represents a function.
  [Key in keyof T]: T[Key] extends InputSignal<any> ? Key : T[Key] extends Function ? never : Key;
}[keyof T];

export type InferInputSignalType<T> = T extends InputSignalWithTransform<unknown, infer R> ? R : T extends InputSignal<infer R> ? R : T;
export type ExtractInputTypes<T> = {
  [Key in keyof T]: InferInputSignalType<T[Key]>;
}

export type ExcludeFunctions<T> = Pick<T, ExcludeFunctionPropertyNames<T>>;
export type Content = string | number | TemplateRef<any> | Type<any>;
export type ResolveViewRef<T> = T extends Type<infer Instance>
  ? CompRef<Instance>
  : T extends TemplateRef<infer Context>
  ? TplRef<Context>
  : StringRef;

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
