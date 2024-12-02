import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import { ADD_REPOSITORY } from '../graphql/mutations';
import { GET_REPOSITORIES } from '../graphql/queries'; // To update the cache after mutation

interface RepoFormProps {
  onAddRepo: (repo: { name: string; url: string; description: string }) => void;
}

interface Repository {
  id: string;
  name: string;
  url: string;
  description: string;
}

const RepoForm: React.FC<RepoFormProps> = ({ onAddRepo }) => {
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [addRepository, { loading }] = useMutation(ADD_REPOSITORY, {
    update(cache, { data: { addRepository } }) {
      const existingData = cache.readQuery<{ repositories: Repository[] }>({
        query: GET_REPOSITORIES,
      });

      const repositories = existingData?.repositories || [];

      cache.writeQuery({
        query: GET_REPOSITORIES,
        data: { repositories: [...repositories, addRepository] },
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { data } = await addRepository({
        variables: { name, url, description },
      });

      if (data?.addRepository) {
        onAddRepo(data.addRepository);
      }
    } catch (error) {
      console.error('Error adding repository:', error);
    } finally {
      setIsSubmitting(false);
    }

    setName('');
    setUrl('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-4">
      <div>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Repository Name"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Repository URL"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <div>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Repository Description"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className={`w-full py-3 text-white rounded-lg ${loading || isSubmitting ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600'}`}
        disabled={loading || isSubmitting} // Disable button during loading
      >
        {loading || isSubmitting ? 'Adding Repository...' : 'Add Repository'}
      </button>
      {(loading || isSubmitting) && (
        <div className="mt-2 text-center text-gray-500">Please wait, adding repository...</div>
      )}
    </form>
  );
};

export default RepoForm;
