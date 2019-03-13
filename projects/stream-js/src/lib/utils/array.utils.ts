import {Assert} from '../l';

export class ArrayUtils {
  public static uniq<T>(value: T[], fn?: (a, b) => boolean): T[] {
    Assert.
    value.filter(item )


    const temp = [];
    for (let i = 0; i < value.length; i++) {
      if (temp.indexOf(value[i]) === -1) {
        temp.push(value[i]);
      }
    }
    return temp;
  }

}
