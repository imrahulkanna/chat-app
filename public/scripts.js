const socket = io();

const sendButton = document.querySelector('#sendButton');
const input = document.querySelector('#messageInput');
const messages = document.querySelector('#messages');
let rem = {}

input.addEventListener('keyup', (e) => {
  if(e.keyCode === 13) {
    e.preventDefault();
    sendButton.click();
  }
});

sendButton.addEventListener('click', (e) => {
  e.preventDefault();
  const command = input.value;
  if(command.trim() === '') {
    alert("enter any message");
    exit();
  }

  if(command.includes('/calc')) {
    const res = eval(command.slice(6))
    if(res === undefined){
      alert('give a math eq');
      exit();
    }
    socket.emit("chat message", { message: `Result: ${res}`, sender: "client" });
  }
  else if(command.includes('/rem')) {
    let pairs = command.slice(5);
    let arr=[];
    if(pairs) {arr = pairs.split(' ')}

    if(arr.length === 2) {
      rem={...rem, [arr[0]]:arr[1],}
    } else if(arr.length === 1) {
      if(rem[arr[0]])
      {socket.emit("chat message", { message: rem[arr[0]], sender: "client" });}
      else {
        alert('No such key. Enter a value along with the key to remember ')
      }
    }
  }
  else {
    switch (command) {
      case "/help":
        const textMessage = `Available commands:
  -> /random - Print a random number
  -> /clear - Clear the chat window
  -> /calc mathEq - Calculates the given mathEq
  -> /rem <name> <val> - Remembers the 'value' against the 'name'
  -> /rem <name> - Returns the 'value' associated to the 'name'`;
        alert(textMessage);
        break;

      case "/clear":
        messages.innerHTML = "";
        break;

      case "/random":
        const num = Math.random();
        const msge = `Your random number is ${num}`;
        socket.emit("chat message", { message: msge, sender: "server" });
        break;

      default:
        socket.emit("chat message", { message: input.value, sender: "client" });
        break;
    }
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
