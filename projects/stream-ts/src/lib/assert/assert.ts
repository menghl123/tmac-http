export class Assert {
  public static isTrue(value: boolean, msg = 'value is not true') {
    if (value !== true) {
      throw new Error(`assert:${msg}`);
    }
  }

  public static isEqual(valueA: any, valueB: any, msg = 'values is not equal') {
    if (valueA !== valueB) {
      throw new Error(`assert:${msg}`);
    }
  }

  public static nonNull(value: any, msg = 'value is  null') {
    if (value === null || value === undefined) {
      throw new Error(`assert:${msg}`);
    }
  }

  public static isNull(value: any, msg = 'value is not null') {
    if (value !== null && value !== undefined) {
      throw new Error(`assert:${msg}`);
    }
  }

  public static isArray(value: any[], msg = 'value is not array') {
    if (!Array.isArray(value)) {
      throw new Error(`assert:${msg}`);
    }
  }

}
