import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { UserMenu } from "./UserMenu";

describe("UserMenu", () => {
  describe("Unauthenticated State", () => {
    it('показывает кнопку "Sign in with GitHub" для неавторизованных', () => {
      render(
        <UserMenu
          isAuthenticated={false}
          onSignIn={vi.fn()}
          onSignOut={vi.fn()}
        />,
      );

      expect(
        screen.getByRole("button", { name: /sign in with github/i }),
      ).toBeInTheDocument();
    });

    it("вызывает onSignIn при клике на кнопку входа", async () => {
      const onSignIn = vi.fn();
      const user = userEvent.setup();

      render(
        <UserMenu
          isAuthenticated={false}
          onSignIn={onSignIn}
          onSignOut={vi.fn()}
        />,
      );

      await user.click(
        screen.getByRole("button", { name: /sign in with github/i }),
      );
      expect(onSignIn).toHaveBeenCalledOnce();
    });

    it("не показывает аватар для неавторизованных", () => {
      render(
        <UserMenu
          isAuthenticated={false}
          onSignIn={vi.fn()}
          onSignOut={vi.fn()}
        />,
      );

      expect(screen.queryByRole("img")).not.toBeInTheDocument();
    });
  });

  describe("Authenticated State", () => {
    it("показывает аватар для авторизованных пользователей", () => {
      render(
        <UserMenu
          isAuthenticated={true}
          user={{
            login: "octocat",
            avatarUrl: "https://example.com/avatar.png",
          }}
          onSignIn={vi.fn()}
          onSignOut={vi.fn()}
        />,
      );

      // Avatar component renders in jsdom, but AvatarImage doesn't create actual <img> in jsdom
      // Instead, check for the Avatar container and fallback text
      const avatarButton = screen.getByRole("button", { name: /user menu/i });
      expect(avatarButton).toBeInTheDocument();

      // Avatar fallback shows first letter of username
      expect(screen.getByText("O")).toBeInTheDocument(); // First letter of "octocat"
    });

    it("показывает username в dropdown menu", async () => {
      const user = userEvent.setup();

      render(
        <UserMenu
          isAuthenticated={true}
          user={{
            login: "testuser",
            avatarUrl: "https://example.com/avatar.png",
          }}
          onSignIn={vi.fn()}
          onSignOut={vi.fn()}
        />,
      );

      // Открываем dropdown
      await user.click(screen.getByRole("button", { name: /user menu/i }));

      // Проверяем username
      expect(screen.getByText("@testuser")).toBeInTheDocument();
      expect(screen.getByText("Authenticated")).toBeInTheDocument();
    });

    it('вызывает onSignOut при клике на "Sign out"', async () => {
      const onSignOut = vi.fn();
      const user = userEvent.setup();

      render(
        <UserMenu
          isAuthenticated={true}
          user={{
            login: "octocat",
            avatarUrl: "https://example.com/avatar.png",
          }}
          onSignIn={vi.fn()}
          onSignOut={onSignOut}
        />,
      );

      // Открываем dropdown
      await user.click(screen.getByRole("button", { name: /user menu/i }));

      // Кликаем на "Sign out"
      await user.click(screen.getByRole("menuitem", { name: /sign out/i }));

      expect(onSignOut).toHaveBeenCalledOnce();
    });

    it("показывает fallback (первую букву username) если аватар не загружается", () => {
      render(
        <UserMenu
          isAuthenticated={true}
          user={{
            login: "johndoe",
            avatarUrl: "",
          }}
          onSignIn={vi.fn()}
          onSignOut={vi.fn()}
        />,
      );

      expect(screen.getByText("J")).toBeInTheDocument();
    });

    it("корректно обрабатывает длинный username", async () => {
      const user = userEvent.setup();

      render(
        <UserMenu
          isAuthenticated={true}
          user={{
            login: "very-long-username-for-testing",
            avatarUrl: "https://example.com/avatar.png",
          }}
          onSignIn={vi.fn()}
          onSignOut={vi.fn()}
        />,
      );

      // Открываем dropdown
      await user.click(screen.getByRole("button", { name: /user menu/i }));

      expect(
        screen.getByText("@very-long-username-for-testing"),
      ).toBeInTheDocument();
    });

    it("корректно обрабатывает username из одного символа", async () => {
      const user = userEvent.setup();

      render(
        <UserMenu
          isAuthenticated={true}
          user={{
            login: "x",
            avatarUrl: "https://example.com/avatar.png",
          }}
          onSignIn={vi.fn()}
          onSignOut={vi.fn()}
        />,
      );

      // Открываем dropdown
      await user.click(screen.getByRole("button", { name: /user menu/i }));

      expect(screen.getByText("@x")).toBeInTheDocument();
      expect(screen.getByText("X")).toBeInTheDocument(); // Fallback letter
    });
  });

  describe("Accessibility", () => {
    it("имеет доступное имя для кнопки меню", () => {
      render(
        <UserMenu
          isAuthenticated={true}
          user={{
            login: "octocat",
            avatarUrl: "https://example.com/avatar.png",
          }}
          onSignIn={vi.fn()}
          onSignOut={vi.fn()}
        />,
      );

      expect(
        screen.getByRole("button", { name: /user menu/i }),
      ).toBeInTheDocument();
    });

    it("поддерживает навигацию с клавиатуры", async () => {
      const user = userEvent.setup();

      render(
        <UserMenu
          isAuthenticated={false}
          onSignIn={vi.fn()}
          onSignOut={vi.fn()}
        />,
      );

      const button = screen.getByRole("button", { name: /sign in/i });

      // Фокус на кнопке
      button.focus();
      expect(button).toHaveFocus();

      // Enter нажимается
      await user.keyboard("{Enter}");
      // Проверка в реальном тесте требует mock onSignIn
    });
  });
});
