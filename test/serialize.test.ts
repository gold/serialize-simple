import { assertEquals } from 'https://deno.land/std@0.85.0/testing/asserts.ts';
import { serialize, deserialize } from '../mod.ts';

Deno.test({
  name: 'serialize object with checksum',
  fn: () => {
    const obj = {
      who: 'Debussy',
      when: '19th-20th century',
      isComposer: false
    };
    const expectedResult = '%7B%22v%22%3A%7B%22who%22%3A%22Debussy%22%2C%22when%22%3A%2219th-20th%20century%22%2C%22isComposer%22%3Afalse%7D%2C%22_c%22%3A%226708f558a8209d89741e85e8976b4c33b6369b6896d6e091deb9bb7c6c9776af%22%7D'
    const includeChecksum = true;
    const actualResult = serialize(obj, includeChecksum);
    assertEquals(expectedResult, actualResult);
  }
});

Deno.test({
  name: 'serialize object',
  fn: () => {
    const obj = {
      who: 'Debussy',
      when: '19th-20th century',
      isComposer: true
    };
    const expectedResult = '%7B%22who%22%3A%22Debussy%22%2C%22when%22%3A%2219th-20th%20century%22%2C%22isComposer%22%3Atrue%7D';
    const actualResult = serialize(obj);
    assertEquals(expectedResult, actualResult);
  }
});

Deno.test({
  name: 'serialize object (array)',
  fn: () => {
    const obj = [2021, true, 'ftw', { x: 1, y: -3 }];
    const actualResult = serialize(obj);
    const expectedResult = '%5B2021%2Ctrue%2C%22ftw%22%2C%7B%22x%22%3A1%2C%22y%22%3A-3%7D%5D';
    assertEquals(expectedResult, actualResult);
  }
});

Deno.test({
  name: 'serialize string',
  fn: () => {
    const str = 'http://deno.land/x/mediainfo@v1.0.2/mod.ts';
    const expectedResult = '%22http%3A%2F%2Fdeno.land%2Fx%2Fmediainfo%40v1.0.2%2Fmod.ts%22';
    const actualResult = serialize(str);
    assertEquals(expectedResult, actualResult);
  }
});

Deno.test({
  name: 'serialize number',
  fn: () => {
    const n = 77.77;
    const actualResult = serialize(n);
    const expectedResult = '77.77';
    assertEquals(actualResult, expectedResult);
  }
});

interface DeserializeObject { who?: string; isChef?: boolean; };
Deno.test({
  name: 'deserialize object',
  fn: () => {
    const serializedStr = '%7B%22who%22%3A%22Shostakovich%22%2C%22when%22%3A%2220th%20century%22%2C%22isChef%22%3Afalse%7D';
    const obj: DeserializeObject = deserialize(serializedStr);
    const expectedWho = 'Shostakovich';
    const actualWho = obj.who;
    assertEquals(expectedWho, actualWho);
    assertEquals(obj.isChef, false, 'obj.isChef should be false');
  }
});

interface DeserializeObjectArray { length?: number; 1?: boolean; 3?: object; }
Deno.test({
  name: 'deserialize object (array)',
  fn: () => {
    // unserialized: [2021, true, 'ftw', { x: 1, y: -3 }]
    const serializedStr = '%5B2021%2Ctrue%2C%22ftw%22%2C%7B%22x%22%3A1%2C%22y%22%3A-3%7D%5D';
    const arr: DeserializeObjectArray  = deserialize(serializedStr);
    assertEquals(arr.length, 4);
    assertEquals(typeof arr[1], 'boolean');
    assertEquals(typeof arr[3], 'object');
  }
});

Deno.test({
  name: 'deserialize object with checksum',
  fn: () => {
    const serializedStr = '%7B%22v%22%3A%7B%22who%22%3A%22Debussy%22%2C%22when%22%3A%2219th-20th%20century%22%2C%22isComposer%22%3Afalse%7D%2C%22_c%22%3A%226708f558a8209d89741e85e8976b4c33b6369b6896d6e091deb9bb7c6c9776af%22%7D'
    const obj = deserialize(serializedStr);
    assertEquals(serializedStr.length > 1, true);
  }
});

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// bad input tests
// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
Deno.test({
  name: 'deserialize with badly formed input, throw exception',
  fn: () => {
    // correctly URL encoded, but invalid JSON
    const badInput = '%5B2021%2Ctrue%2Cftw%22%2C%7B%22x%22%3A1%2C%22y%22%3A-3%7D%5D';
    const shouldThrow = true;
    try {
      deserialize(badInput);
    } catch (e) {
      assertEquals(e instanceof SyntaxError, true);
    }
  }
});

Deno.test({
  name: 'deserialize object with invalid checksum, throw exception',
  fn: () => {
    const serializedStr = '%7B%22v%22%3A%7B%22who%22%3A%22DDebussy%22%2C%22when%22%3A%2219th-20th%20century%22%2C%22isComposer%22%3Afalse%7D%2C%22_c%22%3A%226708f558a8209d89741e85e8976b4c33b6369b6896d6e091deb9bb7c6c9776af%22%7D'
    //                                                    ^
    //                                                 added "D"
    try {
      const obj = deserialize(serializedStr);
    } catch (e) {
      assertEquals(e.name, 'ChecksumError');
    }
  }
});
