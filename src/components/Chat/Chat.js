import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import queryString from "query-string";
import io from "socket.io-client";

import "./Chat.css";

import Infobar from "../InfoBar/InfoBar";
import Input from "../Input/Input";
import Messages from "../Messages/Messages";
import TextContainer from "../TextContainer/TextContainer";

let socket;

const Chat = () => {
  let location = useLocation();

  const ENDPOINT = "https://chat-em-tempo-real.herokuapp.com/";

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState([]);
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState("");

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

    socket.on("roomData", ({ users }) => {
      setUsers(users);
    });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();

    if (message) {
      socket.emit("sendMessage", message, () => setMessage(""));
    }
  };

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
      <TextContainer users={users} />
    </div>
  );
};

export default Chat;
