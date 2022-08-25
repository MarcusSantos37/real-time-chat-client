import React, { useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import queryString from "query-string";
import io from "socket.io-client";

import "./Chat.css";

let socket;

const Chat = () => {
  let location = useLocation();

  const ENDPOINT = "localhost:5000";

  const [name, setName] = useState("");
  const [room, setRoom] = useState("");

  useEffect(() => {
    if (location.search) {
      const data = queryString.parse(location.search);

      setName(data.name);
      setRoom(data.room);
    }
  }, [location.search, ENDPOINT]);

  useEffect(() => {
    if (name && room) {
      socket = io(ENDPOINT);

      socket.emit("join", { name, room }, () => {});
    }

    return () => {
      socket.emit("disconnect");

      socket.off();
    };
  }, [name, room]);

  return <h1>Chat</h1>;
};

export default Chat;
