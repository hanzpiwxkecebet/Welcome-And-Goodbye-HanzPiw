const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason
} = require("@whiskeysockets/baileys")

const P = require("pino")
const chalk = require("chalk")
const { Boom } = require("@hapi/boom")

const welcome = require("./lib/welcome")
const goodbye = require("./lib/goodbye")

async function startBot() {

  const { state, saveCreds } =
    await useMultiFileAuthState("./session")

  const { version } =
    await fetchLatestBaileysVersion()

  const sock = makeWASocket({
    version,
    logger: P({ level: "silent" }),
    auth: state
  })

  // SAVE SESSION
  sock.ev.on("creds.update", saveCreds)

  // CONNECTION
  sock.ev.on("connection.update", ({
    connection,
    lastDisconnect
  }) => {

    if (connection === "open") {
      console.log(
        chalk.green("✅ Bot Connected")
      )
    }

    if (connection === "close") {

      const shouldReconnect =
        new Boom(lastDisconnect?.error)
          ?.output?.statusCode !== DisconnectReason.loggedOut

      console.log(
        chalk.red("❌ Connection Closed")
      )

      if (shouldReconnect) {
        startBot()
      }
    }
  })

  // GROUP UPDATE
  sock.ev.on("group-participants.update", async (anu) => {

    if (anu.action === "add") {
      welcome(sock, anu)
    }

    if (anu.action === "remove") {
      goodbye(sock, anu)
    }

  })

}

startBot()