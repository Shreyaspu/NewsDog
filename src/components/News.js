import React, { Component } from "react";
import Newsitem from "./Newsitem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

export class News extends Component {
  static defaultProps = {
    country: "us",
    pageSize: 6,
    category: "general",
  };
  static propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    setProgress: PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      articles: [],
      loading: false,
      Page: 1,
      totalResults: 0,
      error: null,
    };
    document.title = `${
      this.props.category.charAt(0).toUpperCase() + this.props.category.slice(1)
    } - Newsdog`;
  }

  async updateNews() {
    this.props.setProgress(10);
    try {
      this.setState({ loading: true, error: null });
      const apiKey = 'd99c91a44e3b4ed6b8ccb2cd79ebf265';
      const baseUrl = 'https://newsapi.org/v2';
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const apiUrl = `${baseUrl}/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${apiKey}&page=${this.state.Page}&pageSize=${this.props.pageSize}`;
      let url = proxyUrl + encodeURIComponent(apiUrl);
      
      let data = await fetch(url);
      if (!data.ok) {
        throw new Error(`Failed to fetch news. Status: ${data.status}`);
      }
      
      let parsedData = await data.json();
      if (parsedData.status === "error") {
        throw new Error(parsedData.message || "Error fetching news");
      }
    
      this.setState({
        articles: parsedData.articles || [],
        totalResults: parsedData.totalResults || 0,
        loading: false,
        error: null,
      });
    } catch (error) {
      console.error('Error fetching news:', error);
      this.setState({
        loading: false,
        error: `Failed to load news. Please try again later. (${error.message})`,
      });
    }
    this.props.setProgress(100);
  }

  async componentDidMount() {
    this.updateNews();
  }

  fetchMoreData = async () => {
    try {
      this.setState({ Page: this.state.Page + 1 });
      const apiKey = 'd99c91a44e3b4ed6b8ccb2cd79ebf265';
      const baseUrl = 'https://newsapi.org/v2';
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const apiUrl = `${baseUrl}/top-headlines?country=${this.props.country}&category=${this.props.category}&apiKey=${apiKey}&page=${this.state.Page}&pageSize=${this.props.pageSize}`;
      let url = proxyUrl + encodeURIComponent(apiUrl);
      
      let data = await fetch(url);
      if (!data.ok) {
        throw new Error(`Failed to fetch more news. Status: ${data.status}`);
      }
      
      let parsedData = await data.json();
      if (parsedData.status === "error") {
        throw new Error(parsedData.message || "Error fetching more news");
      }
      
      this.setState({
        articles: this.state.articles.concat(parsedData.articles || []),
        totalResults: parsedData.totalResults || 0,
      });
    } catch (error) {
      console.error('Error fetching more news:', error);
      this.setState({
        error: `Failed to load more news. Please try again later. (${error.message})`
      });
    }
  };

  render() {
    return (
      <>
        <h1 className="text-center" style={{ margin: "30px 0px" }}>
          NewsDog - Top{" "}
          {this.props.category.charAt(0).toUpperCase() +
            this.props.category.slice(1)}{" "}
          Headlines
        </h1>
        {this.state.loading && <Spinner />}
        {this.state.error && (
          <div className="alert alert-danger" role="alert">
            Error: {this.state.error}
          </div>
        )}
        {!this.state.loading && !this.state.error && this.state.articles.length === 0 && (
          <div className="alert alert-info" role="alert">
            No news found. Please try again later.
          </div>
        )}
        
        <InfiniteScroll
          dataLength={this.state.articles.length}
          next={this.fetchMoreData}
          hasMore={this.state.articles.length !== this.state.totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {this.state.articles &&
                this.state.articles.map((element, index) => {
                  if (!element) return null;
                  return (
                    <div
                      className="col-md-4"
                      key={`${element.url || index}-${index}`}
                    >
                      <Newsitem
                        title={element.title || ""}
                        description={element.description || ""}
                        imageUrl={element.urlToImage || ""}
                        url={element.url || ""}
                        author={element.author || "Unknown"}
                        date={element.publishedAt || new Date().toISOString()}
                        source={element.source?.name || "Unknown Source"}
                      />
                    </div>
                  );
                })}
            </div>
          </div>
        </InfiniteScroll>
      </>
    );
  }
}
export default News;
