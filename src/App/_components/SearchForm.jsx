import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Fetch from 'services/Fetch';

import $ from 'utils/jqueryImport';
import 'autocomplete.js/dist/autocomplete.jquery.js'; // eslint-disable-line

const propTypes = {
  onSearch: PropTypes.func.isRequired,
};

class SearchForm extends Component {
  constructor(props) {
    super(props);
    this.searchFormRef = React.createRef();
  }

  componentDidMount() {
    const component = this;

    const getAutocompleteResults = (query, cb) => {
      const suggestQuery = {
        autocomplete_suggest: {
          text: query,
          completion: {
            field: 'suggest',
          },
        },
      };

      Fetch.getJSON(
        `${process.env.REACT_APP_ELASTICSEARCH_URL}/npm/_suggest?source=${JSON.stringify(suggestQuery)}`,
      ).then(data => {
        cb(data.autocomplete_suggest[0].options);
      });
    };

    $('.autocomplete')
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
        component.props.onSearch(suggestion.text);
        this.searchFormRef.current.form.reset();
        $('.autocomplete').autocomplete('val', '');
      });
  }

  handleSubmit = e => {
    const { onSearch } = this.props;

    e.preventDefault();
    $('.autocomplete').autocomplete('close');
    const query = this.searchFormRef.current.value.toLowerCase();
    this.searchFormRef.current.form.reset();
    $('.autocomplete').autocomplete('val', '');
    onSearch(query);
  };

  render() {
    return (
      <form onSubmit={this.handleSubmit} name="seachForm" id="search_form" autoComplete="off">
        <input
          ref={this.searchFormRef}
          id="search_form_input"
          className="autocomplete"
          type="text"
          placeholder="Enter an npm package..."
        />
      </form>
    );
  }
}

SearchForm.propTypes = propTypes;

export default SearchForm;
