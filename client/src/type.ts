export interface Release {
  id: number;
  version: string;
  publishedAt: string;
  seenByUser: boolean;
}

export interface Repository {
  id: number;
  name: string;
  description: string;
  url: string;
  releases: Release[];
  latestRelease?: Release | null;
  hasUnseenUpdates?: boolean;
  tracked: Boolean
}
