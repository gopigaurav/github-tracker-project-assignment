import { gql } from "@apollo/client";

export const GET_REPOSITORIES = gql`
  query GetRepositories {
    repositories {
      id
      name
      url
      description
      tracked
    }
  }
`;
export const GET_RELEASES = gql`
  query GetReleases($repositoryId: Int!) {
    releases(repositoryId: $repositoryId) {
      id
      version
      publishedAt
      seenByUser
      html_url
      body
      repositoryId
    }
  }
`;

export const MARK_AS_SEEN = gql`
  mutation MarkAsSeen($releaseId: Int!) {
    markAsSeen(releaseId: $releaseId) {
      id
      seenByUser
    }
  }
`;