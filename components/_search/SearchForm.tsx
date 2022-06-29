import { useState, useCallback } from 'react';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';

import Fetch from 'services/Fetch';
import { useSearchPackages } from 'services/queries';

type Props = {
  onSearch: (event: any) => any;
};

const SearchForm = ({ onSearch }: Props) => {
  const [value, setValue] = useState('');

  const { data: results } = useSearchPackages(value);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      onSearch(value);
      setValue('');
    },
    [value, onSearch],
  );

  const handleSelect = useCallback(
    (query) => {
      onSearch(query);
      setValue('');
    },
    [onSearch],
  );

  return (
    <form onSubmit={handleSubmit} className={results.length ? 'results' : ''}>
      <Combobox openOnFocus id="search_form" aria-label="Search for a package" onSelect={handleSelect}>
        <ComboboxInput
          id="search_form_input"
          selectOnClick
          value={value}
          placeholder="Enter an npm package..."
          className="autocomplete"
          onChange={(e) => setValue(e.target.value)}
        />
        {Boolean(results?.length) && (
          <ComboboxPopover className="combobox-popover">
            <ComboboxList>
              {results.map((result) => (
                <ComboboxOption key={result.text} value={result.text} className="combobox-option">
                  <span className="search-result-title">{result.text}</span>
                  <span className="search-result-description">{result.payload.description}</span>
                </ComboboxOption>
              ))}
            </ComboboxList>
          </ComboboxPopover>
        )}
      </Combobox>
    </form>
  );
};

export default SearchForm;
