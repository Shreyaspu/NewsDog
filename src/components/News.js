import React, {useEffect, useState} from 'react'
import Newsitem from "./Newsitem";
import Spinner from "./Spinner";
import PropTypes from "prop-types";
import InfiniteScroll from "react-infinite-scroll-component";

const News = (props) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalResults, setTotalResults] = useState(0);
  const [error, setError] = useState(null);
//  document.title = `${
//       props.category.charAt(0).toUpperCase() + props.category.slice(1)
//     } - Newsdog`;

 

  const updateNews = async() => {
    props.setProgress(10);
    try {
      setLoading(true);
      const apiKey = 'd99c91a44e3b4ed6b8ccb2cd79ebf265';
      const baseUrl = 'https://newsapi.org/v2';
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const apiUrl = `${baseUrl}/top-headlines?country=${props.country}&category=${props.category}&apiKey=${apiKey}&page=${page}&pageSize=${props.pageSize}`;
      let url = proxyUrl + encodeURIComponent(apiUrl);
      
      let data = await fetch(url);
      if (!data.ok) {
        throw new Error(`Failed to fetch news. Status: ${data.status}`);
      }
      
      let parsedData = await data.json();
      if (parsedData.status === "error") {
        throw new Error(parsedData.message || "Error fetching news");
      }
      
      setArticles(parsedData.articles || []);
      setTotalResults(parsedData.totalResults || 0);
      setLoading(false);
      setPage(1);
    } catch (error) {
      console.error('Error fetching news:', error);
      setLoading(false);
      setError(`Failed to load news. Please try again later. (${error.message})`);
    }
    props.setProgress(100);
  }
  
  useEffect(() => {
    updateNews();
  }, []);
  

  const fetchMoreData = async () => {
    try {
      setPage(page + 1);
      const apiKey = 'd99c91a44e3b4ed6b8ccb2cd79ebf265';
      const baseUrl = 'https://newsapi.org/v2';
      const proxyUrl = 'https://api.allorigins.win/raw?url=';
      const apiUrl = `${baseUrl}/top-headlines?country=${props.country}&category=${props.category}&apiKey=${apiKey}&page=${page}&pageSize=${props.pageSize}`;
      let url = proxyUrl + encodeURIComponent(apiUrl);
      
      let data = await fetch(url);
      
      
      let parsedData = await data.json();
      
      
      setArticles(articles.concat(parsedData.articles || []));
      setTotalResults(parsedData.totalResults || 0);
      
    } catch (error) {
      console.error('Error fetching more news:', error);
      setError(`Failed to load more news. Please try again later. (${error.message})`);
    }
  };

  
    return (
      <>
        <h1 className="text-center" style={{ margin: "30px 0px", marginTop: "90px" }}>
          NewsDog - Top{" "}
          {props.category.charAt(0).toUpperCase() +
            props.category.slice(1)}{" "}
          Headlines
        </h1>
        {loading && <Spinner />}
        {error && (
          <div className="alert alert-danger" role="alert">
            Error: {error}
          </div>
        )}
        {!loading && !error && articles.length === 0 && (
          <div className="alert alert-info" role="alert">
            No news found. Please try again later.
          </div>
        )}
        
        <InfiniteScroll
          dataLength={articles.length}
          next={fetchMoreData}
          hasMore={articles.length !== totalResults}
          loader={<Spinner />}
        >
          <div className="container">
            <div className="row">
              {articles &&
                articles.map((element, index) => {
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

 News.defaultProps = {
    country: "us",
    pageSize: 6,
    category: "general",
  };
  News.propTypes = {
    country: PropTypes.string,
    pageSize: PropTypes.number,
    category: PropTypes.string,
    setProgress: PropTypes.func
  };
export default News;
