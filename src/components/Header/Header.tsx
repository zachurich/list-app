import { Link, useMatch } from "react-router";
import { useSpaceQuery } from "../../services/spaces";
import styles from "./header.module.css";
import { useListQuery } from "../../services/lists";

export const Header = () => {
  const { data, isLoading } = useSpaceQuery();
  const { params = {} } = useMatch("/:spaceId/list/:listId") ?? {};
  const listId = params?.listId;
  const { data: listData } = useListQuery(listId);

  if (isLoading) {
    return null;
  }

  const isBackLink = Boolean(listId);

  console.log("ZACH", listData);

  return (
    <header className={styles.header}>
      <h1>
        {data ? `${data.author}'s Lists` : "No Author Found"}{" "}
        {isBackLink ? "> List" : ""}
      </h1>
      {isBackLink && (
        <Link to={params ? `/${data?.id}` : `/${data?.id}/`}>Back</Link>
      )}
    </header>
  );
};
