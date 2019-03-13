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
    if (value === null || value === undefined) {
      throw new Error('optional:value can not be null');
    }
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
    if (consumer) {
      consumer(this.value);
    } else {
      throw new Error('optional:ifPresent:consumer can not be null');
    }
  }

  public filter(predicate: (value: T) => boolean): Optional<T> {
    if (!this.isPresent()) {
      return this;
    } else {
      if (predicate) {
        return predicate(this.value) ? this : Optional.empty();
      } else {
        throw new Error('optional:filter:predicate can not be null');
      }
    }
  }

  public map<R>(fn: (value: T) => R): Optional<R> {
    if (fn) {
      return !this.isPresent() ? Optional.empty<R>() : Optional.ofNullable<R>(fn(this.value));
    } else {
      throw new Error('optional:map:fn can not be null');
    }
  }

  public orElse(value: T): T {
    return this.isPresent() ? this.value : value;
  }

  public orElseGet(supplier: () => T): T {
    if (supplier) {
      return this.isPresent() ? this.value : supplier();
    } else {
      throw new Error('optional:orElseGet:supplier can not be null');
    }
  }

  public orElseThrow(supplier: () => void): T | void {
    if (supplier) {
      return this.isPresent() ? this.value : supplier();
    } else {
      throw new Error('optional:orElseThrow:supplier can not be null');
    }
  }

}
