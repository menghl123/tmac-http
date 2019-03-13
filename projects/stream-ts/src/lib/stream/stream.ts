import {Assert} from '../assert/assert';
import {ArrayUtils} from '../utils/array.utils';
import {Optional} from '../optional/optional';
import {NumberUtils} from '../utils/number.utils';

export class Stream<T> {
  protected value: T[];


  constructor(value: T[]) {
    this.value = value;
  }

  public static of<T>(value: T[]): Stream<T> {
    Assert.isArray(value, 'stream:of:value must be array');
    return new Stream<T>(value);
  }


  public filter(predicate: (value: T) => boolean): Stream<T> {
    Assert.nonNull(predicate, 'stream:filter:predicate can not be null');
    this.value = this.value.filter(predicate);
    return this;
  }

  public map<R>(fn: (value: T, index?: number, array?: T[]) => R): Stream<R> {
    Assert.nonNull(fn, 'stream:map:fn can not be null');
    return Stream.of(this.value.map(fn));
  }

  public flatMap<R>(fn: (value: T, index?: number, array?: T[]) => Stream<R>): Stream<R> {
    Assert.nonNull(fn, 'stream:flatMap:fn can not be null');
    const result = this.value.map(fn)
      .map(item => item.toArray())
      .reduce((prev, current) => prev.concat(current), []);
    return Stream.of<R>(result);
  }

  public peek(fn: (value: T) => void): Stream<T> {
    Assert.nonNull(fn, 'stream:peek:fn can not be null');
    this.value.forEach(item => fn(item));
    return this;
  }

  public mapToNumber(fn: (value: T) => number): NumberStream {
    Assert.nonNull(fn, 'stream:mapToNumber:fn can not be null');
    return new NumberStream(this.value.map(fn));
  }

  public distinct(fn = (a, b) => a === b): Stream<T> {
    this.value = ArrayUtils.unique(this.value, fn);
    return this;
  }

  public limit(maxSize: number): Stream<T> {
    Assert.nonNull(maxSize, 'stream:limit:maxSize must be number');
    this.value = this.value.slice(0, maxSize);
    return this;
  }

  public skip(minSize: number): Stream<T> {
    Assert.nonNull(minSize, 'stream:limit:minSize must be number');
    this.value = this.value.slice(minSize, this.value.length);
    return this;
  }

  public forEach(fn: (value: T, index?: number, array?: T[]) => void): void {
    Assert.nonNull(fn, 'stream:forEach:fn must not be null');
    this.value.forEach(fn);
  }

  public anyMatch(fn: (value: T, index?: number, array?: T[]) => boolean): boolean {
    Assert.nonNull(fn, 'stream:anyMatch:fn must not be null');
    return this.value.some(fn);
  }

  public allMatch(fn: (value: T, index?: number, array?: T[]) => boolean): boolean {
    Assert.nonNull(fn, 'stream:anyMatch:fn must not be null');
    return this.value.every(fn);
  }

  public noneMatch(fn: (value: T, index?: number, array?: T[]) => boolean): boolean {
    Assert.nonNull(fn, 'stream:anyMatch:fn must not be null');
    return !this.anyMatch(fn);
  }

  public toArray(): T[] {
    return this.value;
  }

  public reduce(fn: (previousValue: T, currentValue: T, currentIndex?: number, array?: T[]) => T, initValue?: T): Optional<T> {
    Assert.nonNull(fn, 'stream:reduce:fn must not be null');
    return Optional.ofNullable(this.value.reduce(fn, initValue));
  }

  public collectToMap(fn: (value: T, index?: number, array?: T[]) => string): Map<string, T> {
    Assert.nonNull(fn, 'stream:collectToMap:fn must not be null');
    const result = new Map();
    this.value.forEach(((value, index, array) => {
      const key = fn(value, index, array);
      result.set(key, value);
    }));
    return result;
  }

  public collectToSet(): Set<T> {
    return new Set(this.value);
  }

  public findFirst(): Optional<T> {
    return Optional.ofNullable(this.value[0]);
  }

  public findLast(): Optional<T> {
    return Optional.ofNullable(this.value[this.value.length - 1]);
  }

  public findAny(): Optional<T> {
    return Optional.ofNullable(this.value[NumberUtils.randomInteger(0, this.value.length)]);
  }

  public min(fn = (a, b) => a > b): Optional<T> {
    return this.sorted(fn).findFirst();
  }

  public max(fn = (a, b) => a > b): Optional<T> {
    return this.sorted(fn).findLast();
  }

  public sorted(fn = (a, b) => a > b): Stream<T> {
    this.value = ArrayUtils.bubbleSort(this.value, fn);
    return this;
  }

  public count(): number {
    return this.value.length;
  }


}


export class NumberStream extends Stream<number> {


  constructor(value: number[]) {
    super(value);
  }

  public static from(start: number, end: number): NumberStream {
    Assert.nonNull(start, 'NumberStream:from:start must not be null');
    Assert.nonNull(end, 'NumberStream:from:end must not be null');
    const result = [];
    for (let i = Math.round(start); i < Math.round(end); i++) {
      result.push(i);
    }
    return new NumberStream(result);
  }

  public sum(): number {
    return this.reduce((prev, current) => prev + current, 0).orElse(0);
  }

  public average(): number {
    return this.sum() / this.count();
  }

  public summaryStatistics(): NumberSummaryStatistics {
    return new NumberSummaryStatistics(this.max().orElse(0), this.min().orElse(0), this.average(), this.sum(), this.count());
  }

}

export class NumberSummaryStatistics {
  private _max: number;
  private _min: number;
  private _average: number;
  private _sum: number;
  private _count: number;

  constructor(max: number, min: number, average: number, sum: number, count: number) {
    this._max = max;
    this._min = min;
    this._average = average;
    this._sum = sum;
    this._count = count;
  }

  get max(): number {
    return this._max;
  }

  get min(): number {
    return this._min;
  }

  get average(): number {
    return this._average;
  }

  get sum(): number {
    return this._sum;
  }

  get count(): number {
    return this._count;
  }

}
