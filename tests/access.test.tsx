import { describe, it, expect, vi, afterEach } from "vitest";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Routes, Route, useLocation } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth, type User } from "../src/stores/AuthContext";
import Guard from "../src/core/router/ProtectedRoute";
import {
  findMatchingRoute,
  type MatchableRoute,
} from "../src/core/router/matchRoute";
import { api, axiosTransport, configureApi } from "../src/core/service/Axios";
const user: User = { id: 1, name: "First", username: "first", roles: [] };
function Account() {
  const auth = useAuth(),
    location = useLocation();
  return (
    <>
      <span>{location.pathname}</span>
      <button onClick={() => auth.login("next-token", { ...user, id: 2 })}>
        Login
      </button>
      <button onClick={auth.logout}>Logout</button>
    </>
  );
}
describe("route and session policies", () => {
  it("ranks static and parameterized routes and matches nested routes", () => {
    expect(
      findMatchingRoute(
        [
          { path: "/items/:id", permission: "read" },
          { path: "/items/create", permission: "create" },
        ],
        "/items/create",
      )?.permission,
    ).toBe("create");
    expect(
      findMatchingRoute<MatchableRoute>(
        [
          {
            path: "/items",
            children: [{ path: ":id/edit", permission: "update" }],
          },
        ],
        "/items/uuid/edit",
      )?.permission,
    ).toBe("update");
  });
  it("denies direct access to dynamic edit routes", () => {
    render(
      <MemoryRouter initialEntries={["/items/42/edit"]}>
        <Routes>
          <Route
            element={
              <Guard
                isAuthenticated
                can={() => false}
                routes={[{ path: "/items/:id/edit", permission: "update" }]}
                forbidden={<p>Forbidden</p>}
              />
            }
          >
            <Route path="/items/:id/edit" element={<p>Editor</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );
    expect(screen.getByText("Forbidden")).toBeInTheDocument();
    expect(screen.queryByText("Editor")).not.toBeInTheDocument();
  });
  it("clears data from the previous account on login and logout", async () => {
    const client = new QueryClient(),
      actor = userEvent.setup();
    client.setQueryData(["private"], { account: 1 });
    render(
      <MemoryRouter>
        <QueryClientProvider client={client}>
          <AuthProvider>
            <Account />
          </AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>,
    );
    await actor.click(screen.getByText("Login"));
    expect(client.getQueryData(["private"])).toBeUndefined();
    expect(localStorage.getItem("user")).toContain('"id":2');
    client.setQueryData(["private"], { account: 2 });
    await actor.click(screen.getByText("Logout"));
    expect(client.getQueryData(["private"])).toBeUndefined();
    expect(localStorage.getItem("token")).toBeNull();
    expect(screen.getByText("/login")).toBeInTheDocument();
  });
  it("invalidates the whole session on an unauthorized event", async () => {
    localStorage.setItem("token", "session");
    localStorage.setItem("user", JSON.stringify(user));
    const client = new QueryClient();
    client.setQueryData(["private"], { account: 1 });
    render(
      <MemoryRouter>
        <QueryClientProvider client={client}>
          <AuthProvider>
            <Account />
          </AuthProvider>
        </QueryClientProvider>
      </MemoryRouter>,
    );
    act(() => window.dispatchEvent(new Event("core:unauthorized")));
    await waitFor(() => expect(localStorage.getItem("user")).toBeNull());
    expect(client.getQueryCache().getAll()).toHaveLength(0);
  });
});
const originalAdapter = axiosTransport.defaults.adapter;
afterEach(() => {
  axiosTransport.defaults.adapter = originalAdapter;
  configureApi({ token: () => null, onUnauthorized: () => {} });
});
describe("HTTP integration", () => {
  it("handles an error envelope returned with HTTP 200 and reports field errors", async () => {
    const unauthorized = vi.fn();
    configureApi({ baseURL: "/api", onUnauthorized: unauthorized });
    axiosTransport.defaults.adapter = async (config) => ({
      status: 200,
      statusText: "OK",
      headers: {},
      config,
      data: {
        type: "error",
        status: 401,
        data: { message: "Expired", fieldErrors: { name: "Invalid name" } },
      },
    });
    await expect(api.get("/private")).rejects.toMatchObject({
      status: 401,
      fieldErrors: { name: "Invalid name" },
    });
    expect(unauthorized).toHaveBeenCalledOnce();
  });
});
