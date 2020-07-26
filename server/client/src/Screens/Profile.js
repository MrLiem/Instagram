import React, { useState, useEffect, useContext } from "react";
import { UserContext } from "../App";
import "./Profile.css";
const Profile = () => {
  const [myPhotos, setMyPhotos] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  // const [url, setUrl] = useState("");
  useEffect(() => {
    let mounted = true;
    fetch("/myposts", {
      method: "get",
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        if (mounted) setMyPhotos(result.myposts);
      });
    return () => (mounted = false);
  }, [myPhotos]);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "Instagram-MrLiem");
      fetch("https://api.cloudinary.com/v1_1/mrliem0862144900/image/upload", {
        method: "post",
        body: data,
      })
        .then((res) => res.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({
              picture: data.url,
            }),
          })
            .then((res) => res.json())
            .then((result) => {
              console.log(result);
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, picture: result.picture })
              );
              dispatch({ type: "UPDATEPIC", payload: result.picture });
            });
        })
        .catch((err) => console.log(err));
    }
  }, [image]);
  const updatePhoto = (file) => {
    setImage(file);
  };
  return (
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
            src={state ? state.picture : "loading"}
            alt=""
            className=""
            style={{
              width: "160px",
              height: "160px",
              borderRadius: "80px",
              display: "block",
            }}
          />
          <div className="file-field input-field" style={{ margin: "10px" }}>
            <div className="btn blue darken-1">
              <span>Upload Picture</span>
              <input
                type="file"
                onChange={(e) => updatePhoto(e.target.files[0])}
              />
            </div>
            <div className="file-path-wrapper">
              <input className="file-path validate" type="text" />
            </div>
          </div>
        </div>
        <div>
          <h4>{state ? state.name : "loading"}</h4>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "108%",
            }}
          >
            <h6>{myPhotos.length} posts</h6>
            <h6>{state ? state.followers.length : "loading"} followers</h6>
            <h6>{state ? state.followings.length : "loading"} following</h6>
          </div>
        </div>
      </div>

      <div className="gallery">
        {myPhotos.map((item) => {
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
  );
};

export default Profile;
