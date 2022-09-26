import {int2char} from "./util";

const b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
const b64pad = "=";

/**
 * 将内容为16进制数字的字符串转为 base64
 * 
 * @remarks
 * 与 `btoa()` 的区别是：
 * - `btoa()` 函数要求输入是一个字符串，它会将输入字符串的每一个字符对应的 code 作为一个内存中占八位（即：一个字节）二进制数据来对象，然后将这些二进制数据编码为 `Base64` 编码的 `ASCII` 字符串
 * - `hex2b64()` 函数要求输入是内容为16进制数字的字符串，将字符串文本所表达的数字内容作为目标数据来处理
 * 
 * @param h - 内容为16进制数字的字符串，将字符串文本所表达的数字内容作为目标数据来处理
 * @returns 
 */
export function hex2b64(h:string) {
    let i;
    let ret = "";
    const length = h.length;
    const forLength = length - 3;
    for (i = 0; i <= forLength; i += 3) {
        // 3个字符作为一个16进制的来解析成数字
        const c = parseInt(h.substring(i, i + 3), 16);
        /**
         * 把 c 转为两个数，右 6位 为一个数，剩余的位数为一个数，
         * 然后将这两个数作为索引 从 b64map 取对应的字符 拼在一块
         */
        ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
    }

    const restLen = length - i;
    if (restLen === 1) {
        const c = parseInt(h.substring(i, length), 16);
        ret += b64map.charAt(c << 2);
    } else if (restLen === 2) {
        const c = parseInt(h.substring(i, length), 16);
        ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
    }
    while ((ret.length & 3) > 0) {
        ret += b64pad;
    }
    return ret;
}


/**
 * 转换 base64 字符串为 16进制字符串
 * @param s - base64 字符串
 * @returns 
 */
export function b64tohex(s:string) {
    let ret = "";
    let i;
    let k = 0; // base64 的状态，取值为 0、1、2
    let slop = 0;
    const length = s.length;
    for (i = 0; i < length; ++i) {
        const char = s.charAt(i);
        if (char === b64pad) {
            break;
        }
        const v = b64map.indexOf(char);
        if (v < 0) {
            continue;
        }

        switch (k){
            case 0:{
                ret += int2char(v >> 2);
                slop = v & 3;
                break;
            }
            case 1:{
                ret += int2char((slop << 2) | (v >> 4));
                slop = v & 0xf;
                break;
            }
            case 2:{
                ret += int2char(slop);
                ret += int2char(v >> 2);
                slop = v & 3;
                break;
            }
            default:{
                ret += int2char((slop << 2) | (v >> 4));
                ret += int2char(v & 0xf);
            }
        }

        k = (++k) % 3

    }
    if (k === 1) {
        ret += int2char(slop << 2);
    }
    return ret;
}


/**
 * 将 base64字符串 转为 字节数字数组
 * @remarks
 * 1. 它会先通过 {@link b64tohex} 转为 16 进制的字符串，
 * 2. 然后将每两个16进制数转为一个数字，
 * 3. 然后将字些数字组成为了组并返回
 * @param s 
 * @returns 
 */
export function b64toBA(s:string) {
    // piggyback on b64tohex for now, optimize later
    const h = b64tohex(s);
    let i;
    const a = [];
    const length = h.length;
    for (i = 0; i < length; i+=2) {
        a[i] = parseInt(h.substring(i, i + 2), 16);
    }
    return a;
}
