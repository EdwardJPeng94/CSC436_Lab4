import { useState, useContext } from "react";
import { v4 as uuidv4 } from "uuid";
import { StateContext } from "../contexts";
import { useResource } from "react-request-hook";

export default function CreateToDo() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const { state, dispatch } = useContext(StateContext);
  const { user } = state;
  const [uid, setUid] = useState(uuidv4());

  const [post, createPost] = useResource(
    ({ title, content, author, time, id, completed, completedOn }) => ({
      url: "/posts",
      method: "post",
      data: { title, content, author, time, id, completed, completedOn },
    })
  );

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost({
          title,
          content,
          author: user,
          time: Date(Date.now()),
          id: uid,
          completed: null,
          completedOn: null,
        });
        dispatch({
          type: "CREATE_TODO",
          title,
          content,
          author: user,
          id: uid,
          time: Date(Date.now()),
          completed: false,
          completedOn: "",
        });
        setUid(uuidv4());
      }}
    >
      <br />
      <div>
        Author: <b>{user}</b>
      </div>
      <div>
        <label htmlFor="create-title">Title:</label>
        <input
          type="text"
          name="create-title"
          id="create-title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>
      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
      />
      <input type="submit" value="Create" />
    </form>
  );
}
