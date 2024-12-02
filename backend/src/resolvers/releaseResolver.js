import { Release } from '../models/release.js';
import { Repository } from '../models/repository.js';

const releaseResolver = {
  Query: {
    releases: async (_, { repositoryId }) => await Release.findAll({
      where: { repositoryId },
      order: [['publishedAt', 'DESC']],
    })
  },

  Mutation: {
    addRelease: async (_, { version, publishedAt, repositoryId, url, body }) => {
      try {
        const repository = await Repository.findByPk(repositoryId);
        if (!repository) {
          throw new Error('Repository not found.');
        }

        const release = await Release.create({
          version,
          publishedAt,
          repositoryId,
          seenByUser: false,
          url,
          body,
        });

        return release;
      } catch (error) {
        console.error('Error adding release:', error);
        throw new Error('Failed to add release.');
      }
    },

    markAsSeen: async (_, { releaseId }) => {
      try {
        const release = await Release.findByPk(releaseId);
        if (!release) {
          throw new Error('Release not found.');
        }

        release.seenByUser = true;
        await release.save();

        return release;
      } catch (error) {
        console.error('Error marking release as seen:', error);
        throw new Error('Failed to mark release as seen.');
      }
    },
  },
};

export default releaseResolver;
