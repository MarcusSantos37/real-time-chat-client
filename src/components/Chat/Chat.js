import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import queryString from "query-string";
import io from "socket.io-client";

import "./Chat.css";

import Infobar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";

let socket;

const Chat = () => {
  let location = useLocation();

  const ENDPOINT = "localhost:5000";

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket = io(ENDPOINT);

    if (location.search) {
      const data = queryString.parse(location.search);

      setName(data.name);
      setRoom(data.room);
    }

    return () => {
      socket.disconnect();

      socket.off();
    };
  }, [location.search, ENDPOINT]);

  useEffect(() => {
    if (name && room) {
      socket.emit("join", { name, room }, () => {});
    }
  }, [name, room]);

  useEffect(() => {
    socket.on("message", (message) => {
      setMessages([...messages, message]);
    });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

  console.log(message, messages);

  return (
    <div className="outerContainer">
      <div className="container">
        <Infobar room={room} />
        <Messages messages={messages} name={name} />
        <Input
          message={message}
          setMessage={setMessage}
          sendMessage={sendMessage}
        />
      </div>
    </div>
  );
};

export default Chat;
