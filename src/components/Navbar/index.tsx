import styles from "./Navbar.module.css";
import { Input } from "../Input";
import { ChangeEvent } from "react";
import { ThemeToggle } from "../Contexts/ThemeContext";

type NavbarProps = {
  inputSearchValue: (value: string) => void;
};

export function Navbar({ inputSearchValue = () => {} }: NavbarProps) {
  return (
    <nav className={styles.NavbarContainer}>
      <h1 className={styles.NavbarContentTitle}>Cine Explorer Moraes</h1>

      <div className={styles.NavbarContentSearch}>
        <ThemeToggle />
        <Input
          variant={"search"}
          placeholder={"Pesquisar"}
          onChange={(event: ChangeEvent<HTMLInputElement>) =>
            inputSearchValue(event.target.value)
          }
        />
      </div>
    </nav>
  );
}
