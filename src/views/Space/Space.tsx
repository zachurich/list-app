import { useSpaceMutation, useSpaceQuery } from "../../services/spaces";

export const Space = () => {
  const { data, error, isLoading } = useSpaceQuery();
  const { mutateAsync } = useSpaceMutation();

  if (error) {
    return <div>Error loading space: {error.message}</div>;
  }

  if (isLoading) {
    return null;
  }

  return (
    <div>
      <h1>{data ? `${data.author}'s Lists` : "No Author Found"}</h1>
    </div>
  );
};
