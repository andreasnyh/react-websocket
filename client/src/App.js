import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import { TextField } from '@material-ui/core';
import './App.css';

const socket = io.connect('http://localhost:4000');

function App() {
  const [state, setState] = useState({ name: '', message: '' });
  const [chat, setChat] = useState([]);

  useEffect(() => {
    socket.on('message', ({ name, message }) => {
      setChat([...chat, { name, message }]);
    });
  });

  const onTextChange = (event) => {
    setState({ ...state, [event.target.name]: event.target.value });
  };

  const onMessageSubmit = (event) => {
    event.preventDefault();
    const { name, message } = state;
    console.log(JSON.stringify({ name, message }, null, 2));
    socket.emit('message', { name, message });
    setState({ ...state, message: '' });
  };

  const renderChat = () => {
    return chat.map(({ name, message }, index) => (
      <div key={index}>
        <h3>
          {name}: <span>{message}</span>
        </h3>
      </div>
    ));
  };

  return (
    <div className='App'>
      <div className='card'>
        <form onSubmit={onMessageSubmit}>
          <h1>Messenger</h1>
          <div className='name-field'>
            <TextField
              name='name'
              onChange={onTextChange}
              value={state.name}
              label='Name'
              required={true}
            />
          </div>
          <div className='message'>
            <TextField
              name='message'
              onChange={onTextChange}
              value={state.message}
              label='Message'
              required={true}
            />
          </div>
          <button>Send Message</button>
        </form>

        <div className='chat-log'>
          <h1>Chat log</h1>
          {renderChat()}
        </div>
      </div>
    </div>
  );
}

export default App;
