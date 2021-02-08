// Copyright 2021-Eternity Channelping. All rights reserved. MIT License.

/**
 * @param {object|string|number} obj - typically an object, but allow string or number
 * @param {boolean} shouldThrow - allow caller the option of catching error (default false)
 * @return {string} If bad input and shoudThrow is false, return empty string
 */
const serialize = (obj: object | string | number, shouldThrow: boolean = false): string => {
  try {
    return encodeURIComponent(JSON.stringify(obj));
  } catch (e) {
    if (shouldThrow) {
      throw e;
    } else {
      return ''
    }
  }
};

/**
 * @param {string} str - URL encoded JSON
 * @param {boolean} shouldThrow - allow caller the option of catching error (default false)
 * @return {object} If bad input and shoudThrow is false, return empty object
 */
const deserialize = (str: string, shouldThrow: boolean = false): object => {
  try {
    return JSON.parse(decodeURIComponent(str));
  } catch(e) {
    if (shouldThrow) {
      throw e;
    } else {
      return {};
    }
  }
};

// provide import flexibility, e.g.:
//  import { SerializeSimple } from 'https://deno.land/x/serialize-simple/mod.ts'
//  import { deserialize } from 'https://deno.land/x/serialize-simple/mod.ts'
const SerializeSimple = { serialize, deserialize };
export {
  SerializeSimple,
  serialize,
  deserialize
};
