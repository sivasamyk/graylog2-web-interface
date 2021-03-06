'use strict';

var React = require('react');
var ButtonInput = require('react-bootstrap').ButtonInput;
var Immutable = require('immutable');
var TypeAheadInput = require('./TypeAheadInput');

var TypeAheadDataFilter = React.createClass({
    getInitialState() {
        return {
            filterText: '',
            filters: Immutable.OrderedSet(),
            filterByKey: `${this.props.filterBy}s`
        };
    },
    _onSearchTextChanged(event) {
        event.preventDefault();
        this.setState({filterText: this.refs.typeAheadInput.getValue()}, this.filterData);
    },
    _onFilterAdded(event, suggestion) {
        this.setState({
            filters: this.state.filters.add(suggestion[this.props.displayKey]),
            filterText: ''
        }, this.filterData);
        this.refs.typeAheadInput.clear();
    },
    _onFilterRemoved(event) {
        event.preventDefault();
        this.setState({filters: this.state.filters.delete(event.target.getAttribute("data-target"))}, this.filterData);
    },
    _matchFilters(datum) {
        return this.state.filters.every((filter) => {
            var dataToFilter = datum[this.state.filterByKey];

            if (this.props.filterSuggestionAccessor) {
                dataToFilter = dataToFilter.map((data) => data[this.props.filterSuggestionAccessor].toLocaleLowerCase());
            } else {
                dataToFilter = dataToFilter.map(data => data.toLocaleLowerCase());
            }

            return dataToFilter.indexOf(filter.toLocaleLowerCase()) !== -1;
        }, this);
    },
    _matchStringSearch(datum) {
        return this.props.searchInKeys.some((searchInKey) => {
            var key = datum[searchInKey];
            var value = this.state.filterText;

            if (key === null) {
                return false;
            }
            var containsFilter = function (entry, value) {
                if (typeof entry === 'undefined') {
                    return false;
                }
                return entry.toLocaleLowerCase().indexOf(value.toLocaleLowerCase()) !== -1;
            };

            if (typeof key === 'object') {
                return key.some((arrayEntry) => containsFilter(arrayEntry, value));
            } else {
                return containsFilter(key, value);
            }
        }, this);
    },
    _resetFilters() {
        this.refs.typeAheadInput.clear();
        this.setState({filterText: '', filters: Immutable.OrderedSet()}, this.filterData);
    },
    filterData() {
        if (typeof this.props.filterData === 'function') {
            return this.props.filterData(this.props.data);
        }

        var filteredData = this.props.data.filter((datum) => {
            return this._matchFilters(datum) && this._matchStringSearch(datum);
        }, this);

        this.props.onDataFiltered(filteredData);
    },
    render() {
        var filters = this.state.filters.map((filter) => {
            return (
                <li key={`li-${filter}`}>
                    <span className="pill label label-default">
                        {this.props.filterBy}: {filter}
                        <a className="tag-remove" data-target={filter} onClick={this._onFilterRemoved}/>
                    </span>
                </li>
            );
        });

        var suggestions;

        if (this.props.filterSuggestionAccessor) {
            suggestions = this.props.filterSuggestions.map((filterSuggestion) => filterSuggestion[this.props.filterSuggestionAccessor].toLocaleLowerCase());
        } else {
            suggestions = this.props.filterSuggestions.map((filterSuggestion) => filterSuggestion.toLocaleLowerCase());
        }

        suggestions.filter((filterSuggestion) => !this.state.filters.includes(filterSuggestion));

        return (
            <div className="filter">
                <form className="form-inline" onSubmit={this._onSearchTextChanged} style={{display: 'inline'}}>
                    <TypeAheadInput ref="typeAheadInput"
                                    onSuggestionSelected={this._onFilterAdded}
                                    suggestionText={`Filter by ${this.props.filterBy}: `}
                                    suggestions={suggestions}
                                    label={this.props.label}
                                    displayKey={this.props.displayKey}/>
                    <ButtonInput type="submit" value="Filter" style={{marginLeft: 5}}/>
                    <ButtonInput type="button" value="Reset" style={{marginLeft: 5}} onClick={this._resetFilters}
                                 disabled={this.state.filters.count() === 0 && this.state.filterText === ''}/>
                </form>
                <ul className="pill-list">
                    {filters}
                </ul>
            </div>
        );
    }
});

module.exports = TypeAheadDataFilter;