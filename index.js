require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/AuthRouter");
const partyRoutes = require("./routes/PartyRouter");
const inviteRoutes = require("./routes/InviteRouter");
const qrCodeRoutes = require("./routes/QrCodeRouter");
const s3Bucket = require("./helpers/s3");
const { initIO, getIO } = require("./socket");
const cors = require("cors");
const config = require("./config");

const app = express();
app.use(cors());
app.use(express.json());
const PORT = process.env.PORT || 3000;

mongoose
  .connect(config.mongoURI)
  .then(() => {
    console.log(`Connected on port -- ${PORT}`);
    const server = app.listen(PORT);
    initIO(server);
    getIO();
  })
  .catch((err) => console.log(err));

app.post("/push", async (req, res) => {
  const message = req.body;
  await fetch("https://exp.host/--/api/v2/push/send", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(message),
  })
    .then((response) => {
      return response.json();
    })
    .then((data) => {
    });
});

app.use("/api/users", authRoutes);
app.use("/api/parties", partyRoutes);
app.use("/api/invites", inviteRoutes);
app.use("/api/qrcodes", qrCodeRoutes);
app.post("/api/s3Url", s3Bucket.getSignedUrl);
