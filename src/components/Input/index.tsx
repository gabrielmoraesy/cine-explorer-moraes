import { MagnifyingGlass } from "phosphor-react";
import styles from "./Input.module.css";

export interface InputProps {
  variant: "search" | string;
  placeholder: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export function Input({ variant, ...props }: InputProps) {
  return (
    <div className={styles.InputContainer}>
      <input
        {...props}
        type={"text"}
        className={styles.InputStyled}
        maxLength={25}
      />
      {variant === "search" && (
        <MagnifyingGlass className={styles.icon} size={25} color="#4B5C6B" />
      )}
    </div>
  );
}
