import { useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type props = {
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
};

function SearchForm({ userName, setUserName }: props) {
  const [text, setText] = useState(userName);

  function hundlerOnSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (text.length === 0) {
      toast.error("Please enter a  valid username");
      return;
    }
    setUserName(text);
  }

  return (
    <form
      onSubmit={hundlerOnSubmit}
      className="mb-8 flex w-full items-center gap-2 lg:w-1/3"
    >
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>
      <Input
        type="text"
        id="search"
        value={text}
        placeholder="Search Githab User... "
        onChange={(e) => setText(e.target.value)}
        className="flex-grow bg-background"
      />
      <Button type="submit">Search</Button>
    </form>
  );
}

export default SearchForm;
