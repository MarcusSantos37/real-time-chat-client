import React from "react";

import "./Input.css";

const Input = ({ message, setMessage, sendMessage }) => {
  console.log("saldl", message);
  return (
    <form className="form">
      <input
        className="input"
        type="text"
        placeholder="Escreva uma mensagem..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyPress={(e) => (e.key === "Enter" ? sendMessage(e) : null)}
      />
      <button
        disabled={message.length === 0}
        className="sendButton"
        onClick={(e) => sendMessage(e)}
      >
        Enviar
      </button>
    </form>
  );
};

export default Input;
