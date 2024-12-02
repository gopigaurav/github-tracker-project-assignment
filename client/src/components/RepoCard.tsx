import React from "react";
import { useMutation } from "@apollo/client";
import { Release } from "../type";
import { MARK_AS_SEEN_REPO } from "../graphql/mutations";
import { Link } from "react-router-dom";

interface RepoCardProps {
  id: number;
  name: string;
  url: string;
  description: string;
  tracked: Boolean;
  releases: Release[];
}

const RepoCard: React.FC<RepoCardProps> = ({
  id,
  name,
  description,
  releases,
  url,
  tracked,
}) => {
  const [markAsSeenRepo] = useMutation(MARK_AS_SEEN_REPO);

  const handleMarkAsSeen = async (repositoryId: number) => {
    try {
      console.log(id);
      await markAsSeenRepo({ variables: { repositoryId } });
    } catch (error) {
      console.error("Error marking repo as seen:", error);
    }
  };

  return (
    <div className="p-5 space-y-4 border border-gray-300 rounded-lg shadow-md overflow-hidden">
      <p className="text-red-500">
        {tracked
          ? ""
          : "New"}
      </p>
      <Link
        to={`/${name}/${id}`}
        onClick={() => handleMarkAsSeen(id)}
        className="text-xl font-semibold text-gray-900 underline hover:text-blue-600"
      >
        {name || ""}
      </Link>
      <p className="text-gray-600">{description || ""}</p>
    </div>
  );
};

export default RepoCard;
