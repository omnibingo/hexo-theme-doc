const React = require('react');
const {SHOW_SEARCH_RESULTS, HIDE_SEARCH_RESULTS} = require('./actions');
const {dispatch} = require('../utils');

class SearchForm extends React.Component {

  constructor (props) {
    super(props);
  }

  handleKeyUp (e) {
    const query = (e.target.value || '').trim();

    if (!query) {
      dispatch(HIDE_SEARCH_RESULTS);
      return;
    }

    if (query.length < 3) { return; }

    const results = this.props.search(query);

    dispatch(SHOW_SEARCH_RESULTS, {results, query});

    if (typeof this.props.onSearch === 'function') {
      this.props.onSearch();
    }
  }

  render () {

    if (!this.props.search) { return null; }

    return (
      <div className="dc-search-form doc-search-form">
        <input type="search"
          className="dc-input dc-search-form__input doc-search-form__input"
          placeholder="Search..."
          onKeyUp={this.handleKeyUp.bind(this)}
          autoFocus={this.props.autoFocus} />
        <button className="dc-btn dc-search-form__btn doc-search-form__btn" aria-label="Search">
          <i className="dc-icon dc-icon--search"></i>
        </button>
      </div>
    );
  }
}
/**
function SearchResultsTitle ({results, query}) {
  return (
    <div>
      <h1 className="doc-search-results__title">
        { results.length ? results.length : 'No' } results for <span className="doc-search-results__title__query">"{query}"</span>
      </h1>

      { !results.length ? <p>There are no results for "{query}". Why not <strong>try typing another keyword?</strong></p> : null }
    </div>
  );
}
*/

function generateBody(body, query) {
  var indexNumber = body.indexOf(query);
  var bodyLength = body.length;
  var returnBody = '';
  var frontCut = 10;
  var bodyCut = 100;

  if (indexNumber < frontCut && bodyLength > bodyCut) {
    returnBody = body.substring(0, bodyCut) + '...';
  }
  else if (indexNumber < frontCut && bodyLength < bodyCut) {
    returnBody = body.substring(0, bodyLength);
  }
  else if (indexNumber > frontCut && bodyLength > (bodyCut + indexNumber)) {
    returnBody = '...' + body.substring(indexNumber - frontCut, bodyCut + indexNumber) + '...';
  }
  else if (indexNumber > frontCut && bodyLength < (bodyCut + indexNumber)) {
    returnBody = '...' + body.substring(indexNumber - frontCut, bodyLength);
  }
  //add highlight 

  returnBody = returnBody.replace(new RegExp(query, 'g'), '<span style="font-weight: bold;">' + query + '</span>');
  //<span class="doc-highlight">contact</span>
  return returnBody;
}

function SearchResultsTitle({ results, query }) {
  return (
    <div>
      <h1 className="doc-search-results__title">
        搜索 <span className="doc-search-results__title__query">"{query}"</span>，{ results.length ? results.length+'个' : '没有' } 结果 ：
      </h1>

      { !results.length ? <p>没能搜索 "{query}"到结果.  <strong>试试其他关键字？</strong></p> : null }
    </div>
  );
}

function SearchResultsList ({results}) {
  if (!results.length) {
    return null;
  }

  const handleSearchResultLinkClick = () => dispatch(HIDE_SEARCH_RESULTS);

  const createMarkup = (html) => ({ __html: html });

  return (
    <ul className="doc-search-results__list">
      { results.map((result, i) => {
        return (
          <li key={'doc-search-results__list__item-' + i } className="doc-search-results__list__item">
            <a
              href={result.path}
              className="doc-search-results__list__link"
              onClick={handleSearchResultLinkClick}>
              {result.title}
            </a>
            <span className="doc-search-results__list__score-divider">|</span>
            <span className="doc-search-results__list__score">score: {result.score.toFixed(2)}</span>
            <p dangerouslySetInnerHTML={createMarkup(result.body)}></p>
          </li>
        );
      })}
    </ul>
  );
}

module.exports = {SearchForm, SearchResultsTitle, SearchResultsList};
