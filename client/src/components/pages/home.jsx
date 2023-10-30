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
} from "@fortawesome/free-solid-svg-icons";
import { Peer } from "peerjs";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { getUsersByRoom } from "../../actions/userActions";
const socket = socketIO.connect("http://localhost:9000");

const Home = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const { users } = useSelector((state) => state.users);
  const { user } = useSelector((state) => state.persistedReducer.user);

  const [userIds, setUserIds] = useState([]);
  console.log(userIds, "userIds");
  const [showVideo, setShowVideo] = useState(false);
  const [muteAudio, setMuteAudio] = useState(false);
  const videoRef = useRef(null);

  useEffect(() => {
    dispatch(getUsersByRoom(id));
  }, [dispatch]);

  // useEffect(() => {
  //   socket.on('data-updated', () => {
  //     dispatch(getUsersByRoom(id));
  //   });
  //   return () => {
  //     socket.off('data-updated');
  //   };
  // }, [dispatch, id]);

  useEffect(() => {
    socket.emit("join-room", id, "653f40f65adf687269c4a0eb", "jack");
  }, []);

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
    if (!showVideo) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: true,
        });
        const myVideo = document.createElement("video");
        myVideo.srcObject = stream;
        myVideo.muted = true;
        myVideo.play();
        videoRef.current.appendChild(myVideo);
        setShowVideo(true);
      } catch (error) {
        console.error("Error accessing media devices:", error);
      }
    } else {
      const videoElement = videoRef.current.querySelector("video");
      videoElement.srcObject.getTracks().forEach((track) => track.stop());
      videoElement.remove();
      setShowVideo(false);
    }
  };

  const toggleAudio = () => {
    const audioTracks = videoRef.current
      .querySelector("video")
      .srcObject.getAudioTracks();
    audioTracks.forEach((track) => {
      track.enabled = !muteAudio;
    });
    setMuteAudio((prevState) => !prevState);
    console.log("muted");
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
          </div>
          <div className="options">
            <div className="options__left">
              <div id="stopVideo" className="options__button">
                <FontAwesomeIcon icon={faVideoCamera} onClick={toggleVideo} />
              </div>
              <div id="muteButton" className="options__button">
                <FontAwesomeIcon icon={faMicrophone} onClick={toggleAudio} />
              </div>
            </div>
            <div className="options__right">
              <div id="inviteButton" className="options__button">
                <FontAwesomeIcon icon={faUserPlus}  />
              </div>
            </div>
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
