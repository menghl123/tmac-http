import {Assert} from '../assert/assert';

export class ArrayUtils {
  public static unique<T>(value: T[], fn = (a, b) => a === b): T[] {
    Assert.isArray(value, 'ArrayUtils:unique:value must be array');
    const temp = [];
    value.forEach(item => {
      if (temp.findIndex(innerItem => fn(innerItem, item)) === -1) {
        temp.push(item);
      }
    });
    return temp;
  }

  public static bubbleSort<T>(value: T[], fn = (a, b) => a > b): T[] {
    Assert.isArray(value, 'ArrayUtils:bubbleSort:value must be array');
    let temp;
    for (let i = 0; i < value.length - 1; i++) {
      for (let j = 0; j < value.length - 1; j++) {
        if (fn(value[j], value[j + 1])) {
          temp = value[j];
          value[j] = value[j + 1];
          value[j + 1] = temp;
        }
      }
    }

    return value;
  }

}
