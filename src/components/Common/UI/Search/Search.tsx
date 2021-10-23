import SearchIcon from 'assets/icons/search.svg';
import './Search.scss';

const Search = () => {
  const searchHandler = (event: React.FormEvent): void => {
    event.preventDefault();

    console.log('SEARCH!');
  };

  return (
    <form className="search" onSubmit={searchHandler}>
      <input id="search-input" type="text" placeholder="Search Videos" />
      <label htmlFor="search-input">
        <SearchIcon />
      </label>
    </form>
  );
};

export default Search;
