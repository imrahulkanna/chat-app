const socket = io();

const sendButton = document.querySelector('#sendButton');
const input = document.querySelector('#messageInput');
const messages = document.querySelector('#messages');

input.addEventListener('keyup', (e) => {
  if(e.keyCode === 13) {
    e.preventDefault();
    sendButton.click();
  }
});

// input.addEventListener('keyup', (e) => {
//   const command = input.value;
//   switch (command) {
//     case '/help':
//       const textMessage = `Available commands:
// -> /random - Print a random number
// -> /clear - Clear the chat window`;
//       alert(textMessage);
//       input.value=''
//       break;
    
//     case '/clear':
//       break;

//     case '/random':
//       break

//     default:
//       break;
//   }
// })

sendButton.addEventListener('click', (e) => {
  e.preventDefault();
  const command = input.value;
  switch (command) {
    case "/help":
      const textMessage = `Available commands:
  -> /random - Print a random number
  -> /clear - Clear the chat window`;
      alert(textMessage);
      break;

    case "/clear":
      messages.innerHTML="";
      break;

    case "/random":
      const num = Math.random();
      const msge = `Your random number is ${num}`
      socket.emit("chat message", { message: msge, sender: "server" });
      break;

    default:
      socket.emit("chat message", { message: input.value, sender: "client" });
      break;
  }
  input.value = "";
});

function replaceTextWithEmojis(text) {
  textArr = text.split(' ');
  for(let i=0; i<textArr.length; i++){
    switch (textArr[i].toLowerCase()) {
      case 'lol':textArr[i] = "😂";break;
      case 'like':textArr[i]='💟';break;
      case 'hey':textArr[i]='👋';break;
      case 'woah':textArr[i]='😲';break;
      case 'congratulations':textArr[i] = "🎉";break;
      case 'react':textArr[i] = "⚛️";break;
      default:break;
    }
  };
    return textArr.join(' ');
}

socket.on('chat message', (data) => {
    const messageElement = document.createElement('div');
    if (data.sender === 'client') {
        messageElement.classList.add('message', 'client');
    } else {
        messageElement.classList.add('message', 'server');
    }
    messageElement.textContent = replaceTextWithEmojis(data.message);
    messages.appendChild(messageElement);
    messages.scrollTop = messages.scrollHeight;
});
