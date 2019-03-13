export interface Collection<T> {
  size(): number;

  isEmpty(): boolean;

  contains(value: any): boolean;


}
