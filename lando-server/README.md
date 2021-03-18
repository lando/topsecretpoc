# Lando Server Development

## Language
- `cmd`: A command string (Use `cmd` to indicate a string as opposed to a Command object)
- `Command`: [Model] A Lando command object
- `CommandCall`: [Model] A Lando Command Call object; The highest level object that represents the API call, Command, and stage workflow
- `gRPC Service`: A single gRPC service in either the `.proto` file, the auto generated files, or the custom implementation file.
- `Model`: A JavaScript class used for data structure but not business logic
- `Module`: A NodeJS module; A JavaScript file with exports
- `Stage`: [Model] A CommandCall Stage object.

## Directory Structure
- `grpc`: gRPC services and compiled protobuffers
- `models`: Anemic data models or data structures with little to no business logic

## `grpc` Directory
The `grpc` directory contains compiled protobuf files along with one file per gRPC service.

### gRPC Proto Files
The generated proto files are generated and copied into the `grpc/protos` directory.

These files are not to be edited manually. Any changes to the original `.proto` files
which define gRPC messages and services require the `grpc/protos` files be re-generated.

### gRPC Service Modules
`gRPC Service` refers to the service defined in a `.proto` file, and `Module` refers to
the NodeJS module file that exports the gRPC Service data, health check, & implementation.

JavaScript files in the `grpc` directory are dynamically loaded and attached to the gRPC
server by way of an explicit export format.

Example export:
```javascript
module.exports = {
  name: SERVICE_NAME,
  definition: service.CommandServiceService,
  implementation: {list, run},
  healthCheck,
};
```

## Models
JavaScript files in the `models` directory are Anemic Models, or classes designed
to contain only data and perhaps light logic for formatting or to facilitate the serialization 
and deserialization of properties. These classes will be void of any business logic.

Each model module exports a single class which is explicitly loaded in `models/index.js`
so all models may be accessed as below:

```javascript
const {CommandCall, Stage} = require('./index');
```
