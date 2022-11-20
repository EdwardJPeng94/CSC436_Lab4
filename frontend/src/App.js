import React, { useState, useReducer, useEffect } from "react";
import UserBar from "./user/UserBar";
import ToDoList from "./todo/ToDoList";
import CreateToDo from "./todo/CreateToDo";
import appReducer from "./reducers";
import { ThemeContext, StateContext } from "./contexts";
import Header from "./Header";
import { useResource } from "react-request-hook";

function App() {
  const initialPosts = [];

  const [state, dispatch] = useReducer(appReducer, {
    user: "",
    posts: initialPosts,
  });

  const [theme] = useState({
    primaryColor: "deepskyblue",
    secondaryColor: "coral",
    tertiaryColor: "forestgreen",
  });

  const { user } = state;

  useEffect(() => {
    if (user) {
      document.title = `Eddie’s Blog`;
    } else {
      document.title = "Blog";
    }
  }, [user]);

  const [posts, getPosts] = useResource(() => ({
    url: "/post",
    method: "get",
    headers: { Authorization: `${state?.user?.access_token}` },
  }));

  useEffect(() => {
    getPosts();
  }, [state?.user?.access_token]);

  useEffect(() => {
    if (posts && posts.isLoading === false && posts.data) {
      dispatch({ type: "FETCH_POSTS", posts: posts.data.posts.reverse() });
    }
  }, [posts]);
  // useEffect(getPosts, []);

  // useEffect(() => {
  //   if (posts && posts.data) {
  //     dispatch({ type: "FETCH_POSTS", posts: posts.data.reverse() });
  //   }
  // }, [posts]);

  return (
    <div>
      <StateContext.Provider value={{ state, dispatch }}>
        <ThemeContext.Provider value={theme}>
          <Header title="To Do List" />
          <React.Suspense fallback={"Loading..."}>
            <UserBar />
          </React.Suspense>
          <ToDoList />
          {state.user && <CreateToDo />}
        </ThemeContext.Provider>
      </StateContext.Provider>
    </div>
  );
}

export default App;
