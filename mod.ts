// Copyright 2021-Eternity Channelping. All rights reserved. MIT License.

import { createHash } from 'https://deno.land/std@0.87.0/hash/mod.ts';

type InputObjectValue = object | string | number;
interface ChecksumObject { v: InputObjectValue, _c: string }

const HASH_ALGORITHM = 'sha256';
const HEX_STRING_RX = /^[a-fA-F0-9]+$/;

class ChecksumError extends Error {
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
  }
}

/**
 * @param {InputObjectValue} obj object, string, number
 * @param {boolean} includeChecksum optional - embed hash of input object for a
 *                                             deserialize method to check against.
 * @return {string} a serialized string which is both shell and URL safe.
 */
const serialize = (obj: InputObjectValue, includeChecksum: boolean = false): string => {
  try {
    if (includeChecksum) {
      const checksumObj: ChecksumObject = { v: {}, _c: '' };
      const serializedObject = encodeURIComponent(JSON.stringify(obj));
      checksumObj.v = obj;
      checksumObj._c = createChecksum(serializedObject)
      return encodeURIComponent(JSON.stringify(checksumObj));
    } else {
      return encodeURIComponent(JSON.stringify(obj));
    }
  } catch (e) {
    throw e;
  }
};

/**
 * @param {string} str - URL encoded JSON
 * @return {object} If bad input and shoudThrow is false, return empty object
 */
const deserialize = (str: string): object => {
  try {
    const obj = JSON.parse(decodeURIComponent(str));

    const expectedChecksum = getExistingChecksum(obj);
    if (expectedChecksum.length > 0) {
      const serializedObject = encodeURIComponent(JSON.stringify(obj.v));
      const computedChecksum = createChecksum(serializedObject);
      if (expectedChecksum === computedChecksum) {
        return obj.v;
      } else {
        throw new ChecksumError('Embedded checksum does not match data. Data integrity is questionable.');
      }
    } else {
      return obj;
    }
  } catch(e) {
    throw e;
  }
};

const createChecksum = (str: string): string => {
  const hash = createHash(HASH_ALGORITHM);
  hash.update(str);
  return hash.toString();
}

/**
* Check if object has exactly two keys: v and _c. If _c is a hex string, then
* it's almost certain that it's a value against which to check the integrity of
* the original value, referenced by v.
*
* @param {ChecksumObject} obj
* @return {string} return hex string if checksum is on object, else empty string
*/
const getExistingChecksum = (obj: ChecksumObject): string => {
  if (typeof obj === 'object') {
    const expectedKeys = ['v', '_c'];
    const objKeys = Object.keys(obj);
    const isSameMessageShape = (expectedKeys.length == objKeys.length) && expectedKeys.every((el, idx) => {
      return el === objKeys[idx];
    });
    return isSameMessageShape && HEX_STRING_RX.test(obj._c) ? obj._c : '';
  }
  return ''
}

// provide import flexibility, e.g.:
//  import { SerializeSimple } from 'https://deno.land/x/serialize_simple/mod.ts'
//  import { deserialize } from 'https://deno.land/x/serialize_simple/mod.ts'
const SerializeSimple = { serialize, deserialize };
export {
  SerializeSimple,
  serialize,
  deserialize
};
