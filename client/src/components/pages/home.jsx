import React, { useState, useEffect, useRef } from "react";
import { Container, Button } from "react-bootstrap";
import Loader from "../layouts/loader";
import socketIO from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideoCamera,
  faMicrophone,
  faUserPlus,
  faPaperPlane,
  faPhone,
  faVideoSlash,
  faMicrophoneSlash,
  faRefresh,
} from "@fortawesome/free-solid-svg-icons";
import { Peer } from "peerjs";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUsersByRoom } from "../../actions/userActions";
const socket = socketIO.connect("http://localhost:9000");

const Home = () => {
  const dispatch = useDispatch();
  const { roomId } = useParams();
  const { users } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.persistedReducer.user);

  const [userIds, setUserIds] = useState([]);
  const [uniqueId, setUniqueId] = useState(null);
  console.log(userIds, "userIds");
  const [showVideo, setShowVideo] = useState(false);
  const [call, setCall] = useState(false);
  const [muteAudio, setMuteAudio] = useState(false);
  const [myVideoStream, setMyVideoStream] = useState(null);
  const videoRef = useRef(null);
  const videoGrid = document.getElementById("video-grid");
  const myVideo = document.createElement("video");

  const myPeer = new Peer({
    host: "localhost",
    port: 9000,
    path: "/peerjs",
    config: {
      iceServers: [
        { url: "stun:stun01.sipphone.com" },
        { url: "stun:stun.ekiga.net" },
        { url: "stun:stunserver.org" },
        { url: "stun:stun.softjoys.com" },
        { url: "stun:stun.voiparound.com" },
        { url: "stun:stun.voipbuster.com" },
        { url: "stun:stun.voipstunt.com" },
        { url: "stun:stun.voxgratia.org" },
        { url: "stun:stun.xten.com" },
        {
          url: "turn:192.158.29.39:3478?transport=udp",
          credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
          username: "28224511:1379330808",
        },
        {
          url: "turn:192.158.29.39:3478?transport=tcp",
          credential: "JZEOEt2V3Qb0y27GRntt2u2PAYA=",
          username: "28224511:1379330808",
        },
      ],
    },
    debug: 3,
  });

  const addVideoStream1 = (video, stream, id) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
      videoGrid.append(video);
    });
    setUniqueId(id);
  };

  const addVideoStream = (video, stream) => {
    video.srcObject = stream;
    video.addEventListener("loadedmetadata", () => {
      video.play();
      videoGrid.append(video);
    });
  };

  const connectToNewUser = (userId, stream) => {
    console.log("I call someone" + userId);
    const call = myPeer.call(userId, stream);
    const video = document.createElement("video");
    call.on("stream", (userVideoStream) => {
      addVideoStream(video, userVideoStream);
    });
  };

  // const startVideoCall = () => {
  //   navigator.mediaDevices
  //     .getUserMedia({ audio: true, video: true })
  //     .then((stream) => {
  //       setMyVideoStream(stream);
  //       addVideoStream(myVideo, stream);

  //       myPeer.on("call", (call) => {
  //         console.log("someone call me");
  //         call.answer(stream);
  //         const video = document.createElement("video");
  //         call.on("stream", (userVideoStream) => {
  //           addVideoStream(video, userVideoStream);
  //         });
  //       });

  //       socket.on("user-connected", (userId) => {
  //         console.log(userId, "id")
  //         connectToNewUser(userId, stream);
  //       });
  //       setCall(true);
  //       setShowVideo(true);
  //       setMuteAudio(false);
  //     })

  //     .catch((error) => {
  //       console.error("Error accessing media devices:", error);
  //     });
  // };

  // useEffect(() => {
  //   const id = user._id;
  //   if (uniqueId) {
  //     null;
  //   } else {
  //     navigator.mediaDevices
  //       .getUserMedia({ audio: true, video: true })
  //       .then((stream) => {
  //         setMyVideoStream(stream);
  //         addVideoStream1(myVideo, stream, id);

  //         setCall(true);
  //         setShowVideo(true);
  //         setMuteAudio(false);
  //       })

  //       .catch((error) => {
  //         console.error("Error accessing media devices:", error);
  //       });
  //   }
  // }, [users]);

  const refresh = () => {
    // console.log("clicked");
    // navigator.mediaDevices
    //   .getUserMedia({ audio: true, video: true })
    //   .then((stream) => {
    //     setMyVideoStream(stream);
    //     myPeer.on("call", (call) => {
    //       console.log("someone call me");
    //       call.answer(stream);
    //       const video = document.createElement("video");
    //       call.on("stream", (userVideoStream) => {
    //         addVideoStream(video, userVideoStream);
    //       });
    //     });
    //     socket.on("user-connected", (userId) => {
    //       console.log(userId, "id");
    //       connectToNewUser(userId, stream);
    //     });
    //   });
  };

  useEffect(() => {
    navigator.mediaDevices
    .getUserMedia({
      audio: true,
      video: true,
    })
    .then((stream) => {
      setMyVideoStream(stream)
      addVideoStream(myVideo, stream);

      myPeer.on("call", (call) => {
        console.log("someone call me");
        call.answer(stream);
        const video = document.createElement("video");
        call.on("stream", (userVideoStream) => {
          addVideoStream(video, userVideoStream);
        });
      });

      socket.on("user-connected", (userId) => {
        connectToNewUser(userId, stream);
      });
    });

  }, [user])


  // useEffect(() => {
  //   navigator.mediaDevices
  //     .getUserMedia({ audio: true, video: true })
  //     .then((stream) => {
  //       myPeer.on("call", (call) => {
  //         console.log("someone call me");
  //         call.answer(stream);
  //         const video = document.createElement("video");
  //         call.on("stream", (userVideoStream) => {
  //           addVideoStream(video, userVideoStream);
  //         });
  //       });
  //       socket.on("user-connected", (userId) => {
  //         console.log(userId, "id");
  //         connectToNewUser(userId, stream);
  //       });
  //     })

  //   // return () => {
  //   //   myPeer.destroy();
  //   //   socket.disconnect();
  //   // };
  // }, [myVideoStream]);

  useEffect(() => {
    dispatch(getUsersByRoom(roomId));
  }, [dispatch]);

  useEffect(() => {
    myPeer.on("open", (id) => {
      socket.emit("join-room", roomId, id, user.name);
    });
  }, [roomId]);

  useEffect(() => {
    if (users) {
      const specificId = user._id;
      const filteredUserIds = users
        .filter((user) => user._id != specificId)
        .map((user) => user._id);
      setUserIds(filteredUserIds);
    }
  }, [users]);

  const toggleVideo = async () => {
    const enabled = myVideoStream.getVideoTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getVideoTracks()[0].enabled = false;
      setShowVideo(false);
    } else {
      myVideoStream.getVideoTracks()[0].enabled = true;
      setShowVideo(true);
    }
  };

  const copyLink = () => {
    const url = new URL(window.location.href);
    const lastPart = url.pathname.split("/").pop();
    prompt("share this id to connect", lastPart);
  };

  const toggleAudio = () => {
    const enabled = myVideoStream.getAudioTracks()[0].enabled;
    if (enabled) {
      myVideoStream.getAudioTracks()[0].enabled = false;
      setMuteAudio(true);
    } else {
      myVideoStream.getAudioTracks()[0].enabled = true;
      setMuteAudio(false);
    }
  };

  return (
    <div>
      <div className="header">
        <div className="logo">
          <h3>Video Chat</h3>
        </div>
      </div>
      <div className="main">
        <div className="main__left">
          <div className="videos__group">
            <div ref={videoRef} id="video-grid"></div>
            <div ref={videoRef} id="video-grid"></div>
          </div>
          <div className="options">
            <div className="options__left">
              {showVideo ? (
                <div id="stopVideo" className="options__button">
                  <FontAwesomeIcon icon={faVideoCamera} onClick={toggleVideo} />
                </div>
              ) : (
                <div id="stopVideo" className="options__button">
                  <FontAwesomeIcon icon={faVideoSlash} onClick={toggleVideo} />
                </div>
              )}
              {muteAudio ? (
                <div id="muteButton" className="options__button">
                  <FontAwesomeIcon
                    icon={faMicrophoneSlash}
                    onClick={toggleAudio}
                  />
                </div>
              ) : (
                <div id="muteButton" className="options__button">
                  <FontAwesomeIcon icon={faMicrophone} onClick={toggleAudio} />
                </div>
              )}
            </div>
            <div className="options__right">
              <div id="inviteButton" className="options__button">
                <FontAwesomeIcon icon={faUserPlus} onClick={copyLink} />
              </div>
            </div>
            <div className="options__right" style={{ marginLeft: "7px" }}>
              <div id="inviteButton3" className="options__button">
                <FontAwesomeIcon icon={faRefresh} onClick={refresh} />
              </div>
            </div>
            {/*  {call ? null : (
              <div className="options__right" style={{ marginLeft: "7px" }}>
                <div id="inviteButton2" className="options__button">
                  <FontAwesomeIcon icon={faPhone} onClick={startVideoCall} />
                </div>
              </div>
            )}*/}
          </div>
        </div>
        <div className="main__right">
          <div className="main__chat_window">
            <div className="messages"></div>
          </div>
          <div className="main__message_container">
            <input
              id="chat_message"
              type="text"
              autoComplete="off"
              placeholder="Type message here..."
            />
            <div id="send" className="options__button">
              <FontAwesomeIcon icon={faPaperPlane} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
