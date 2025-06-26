import { useTheme } from "../../../context/theme";
import { Moon, Sun } from "lucide-react";
import {
  StyledNavbar,
  NavContainer,
  LogoContainer,
  ThemeToggleButton,
} from "./navbar.styled";
import { Link } from "react-router-dom";

export const Navbar = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <StyledNavbar>
      <NavContainer>
        <LogoContainer>
          <Link to="/">
            <img src="/logo.svg" alt="ScrumPoker Logo" width={100} height={50} />
          </Link>
        </LogoContainer>
        <ThemeToggleButton onClick={toggleTheme}>
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </ThemeToggleButton>
      </NavContainer>
    </StyledNavbar>
  );
};
