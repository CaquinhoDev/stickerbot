import { checkCommand } from '../utils/validators'
import { StickerBotCommand } from '../types/Command'
import { WAMessageExtended } from '../types/Message'
import { getBody, getCachedGroupMetadata, react, sendMessage } from '../utils/baileysHelper'
import { spinText } from '../utils/misc'
import path from 'path'
import { getClient } from '../bot'
import { jidNormalizedUser } from '@whiskeysockets/baileys'


// Gets the file name without the .ts extension
const commandName = path.basename(__filename, '.ts')


// Command settings:
export const command: StickerBotCommand = {
    name: commandName,
    aliases: ['todos', 'todas', 'tds', 'all', 'everyone'],
    desc: 'Menciona todos os membros do grupo.',
    example: 'olhem isso aqui!',
    needsPrefix: true,
    inMaintenance: false,
    runInPrivate: false,
    runInGroups: true,
    onlyInBotGroup: false,
    onlyBotAdmin: false,
    onlyAdmin: false,
    botMustBeAdmin: false,
    interval: 30,
    limiter: {},// do not touch this
    run: async (
        jid: string,
        message: WAMessage,
        alias: string,
        body: string,
        group: GroupMetadata | undefined,
        isBotAdmin: boolean,
        isGroupAdmin: boolean,
        amAdmin: boolean
    ) => {
        const check = await checkCommand(message, command)
        if (!check) {
            return false
        }

        console.log(`Sending ${command.name}`)

        // Menciona todos os membros do grupo, exceto o bot.

        const client = getClient()
        const body = getBody(message)
        const alert = body.slice(command.needsPrefix ? 1 : 0).replace(alias, '').trim()
        const jid = message.key.remoteJid
        const group = await getCachedGroupMetadata(jid!)

        if(!group) {
            await react(message, '❌')
            return false
        }

        const botJid = jidNormalizedUser(client.user?.id)
        const participants = group.participants.filter(
            participant => participant.id !== botJid)
            .map(({ id }) => id)

        const phrase = alert ?
                        `{📢|📣|⚠|❗|‼️} - ${alert}` :
                        '{📢|📣|⚠|❗|‼️} - {Atenção|Olhem isso|Prestem atenção|Ei}!'

        return await sendMessage(
            { text: spinText(phrase), mentions: participants },
            message
        )
    }
}
