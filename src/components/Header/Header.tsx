import styles from "./header.module.css";
import { useTheme } from "../../theme";
import { ChevronLeft, Moon, Sun } from "lucide-react";
import { Button } from "../Button/Button";
import { useSpace } from "../../views/Space/hooks";
import { useListId } from "../../ui";
import { Link } from "react-router";
// import { useListQuery } from "../../services/lists";
import classNames from "classnames";
// import { Menu } from "../Menu/Menu";
// import { clearSpaceToken } from "../../services/token";
// import { useSpaceDeletion } from "../../services/spaces";

export const Header = () => {
  const { theme, toggleTheme } = useTheme();
  const listId = useListId();
  const { space, isLoading } = useSpace();
  // const { mutateAsync: clearSpace } = useSpaceDeletion();
  // const navigate = useNavigate();
  // const list = useListQuery(listId, space?.id).data;

  const getAuthorName = () =>
    space
      ? `${
          space.author.charAt(0).toUpperCase() + space.author.slice(1)
        }'s Lists`
      : null;

  const getHeaderTitle = () => {
    if (listId) {
      return (
        <Link to="..">
          <ChevronLeft size={28} strokeWidth={2} />
          {getAuthorName()}
        </Link>
      );
    }
    return getAuthorName();
  };

  // const getHeaderBreadcrumb = () => {
  //   if (!listId || !list) {
  //     return null;
  //   }
  //   return (
  //     <>
  //       <ChevronRight size={20} strokeWidth={2} />
  //       <div className={styles.listBreadcrumbTitle}>
  //         {list?.title || "List"}
  //       </div>
  //     </>
  //   );
  // };

  // const onClearSpace = async () => {
  //   if (!space?.id || !space?.space_token) return;
  //   await clearSpace({
  //     spaceId: space.id,
  //     spaceToken: space.space_token,
  //   });
  //   clearSpaceToken();
  //   navigate("/");
  // };

  return (
    <header className={styles.header}>
      <div
        className={classNames(styles.listBreadcrumb, {
          [styles.loaded]: !isLoading,
        })}
      >
        <h1>{getHeaderTitle() || "Lists"}</h1>
        {/* {getHeaderBreadcrumb()} */}
      </div>
      <div className={styles.actions}>
        <Button
          // className={styles.themeToggle}
          variant="icon"
          onClick={toggleTheme}
        >
          {theme === "dark" ? <Sun size={24} /> : <Moon size={24} />}
        </Button>
        {/* <Menu
          className={styles.menu}
          items={[
            // {
            //   label: "Share 🚧",
            //   onClick: () => null,
            // },
            {
              label: "Clear Space",
              onClick: onClearSpace,
            },
          ]}
        /> */}
      </div>
    </header>
  );
};
