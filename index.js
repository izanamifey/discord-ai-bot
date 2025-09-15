require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const OpenAI = require("openai");

// Init Discord client
const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
});

// Init OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// On ready
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// On message
client.on("messageCreate", async (message) => {
  // Ignore bot messages
  if (message.author.bot) return;

  // Prefix (contoh: !ask)
  if (message.content.startsWith("!ask")) {
    const prompt = message.content.replace("!ask", "").trim();

    if (!prompt) {
      return message.reply("⚠️ Please provide a question after `!ask`");
    }

    try {
      // Call OpenAI
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
      });

      const reply = response.choices[0].message.content;
      await message.reply(reply);
    } catch (error) {
      console.error("OpenAI Error:", error);
      await message.reply("❌ Error generating response.");
    }
  }
});

// Login
client.login(process.env.DISCORD_TOKEN);
