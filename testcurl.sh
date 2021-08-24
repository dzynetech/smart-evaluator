curl -g --user admin:admin \
	-X POST \
	-H "Content-Type: application/json" \
	-d '{"query":"query MyQuery {\n  query {\n    permits(first: 1) {\n      edges {\n        node {\n          id\n        }\n      }\n    }\n  }\n}\n","operationName":"MyQuery"}' \
	http://smart.dzynetech.com:4401/graphql
