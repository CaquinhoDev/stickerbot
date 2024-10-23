import { GroupMetadata } from "@whiskeysockets/baileys";
import path from "path";
import axios from "axios";

import { StickerBotCommand } from "../types/Command";
import { WAMessageExtended } from "../types/Message";
import { sendMessage } from "../utils/baileysHelper";
import { checkCommand } from "../utils/commandValidator";
import { capitalize } from "../utils/misc";

// Gets the extension of this file, to dynamically import '.ts' if in development and '.js' if in production
const extension = __filename.endsWith(".js") ? ".js" : ".ts";

// Gets the file name without the .ts/.js extension
const commandName = capitalize(path.basename(__filename, extension));

// Command settings:
export const command: StickerBotCommand = {
  name: commandName,
  aliases: ["search"],
  desc: "Realiza uma busca na web usando a API da PHIND.",
  example: "search Python programming",
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
    // Verifica se a mensagem contém um termo de busca
    const query = body.trim();
    if (!query) {
      return await sendMessage(
        { text: "Por favor, forneça um termo de busca." },
        message
      );
    }

    // Configurações da API da PHIND
    const url = "https://https.api.phind.com/infer/";
    const payload = {
      question: query,
      options: {},
      context: "",
      challenge: 123, // Substitua por um valor válido conforme necessário
    };

    try {
      // Faz a requisição à API da PHIND
      const response = await axios.post(url, payload, {
        headers: {
          "Content-Type": "application/json;charset=UTF-8",
          Origin: "https://www.phind.com",
          Referer: "https://www.phind.com",
        },
      });

      // Processa os resultados da busca
      const data = response.data;

      // A resposta pode ser um stream de eventos, aqui simplificamos para o exemplo
      let reply = "Aqui estão os resultados da sua busca:\n\n";
      reply += data.answer || "Nenhum resultado encontrado.";

      return await sendMessage({ text: reply }, message);
    } catch (error) {
      console.error("Erro ao buscar na API da PHIND:", error);
      return await sendMessage(
        {
          text: "Ocorreu um erro ao realizar a busca. Por favor, tente novamente mais tarde.",
        },
        message
      );
    }
  },
};
