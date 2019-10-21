import React from 'react';
import './index.css';


const list = [
  {
    title: "React",
    url: "https://reactjs.org/",
    author: "Jordan Walke",
    num_comments: 3,
    points: 4,
    objectID: 0
  },
  {
    title: "Redux",
    url: "https://redux.js.org/",
    author: "Dan Abramov, Andrew Clark",
    num_comments: 2,
    points: 5,
    objectID: 1
  }
];



function isSearched(searchTerm) {
  return function(item) {
    return item.title.toLowerCase().includes(searchTerm.toLowerCase());
  };
}


// APP
class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      list
    };

    this.onDismiss = this.onDismiss.bind(this);
    this.onSearchChange = this.onSearchChange.bind(this);
  }

  onDismiss(id) {
    const updatedList = this.state.list.filter(item => item.objectID !== id);

    this.setState({
      list: updatedList,
      searchTerm: ''
    });
  }

  onSearchChange(event) {
    this.setState({ searchTerm: event.target.value });
  }

  render() {
    const { list, searchTerm } = this.state;

    return (
      <div className="App">
        <h1>Tasks</h1>
        <Search
          value={searchTerm}
          onChange={this.onSearchChange}
        />
        <hr />
        <Table 
          list={list}
          pattern={searchTerm}
          onDismiss={this.onDismiss}
        />
      </div>
    );
  }
}


class Search extends React.Component {
  render() {
    const {value, onChange} = this.props;

    return (
      <form>
          <label>Search </label>
          <input
            type="text"
            value={value}
            onChange={onChange}
          />
        </form>
    )
  }
}


class Table extends React.Component {
  render() {
    const { list, pattern, onDismiss} = this.props;

    return (
      {list.filter(isSearched(pattern)).map(item => 
        <div key={item.objectID}>
          <span>
            <a href={item.url}>{item.title}</a>
          </span>
          <span>{item.author}</span>
          <span>{item.num_comments}</span>
          <span>{item.points}</span>
          <span>
            <button
              onClick={() => onDismiss(item.objectID)}
              type="button"
            >
              Dismiss
            </button>
          </span>
        </div>
      )}
    )
  }
}


export default App;


