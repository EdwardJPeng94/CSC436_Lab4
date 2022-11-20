import { useState, useContext, useEffect } from "react";
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
      url: "/post",
      method: "post",
      headers: { Authorization: `${state.user.access_token}` },
      data: { title, content, author, time, id, completed, completedOn },
    })
  );

  useEffect(() => {
    if (post.isLoading === false && post.data) {
      dispatch({
        type: "CREATE_TODO",
        title: post.data.title,
        content: post.data.content,
        id: post.data._id,
        author: user.username,
        time: Date(Date.now()),
        completed: false,
        completedOn: "",
      });
    }
  }, [post]);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createPost({
          title,
          content,
          author: user.username,
          time: Date(Date.now()),
          _id: uid,
          completed: null,
          completedOn: null,
        });
        // dispatch({
        //   type: "CREATE_TODO",
        //   title,
        //   content,
        //   author: user,
        //   id: uid,
        //   time: Date(Date.now()),
        //   completed: false,
        //   completedOn: "",
        // });
        //setUid(uuidv4());
      }}
    >
      <br />
      <div>
        Author: <b>{user.username}</b>
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
