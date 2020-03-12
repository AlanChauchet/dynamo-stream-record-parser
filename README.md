### Dynamo StreamRecord parser

dynamo-stream-record-parser is a simple function that helps you parse an AWS Dynamo StreamRecord

## Installation

Dynamo StreamRecord parser is available as `dynamo-stream-record-parser` package on [npm](https://www.npmjs.com/)

With npm

```bash
$ npm install dynamo-stream-record-parser --save
```

If using yarn

```bash
$ yarn add dynamo-stream-record-parser
```

## Examples

`dynamo-stream-record-parser` exports a `parseDynamoStreamRecord` function which parses the data you'll pass as first parameter and returns the parsed value<br/>
You can use `parseDynamoStreamRecord` with any type of value but it will only parse it if it is an array or an object (in any other case, it will just return the given parameter unchanged):

### Use with a Dynamo StreamRecord

```js
import { parseDynamoStreamRecord } from 'dynamo-stream-record-parser';

const streamRecord = {
     eventID: "8f9e7f8e6fg876f78sdf7d9sdf",
     eventName: "INSERT",
     eventVersion: "1.1",
     eventSource: "aws:dynamodb",
     awsRegion: "us-west-2",
     dynamodb: {
       Keys: {
         Id: {
           N: "101"
         }
       },
       NewImage: {
         Message: {
           S: "New item!"
         },
         Id: {
           N: "101"
         }
       },
       ApproximateCreationDateTime: 1428537600,
       SequenceNumber: "1234567890",
       SizeBytes: 26,
       StreamViewType: "NEW_AND_OLD_IMAGES"
     },
     eventSourceARN: "arn:aws:blahblahblah"
}

const parsedStreamRecord = parseDynamoStreamRecord(streamRecord);

// parsedStreamRecord.dynamodb =
// {
//   Keys: {
//     Id: 101
//   },
//   NewImage: {
//     Message: "New item!",
//     Id: 101
//   }
// }
// (Note that other keys of base streamRecord are left unchanged in parsedStreamRecord)
```

### Use with an array of Dynamo StreamRecord

```js
import { parseDynamoStreamRecord } from 'dynamo-stream-record-parser';

const streamRecords = [{
  Keys: {
    Id: {
      N: "101"
    }
  }
}, {
  NewImage: {
    Message: {
      S: "New item!"
    },
    Id: {
      N: "101"
    }
  }
}];

const parsedStreamRecords = parseDynamoStreamRecord(streamRecords);

// parsedStreamRecords =
// [{
//   Keys: {
//     Id: 101
//   }
//  }, {
//   NewImage: {
//     Message: "New item!",
//     Id: 101
//   }
// }]
//
```

### Use with large numbers

The Dynamo StreamRecords holds number values as string because it can go up to `9.9999999999999999999999999999999999999E+125`.
By default, the parser will convert those strings into numbers which could lead to a loss of precision.
If you want to avoid that, you can pass `true` as the second parameter of `parseDynamoStreamRecord` and then all StreamRecords numbers will be converted to `BigInt` instead of regular `Number`.
