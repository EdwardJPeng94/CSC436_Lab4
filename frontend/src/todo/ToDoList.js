import ToDo from "./ToDo";
import { useContext } from "react";
import { StateContext } from "../contexts";

export default function TodoList() {
  const { state } = useContext(StateContext);
  const { posts } = state;

  return (
    <div>
      {posts.map((p, i) => (
        <div key={p.id}>
          <ToDo {...p} />

          <br />
        </div>
      ))}
    </div>
  );
}
