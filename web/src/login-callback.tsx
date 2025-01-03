import { useEffect, useState } from "react";
import { UserManager, User } from "oidc-client-ts";

type Props = {
  authenticated: boolean | null;
  setAuth: (authenticated: boolean | null) => void;
  userManager: UserManager;
  handleLogout: any;
};

const Callback = ({
  authenticated,
  setAuth,
  userManager,

  handleLogout,
}: Props) => {
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [apiResponse, setApiResponse] = useState<string | null>(null);

  useEffect(() => {
    if (authenticated === null) {
      userManager
        .signinRedirectCallback()
        .then((user: User) => {
          if (user) {
            setAuth(true);
            setUserInfo(user);
          } else {
            setAuth(false);
            setApiResponse("Processed callback, but no user?");
          }
        })
        .catch(() => {
          setAuth(false);
        });
    }
    if (authenticated === true && userInfo === null) {
      userManager
        .getUser()
        .then((user) => {
          if (user) {
            setAuth(true);
            setUserInfo(user);
          } else {
            setAuth(false);
            setApiResponse("No user?");
          }
        })
        .catch(() => {
          setAuth(false);
          setApiResponse("Error getting user?");
        });
    }
    if (authenticated === true && userInfo && apiResponse === null) {
      fetch(
        `${import.meta.env.VITE_API_BASE_URL}/api/private`,
        { headers: { Authorization: `Bearer ${userInfo.access_token}` } },
      ).then((response) => {
          if (response.ok) {
            response.json().then((json_response) => {
              if ("message" in json_response && typeof json_response["message"] === "string") {
                setApiResponse(json_response["message"]);
              } else {
                setApiResponse("Good response with no message.");
              }
            })
          } else {
              setApiResponse("Bad response " + response.status);
          }
        })
    }
  }, [authenticated, userManager, setAuth, setApiResponse]);

  if (authenticated === true && apiResponse) {
    return (
      <div>
        <p>Name: {userInfo?.profile.name}</p>
        <p>Email: {userInfo?.profile.email}</p>
        <p>API Response: {apiResponse}</p>
        <button onClick={handleLogout}>Log out</button>
      </div>
    );
  } else {
    return <div>Loading...</div>;
  }
};

export default Callback;