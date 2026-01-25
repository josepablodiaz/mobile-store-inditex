import { useState, useEffect } from 'react';
import { useDebounce } from '../../hooks/useDebounce';
import './SearchBar.css';

/**
 * @param {object} props
 * @param {function} props.onSearch 
 * @param {string} props.placeholder
 */
const SearchBar = ({
  onSearch,
  placeholder = 'Search by brand or model...',
}) => {
  const [inputValue, setInputValue] = useState('');

  const debouncedValue = useDebounce(inputValue, 300);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleClear = () => {
    setInputValue('');
  };

  return (
    <div className="search-bar">
      <div className="search-bar-container">
        <svg
          className="search-icon"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="2" />
          <path
            d="M16 16l4 4"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>

        <input
          type="text"
          className="search-input"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleChange}
          aria-label="Search products"
          data-testid="search-input"
        />

        {inputValue && (
          <button
            className="search-clear"
            onClick={handleClear}
            aria-label="Clear search"
            type="button"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
};

export default SearchBar;
