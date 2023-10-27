import React, { useState, useEffect } from "react";
import { Container, Button } from "react-bootstrap";
import Loader from "../layouts/loader";
import socketIO from "socket.io-client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faVideoCamera,
  faMicrophone,
  faUserPlus,
  faPaperPlane
} from "@fortawesome/free-solid-svg-icons";
import { Peer } from "peerjs";
const socket = socketIO.connect("http://localhost:9000");


const Home = () => {
 

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
            <div id="video-grid"></div>
          </div>
          <div className="options">
            <div className="options__left">
              <div id="stopVideo" className="options__button">
                <FontAwesomeIcon icon={faVideoCamera} />
              </div>
              <div id="muteButton" className="options__button">
                <FontAwesomeIcon icon={faMicrophone} />
              </div>
            </div>
            <div className="options__right">
              <div id="inviteButton" className="options__button">
                <FontAwesomeIcon icon={faUserPlus} />
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
