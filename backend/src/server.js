require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");

const rfpRoutes = require("./routes/rfp");
const vendorRoutes = require("./routes/vendors");
const emailRoutes = require("./routes/email");

const { startPolling } = require("./services/imapPoller");

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/rfp", rfpRoutes);
app.use("/api/vendors", vendorRoutes);
app.use("/api/email", emailRoutes);

const PORT = process.env.PORT || 4000;
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log("Server running on", PORT);
    });

    // Start IMAP poller if credentials present
    if (process.env.IMAP_HOST && process.env.IMAP_USER) {
      const interval = parseInt(process.env.POLL_INTERVAL_SECONDS || "60");
      startPolling(interval);
      console.log("Started IMAP poller every", interval, "seconds");
    }
  })
  .catch(err => {
    console.error("DB conn error:", err.message);
  });
