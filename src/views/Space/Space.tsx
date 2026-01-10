import { Link, useParams } from "react-router";
import { useSpaceMutation, useSpaceQuery } from "../../services/spaces";

import styles from "./space.module.css";
import { useAllListsQuery } from "../../services/lists";
import { List } from "../List/List";

const lists = [
  {
    id: "1",
    title: "Groceries",
    data: ["Apples", "Bananas", "Carrots"],
  },
  {
    id: "2",
    title: "Chores",
    data: ["Laundry", "Dishes", "Vacuum"],
  },
];

export const Space = () => {
  const { data, error: spaceError, isLoading: spaceLoading } = useSpaceQuery();
  const { spaceId, listId } = useParams();
  const {
    data: listsData,
    error: listsError,
    isLoading: listsLoading,
  } = useAllListsQuery(spaceId || "");

  const isLoading = listsLoading || spaceLoading;
  const error = listsError || spaceError;

  if (error) {
    return <div>Error loading space: {error.message}</div>;
  }

  if (isLoading) {
    return null;
  }

  return (
    <div className={styles.space}>
      <aside className={styles.lists}>
        {listsData?.map((list) => (
          <section key={list.id} className={styles.list}>
            <Link to={`/${data?.id}/list/${list.id}`}>
              <h2>{list.title}</h2>
            </Link>
          </section>
        ))}
        <button className={styles.addList}>+ New List</button>
      </aside>
      <main className={styles.main}>
        {listId ? (
          <List listId={listId} />
        ) : (
          <div>
            <h2>Welcome to {data?.author}'s Space</h2>
            <p>Select a list from the sidebar to view its details.</p>
          </div>
        )}
      </main>
    </div>
  );
};
