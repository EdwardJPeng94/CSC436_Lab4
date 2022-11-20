import ToDo from "./ToDo";
import { useContext } from "react";
import { StateContext } from "../contexts";

export default function TodoList() {
  const { state } = useContext(StateContext);
  const { posts } = state;

  return (
    <div>
      {/* {posts.map((p, i) => (
        <div key={p._id}>
          <ToDo {...p} />

          <br />
        </div>
      ))} */}

      {/* <div>
        {posts.length === 0 && <h2>No posts found.</h2>}
        {posts.length > 0 &&
          posts.map((p, i) => <ToDo {...p} key={p._id | p.id} />)}
      </div> */}

      <div>
        {posts.length === 0 && <h2>No posts found.</h2>}
        {posts.length > 0 &&
          posts.map((p, i) => (
            <div key={p._id}>
              <ToDo {...p} />

              <br />
            </div>
          ))}
      </div>

      {/* <div key={p._id}>
        <ToDo {...p} />

        <br />
      </div> */}
    </div>
  );
}
