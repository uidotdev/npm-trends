import { useState, useCallback } from 'react';
import { Combobox, ComboboxInput, ComboboxPopover, ComboboxList, ComboboxOption } from '@reach/combobox';

import Fetch from 'services/Fetch';

type Props = {
  onSearch: (event: any) => any;
};

const SearchForm = ({ onSearch }: Props) => {
  const [results, setResults] = useState([]);
  const [value, setValue] = useState('');

  const handleSearchTermChange = useCallback((e) => {
    setValue(e.target.value);
    const suggestQuery = {
      // eslint-disable-next-line
      autocomplete_suggest: {
        text: e.target.value,
        completion: {
          field: 'suggest',
          size: 10,
        },
      },
    };

    Fetch.getJSON(
      `${process.env.NEXT_PUBLIC_ELASTICSEARCH_URL}/npm/_suggest?source=${JSON.stringify(suggestQuery)}`,
    ).then((data: any) => {
      setResults(data.autocomplete_suggest[0].options);
    });
  }, []);

  return (
    <>
      <Combobox
        id="search_form"
        aria-label="Search for a package"
        onSelect={(query) => {
          onSearch(query);
          setValue('');
        }}
      >
        <ComboboxInput
          id="search_form_input"
          selectOnClick
          value={value}
          placeholder="Enter an npm package..."
          className="autocomplete"
          onChange={handleSearchTermChange}
        />
        {results.length > 0 && (
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
    </>
  );
};

export default SearchForm;
