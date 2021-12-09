import { useRef, useState } from 'react';
import { useHistory } from 'react-router';

import { ReactComponent as SearchIcon } from 'assets/icons/search.svg';
import './Search.scss';

const Search = () => {
  const [keyword, setKeyword] = useState('');

  const inputRef = useRef<HTMLInputElement | null>(null);
  const history = useHistory();

  const searchInputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setKeyword(event.target.value);
  };

  const searchHandler = (event: React.FormEvent) => {
    event.preventDefault();

    if (!keyword) return;

    history.push(`/?search=${keyword}`);
    inputRef.current!.blur();
  };

  return (
    <form className="search" onSubmit={searchHandler}>
      <input
        ref={inputRef}
        id="search-input"
        type="text"
        placeholder="Search Videos"
        autoComplete="off"
        value={keyword}
        onChange={searchInputHandler}
      />
      <label htmlFor="search-input">
        <SearchIcon />
      </label>
    </form>
  );
};

export default Search;
