import React from 'react';
import './index.css';


const DEFAULT_QUERY = 'redux';
const DEFAULT_HPP = '100'

const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';
const PARAM_PAGE = 'page=';
const PARAM_HPP = 'hitsPerPage=';


const largeColumn = {
  width: '40%',
}
const midColumn = {
  width: '30%',
};
const smallColumn = {
  width: '10%',
};


// APP
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null, 
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  // Fetch function from HNApi
  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error)
  }

  // call for server data and get results on Submit button click
  onSearchSubmit(e) {
    const { searchTerm } = this.state;

    this.fetchSearchTopStories(searchTerm);
    e.preventDefault();
  }

  // update search term on every change to state
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  // fetch data from server on mount
  componentDidMount() {
    const { searchTerm } = this.state;

    this.fetchSearchTopStories(searchTerm);
  }


  // OnDismiss - 
  onDismiss(id) {
    const updatedHits = this.state.result.hits.filter(item => item.objectID !== id);

    this.setState({
      // result: Object.assign({}, this.state.result, {hits: updatedHits }),
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  setSearchTopStories(result) {
    const { hits, page } = result;

    // if page is not 0, return the avialable hits or
    // return empty array if this is new request via ComponentDidMount
    const oldHits = page !== 0 ?
          this.state.results.hits : [];

    // Merge old hits and new hits from next page
    const updatedHits = [
      ...oldHits,
      ...hits
    ];

    // update the hits data and new page number to state
    this.setState({ 
      result: {hits: updatedHits, page} 
    });
  }


 


  render() {
    const { searchTerm, result } = this.state;
    const page = (result && result.page) || 0;

    // if (!result) return null;

    return (
      <div className="page">
        <div className="interactions">
          <h1>Tasks</h1>
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
            onSubmit={this.onSearchSubmit}
          >Search</Search>
          <hr />
        </div>
        {
          result && 
          <Table 
            list={result.hits}
            onDismiss={this.onDismiss}
          />
        }
        <div className="interactions">
          <Button
            onClick={() => this.fetchSearchTopStories(searchTerm, page + 1)}
          >More</Button>
        </div>
      </div>
    );
  }
}




// SEARCH COMPONENT
const Search = ({ value, onChange, onSubmit, children }) =>
    <form>
        <label>{children} </label>
        <input
          type="text"
          value={value}
          onChange={onChange}
          onSubmit={onSubmit}
        />
        <button type="submit">
          {children}
        </button>
      </form>


// DISPLAY TABLE COMPONENT
const Table = ({ list, onDismiss }) =>
  <div className="table">
  { list.map(item => 
    <div key={item.objectID} className="table-row">
      <span style={largeColumn}>
        <a href={item.url}>{item.title}</a>
      </span>
      <span style={midColumn}>{item.author}</span>
      <span style={smallColumn}>{item.num_comments}</span>
      <span style={smallColumn}>{item.points}</span>
      <span>
        <Button
          onClick={() => onDismiss(item.objectID)}
          className="button-inline"
        >
          Dismiss
        </Button>
      </span>
    </div>
  )}
  </div>


// BUTTON COMPONENT
const Button = ({ onClick, className='', children }) => 
  <button
    onClick={onClick}
    className={className}
    type="button"
  >{children}</button>



export default App;


