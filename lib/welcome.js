const moment = require("moment-timezone")

module.exports = async (sock, anu) => {

  try {

    const metadata =
      await sock.groupMetadata(anu.id)

    const participants =
      anu.participants

    for (let num of participants) {

      // PROFILE
      let ppuser

      try {
        ppuser =
          await sock.profilePictureUrl(num, "image")
      } catch {
        ppuser =
          "https://i.ibb.co/3Fh9V6p/avatar-contact.png"
      }

      // DATE
      const tanggal = moment()
        .tz("Asia/Jakarta")
        .format("DD/MM/YYYY")

      // MEMBER
      const memberCount =
        metadata.participants.length

      // RANDOM TIPS
      const quotes = [
        `Jangan jadi silent reader ya!`,
        `Santai aja, anggap rumah sendiri!`,
        `Yuk langsung gas ngobrol!`,
        `Siap-siap rame bareng!`,
        `Jangan malu-malu, kita semua temen!`,
        `Kalau bingung mulai, nyapa aja dulu 😄`,
        `Semoga betah dan nyaman disini ✨`,
        `Mari jadi member yang aktif dan seru!`,
        `Awas ketagihan ngobrol disini 👀`,
        `Yang masuk wajib bawa vibes positif 🤍`
      ]

      // RANDOM QUOTE
      const quote =
        quotes[Math.floor(Math.random() * quotes.length)]

      // MESSAGE
      const teksWelcome = `
╭━━━〔 🌸 WELCOME 🌸 〕━━⬣

✨ *Kon'nichiwaa~*
Ada member baru nihh 🤍

💌 Halo @${num.split("@")[0]}
Selamat datang di *${metadata.subject}*

╭─〔 📌 GROUP INFO 〕─⬣
│ 👥 Member Ke :
│ ${memberCount}
│
│ 📅 Date :
│ ${tanggal}
│
│ 🤖 Bot :
│ Bot Miracle Roleplay
╰────────────────⬣

💬 *Pesan Admin*
「 Jangan lupa berbaur dan
ramein grupnya yaa 😆 」

✨ *Tips Hari Ini*
「 ${quote} 」

╭─〔 🌷 NOTE 〕─⬣
│ • No Spam
│ • No Rusuh
│ • Saling Respect
│ • Enjoy The Group ✨
╰────────────────⬣

🌸 *Selamat bergabung dan
semoga betah disini!* 🤍
`

      // SEND
      await sock.sendMessage(anu.id, {
        image: { url: ppuser },
        caption: teksWelcome,
        mentions: [num]
      })

    }

  } catch (err) {
    console.log(err)
  }
}