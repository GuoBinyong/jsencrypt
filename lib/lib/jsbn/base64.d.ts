/**
 * 16进制的字符串转为 base64
 * @param h - 16进制的字符串
 * @returns
 */
export declare function hex2b64(h: string): string;
export declare function b64tohex(s: string): string;
/**
 * 将 base64字符串 转为 字节数字数组
 * @remarks
 * 1. 它会先通过 {@link b64tohex} 转为 16 进制的字符串，
 * 2. 然后将每两个16进制数转为一个数字，
 * 3. 然后将字些数字组成为了组并返回
 * @param s
 * @returns
 */
export declare function b64toBA(s: string): number[];
