import { useState } from "react";
import SearchForm from "./components/SearchForm";
import UserProfile from "./components/UserProfile";

function App() {
  const [userName, setUserName] = useState("")
  return <main className="mx-auto max-w-3xl px-8 py-20">
    <SearchForm userName={userName} setUserName={setUserName} />
    <UserProfile userName={userName} />
  </main>
}

export default App
