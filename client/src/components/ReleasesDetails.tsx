import React from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@apollo/client";
import { GET_RELEASES, MARK_AS_SEEN } from "../graphql/queries";
import ReactMarkdown from "react-markdown";
import { MARK_AS_SEEN_REPO } from "../graphql/mutations";

interface Release {
  id: number;
  version: string;
  publishedAt: string;
  seenByUser: boolean;
  html_url: string;
  body: string;
  repositoryId: number;
}

const ReleaseDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const repositoryId = id ? parseInt(id, 10) : undefined;

  const { loading, error, data, refetch } = useQuery<{ releases: Release[] }>(
    GET_RELEASES,
    {
      variables: { repositoryId },
      skip: !repositoryId,
    }
  );

  const [markAsSeen] = useMutation(MARK_AS_SEEN, {
    onCompleted: () => refetch(),
    onError: (err) => console.error("Error marking release as seen:", err),
  });

  const handleMarkAsSeen = async (releaseId: number) => {
    try {
      await markAsSeen({ variables: { releaseId } });
    } catch (err) {
      console.error("Error marking release as seen:", err);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div
          className="w-12 h-12 border-b-2 border-blue-500 rounded-full animate-spin"
          aria-label="Loading"
        ></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500 rounded-lg bg-red-50">
        <p>Error loading releases: {error.message}</p>
      </div>
    );
  }

  const releases = data?.releases || [];

  return (
    <div className="max-w-4xl p-6 mx-auto">
      <h1 className="mb-6 text-2xl font-bold">Repository Releases</h1>

      {releases.length === 0 ? (
        <p className="text-gray-500">No releases found for this repository.</p>
      ) : (
        <div className="space-y-6">
          {releases.map((release) => (
            <div
              key={release.id}
              className="p-6 bg-white border border-gray-200 rounded-lg shadow-md"
            >
              {/* Header Section */}
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-semibold text-blue-600">
                  Version {release.version}
                </h2>
                <span className="text-sm text-gray-500">
                  Published:{" "}
                  {new Date(parseInt(release.publishedAt, 10)).toLocaleString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    }
                  )}
                </span>
              </div>

              {/* Render Body with Markdown */}
              {release.body && (
                <div className="mt-4 prose text-gray-700 max-w-none">
                  <ReactMarkdown>{release.body}</ReactMarkdown>
                </div>
              )}

              {/* Footer Section */}
              <div className="flex flex-wrap items-center justify-between mt-4">
                {/* Seen Status */}
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    release.seenByUser
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {release.seenByUser ? "Seen" : "New"}
                </span>

                {/* Mark as Seen Button */}
                {!release.seenByUser && (
                  <button
                    onClick={() => handleMarkAsSeen(release.id)}
                    className="px-4 py-2 text-white transition-colors bg-blue-500 rounded-lg hover:bg-blue-600"
                    aria-label="Mark as Seen"
                  >
                    Mark as Seen
                  </button>
                )}

                {/* GitHub Link */}
                <a
                  href={release.html_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                  aria-label={`View release version ${release.version}`}
                >
                  View on GitHub
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReleaseDetails;
