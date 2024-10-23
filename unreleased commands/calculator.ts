import { GroupMetadata } from "@whiskeysockets/baileys";
import path from "path";
import { create, all } from "mathjs"; // Importando a biblioteca math.js

import { StickerBotCommand } from "../types/Command";
import { WAMessageExtended } from "../types/Message";
import { react, sendMessage } from "../utils/baileysHelper";
import { checkCommand } from "../utils/commandValidator";
import { capitalize, spintax } from "../utils/misc";

// Obtendo a extensão deste arquivo para importar dinamicamente '.ts' se estiver em desenvolvimento e '.js' se estiver em produção
const extension = __filename.endsWith(".js") ? ".js" : ".ts";

// Obtendo o nome do arquivo sem a extensão .ts/.js
const commandName = capitalize(path.basename(__filename, extension));

// Configurações do comando:
export const command: StickerBotCommand = {
  name: commandName,
  aliases: ["calc", "calcular"], // Alias para o comando
  desc: "Calcula uma expressão matemática usando math.js.", // Descrição do comando
  example: "calcular 5+5",
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
    // Verifica se foi fornecida uma expressão para calcular
    if (!body.trim()) {
      await sendMessage(
        { text: "ℹ️ Envie uma expressão matemática para eu calcular." },
        message
      );
      return;
    }

    const args = body.trim().split(" "); // Divide a mensagem em partes separadas por espaços
    if (!args[1]) {
      await sendMessage({ text: "⚠️ Please input a calculation." }, message);
      return;
    }

    let result;
    try {
      // Cria uma instância de math.js
      const math = create(all);

      // Calcula a expressão matemática usando math.js
      result = math.evaluate(args.slice(1).join(""));

      // Verifica se o resultado é um número válido
      if (isNaN(result)) {
        throw new Error("Resultado não é um número válido.");
      }
    } catch (error: any) {
      await sendMessage(
        {
          text: `❌ Ocorreu um erro ao calcular a expressão: ${error.message}`,
        },
        message
      );
      await react(message, "❌");
      return;
    }

    // Envia o resultado de volta
    await sendMessage({ text: `✅ Resultado: ${result}` }, message);
    return await react(message, "✅");
  },
};
