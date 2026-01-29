import { Link } from "react-router";

import styles from "./space.module.css";
import { type List as ListType } from "../../services/lists";
import { List } from "../List/List";
import { Menu } from "../../components/Menu/Menu";

import classNames from "classnames";
import { Plus } from "lucide-react";
import { Button } from "../../components/Button/Button";
import { useSpace } from "./hooks";
import { useIsMobile, useSidebarVisibility } from "../../ui";

export const Space = () => {
  const {
    space: data,
    lists: listsData,
    isLoading,
    error,
    navigate,
    spaceId,
    listId,
    deleteList,
    createList,
  } = useSpace();

  const isMobile = useIsMobile();
  const isSidebarVisible = useSidebarVisibility();

  const handleAddList = async () => {
    const newList = {
      title: "Untitled List",
      slug: "untitled-list",
      data: [],
      space_id: spaceId || "",
    };
    try {
      console.log("Creating list:", newList);
      const res = await createList(newList);
      if (!isMobile) {
        navigate(`/${spaceId}/list/${res.id}`);
      }
    } catch (error) {
      console.error("Error creating list:", error);
    }
  };

  if (error instanceof Error) {
    return <div>Error loading space: {error.message}</div>;
  }

  // if (isLoading) {
  //   return null;
  // }

  const getMenuItems = (list: ListType) => [
    {
      id: "1",
      onClick: async () => {
        try {
          await deleteList(list.id);
          if (listId === list.id) {
            navigate(`/${spaceId}/`);
          }
        } catch (error) {
          console.error("Error deleting list:", error);
        }
      },
      label: "Delete List",
    },
    {
      id: "2",
      onClick: () => {
        navigate(`/${spaceId}/list/${list.id}`);
      },
      label: "Go to List",
    },
  ];

  return (
    <div
      className={classNames(styles.space, {
        [styles.loaded]: !isLoading,
      })}
    >
      <aside
        className={styles.lists}
        style={{
          display: isSidebarVisible ? undefined : "none",
        }}
      >
        <div className={styles.listContainer}>
          {listsData?.map((list) => (
            <section
              key={list.id}
              className={classNames(styles.list, {
                [styles.activeList]: list.id === listId,
              })}
            >
              <Link to={`/${data?.id}/list/${list.id}`}>
                {list.title}{" "}
                {list.data.length > 0 &&
                list.data.every((item) => item.completed)
                  ? "✓"
                  : ""}
              </Link>
              <div className={styles.listMenu}>
                <Menu items={getMenuItems(list)} />
              </div>
            </section>
          ))}
        </div>
        <Button
          className={styles.addList}
          icon={<Plus size={16} />}
          variant="primary"
          onClick={async () => {
            await handleAddList();
          }}
        >
          New List
        </Button>
      </aside>
      <main
        className={styles.main}
        style={{
          display: isSidebarVisible && isMobile ? "none" : "block",
        }}
      >
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
