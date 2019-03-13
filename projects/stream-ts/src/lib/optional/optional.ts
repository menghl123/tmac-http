import {Assert} from '../assert/assert';

export class Optional<T> {
  private static EMPTY: Optional<any> = new Optional<any>();
  private value: T;

  constructor(value?: T) {
    this.value = value;
  }

  public static empty<R>(): Optional<R> {
    return Optional.EMPTY;
  }

  public static of<T>(value: any): Optional<T> {
    Assert.nonNull(value, 'optional:value can not be null');
    return new Optional<T>(value);
  }

  public static ofNullable<T>(value: any): Optional<T> {
    return value === null || value === undefined ? Optional.empty() : Optional.of(value);
  }

  public get(): T {
    if (this.value === null || this.value === undefined) {
      console.error('optional:no value present');
    } else {
      return this.value;
    }
  }

  public isPresent(): boolean {
    return this.value !== null && this.value !== undefined;
  }

  public ifPresent(consumer: (value: T) => void): void {
    Assert.nonNull(consumer, 'optional:ifPresent:consumer can not be null');
    consumer(this.value);
  }

  public filter(predicate: (value: T) => boolean): Optional<T> {
    if (!this.isPresent()) {
      return this;
    } else {
      Assert.nonNull(predicate, 'optional:filter:predicate can not be null');
      return predicate(this.value) ? this : Optional.empty();
    }
  }

  public map<R>(fn: (value: T) => R): Optional<R> {
    Assert.nonNull(fn, 'optional:map:fn can not be null');
    return !this.isPresent() ? Optional.empty<R>() : Optional.ofNullable<R>(fn(this.value));
  }

  public orElse(value: T): T {
    return this.isPresent() ? this.value : value;
  }

  public orElseGet(supplier: () => T): T {
    Assert.nonNull(supplier, 'optional:orElseGet:supplier can not be null');
    return this.isPresent() ? this.value : supplier();
  }

  public orElseThrow(supplier: () => never): T | never {
    Assert.nonNull(supplier, 'optional:orElseThrow:supplier can not be null');
    return this.isPresent() ? this.value : supplier();
  }

}
