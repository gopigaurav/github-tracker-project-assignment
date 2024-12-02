import { gql } from "@apollo/client";

// export const ADD_REPOSITORY = gql`
//   mutation AddRepository($url: String!) {
//     addRepository(url: $url) {
//       id
//       name
//     }
//   }
// `;

export const ADD_REPOSITORY = gql`
  mutation AddRepository($name: String!, $url: String!, $description: String) {
    addRepository(name: $name, url: $url, description: $description) {
      id
      name
      description
     
    }
  }
`;


export const MARK_AS_SEEN_REPO = gql`
  mutation MarkAsSeenRepo($repositoryId: Int!) {
    markAsSeenRepo(repositoryId: $repositoryId) {
      id
      tracked
    }
  }
`;
