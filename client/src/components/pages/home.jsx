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
// const socket = socketIO.connect("http://localhost:9000");
import io from "socket.io-client";

const Home = () => {
  const { roomId } = useParams();
  const { user } = useSelector((state) => state.persistedReducer.user);
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef();
  const peerRef = useRef(null);
  const socketRef = useRef(null);
  const [myVideoStream, setMyVideoStream] = useState(null);
  const [showVideo, setShowVideo] = useState(true);
  const [muteAudio, setMuteAudio] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  useEffect(() => {
    socketRef.current = io("http://localhost:9000");
    peerRef.current = new Peer({
      host: "127.0.0.1",
      port: 9000,
      path: "/peerjs",
      debug: 3,
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
    });

    navigator.mediaDevices
      .getUserMedia({
        audio: true,
        video: true,
      })
      .then((stream) => {
        setMyVideoStream(stream);
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }

        peerRef.current.on("call", (call) => {
          call.answer(stream);
          call.on("stream", (userVideoStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = userVideoStream;
            }
          });
        });

        socketRef.current.on("user-connected", (userId) => {
          const call = peerRef.current.call(userId, stream);
          call.on("stream", (userVideoStream) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = userVideoStream;
            }
          });
        });
      });

    socketRef.current.on("createMessage", (message, userName) => {
      setMessages((prevMessages) => [...prevMessages, { message, userName }]);
    });

    peerRef.current.on("open", (id) => {
      socketRef.current.emit("join-room", roomId, id, user.firstName);
    });

    return () => {
      socketRef.current.disconnect();
      peerRef.current.destroy();
    };
  }, []);

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

  const sendMessage = (e) => {
    e.preventDefault();
    if (newMessage !== "") {
      socketRef.current.emit("message", newMessage);
      setNewMessage("");
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
            {/* <div ref={videoRef} id="video-grid"></div> */}

            <div id="video-grid">
              <video ref={localVideoRef} autoPlay />
              <video ref={remoteVideoRef} autoPlay />
            </div>
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
            <div className="messages">
              {messages.map((messageObj, index) => (
                <p key={index} style={{color: "#706233"}}>
                  <strong>{messageObj.userName}</strong>: {messageObj.message}
                </p>
              ))}
            </div>
          </div>
          <div className="main__message_container">
            <input
              id="chat_message"
              type="text"
              autoComplete="off"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type message here..."
            />
            <div id="send" className="options__button">
              <FontAwesomeIcon icon={faPaperPlane} onClick={sendMessage} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
