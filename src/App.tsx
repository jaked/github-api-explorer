import React from "react";
import Fuse from "fuse.js";
import { Box, FormControl, SelectPanel, TextInput } from "@primer/react";
import { ActionList } from "@primer/react/deprecated";
import GHAPI from "./github.ae.json";

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
        Object.entries(GHAPI.paths).map(([path, endpoint], id) => ({
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
          items={fuse.search(search, { limit: 50 }).map((result) => ({
            text: result.item.path,
            id: result.item.path,
          }))}
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
