import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../App";
import "./Navbar.css";

const NavBar = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const renderList = () => {
    if (state) {
      return (
        <ul id="nav-mobile" className="right" key={"Not sign In"}>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/createpost">Create post</Link>
          </li>
          <li>
            <Link to="myfollowerposts">My following posts</Link>
          </li>
          <li>
            <button
              className="btn waves-effect waves-light  red darken-3"
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                history.push("/signin");
              }}
            >
              LogOut
            </button>
          </li>
        </ul>
      );
    } else {
      return (
        <ul id="nav-mobile" className="right" key={"Signed In"}>
          <li>
            <Link to="/signin">SignIn</Link>
          </li>
          <li>
            <Link to="signup">SignUp</Link>
          </li>
        </ul>
      );
    }
  };

  return (
    <nav>
      <div className="nav-wrapper white">
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          Instagram
        </Link>
        {renderList()}
      </div>
    </nav>
  );
};

export default NavBar;
