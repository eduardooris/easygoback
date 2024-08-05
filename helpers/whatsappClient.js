const { Client, LocalAuth } = require("whatsapp-web.js");
const qrcode = require("qrcode-terminal");

let client;

function initializeClient() {
  client = new Client({
    authStrategy: new LocalAuth(),
  });

  client.on("qr", (qr) => {
    console.log("QR Code recebido, escaneie com o WhatsApp!");
    qrcode.generate(qr, { small: true });
  });

  client.on("ready", () => {
    console.log("Cliente do WhatsApp está pronto!");
  });

  client.initialize();
}

function sendMessage(phone, message) {
  if (!client) {
    throw new Error("Cliente WhatsApp não inicializado.");
  }

  // Verifica se o número já está no formato internacional
  const formattedPhone = phone.startsWith("55") ? phone : `55${phone}`;
  const chatId = `${formattedPhone}@c.us`;

  return client.sendMessage(chatId, message);
}

module.exports = {
  initializeClient,
  sendMessage,
};
