import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import { GET_REPOSITORIES } from '../graphql/queries';
import RepoCard from './RepoCard';
import { Repository } from '../type';

interface RepoListProps {
  repositories: Repository[];
}


const RepoList: React.FC<RepoListProps> = ({ repositories }) => {
  const { loading, error, data } = useQuery<{ repositories: Repository[] }>(GET_REPOSITORIES);
  console.log(data, error)

  if (loading) return <p className="text-center text-gray-500">Loading repositories...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error.message}</p>;

  if (!data || !data.repositories || !data.repositories.length) {
    return <p className="text-center text-gray-500">No repositories found.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-6 p-4 repo-list sm:grid-cols-2 lg:grid-cols-3">
      {data.repositories.map((repo) => (
        <RepoCard
          key={repo?.id}
          id={repo?.id}
          name={repo?.name}
          description={repo?.description}
          releases={repo?.releases}
          url={repo?.url}
          tracked={repo?.tracked}
        />
      ))}
    </div>
  );
};

export default RepoList;
