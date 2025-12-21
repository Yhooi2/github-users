import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

type Props = {
  userName: string;
  setUserName: React.Dispatch<React.SetStateAction<string>>;
};

/**
 * Search form component for GitHub username input
 *
 * Features:
 * - Controlled input with local state
 * - Client-side validation (non-empty check)
 * - Toast notifications for validation errors
 * - Accessible with screen reader support
 *
 * @param props - Component props
 * @param props.userName - Initial username value
 * @param props.setUserName - Callback to update parent's username state
 * @returns Search form component
 *
 * @example
 * ```typescript
 * function App() {
 *   const [userName, setUserName] = useState('')
 *
 *   return <SearchForm userName={userName} setUserName={setUserName} />
 * }
 * ```
 */
function SearchForm({ userName, setUserName }: Props) {
  const [text, setText] = useState(userName);

  // Sync local state when userName prop changes (e.g., from URL or external source)
  useEffect(() => {
    setText(userName);
  }, [userName]);

  /**
   * Handles form submission with validation
   *
   * Validates that the input matches GitHub username format:
   * - Only alphanumeric characters and hyphens
   * - Cannot start or end with hyphen
   * - Maximum 39 characters
   * Shows a toast error notification if validation fails.
   *
   * @param e - Form submission event
   */
  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const trimmed = text.trim();

    if (trimmed.length === 0) {
      toast.error("Please enter a valid username");
      return;
    }

    // GitHub username validation: alphanumeric + hyphens, 1-39 chars, cannot start/end with hyphen
    const githubUsernameRegex = /^[a-z\d](?:[a-z\d]|-(?=[a-z\d])){0,38}$/i;
    if (!githubUsernameRegex.test(trimmed)) {
      toast.error("Invalid GitHub username format");
      return;
    }

    setUserName(trimmed);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
      <Label htmlFor="search" className="sr-only">
        Search
      </Label>
      <Input
        type="text"
        id="search"
        value={text}
        placeholder="Search GitHub User..."
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setText(e.target.value)
        }
        className="flex-grow bg-background"
      />
      <Button type="submit">Search</Button>
    </form>
  );
}

export default SearchForm;
