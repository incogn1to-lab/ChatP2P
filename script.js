const chat = document.getElementById('chat');
const messageInput = document.getElementById('message');

const peer = new RTCPeerConnection({
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
});

let channel = peer.createDataChannel("chat");

channel.onmessage = (e) => {
  chat.value += "Otro: " + e.data + "\n";
};

function sendMessage() {
  const msg = messageInput.value;
  channel.send(msg);
  chat.value += "Yo: " + msg + "\n";
  messageInput.value = "";
}

// Mostrar oferta para compartir manualmente
peer.onicecandidate = ({ candidate }) => {
  if (candidate) console.log("ICE:", JSON.stringify(candidate));
};

peer.createOffer().then(offer => {
  peer.setLocalDescription(offer);
  console.log("Oferta:", JSON.stringify(offer));
});
