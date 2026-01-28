import { useEffect, useRef, useState } from "react";
import styles from "./menu.module.css";
import { Ellipsis } from "lucide-react";
import { Button } from "../Button/Button";

import classNames from "classnames";

type MenuItem = {
  label: string;
  onClick: () => Promise<void> | void;
  id?: string;
};

export const Menu = ({
  className,
  items,
}: {
  className?: string;
  items: MenuItem[];
}) => {
  const [visible, setVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setVisible(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleMenuItemClick = async (item: MenuItem) => {
    await item.onClick();
    setVisible(false);
  };

  return (
    <div className={styles.root}>
      <Button
        className={styles.menuButton}
        onClick={() => setVisible(!visible)}
        variant="icon"
      >
        <Ellipsis size={18} />
      </Button>
      {visible && (
        <div className={classNames(styles.menu, className)} ref={menuRef}>
          {items.map((item) => (
            <button
              className={styles.menuItemButton}
              key={item.id}
              onClick={() => handleMenuItemClick(item)}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
