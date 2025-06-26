import { AppRoutes } from "./routes";
import { ThemeProvider } from "./context/theme";
import './index.css'
import { Navbar } from "./components/layout";
import { UserProvider } from "./context/user";

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <Navbar />
        <AppRoutes />
      </UserProvider>
    </ThemeProvider>
  );
}

export default App;
