import { useState, type SyntheticEvent } from "react";

export default function SearchBar({ onSearch, initialValue = "" }: {
  onSearch: (query: string) => void;
  initialValue?: string;
}) {
  const [query, setQuery] = useState(initialValue);

  function submit(event: SyntheticEvent<HTMLFormElement>) {
    event.preventDefault();
    onSearch(query.trim());
  }

  return (
    <form className="search-bar" onSubmit={submit}>
      <span aria-hidden="true">⌕</span>
      <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Busque por título, autor ou assunto..." />
      <button className="button" type="submit">Pesquisar</button>
    </form>
  );
}
