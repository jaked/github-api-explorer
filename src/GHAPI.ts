import GHAPI_raw from "./api.github.com.json";

// see also https://github.com/drwpow/openapi-typescript/blob/main/src/types.ts
// see also https://github.com/metadevpro/openapi3-ts/blob/master/src/model/OpenApi.ts

type Ref = { $ref: string };
type RefOr<T> = Ref | T;

type Tag = { name: string; description: string };

type Schema = {
  description?: string;
  type?: "integer" | "number" | "string" | "boolean" | "object" | "array";
  anyOf?: RefOr<Schema>[];
  format?: "date-time" | "uri";
  enum?: any[];
  example?: any;
  nullable?: boolean;
  properties?: Record<string, RefOr<Schema>>;
  required?: string[];
  items?: RefOr<Schema>;
};

type Parameter = {
  name: string;
  in: "path" | "query";
  required: boolean;
  schema: Schema;
};

type Operation = {
  summary: string;
  description: string;
  tags: string[];
  externalDocs?: {
    url: string;
  };
  parameters?: RefOr<Parameter>[];
};

type Path = {
  get?: Operation;
  put?: Operation;
  post?: Operation;
  delete?: Operation;
  options?: Operation;
  head?: Operation;
  patch?: Operation;
  trace?: Operation;
};

type OpenAPI = {
  tags: Tag[];
  paths: Record<string, Path>;
  components: {
    schemas: Record<string, Schema>;
    parameters: Record<string, Parameter>;
  };
};

export default GHAPI_raw as unknown as OpenAPI;
