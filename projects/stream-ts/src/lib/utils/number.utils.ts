export class NumberUtils {
  public static randomInteger(start = 0, end = Number.MAX_SAFE_INTEGER): number {
    return start + Math.round((end - start) * Math.random());
  }
}
