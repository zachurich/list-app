import { Copyright } from "lucide-react";
import styles from "./footer.module.css";

export const Footer = () => {
  return (
    <footer className={styles.root}>
      <div>
        Built by
        <a
          href="https://zachurich.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Zach Urich
        </a>{" "}
        <span>|</span> <Copyright size={14} /> {new Date().getFullYear()}
      </div>
    </footer>
  );
};
