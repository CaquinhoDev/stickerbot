import { GroupMetadata } from "@whiskeysockets/baileys";
import axios from "axios";
import path from "path";
import { bot } from "../config";
import { StickerBotCommand } from "../types/Command";
import { WAMessageExtended } from "../types/Message";
import { react, sendMessage } from "../utils/baileysHelper";
import { checkCommand } from "../utils/commandValidator";
import { emojis } from "../utils/emojis";
import { capitalize } from "../utils/misc";

const extension = __filename.endsWith(".js") ? ".js" : ".ts";
const commandName = capitalize(path.basename(__filename, extension));

export const command: StickerBotCommand = {
  name: commandName,
  aliases: ["search", "pesquisar"], // Comandos aceitos: !search ou !pesquisar
  desc: "Pesquisa na Wikipedia e retorna um resumo.",
  example: "!search <termo>", // Exemplo de uso
  needsPrefix: true,
  inMaintenance: false, // Indica se o comando está em manutenção
  runInPrivate: true, // Comando funciona em privado
  runInGroups: true, // Comando funciona em grupos
  onlyInBotGroup: false, // Funciona apenas nos grupos do bot? Não.
  onlyBotAdmin: false, // Apenas administradores do bot podem usar? Não.
  onlyAdmin: false, // Apenas administradores do grupo podem usar? Não.
  onlyVip: false, // Apenas usuários VIP podem usar? Não.
  botMustBeAdmin: false, // Bot precisa ser admin? Não.
  interval: 5, // Intervalo para executar novamente (segundos)
  limiter: {}, // Controlador de execução de comandos

  run: async (
    jid: string,
    sender: string,
    message: WAMessageExtended,
    alias: string,
    body: string,
    group: GroupMetadata | undefined
  ) => {
    const check = await checkCommand(
      jid,
      message,
      alias,
      group,
      false,
      false,
      false,
      false,
      command
    );
    if (!check) return;

    // Remove o alias (ex: "!search") da mensagem e pega o termo de pesquisa
    let searchTerm = body.replace(alias, "").trim();

    if (!searchTerm) {
      await sendMessage(
        { text: "Você precisa fornecer um termo para pesquisar!" },
        message,
        true
      );
      return;
    }

    // Remove caracteres especiais que podem causar erro
    searchTerm = searchTerm.replace(/[!@#$%^&*(),.?":{}|<>]/g, "");

    try {
      // Faz a requisição para a API da Wikipedia
      const { data } = await axios.get(
        `https://pt.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          searchTerm
        )}`
      );

      if (data.extract) {
        // Monta a resposta com o resumo e o link da Wikipedia
        const summary = `*${data.title}*\n\n${data.extract}\n\nLeia mais: ${data.content_urls.desktop.page}`;
        await sendMessage({ text: summary }, message, true);
      } else {
        // Caso não encontre nada
        await sendMessage(
          { text: "Nenhum resultado encontrado para o termo pesquisado." },
          message,
          true
        );
      }
    } catch (error) {
      console.error("Erro ao buscar na Wikipedia:", error);
      await sendMessage(
        {
          text: "Ocorreu um erro ao realizar a pesquisa. Tente novamente mais tarde.",
        },
        message,
        true
      );
    }

    // Reage à mensagem com o emoji de pesquisa
    return await react(message, emojis.search);
  },
};
