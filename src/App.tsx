import React from "react";
import Fuse from "fuse.js";
import GHAPI from "./GHAPI";

import {
  Combobox,
  ComboboxInput,
  ComboboxPopover,
  ComboboxList,
  ComboboxOption,
  ComboboxOptionText,
} from "@reach/combobox";
import "@reach/combobox/styles.css";

const Header = () => {
  const [token, setToken] = React.useState("");

  return (
    <div className="m-2">
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

const EndpointPicker = () => {
  const [search, setSearch] = React.useState("");
  const [endpoint, setEndpoint] = React.useState("");

  const comboboxListRef = React.useRef<HTMLUListElement>(null);

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

  // from https://github.com/reach/reach-ui/issues/357
  const onKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (!event.isDefaultPrevented()) {
      const comboboxList = comboboxListRef.current;
      if (!comboboxList) return;

      window.requestAnimationFrame(() => {
        const element = comboboxList.querySelector(
          "[aria-selected=true]"
        ) as HTMLElement;
        if (element) {
          const top = element.offsetTop - comboboxList.scrollTop;
          const bottom =
            comboboxList.scrollTop +
            comboboxList.clientHeight -
            (element.offsetTop + element.clientHeight);

          if (bottom < 0) comboboxList.scrollTop -= bottom;
          if (top < 0) comboboxList.scrollTop += top;
        }
      });
    }
  };

  return (
    <div>
      <Combobox openOnFocus={true} onSelect={setEndpoint} aria-label="endpoint">
        <ComboboxInput
          className="w-full border-2 outline-1"
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={onKeyDown}
        />
        <ComboboxPopover portal={false}>
          <ComboboxList
            // relative so it's the offsetParent for items, to make onKeyDown work
            className="max-h-48 overflow-auto relative"
            ref={comboboxListRef}
          >
            {items.map((item) => (
              <ComboboxOption value={item.text} />
            ))}
          </ComboboxList>
        </ComboboxPopover>
      </Combobox>
      <div>
        {GHAPI.paths[endpoint] && (
          <pre>{JSON.stringify(GHAPI.paths[endpoint], undefined, 2)}</pre>
        )}
      </div>
    </div>
  );
};

const App = () => {
  return (
    <div className="flex flex-col h-full bg-blue-100">
      <div className="flex-none">
        <Header />
      </div>
      <div className="grid grid-cols-3 h-full flex-1 m-2 gap-2">
        <div className="rounded-l-2xl border-2 border-black bg-white p-2">
          <EndpointPicker />
        </div>
        <div className="border-2 border-black bg-white p-2">2</div>
        <div className="rounded-r-2xl border-2 border-black bg-white p-2">
          3
        </div>
      </div>
    </div>
  );
};

export default App;
