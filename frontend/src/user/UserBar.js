import Login from "./Login";
import Register from "./Register";
import React, { useContext } from "react";
import { StateContext } from "../contexts";
const Logout = React.lazy(() => import("./Logout"));

export default function UserBar({}) {
  const { state } = useContext(StateContext);
  if (state.user) {
    return <Logout />;
  } else {
    return (
      <>
        <Login />
        <Register />
      </>
    );
  }
}
