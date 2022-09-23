import { int2char } from "./util";
var b64map = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
var b64pad = "=";
/**
 * 16进制的字符串转为 base64
 * @param h - 16进制的字符串
 * @returns
 */
export function hex2b64(h) {
    var i;
    var ret = "";
    var length = h.length;
    var forLength = length - 3;
    for (i = 0; i <= forLength; i += 3) {
        // 3个字符作为一个16进制的来解析成数字
        var c = parseInt(h.substring(i, i + 3), 16);
        /**
         * 把 c 转为两个数，右 6位 为一个数，剩余的位数为一个数，
         * 然后将这两个数作为索引 从 b64map 取对应的字符 拼在一块
         */
        ret += b64map.charAt(c >> 6) + b64map.charAt(c & 63);
    }
    var restLen = length - i;
    if (restLen === 1) {
        var c = parseInt(h.substring(i, length), 16);
        ret += b64map.charAt(c << 2);
    }
    else if (restLen === 2) {
        var c = parseInt(h.substring(i, length), 16);
        ret += b64map.charAt(c >> 2) + b64map.charAt((c & 3) << 4);
    }
    while ((ret.length & 3) > 0) {
        ret += b64pad;
    }
    return ret;
}
// 转换 base64 字符串为 16进制字符串
export function b64tohex(s) {
    var ret = "";
    var i;
    var k = 0; // base64 的状态，取值为 0、1、2
    var slop = 0;
    var length = s.length;
    for (i = 0; i < length; ++i) {
        var char = s.charAt(i);
        if (char === b64pad) {
            break;
        }
        var v = b64map.indexOf(char);
        if (v < 0) {
            continue;
        }
        switch (k) {
            case 0: {
                ret += int2char(v >> 2);
                slop = v & 3;
                break;
            }
            case 1: {
                ret += int2char((slop << 2) | (v >> 4));
                slop = v & 0xf;
                break;
            }
            case 2: {
                ret += int2char(slop);
                ret += int2char(v >> 2);
                slop = v & 3;
                break;
            }
            default: {
                ret += int2char((slop << 2) | (v >> 4));
                ret += int2char(v & 0xf);
            }
        }
        k = (++k) % 3;
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
export function b64toBA(s) {
    // piggyback on b64tohex for now, optimize later
    var h = b64tohex(s);
    var i;
    var a = [];
    var length = h.length;
    for (i = 0; i < length; i += 2) {
        a[i] = parseInt(h.substring(i, i + 2), 16);
    }
    return a;
}
