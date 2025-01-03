import { useEffect, useState } from "react"
import { UserManager, WebStorageStateStore } from "oidc-client-ts";
import { BrowserRouter, Route, Routes } from "react-router";

import Login from "./login";
import Callback from "./login-callback";

export default function App() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const auth = new UserManager({
    userStore: new WebStorageStateStore({ store: window.localStorage }),
    loadUserInfo: true,
    authority: import.meta.env.VITE_AUTH_URL,
    client_id: import.meta.env.VITE_AUTH_CLIENT_ID,
    redirect_uri: import.meta.env.VITE_AUTH_REDIRECT_URI,
    response_type: "code",
    scope: "openid profile email",
  });

  useEffect(() => {
    auth.getUser().then((user) => { setAuthenticated(!!user); });
  }, [auth]);

  return (
    <div className="App">
      <header className="App-header">
        <h1>Sup?</h1>
        <p>Welcome to ZITADEL React</p>

        <BrowserRouter>
          <Routes>
            <Route
              path="/"
              element={
                <Login authenticated={authenticated} handleLogin={auth.signinRedirect.bind(auth)} />
              }
            />
            <Route
              path="/login-callback"
              element={
                <Callback
                  authenticated={authenticated}
                  setAuth={setAuthenticated}
                  handleLogout={auth.signoutRedirect.bind(auth)}
                  userManager={auth}
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </header>
    </div>
  );
}
