import { Link, useMatch } from "react-router";
import { useSpaceQuery } from "../../services/spaces";
import styles from "./header.module.css";
import { useListQuery } from "../../services/lists";

export const Header = () => {
  const { data, isLoading: isSpaceLoading } = useSpaceQuery();
  const { params = {} }: { params?: { spaceId?: string; listId?: string } } =
    useMatch("/:spaceId/list/:listId") ?? {};
  const listId = params?.listId;
  const { data: listData, isLoading: isListLoading } = useListQuery(
    listId,
    data?.id
  );
  const isLoading = isSpaceLoading || isListLoading;

  if (isLoading || !data) {
    return null;
  }

  const isBackLink = Boolean(listId);

  return (
    <header className={styles.header}>
      <h1>
        {data
          ? `${
              data.author.charAt(0).toUpperCase() + data.author.slice(1)
            }'s Lists`
          : "No Author Found"}{" "}
      </h1>
    </header>
  );
};
