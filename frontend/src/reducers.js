function userReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
    case "REGISTER":
      return action.username;
    case "LOGOUT":
      return "";
    default:
      return state;
  }
}

function todoReducer(state, action) {
  switch (action.type) {
    case "CREATE_TODO":
      const newPost = {
        title: action.title,
        content: action.content,
        author: action.author,
        time: action.time,
        id: action.id,
      };
      return [newPost, ...state];
    case "TOGGLE_TODO":
      return state.map((item) => {
        if (item.id === action.id) {
          return {
            ...item,
            check: !item.check,
            completed: !item.completed,
            completedOn: Date(Date.now()),
          };
        } else {
          return item;
        }
      });
    case "DELETE_TODO":
      return state.filter((item) => item.id !== action.id);

    case "FETCH_POSTS":
      return action.posts;
    default:
      return state;
  }
}

export default function appReducer(state, action) {
  return {
    user: userReducer(state.user, action),
    posts: todoReducer(state.posts, action),
  };
}
