import React, { useState } from 'react';
import RepoForm from './components/RepoForm';
import RepoList from './components/RepoList';
import { ApolloProvider } from '@apollo/client';
import client from './graphql/client';
import { Repository } from './type';

const App: React.FC = () => {
  const [repositories, setRepositories] = useState<Repository[]>([]);

  const addRepository = (repoUrl: any) => {
    setRepositories([...repositories, repoUrl]);
  };

  return (
    <ApolloProvider client={client}>
      <div className="max-w-4xl p-8 mx-auto app">
        <h1 className="mb-8 text-3xl font-semibold text-center text-gray-800">GitHub Repository Tracker</h1>
        <RepoForm onAddRepo={addRepository} />
        <RepoList repositories={repositories} />
      </div>
    </ApolloProvider>
  );
};

export default App;
