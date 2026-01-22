import { useEffect, useRef, useState } from "react";
import styles from "./menu.module.css";
import { Ellipsis } from "lucide-react";

type MenuItem = {
  label: string;
  onClick: () => Promise<void> | void;
  id?: string;
};

export const Menu = ({ items }: { items: MenuItem[] }) => {
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
      <button
        className={styles.menuButton}
        onClick={() => setVisible(!visible)}
      >
        <Ellipsis size={18} />
      </button>
      {visible && (
        <div className={styles.menu} ref={menuRef}>
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
