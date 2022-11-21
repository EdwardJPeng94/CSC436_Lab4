import React from "react";

import { useContext } from "react";
import { ThemeContext } from "../contexts";
import { StateContext } from "../contexts";
import { useResource } from "react-request-hook";

export default function ToDo({
  title,
  content,
  author,
  time,
  completed,
  completedOn,
  check,
  _id,
  login,
}) {
  const { secondaryColor, tertiaryColor } = useContext(ThemeContext);
  const { state, dispatch } = useContext(StateContext);
  const { posts } = state;

  const [del, deletePost] = useResource(({ id }) => ({
    url: `/post/${id}`,
    method: "delete",
    headers: { Authorization: `${state.user.access_token}` },
  }));

  const [toggle, togglePost] = useResource(
    ({ id, completed, completedOn }) => ({
      url: `/post/${id}`,
      method: "patch",
      data: { id, completed, completedOn },
      headers: { Authorization: `${state.user.access_token}` },
    })
  );
  return (
    <div>
      <h3 style={{ color: secondaryColor }}>{title}</h3>
      <div>{content}</div>
      <br />
      <i>
        Written by <b style={{ color: tertiaryColor }}>{login}</b>
      </i>
      <br />
      Created on <b> {time}</b>
      <br />
      <input
        type="submit"
        value="Completed"
        onClick={(event) => {
          event.preventDefault();
          togglePost({
            id: _id,
            completed: !completed,
            completedOn: Date(Date.now()),
          });
          dispatch({
            type: "TOGGLE_TODO",
            id: _id,
            check: check,
            completed: completed,
            completedOn: completedOn,
          });
        }}
      />
      <br />
      <input
        type="submit"
        value="Delete"
        onClick={(event) => {
          event.preventDefault();
          deletePost({ id: _id });
          dispatch({ type: "DELETE_TODO", id: _id });
        }}
      />
      <br />
      <label>
        Completed?
        <b>{completed ? "yes" : "no"}</b>
        <br />
        Completed on
        <b> {completed ? completedOn : ""}</b>
        <br />
      </label>
    </div>
  );
}

//{completed == null ? (check ? "Yes" : "No") : completed}
