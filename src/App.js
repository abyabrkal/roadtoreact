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

    // state updates to includes multiple results based on each searchterm
    this.state = {
      results: null, 
      searchKey: '',
      searchTerm: DEFAULT_QUERY,
      error: null
    };


    this.needsToSearchTopStories = this.needsToSearchTopStories.bind(this);
    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.fetchSearchTopStories = this.fetchSearchTopStories.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
  }

  needsToSearchTopStories(searchTerm) {
    return !this.state.results[searchTerm];
  }

  // Fetch function from HNApi
  fetchSearchTopStories(searchTerm, page = 0) {
    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}&${PARAM_PAGE}${page}&${PARAM_HPP}${DEFAULT_HPP}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => this.setState({ error }))
  }

 // fetch data from server on mount
 componentDidMount() {
  const { searchTerm } = this.state;
  this.setState({ searchKey: searchTerm })
  this.fetchSearchTopStories(searchTerm);
}


  // call for server data and get results on Submit button click
  onSearchSubmit(e) {
    const { searchTerm } = this.state;
    this.setState({ searchKey: searchTerm})
    
    if(this.needsToSearchTopStories(searchTerm)){
      this.fetchSearchTopStories(searchTerm);
    }
    
    e.preventDefault();
  }

  // update search term on every change to state
  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

 
  // OnDismiss - 
  onDismiss(id) {
    const { searchKey, results } = this.state;
    const { hits, page } = results[searchKey];

    const updatedHits = hits.filter(item => item.objectID !== id);

    this.setState({
      // result: Object.assign({}, this.state.result, {hits: updatedHits }),
      //result: { ...this.state.results, hits: updatedHits }
      ...results,
      [searchKey]: { hits: updatedHits, page }
    });
  }

  setSearchTopStories(result) {
    const { hits, page } = result;
    const { searchKey, results } = this.state;

    // if page is not 0, return the avialable hits or
    // return empty array if this is new request via ComponentDidMount
    //const oldHits = page !== 0 ?
    //      this.state.results.hits : [];
    const oldHits = results && results[searchKey] 
      ? results[searchKey].hits
      : [];


    // Merge old hits and new hits from next page
    const updatedHits = [
      ...oldHits,
      ...hits
    ];


    // update the hits data and new page number to state
    this.setState({ 
      //results: {hits: updatedHits, page} 
      results: {
        ...results,
        [searchKey]: { hits: updatedHits, page }
      }
    });
  }


 


  render() {
    const { searchTerm, results, searchKey, error } = this.state;
    const page = (results &&
                  results[searchKey] &&
                  results[searchKey].page) || 0;
    const list = (results &&
                  results[searchKey] &&
                  results[searchKey].hits) || [];
    // if (!result) return null;
    //if(error) return <p>Something went wrong!</p>

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
        { error
          ? <div className="interations">
              <p>Something went wrong!</p>
            </div>
          //results && 
          : <Table 
            list={list}
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


