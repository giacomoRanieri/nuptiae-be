export default () => ({
  graphql: {
    schema: process.env.GRAPHQL_SCHEMA_PATH || './schema.gql',
  },
  swagger: {
    spec: process.env.SWAGGER_SPEC_PATH || './swagger-spec.json',
  },
});
