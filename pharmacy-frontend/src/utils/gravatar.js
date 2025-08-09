/**
 * Simple MD5 hash implementation for browser
 * @param {string} string - The string to hash
 * @returns {string} - MD5 hash
 */
const md5 = (string) => {
  function rotateLeft(lValue, iShiftBits) {
    return (lValue << iShiftBits) | (lValue >>> (32 - iShiftBits));
  }

  function addUnsigned(lX, lY) {
    const lX4 = lX & 0x40000000;
    const lY4 = lY & 0x40000000;
    const lX8 = lX & 0x80000000;
    const lY8 = lY & 0x80000000;
    const lResult = (lX & 0x3fffffff) + (lY & 0x3fffffff);
    if (lX4 & lY4) {
      return lResult ^ 0x80000000 ^ lX8 ^ lY8;
    }
    if (lX4 | lY4) {
      if (lResult & 0x40000000) {
        return lResult ^ 0xc0000000 ^ lX8 ^ lY8;
      } else {
        return lResult ^ 0x40000000 ^ lX8 ^ lY8;
      }
    } else {
      return lResult ^ lX8 ^ lY8;
    }
  }

  function f(x, y, z) {
    return (x & y) | (~x & z);
  }
  function g(x, y, z) {
    return (x & z) | (y & ~z);
  }
  function h(x, y, z) {
    return x ^ y ^ z;
  }
  function i(x, y, z) {
    return y ^ (x | ~z);
  }

  function ff(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(f(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function gg(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(g(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function hh(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(h(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function ii(a, b, c, d, x, s, ac) {
    a = addUnsigned(a, addUnsigned(addUnsigned(i(b, c, d), x), ac));
    return addUnsigned(rotateLeft(a, s), b);
  }

  function convertToWordArray(string) {
    let lWordCount;
    const lMessageLength = string.length;
    const lNumberOfWords_temp1 = lMessageLength + 8;
    const lNumberOfWords_temp2 = (lNumberOfWords_temp1 - (lNumberOfWords_temp1 % 64)) / 64;
    const lNumberOfWords = (lNumberOfWords_temp2 + 1) * 16;
    const lWordArray = Array(lNumberOfWords - 1);
    let lBytePosition = 0;
    let lByteCount = 0;
    while (lByteCount < lMessageLength) {
      lWordCount = (lByteCount - (lByteCount % 4)) / 4;
      lBytePosition = (lByteCount % 4) * 8;
      lWordArray[lWordCount] = lWordArray[lWordCount] | (string.charCodeAt(lByteCount) << lBytePosition);
      lByteCount++;
    }
    lWordCount = (lByteCount - (lByteCount % 4)) / 4;
    lBytePosition = (lByteCount % 4) * 8;
    lWordArray[lWordCount] = lWordArray[lWordCount] | (0x80 << lBytePosition);
    lWordArray[lNumberOfWords - 2] = lMessageLength << 3;
    lWordArray[lNumberOfWords - 1] = lMessageLength >>> 29;
    return lWordArray;
  }

  function wordToHex(lValue) {
    let wordToHexValue = '';
    let wordToHexValue_temp = '';
    let lByte;
    let lCount;
    for (lCount = 0; lCount <= 3; lCount++) {
      lByte = (lValue >>> (lCount * 8)) & 255;
      wordToHexValue_temp = '0' + lByte.toString(16);
      wordToHexValue = wordToHexValue + wordToHexValue_temp.substr(wordToHexValue_temp.length - 2, 2);
    }
    return wordToHexValue;
  }

  let x = Array();
  let k, aa, bb, cc, dd, a, b, c, d;
  const s11 = 7, s12 = 12, s13 = 17, s14 = 22;
  const s21 = 5, s22 = 9, s23 = 14, s24 = 20;
  const s31 = 4, s32 = 11, s33 = 16, s34 = 23;
  const s41 = 6, s42 = 10, s43 = 15, s44 = 21;

  x = convertToWordArray(string);
  a = 0x67452301; b = 0xefcdab89; c = 0x98badcfe; d = 0x10325476;

  for (k = 0; k < x.length; k += 16) {
    aa = a; bb = b; cc = c; dd = d;
    a = ff(a, b, c, d, x[k + 0], s11, 0xd76aa478);
    d = ff(d, a, b, c, x[k + 1], s12, 0xe8c7b756);
    c = ff(c, d, a, b, x[k + 2], s13, 0x242070db);
    b = ff(b, c, d, a, x[k + 3], s14, 0xc1bdceee);
    a = ff(a, b, c, d, x[k + 4], s11, 0xf57c0faf);
    d = ff(d, a, b, c, x[k + 5], s12, 0x4787c62a);
    c = ff(c, d, a, b, x[k + 6], s13, 0xa8304613);
    b = ff(b, c, d, a, x[k + 7], s14, 0xfd469501);
    a = ff(a, b, c, d, x[k + 8], s11, 0x698098d8);
    d = ff(d, a, b, c, x[k + 9], s12, 0x8b44f7af);
    c = ff(c, d, a, b, x[k + 10], s13, 0xffff5bb1);
    b = ff(b, c, d, a, x[k + 11], s14, 0x895cd7be);
    a = ff(a, b, c, d, x[k + 12], s11, 0x6b901122);
    d = ff(d, a, b, c, x[k + 13], s12, 0xfd987193);
    c = ff(c, d, a, b, x[k + 14], s13, 0xa679438e);
    b = ff(b, c, d, a, x[k + 15], s14, 0x49b40821);
    a = gg(a, b, c, d, x[k + 1], s21, 0xf61e2562);
    d = gg(d, a, b, c, x[k + 6], s22, 0xc040b340);
    c = gg(c, d, a, b, x[k + 11], s23, 0x265e5a51);
    b = gg(b, c, d, a, x[k + 0], s24, 0xe9b6c7aa);
    a = gg(a, b, c, d, x[k + 5], s21, 0xd62f105d);
    d = gg(d, a, b, c, x[k + 10], s22, 0x2441453);
    c = gg(c, d, a, b, x[k + 15], s23, 0xd8a1e681);
    b = gg(b, c, d, a, x[k + 4], s24, 0xe7d3fbc8);
    a = gg(a, b, c, d, x[k + 9], s21, 0x21e1cde6);
    d = gg(d, a, b, c, x[k + 14], s22, 0xc33707d6);
    c = gg(c, d, a, b, x[k + 3], s23, 0xf4d50d87);
    b = gg(b, c, d, a, x[k + 8], s24, 0x455a14ed);
    a = gg(a, b, c, d, x[k + 13], s21, 0xa9e3e905);
    d = gg(d, a, b, c, x[k + 2], s22, 0xfcefa3f8);
    c = gg(c, d, a, b, x[k + 7], s23, 0x676f02d9);
    b = gg(b, c, d, a, x[k + 12], s24, 0x8d2a4c8a);
    a = hh(a, b, c, d, x[k + 5], s31, 0xfffa3942);
    d = hh(d, a, b, c, x[k + 8], s32, 0x8771f681);
    c = hh(c, d, a, b, x[k + 11], s33, 0x6d9d6122);
    b = hh(b, c, d, a, x[k + 14], s34, 0xfde5380c);
    a = hh(a, b, c, d, x[k + 1], s31, 0xa4beea44);
    d = hh(d, a, b, c, x[k + 4], s32, 0x4bdecfa9);
    c = hh(c, d, a, b, x[k + 7], s33, 0xf6bb4b60);
    b = hh(b, c, d, a, x[k + 10], s34, 0xbebfbc70);
    a = hh(a, b, c, d, x[k + 13], s31, 0x289b7ec6);
    d = hh(d, a, b, c, x[k + 0], s32, 0xeaa127fa);
    c = hh(c, d, a, b, x[k + 3], s33, 0xd4ef3085);
    b = hh(b, c, d, a, x[k + 6], s34, 0x4881d05);
    a = hh(a, b, c, d, x[k + 9], s31, 0xd9d4d039);
    d = hh(d, a, b, c, x[k + 12], s32, 0xe6db99e5);
    c = hh(c, d, a, b, x[k + 15], s33, 0x1fa27cf8);
    b = hh(b, c, d, a, x[k + 2], s34, 0xc4ac5665);
    a = ii(a, b, c, d, x[k + 0], s41, 0xf4292244);
    d = ii(d, a, b, c, x[k + 7], s42, 0x432aff97);
    c = ii(c, d, a, b, x[k + 14], s43, 0xab9423a7);
    b = ii(b, c, d, a, x[k + 5], s44, 0xfc93a039);
    a = ii(a, b, c, d, x[k + 12], s41, 0x655b59c3);
    d = ii(d, a, b, c, x[k + 3], s42, 0x8f0ccc92);
    c = ii(c, d, a, b, x[k + 10], s43, 0xffeff47d);
    b = ii(b, c, d, a, x[k + 1], s44, 0x85845dd1);
    a = ii(a, b, c, d, x[k + 8], s41, 0x6fa87e4f);
    d = ii(d, a, b, c, x[k + 15], s42, 0xfe2ce6e0);
    c = ii(c, d, a, b, x[k + 6], s43, 0xa3014314);
    b = ii(b, c, d, a, x[k + 13], s44, 0x4e0811a1);
    a = ii(a, b, c, d, x[k + 4], s41, 0xf7537e82);
    d = ii(d, a, b, c, x[k + 11], s42, 0xbd3af235);
    c = ii(c, d, a, b, x[k + 2], s43, 0x2ad7d2bb);
    b = ii(b, c, d, a, x[k + 9], s44, 0xeb86d391);
    a = addUnsigned(a, aa);
    b = addUnsigned(b, bb);
    c = addUnsigned(c, cc);
    d = addUnsigned(d, dd);
  }

  const temp = wordToHex(a) + wordToHex(b) + wordToHex(c) + wordToHex(d);
  return temp.toLowerCase();
};

/**
 * Generate Gravatar URL from email address
 * @param {string} email - The email address
 * @param {number} size - The size of the image (default: 80)
 * @param {string} defaultImage - Default image type (default: 'mp' for mystery person)
 * @returns {string} - The Gravatar URL
 */
export const getGravatarUrl = (email, size = 80, defaultImage = 'mp') => {
  if (!email) return null;
  
  // Create MD5 hash of the email
  const emailHash = md5(email.toLowerCase().trim());
  
  // Return Gravatar URL
  return `https://www.gravatar.com/avatar/${emailHash}?s=${size}&d=${defaultImage}`;
};

/**
 * Check if Gravatar exists for an email
 * @param {string} email - The email address
 * @returns {Promise<boolean>} - Whether Gravatar exists
 */
export const hasGravatar = async (email) => {
  if (!email) return false;
  
  try {
    const emailHash = CryptoJS.MD5(email.toLowerCase().trim()).toString();
    const response = await fetch(`https://www.gravatar.com/avatar/${emailHash}?d=404`);
    return response.status === 200;
  } catch (error) {
    return false;
  }
};
