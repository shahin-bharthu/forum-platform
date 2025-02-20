import { useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";
import axiosInstance from "../../../utils/axiosInstance";

const SearchResults = () => {
  const params = useParams();
  const location = useLocation();
  const { forumResults, postResults } = location.state || {forumResults: [], postResults: []};
  const [searchCommentsResults, setSearchCommentsResults] = useState([{comment: {content: ''}, topic: {}, forum: {}}]);

  const searchComments = async (searchText) => {
      const response = await axiosInstance.get(`comment/search/${searchText}`);
      const results = response.data.data || [];
      const commentsData = await Promise.all(results.map(async (comment) => {
        const commentResponse = (await axiosInstance.get(`comment/id/${comment.id}`)).data;
        return commentResponse.data;
      }));
      setSearchCommentsResults(commentsData);
      console.log(commentsData);
  }

  useEffect(() => {
    searchComments(params.searchText);
  }, [])

  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 3fr",
          gridTemplateRows: "repeat(3, 1fr)",
          gridTemplateAreas: `"header header" "forums posts" "comments comments"`,
          width: "100vw",
          height: "90vh",
          margin: "10px",
          gap: "5px",
          marginTop: "50px"
        }}
      >

        <h1 style={{ gridArea: "header", border: "1px solid pink" }}>
          Search Results for {params.searchText}
        </h1>

        <ul style={{ gridArea: "forums", border: "1px solid pink" }}>
          {forumResults.map((forum) => {
            return <li style={{ textAlign: "left" }}>{forum.name}</li>;
          })}
        </ul>

        <ul style={{ gridArea: "posts", border: "1px solid pink" }}>
          {postResults.map((post) => {
            return <li style={{ textAlign: "left" }}>{post.title}</li>;
          })}
        </ul>

        <ul style={{ gridArea: "comments", border: "1px solid pink" }}>
          {searchCommentsResults.map((result) => {
            return <li style={{ textAlign: "left" }}>{result.comment.content}</li>;
          })}
        </ul>

      </div>
    </>
  );
};

export default SearchResults;
