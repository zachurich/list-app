import styles from "./header.module.css";
import { useTheme } from "../../theme";
import { ChevronRight, Moon, Sun } from "lucide-react";
import { Button } from "../Button/Button";
import { useSpace } from "../../views/Space/hooks";
import { useListId } from "../../ui";
import { Link } from "react-router";
import { useListQuery } from "../../services/lists";
import classNames from "classnames";

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const listId = useListId();
  const { space, isLoading } = useSpace();
  const list = useListQuery(listId, space?.id).data;

  const getAuthorName = () =>
    space
      ? `${
          space.author.charAt(0).toUpperCase() + space.author.slice(1)
        }'s Lists`
      : null;

  const getHeaderTitle = () => {
    if (listId) {
      return <Link to="..">{getAuthorName()}</Link>;
    }
    return getAuthorName();
  };

  const getHeaderBreadcrumb = () => {
    if (!listId || !list) {
      return null;
    }
    return (
      <>
        <ChevronRight size={20} />
        <div className={styles.listBreadcrumbTitle}>
          {list?.title || "List"}
        </div>
      </>
    );
  };

  return (
    <header className={styles.header}>
      <div
        className={classNames(styles.listBreadcrumb, {
          [styles.loaded]: !isLoading,
        })}
      >
        <h1>{getHeaderTitle() || "Lists"}</h1>
        {getHeaderBreadcrumb()}
      </div>
      <Button
        // className={styles.themeToggle}
        variant="icon"
        onClick={toggleTheme}
      >
        {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
      </Button>
    </header>
  );
};
