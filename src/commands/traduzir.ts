import { GroupMetadata } from "@whiskeysockets/baileys";
import path from "path";
import { translate } from "@vitalets/google-translate-api";

import { StickerBotCommand } from "../types/Command";
import { WAMessageExtended } from "../types/Message";
import { sendMessage } from "../utils/baileysHelper";
import { checkCommand } from "../utils/commandValidator";
import { capitalize, spintax } from "../utils/misc";

// Gets the extension of this file, to dynamically import '.ts' if in development and '.js' if in production
const extension = __filename.endsWith(".js") ? ".js" : ".ts";

// Gets the file name without the .ts/.js extension
const commandName = capitalize(path.basename(__filename, extension));

// Command settings:
export const command: StickerBotCommand = {
  name: commandName,
  aliases: ["traduzir", "translate", "traduza", "traduz"],
  desc: "Traduz o texto enviado para o português.",
  example: "!traduzir <texto>",
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

    // Verifica se há texto para traduzir
    if (!body) {
      return await sendMessage(
        { text: "Por favor, forneça o texto para traduzir." },
        message
      );
    }

    // Remove o comando do início do texto
    const textToTranslate = body.slice(alias.length).trim();

    try {
      // Traduz o texto para o português
      const result = await translate(textToTranslate, { to: "pt" });

      const response = `${result.text}`;

      return await sendMessage({ text: response }, message);
    } catch (error) {
      console.error("Erro na tradução:", error);
      return await sendMessage(
        { text: "Desculpe, ocorreu um erro ao tentar traduzir o texto." },
        message
      );
    }
  },
};
