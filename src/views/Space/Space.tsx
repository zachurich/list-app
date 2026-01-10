import { Link, useNavigate, useParams } from "react-router";
import { useSpaceQuery } from "../../services/spaces";

import styles from "./space.module.css";
import { useAllListsQuery, useListMutation } from "../../services/lists";
import { List } from "../List/List";

export const Space = () => {
  const { data, error: spaceError, isLoading: spaceLoading } = useSpaceQuery();
  const navigate = useNavigate();
  const { spaceId, listId } = useParams();
  const {
    data: listsData,
    error: listsError,
    isLoading: listsLoading,
  } = useAllListsQuery(spaceId || "");

  const isLoading = listsLoading || spaceLoading;
  const error = listsError || spaceError;

  const { mutateAsync: createList } = useListMutation(data?.id);

  const handleAddList = async () => {
    const newList = {
      title: "New List",
      slug: "new-list",
      data: [],
      space_id: spaceId || "",
    };
    try {
      console.log("Creating list:", newList);
      const res = await createList(newList);
      navigate(`/${spaceId}/list/${res.id}`);
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

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
              {list.title}{" "}
              {list.data.length > 0 && list.data.every((item) => item.completed)
                ? "✓"
                : ""}
            </Link>
          </section>
        ))}
        <button className={styles.addList} onClick={handleAddList}>
          + New List
        </button>
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
