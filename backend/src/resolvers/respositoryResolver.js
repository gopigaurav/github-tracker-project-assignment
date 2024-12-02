import { Repository } from '../models/repository.js';
import { Release } from '../models/release.js';
import { Octokit } from '@octokit/core';

const octokit = new Octokit({ auth: process.env.GITHUB_TOKEN });


const fetchAndStoreReleases = async () => {
  const repositories = await Repository.findAll();

  for (const repository of repositories) {
    const { name, url } = repository;
    const parts = new URL(url).pathname.split('/');
    const owner = parts[1];
    const repo = parts[2];

    console.log('running')

    try {
      const releases = await octokit.request('GET /repos/{owner}/{repo}/releases', {
        owner,
        repo,
      });

      if (releases.data.length === 0) continue;

      const latestRelease = releases.data[0];

      const existingRelease = await Release.findOne({
        where: { version: latestRelease.tag_name, repositoryId: repository.id },
      });

      if (!existingRelease) {
        await Release.create({
          version: latestRelease.tag_name,
          publishedAt: latestRelease.published_at,
          seenByUser: false,
          repositoryId: repository.id,
          html_url: latestRelease.html_url,
          body: latestRelease.body,
        });
        repository.tracked = false;
        await repository.save();
        console.log(`Stored new release ${latestRelease.tag_name} for ${repository.name}`);
      } else {
        console.log(`Release ${latestRelease.tag_name} already exists for ${repository.name}`);
      }
    } catch (error) {
      console.error(`Error fetching releases for ${repository.name}:`, error);
    }
  }
};

// Runs every hour
setInterval(fetchAndStoreReleases, 60 * 60 * 1000);


const repositoryResolver = {
  Query: {
    repositories: async () => await Repository.findAll({
      include: [{
        model: Release,
        order: [['publishedAt', 'DESC']],
        limit: 1,
      }],
    }),
  },

  Mutation: {
    addRepository: async (_, args) => {
      try {
        const { pathname } = new URL(args.url);
        const parts = pathname.split('/');

        if (parts.length < 3) {
          throw new Error('Invalid GitHub URL. Expected format: https://github.com/owner/repo');
        }

        const [, owner, repo] = parts;

        const { data } = await octokit.request('GET /repos/{owner}/{repo}', { owner, repo });

        const repository = await Repository.create({
          name: data.name,
          url: data.html_url,
          description: args.description,
          tracked: false,
        });

        const releases = await octokit.request('GET /repos/{owner}/{repo}/releases', {
          owner,
          repo,
        });

        for (const release of releases.data) {
          console.log(release.url, release.body)
          await Release.create({
            version: release.tag_name,
            publishedAt: release.published_at,
            seenByUser: false,
            repositoryId: repository.id,
            html_url: release.html_url,
            body: release.body
          });
        }

        return repository;
      } catch (e) {
        console.error('Error adding repository:', e);
        throw new Error('Error adding repository');
      }
    },

    markAsSeenRepo: async (_, args) => {
      try {
        const repo = await Repository.findByPk(args.repositoryId);
        if (repo) {
          repo.tracked = true;
          await repo.save();
        }
        return repo;
      } catch (e) {
        console.error('Error marking release as seen:', e);
        throw new Error('Error marking release as seen');
      }
    },
  },
};

export default repositoryResolver;
