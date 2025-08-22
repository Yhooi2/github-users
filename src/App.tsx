import { useEffect, useState } from "react";
import SearchForm from "./components/SearchForm";
import { ThemeToggle } from "./components/ThemeToggle";
import { UserProfile } from "./components/UserProfile";

function App() {
  const [userName, setUserName] = useState("Yhooi2");

  // Sync with localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("githubUserName");
    if (storedUser) {
      setUserName(storedUser);
    }
  }, []);

  useEffect(() => {
    if (userName) {
      localStorage.setItem("githubUserName", userName);
    }
  }, [userName]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <SearchForm userName={userName} setUserName={setUserName} />
          <ThemeToggle />
        </div>
        {userName && <UserProfile userName={userName} />}
      </div>
    </main>
  );
}

export default App;
