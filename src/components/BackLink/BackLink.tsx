import { Link } from "react-router";
import styles from "./backLink.module.css";
import { useSidebarVisibility } from "../../ui";

export const BackLink = () => {
  const isSidebarVisible = useSidebarVisibility();
  // const

  if (isSidebarVisible) {
    return null;
  }

  return (
    <div className={styles.root}>
      <Link to=".." relative="path">
        ← Back to Lists
      </Link>
    </div>
  );
};
