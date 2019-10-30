import React from 'react';
import './index.css';


const DEFAULT_QUERY = 'redux';
const PATH_BASE = 'https://hn.algolia.com/api/v1';
const PATH_SEARCH = '/search';
const PARAM_SEARCH = 'query=';


const isSearched = (searchTerm) => (item) =>
    item.title.toLowerCase().includes(searchTerm.toLowerCase());



// APP
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      result: null, 
      searchTerm: DEFAULT_QUERY,
    };

    this.setSearchTopStories = this.setSearchTopStories.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onDismiss(id) {
    const updatedHits = this.state.result.hits.filter(item => item.objectID !== id);

    this.setState({
      // result: Object.assign({}, this.state.result, {hits: updatedHits }),
      result: { ...this.state.result, hits: updatedHits }
    });
  }

  setSearchTopStories(result) {
    this.setState({ result });
  }


  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  componentDidMount() {
    const { searchTerm } = this.state;

    fetch(`${PATH_BASE}${PATH_SEARCH}?${PARAM_SEARCH}${searchTerm}`)
      .then(response => response.json())
      .then(result => this.setSearchTopStories(result))
      .catch(error => error)
  }



  render() {
    const { searchTerm, result } = this.state;
    console.log(result)

    // if (!result) return null;

    return (
      <div className="page">
        <div className="interactions">
          <h1>Tasks</h1>
          <Search
            value={searchTerm}
            onChange={this.onSearchChange}
          >Search</Search>
          <hr />
        </div>
        {
          result ? 
            <Table 
              list={result.hits}
              pattern={searchTerm}
              onDismiss={this.onDismiss}
            />
          : null
        }
      </div>
    );
  }
}



const Search = ({ value, onChange, children }) =>
    <form>
        <label>{children} </label>
        <input
          type="text"
          value={value}
          onChange={onChange}
        />
      </form>



const Table = ({ list, pattern, onDismiss }) =>
  <div className="table">
  { list.filter(isSearched(pattern)).map(item => 
    <div key={item.objectID} className="table-row">
      <span>
        <a href={item.url}>{item.title}</a>
      </span>
      <span>{item.author}</span>
      <span>{item.num_comments}</span>
      <span>{item.points}</span>
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


const Button = ({ onClick, className='', children }) => 
  <button
    onClick={onClick}
    className={className}
    type="button"
  >{children}</button>



export default App;


