import classNames from "classnames";

import styles from "./button.module.css";

type Props = {
  ref?: React.Ref<unknown>;
  onClick: () => void;
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "icon";
  icon?: React.ReactNode;
  className?: string;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button = ({
  className,
  onClick,
  children,
  icon,
  variant = "primary",
  ...rest
}: Props) => {
  return (
    <button
      onClick={onClick}
      className={classNames(styles.root, styles[variant], className)}
      {...rest}
    >
      {icon}
      {children}
    </button>
  );
};
