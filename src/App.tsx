import React from 'react';
import './App.css';
import { gql, useQuery} from "@apollo/client";
import Table from './Table';


// Get data from Api .
const GET_DATA = gql`
{
  search(query: "facebook/react sort:best-match-asc", type: REPOSITORY, first: 100) {
    repositoryCount
    nodes {
      ... on Repository {
        nameWithOwner
        description
        updatedAt
        createdAt
        stargazerCount,
        forkCount,
        url
      }
    }
  }
}
`;

export default function App() {
  const { loading, error, data } = useQuery(GET_DATA);
  if (loading) return <p>Loading Data please wait...</p>;
  if (error) return <pre>{error.message}</pre>
  return (
    <>
    <div>
     {!loading &&
     <Table
      tableData = {data.search.nodes}
      />} 
    </div>
    </>
  );
}
