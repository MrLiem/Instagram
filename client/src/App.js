import React from "react";
import NavBar from "./components/Navbar";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import Home from "./Screens/Home";
import Profile from "./Screens/Profile";
import Login from "./Screens/Login";
import SignUp from "./Screens/SignUp";

function App() {
  return (
    <BrowserRouter>
      <NavBar />
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
        <Redirect to="/"/>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
