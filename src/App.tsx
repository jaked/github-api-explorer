import React from "react";
import Fuse from "fuse.js";
import { Box, FormControl, SelectPanel, TextInput } from "@primer/react";
import { ActionList } from "@primer/react/deprecated";
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
  };
};

const GHAPI = GHAPI_raw as unknown as OpenAPI;

function App() {
  const [token, setToken] = React.useState("");
  const [search, setSearch] = React.useState("");
  const [open, setOpen] = React.useState(false);
  const [endpoint, setEndpoint] = React.useState<
    undefined | { text?: string; id?: string | number }
  >(undefined);

  const fuse = React.useMemo(
    () =>
      new Fuse(
        Object.entries(GHAPI.paths).map(([path, endpoint]) => ({
          path,
          endpoint,
        })),
        {
          useExtendedSearch: true,
          keys: ["path"],
        }
      ),
    []
  );

  const items = React.useMemo(
    () =>
      fuse.search(search, { limit: 50 }).map((result) => ({
        text: result.item.path,
        id: result.item.path,
      })),
    [search]
  );

  if (endpoint) {
    console.log(GHAPI.paths[endpoint.id]);
  }

  return (
    <Box m={"1em"}>
      <h1>GitHub API Explorer</h1>
      <FormControl>
        <FormControl.Label>Token</FormControl.Label>
        <TextInput
          value={token}
          onChange={(e) => setToken(e.currentTarget.value)}
        />
      </FormControl>
      <FormControl>
        <FormControl.Label>Endpoint</FormControl.Label>
        <SelectPanel
          placeholderText=""
          open={open}
          onOpenChange={setOpen}
          items={items}
          onFilterChange={setSearch}
          selected={endpoint}
          onSelectedChange={setEndpoint}
          overlayProps={{ width: "auto", height: "large" }}
          renderItem={(props) => {
            return <ActionList.Item {...props} />;
          }}
        />
      </FormControl>
    </Box>
  );
}

export default App;
