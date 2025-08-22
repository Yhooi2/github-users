import { useEffect, useState } from "react";
import SearchForm from "./components/SearchForm";
import { UserProfile } from "./components/UserProfile";

function App() {
  const [userName, setUserName] = useState("Yhooi2");

  // Sync with localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("githubU  serName");
    if (storedUser) {
      setUserName(storedUser);
    }
  }, []);

  useEffect(() => {
    if (userName) {
      localStorage.setItem("githubUserName", userName);
    }
  }, [userName]); // Added userName to dependencies to update localStorage on change

  // Removed unnecessary import of
  useEffect;
  return (
    <main className="min-h-screen bg-gray-100">
      <div className="mx-auto max-w-6xl px-4 py-8">
        <SearchForm userName={userName} setUserName={setUserName} />
        {userName && <UserProfile userName={userName} />}
      </div>
    </main>
  );
}

export default App;
