test:
	node ./client/test.js

serve:
	node ./bin/lando-server.js

protos: proto-command-call

proto-command-call:
	protoc -I=. ./protos/lando.proto \
		--js_out=import_style=commonjs,binary:./build \
		--grpc_out=./build \
		--plugin=protoc-gen-grpc=`which grpc_tools_node_protoc_plugin`
