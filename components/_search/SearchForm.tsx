import { useRef, useEffect } from 'react';
import Fetch from 'services/Fetch';

type Props = {
  onSearch: (event: any) => any;
};

const SearchForm = ({ onSearch }: Props) => {
  const searchFormRef = useRef();

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

      ($('.autocomplete') as any)
        .autocomplete(
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
        )
        .on('autocomplete:selected', (event, suggestion) => {
          onSearch(suggestion.text);

          (searchFormRef.current as any).form.reset();
          ($('.autocomplete') as any).autocomplete('val', '');
        });
    });
  }, [onSearch, searchFormRef]);

  const handleSubmit = (e) => {
    e.preventDefault();
    ($('.autocomplete') as any).autocomplete('close');
    const query = (searchFormRef.current as any).value.toLowerCase();
    (searchFormRef.current as any).form.reset();
    ($('.autocomplete') as any).autocomplete('val', '');
    onSearch(query);
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
