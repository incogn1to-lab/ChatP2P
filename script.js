const chat = document.getElementById('chat');
const messageInput = document.getElementById('message');
const recipientInput = document.getElementById('recipientId');
const agentIdDisplay = document.getElementById('agentId');

// Generar ID único para el agente
const agentId = "agent_" + Math.floor(Math.random() * 100000);
agentIdDisplay.textContent = agentId;

// WebRTC setup
const peer = new RTCPeerConnection({
  iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
});

let channel = peer.createDataChannel("chat");

channel.onmessage = (e) => {
  const data = JSON.parse(e.data);
  chat.value += `📥 ${data.sender} → ${data.recipient}: ${data.message}\n`;
};

function sendMessage() {
  const msg = messageInput.value;
  const to = recipientInput.value || "desconocido";

  const semanticMessage = {
    "@context": "https://schema.org",
    "@type": "Message",
    "sender": agentId,
    "recipient": to,
    "message": msg,
    "timestamp": new Date().toISOString()
  };

  channel.send(JSON.stringify(semanticMessage));
  chat.value += `📤 ${agentId} → ${to}: ${msg}\n`;
  messageInput.value = "";
}

// Señal manual
peer.onicecandidate = ({ candidate }) => {
  if (candidate) console.log("ICE:", JSON.stringify(candidate));
};

peer.createOffer().then(offer => {
  peer.setLocalDescription(offer);
  console.log("Oferta:", JSON.stringify(offer));
});
