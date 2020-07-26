import React, { useEffect, createContext, useReducer, useContext } from "react";
import NavBar from "./components/Navbar";
import {
  BrowserRouter,
  Route,
  Redirect,
  Switch,
  useHistory,
} from "react-router-dom";
import Home from "./Screens/Home";
import Profile from "./Screens/Profile";
import Login from "./Screens/SignIn";
import SignUp from "./Screens/SignUp";
import CreatePost from "./Screens/CreatePost";
import UserProfile from './Screens/UserProfile'
import SubscribesUserPosts from './Screens/SubscribesUserPosts'
import { reducer, initialState } from "./reducer/userReducer";

export const UserContext = createContext();

const Routing = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/signin");
    }
  },[]);
  return (
    <Switch>
      <Route path="/" exact>
        <Home />
      </Route>
      <Route path="/signin" exact>
        <Login />
      </Route>
      <Route path="/profile" exact>
        <Profile />
      </Route>
      <Route path="/signup" exact>
        <SignUp />
      </Route>
      <Route path="/createpost" exact>
        <CreatePost />
      </Route>
      <Route path="/profile/:userId" exact>
        <UserProfile />
      </Route>
      <Route path="/myfollowerposts" exact>
        <SubscribesUserPosts />
      </Route>
      <Redirect to="/" />
    </Switch>
  );
};
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <NavBar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
