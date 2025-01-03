import { Navigate } from "react-router";

type Props = {
  handleLogin: () => void;
  authenticated: boolean | null;
};

const Login = ({ authenticated, handleLogin }: Props) => {
  return (
    <div>
      {authenticated === null && <div>Loading...</div>}
      {authenticated === false && (
        <div>
          <button onClick={() => { handleLogin(); }}>Login</button>
        </div>
      )}
      {authenticated && <Navigate to="/login-callback" />}
    </div>
  );
};

export default Login;