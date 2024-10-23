import { GroupMetadata } from "@whiskeysockets/baileys";
import path from "path";
import axios from "axios";
import { config } from "dotenv";

import { StickerBotCommand } from "../types/Command";
import { WAMessageExtended } from "../types/Message";
import { sendMessage } from "../utils/baileysHelper";
import { checkCommand } from "../utils/commandValidator";
import { capitalize } from "../utils/misc";

// Carregar variáveis de ambiente
config();

// Gets the extension of this file, to dynamically import '.ts' if in development and '.js' if in production
const extension = __filename.endsWith(".js") ? ".js" : ".ts";

// Gets the file name without the .ts/.js extension
const commandName = capitalize(path.basename(__filename, extension));

// Command settings:
export const command: StickerBotCommand = {
  name: commandName,
  aliases: ["IA", "GPT", "CHATBOT", "BOT"],
  desc: "Interage com a IA usando a API da Open AI.",
  needsPrefix: true,
  inMaintenance: false,
  runInPrivate: true,
  runInGroups: true,
  onlyInBotGroup: false,
  onlyBotAdmin: false,
  onlyAdmin: false,
  onlyVip: false,
  botMustBeAdmin: false,
  interval: 5,
  limiter: {}, // do not touch this
  run: async (
    jid: string,
    sender: string,
    message: WAMessageExtended,
    alias: string,
    body: string,
    group: GroupMetadata | undefined,
    isBotAdmin: boolean,
    isVip: boolean,
    isGroupAdmin: boolean,
    amAdmin: boolean
  ) => {
    const check = await checkCommand(
      jid,
      message,
      alias,
      group,
      isBotAdmin,
      isVip,
      isGroupAdmin,
      amAdmin,
      command
    );
    if (!check) return;

    try {
      const prompt = [
        { role: "user", content: "hello" },
        { role: "assistant", content: "Hi there! How can I assist you today?" },
        { role: "user", content: body },
      ];

      const response = await axios.post(
        "https://chatgpt-42.p.rapidapi.com/conversationgpt4-2",
        {
          messages: prompt,
          system_prompt: "",
          temperature: 0.9,
          top_k: 5,
          top_p: 0.9,
          max_tokens: 256,
          web_access: false,
        },
        {
          headers: {
            "x-rapidapi-key": process.env.RAPIDAPI_KEY,
            "x-rapidapi-host": process.env.RAPIDAPI_HOST,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("API Response:", response.data); // Log da resposta completa

      const replyText = response.data.result; // Use o campo "result" em vez de "reply"

      if (!replyText) {
        throw new Error('A resposta da API não contém o campo "result".');
      }

      return await sendMessage({ text: replyText }, message);
    } catch (error) {
      console.error("Error calling GPT API:", error);
      return await sendMessage(
        {
          text: "Houve um erro ao se comunicar com a IA. Tente novamente mais tarde.",
        },
        message
      );
    }
  },
};
