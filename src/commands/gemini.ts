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
  desc: "Interage com a IA usando a API Gemini.",
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
      // Configurando o prompt com a mensagem do usuário
      const prompt = {
        contents: [
          {
            parts: [
              {
                text: `You are an AI model named Gemini. Always mention that this bot was created by Pedro Henrique, 
                But you don't need to say it all the time either.
                 Be nice and good people, also don't use such difficult words, you know? 
                 Also always try to keep the user active with you, asking interesting questions or trying to interact with them...
                  format your response for whatsapp instead of markdown, so avoid using '' for bold, instead use just one '*'. Now, respond to the following message: "${body}"`,
              },
            ],
          },
        ],
      };

      // Fazendo a requisição para a API Gemini
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI}`,
        prompt,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      console.log("Resposta da API:", response.data); // Log da resposta completa

      // Verificando e extraindo a resposta da IA
      const candidates = response.data.candidates;
      if (!candidates || candidates.length === 0 || !candidates[0].content) {
        throw new Error("A resposta da API não contém o conteúdo esperado.");
      }

      const replyText = candidates[0].content.parts[0]?.text; // Extraindo o texto da resposta

      if (!replyText) {
        throw new Error('O campo "text" não foi encontrado na resposta.');
      }

      // Envia a resposta da IA ao usuário
      return await sendMessage({ text: replyText }, message);
    } catch (error) {
      console.error("Erro ao se comunicar com a API Gemini:", error);
      return await sendMessage(
        {
          text: "Houve um erro ao se comunicar com a IA Gemini. Tente novamente mais tarde.",
        },
        message
      );
    }
  },
};
