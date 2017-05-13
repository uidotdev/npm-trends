import React, {Component, PropTypes} from 'react';

var elasticsearch_url = $("meta[name='elasticsearch_url']").attr('content');

export default class SearchForm extends Component {

	static propTypes = {
		curr_packets: PropTypes.string.isRequired,
		onSearch: PropTypes.func.isRequired,
	}

	componentDidMount() {
		var component = this;

		var getAutocompleteResults = function(query, cb){

			var suggest_query = {
				'autocomplete_suggest': {
					'text': query,
					'completion': {
						'field': 'suggest'
					} 
				}
			}

			$.ajax({
				url: "http://" + elasticsearch_url + "/npm/_suggest",
				dataType: 'json',
				method: "POST",
				data: JSON.stringify(suggest_query),
				success: function(data){
					cb(data.autocomplete_suggest[0].options);
				}.bind(this)
			});
		}

		$('.autocomplete').autocomplete({
		  hint: false
		},
		{
		  source: getAutocompleteResults,
		  displayKey: 'text',
		  templates: {
		    suggestion: function (data) {
		      return "<div class='autocomplete-name'>" + data.text + "</div><div class='autocomplete-description'>" + data.payload.description + "</div>";
		    }
			}
		}).on('autocomplete:selected', function(event, suggestion, dataset) {
			component.props.onSearch(suggestion.text);
			this.form.reset();
			$('.autocomplete').autocomplete('val', '');
	  });
	}

	handleSubmit = (e) => {
		e.preventDefault();
		$('.autocomplete').autocomplete('close');
		var query = this.refs.search_query.value.toLowerCase();
		this.refs.search_query.form.reset();
		$('.autocomplete').autocomplete('val', '');
		this.props.onSearch(query);
		return;
	}

	render(){
		return (
			<form onSubmit={this.handleSubmit} name="seachForm" id="search_form" autoComplete="off">
				<input id="search_form_input" 
							 className="autocomplete"
				       ref="search_query" 
				       type="text"
				       placeholder="Enter an npm package..."/>
			</form>
		);
	}

};


