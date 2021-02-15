# serialize_simple

## Usage
```javascript
import { SerializeSimple } from 'https://deno.land/x/serialize_simple/mod.ts';

// OR

import { serialize, deserialize } from 'https://deno.land/x/serialize_simple/mod.ts';

const obj = { data: [2021, true, 'ftw', { x: 1, y: -3 }] };
const result = SerializeSimple.serialize(obj);
```

`result` is a string that can be deserialized in any other conventional
language/system:

`result: "%7B%22data%22%3A%5B2021%2Ctrue%2C%22ftw%22%2C%7B%22x%22%3A1%2C%22y%22%3A-3%7D%5D%7D"`

The `deserialize` method takes a serialized string as input and returns native JavaScript object.

## Security

When serializing your data, you can optionally have a checksum embedded in the
serialzed object. This value is used to check the integrity when deserializing.

The deserialize operation will automatically detect if the serialized object had
included a checksum or not. If it does detect a checksum, the deserialize method
will automatically validate the integrity of the serialized object. If valid,
deserialize returns the original object. If checksum is not valid, deserialize
throws an exception.

```javascript
const data = { description: 'critical information', coefficient: 1.07 };
const includeChecksum = true;
const serializedObj = serialize(data, includeChecksum);

try {
  const originalData = deserialize(serializedObj);
} catch (e) {
  // The serializedObj had been tampered with en route
  // if e.name === 'ChecksumError'
console.info(e);
}
```

## More Details
The `serialize_simple` module uses standard tech, thus providing complete
interoperability among various languages, frameworks, operating systems, and
environments.

Escaping dynamically created objects for shell command safety is painstaking and
error prone. `serialize_simple` is an easy solution.

When using `serialize_simple`, your application can invoke a command line
program (written in Python, for example) and send a list of parameters
without worrying about unpredictable shell behavior encountering special
characters.

## Interoperability Example: Python Port

Serialization is a simple, two-step process:

1. JSON.stringify native object.
2. URL encode the JSON.

Deserialization is the same, in reverse:

1. URL decode the string back to JSON.
2. JSON.parse the JSON string back to native object.

Below is a script demonstrating an implementation of deserialize in python:

```python
#!/usr/bin/env python
import sys
import urllib.parse
import json

def deserialize(str):
  json_str = urllib.parse.unquote(str)
  return json.loads(json_str)

def main():
  # get serialized params from command line
  serialized_str = sys.argv[1]
  # => %7B%22port%22%3A9393%2C%22host%22%3A%22cezanne.museum%22%2C%22baroque%22%3Afalse%7D

  # deserialize string created by Deno's serialize_simple module
  native_object = deserialize(serialized_str)

  print(native_object) # => {'port': 9393, 'host': 'cezanne.museum', 'baroque': False}

if __name__ == '__main__':
    main()
```

## Contribute

Merely by using this module, you will contribute to your own productivity.

Have fun!

Gerry Gold, 2021
