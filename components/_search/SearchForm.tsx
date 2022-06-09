import { useState, useRef, useEffect, useCallback } from 'react';
import Fetch from 'services/Fetch';

type Props = {
  onSearch: (event: any) => any;
};

const SearchForm = ({ onSearch }: Props) => {
  const [autocomplete, setAutocomplete] = useState(null);
  const searchFormRef = useRef();
  
  useEffect(() => {
    ($('#search_form_input' as any).focus()
  }, [])

  const handlePackageSelection = useCallback(
    (packageName: string) => {
      (searchFormRef.current as any).form.reset();
      ($('.autocomplete') as any).autocomplete('val', '');
      onSearch(packageName);
    },
    [onSearch],
  );

  useEffect(() => {
    // eslint-disable-next-line
    import('autocomplete.js/dist/autocomplete.jquery.js').then(() => {
      const getAutocompleteResults = (query, cb) => {
        const suggestQuery = {
          // eslint-disable-next-line
          autocomplete_suggest: {
            text: query,
            completion: {
              field: 'suggest',
            },
          },
        };

        Fetch.getJSON(
          `${process.env.NEXT_PUBLIC_ELASTICSEARCH_URL}/npm/_suggest?source=${JSON.stringify(suggestQuery)}`,
        ).then((data: any) => {
          cb(data.autocomplete_suggest[0].options);
        });
      };

      const autocompleteInstance = ($('.autocomplete') as any).autocomplete(
        {
          hint: false,
        },
        {
          source: getAutocompleteResults,
          displayKey: 'text',
          templates: {
            suggestion(data) {
              return `<div class='autocomplete-name'>${data.text}</div><div class='autocomplete-description'>${data.payload.description}</div>`;
            },
          },
        },
      );

      setAutocomplete(autocompleteInstance);
    });
  }, []);

  useEffect(() => {
    if (autocomplete) {
      autocomplete.off('autocomplete:selected').on('autocomplete:selected', (event, suggestion) => {
        handlePackageSelection(suggestion.text);
      });
    }
  }, [autocomplete, handlePackageSelection]);

  const handleSubmit = (e) => {
    e.preventDefault();
    ($('.autocomplete') as any).autocomplete('close');
    const query = (searchFormRef.current as any).value.toLowerCase();
    handlePackageSelection(query);
  };

  return (
    <form onSubmit={handleSubmit} name="seachForm" id="search_form" autoComplete="off">
      <input
        ref={searchFormRef}
        id="search_form_input"
        className="autocomplete"
        type="text"
        placeholder="Enter an npm package..."
      />
    </form>
  );
};

export default SearchForm;
