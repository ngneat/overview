import {  InputSignal, InputSignalWithTransform, TemplateRef, Type } from '@angular/core';
import { CompRef } from './comp-ref';
import { StringRef } from './string-ref';
import { TplRef } from './template-ref';

// A common interface so callers can hold any kind of rendered content — component,
// template, or plain string — and interact with it uniformly without branching on the type.
export interface ViewRef {
  getElement(): Element | string;

  detectChanges(): ViewRef;

  updateContext(context: any): ViewRef;

  destroy(): void;
}

// Angular signal inputs are technically functions at runtime, but they represent data
// properties — not methods. Without this carve-out they'd be filtered out alongside
// real methods, making typed input setting impossible for modern signal-based components.
type ExcludeFunctionPropertyNames<T> = {
  [Key in keyof T]: T[Key] extends InputSignal<any> ? Key : T[Key] extends Function ? never : Key;
}[keyof T];

// Signal inputs distinguish between the value type and the transform type (what you
// pass in vs. what the component reads out). We want the transform type so callers
// provide values that satisfy the input's acceptance contract, not just its output type.
export type InferInputSignalType<T> = T extends InputSignalWithTransform<unknown, infer R> ? R : T extends InputSignal<infer R> ? R : T;
export type ExtractInputTypes<T> = {
  [Key in keyof T]: InferInputSignalType<T[Key]>;
}

export type ExcludeFunctions<T> = Pick<T, ExcludeFunctionPropertyNames<T>>;
export type Content = string | number | TemplateRef<any> | Type<any>;

// Narrows the return type of createView so callers get a fully-typed ref
// (e.g. CompRef<MyComp>) instead of the base ViewRef, enabling typed input setting
// without casting.
export type ResolveViewRef<T> = T extends Type<infer Instance>
  ? CompRef<Instance>
  : T extends TemplateRef<infer Context>
  ? TplRef<Context>
  : StringRef;

// Runtime type guards are needed because Content is a union that TypeScript can't
// narrow automatically at runtime — TemplateRef, component classes, and strings are
// structurally indistinguishable without these checks.
export function isTemplateRef(value: any): value is TemplateRef<any> {
  return value instanceof TemplateRef;
}

export function isComponent(value: any): value is Type<any> {
  return typeof value === 'function';
}

export function isString(value: any): value is string {
  return typeof value === 'string';
}

// CompRef and TplRef store their inner Angular view refs differently, so this
// normalises access when the raw Angular view (e.g. for change detection) is needed.
export function getViewRef<T>(value: CompRef<T> | TplRef<T>) {
  return value instanceof CompRef ? value.ref.hostView : value.ref;
}
