import styles from "./header.module.css";
import { useTheme } from "../../theme";
import { Moon, Sun } from "lucide-react";
import { Button } from "../Button/Button";
import { useSpace } from "../../views/Space/hooks";

export const Header = () => {
  const { theme, toggleTheme } = useTheme();

  const { space, isLoading, listId } = useSpace();

  const isBackLink = Boolean(listId);

  return (
    <header className={styles.header}>
      <h1>
        {space
          ? `${
              space.author.charAt(0).toUpperCase() + space.author.slice(1)
            }'s Lists`
          : null}
      </h1>
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
