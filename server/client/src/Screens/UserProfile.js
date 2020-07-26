import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { UserContext } from "../App";
import "./UserProfile.css";
const UserProfile = () => {
  let mounted = true;
  const [userProfile, setUserProfile] = useState(null);
  const { userId } = useParams();
  const { state, dispatch } = useContext(UserContext);
  const [showFollow, setShowFollow] = useState(
    state ? !state.followings.includes(userId) : true
  );
  useEffect(() => {
    fetch(`/user/${userId}`, {
      method: "get",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (mounted) {
          setUserProfile(result);
        }
      });
    return () => (mounted = false);
  }, [userProfile]);

  const followUser = () => {
    fetch("/follow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { followers: data.followers, followings: data.followings },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setShowFollow(false);
      })
      .catch((err) => console.log(err));
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "put",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userId,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { followers: data.followers, followings: data.followings },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setShowFollow(true);
      })
      .catch((err) => console.log(err));
  };
  return (
    <>
      {userProfile ? (
        <div style={{ maxWidth: "1000px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0",
              borderBottom: "1px solid grey",
            }}
          >
            <div>
              <img
                src={userProfile.user.picture}
                alt=""
                className=""
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
              />
            </div>
            <div>
              <h4 className="">{userProfile.user.name}</h4>
              <h4 className="">{userProfile.user.email}</h4>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  width: "108%",
                }}
              >
                <h6>{userProfile.posts.length} posts</h6>
                <h6>{userProfile.user.followers.length} followers</h6>
                <h6>{userProfile.user.followings.length} following</h6>
              </div>
              {showFollow ? (
                <button
                  style={{ margin: "10px" }}
                  className="btn waves-effect waves-light  blue darken-1 "
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  style={{ margin: "10px" }}
                  className="btn waves-effect waves-light  blue darken-1 "
                  onClick={() => unfollowUser()}
                >
                  Unfollow
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {userProfile.posts.map((item) => {
              return (
                <img
                  key={item._id}
                  src={item.photo}
                  alt={item.title}
                  className="item"
                />
              );
            })}
          </div>
        </div>
      ) : (
        <h2>loading.......!!!</h2>
      )}
    </>
  );
};

export default UserProfile;
