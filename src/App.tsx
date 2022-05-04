import React from "react";
import Fuse from "fuse.js";
import GHAPI from "./GHAPI";

const Header = () => {
  const [token, setToken] = React.useState("");

  return (
    <div>
      <h1 className="text-3xl">GitHub API Explorer</h1>
      <label>
        Token
        <input
          id="token"
          type="text"
          value={token}
          onChange={(e) => setToken(e.currentTarget.value)}
        />
      </label>
    </div>
  );
};

const App = () => {
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
    <>
      <Header />
      <div className="grid grid-cols-3 h-full">
        <div className="h-full rounded-2xl border-2">1</div>
        <div className="h-full rounded-2xl border-2">2</div>
        <div className="h-full rounded-2xl border-2">3</div>
      </div>
    </>
  );
};

export default App;
