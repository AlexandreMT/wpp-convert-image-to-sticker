import { create, Client, Message } from '@open-wa/wa-automate';
import { Converter } from './core';
import { Helper } from './core/Helper';

const COMMANDS = ['!figurinha', '!sticker', '!gif', '!semfundo', '!help'];
const BLACK_LIST = ['556392785687']
const successMessage = `
Se gostou das funcionalidades ajude a manter o bot online fazendo uma doação de qualquer valor:
*PIX:* 
`;
const pixMessage = 'f1af71f2-f800-4626-afff-ab2fb5a71dff'

async function start (client: Client) {
  console.log('Bot iniciado com sucesso!')
  await client.onAnyMessage(async (message: Message) => {
      const hasCommand = COMMANDS.some(command => {
        return message.text.startsWith(command)
      })
      const isBlackListed = BLACK_LIST.some(number => {
        return message.from.startsWith(number)
      })
      // const logger = new Logger(message.body, message.from)
      try {
        if (hasCommand) {
          if (message.text === '!help') {
            if(isBlackListed){
              await client.sendText(message.from, 'VSF TONI')
              return
            }
            const helper = new Helper(client, message)
            await helper.execute()
            // logger.log()
          }
          else {
            const converter = new Converter(client, message)
            await converter.convert()
            await client.sendText(message.from, successMessage);
            await client.sendText(message.from, pixMessage);
            // logger.log()
          }
          return
        }
      } catch (err) {
        await client.sendText(
          message.from,
          'Não foi possivel converter o arquivo enviado em figurinha, tente novamente.'
        );
        // logger.log(err)
        // new Database().disconnect()
        return;
      }
  });
}

const main = async () => {
  const client = await create({ qrTimeout: 0 })
  start(client)
}

main()