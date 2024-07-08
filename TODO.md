# 📝 TO DO

## 🚀 Funcionalidades Novas

- [x] Criar stickers de mensagens citadas
- [ ] Carregar frases de um JSON
- [ ] Adicionar thumbnail nas imagens do `unmakeSticker`
- [ ] Limpeza automática de histórico/conversas
- [x] Implementar `botSetup`
- [x] Logs no grupo de admins
- [ ] Obrigar usuário a participar da comunidade (configurável)
- [ ] Ignorar chat privado (configurável)
- [x] Limite de taxa (10 mensagens/minuto por usuário)
- [x] Sistema de banimento
  - [x] `ban` / `banneds` / `unban`

## 🛠️ Melhorias e Correções

- [x] Renomear `spinText` para `spintax`
- [x] Adicionar `Dependabot`
- [x] Adicionar `ESLint`
- [x] Implementar `makeSticker`
- [x] Aprimorar `makeSticker` (tem muitos argumentos, não tá legal)
- [x] Implementar `unmakeSticker`

## 🔍 Validações para Criar Sticker

- [x] Unmakesticker apenas por comando (toImg)
- [x] Chat privado
- [x] Grupos
  - [x] Criar se for mencionado
  - [x] Criar se for um grupo oficial

## 📝 Criar Sticker com Texto

- [x] Texto em imagem
- [ ] Texto em vídeo
- [x] Texto em sticker

## 🔄 Migrar Comandos Antigos para o Novo Bot

- [x] `ttp` / `attp`
- [x] `open` / `close`
- [x] `placa` / `fipe`
- [x] `everyone`
- [x] `invite`
- [x] `jid`
- [x] `kick`
- [x] `link`
- [x] `menu`
- [x] `mp3`
- [x] `ping`
- [x] `pinga`
- [x] `pix`
- [x] `promote` / `demote`
- [x] `sorteio`
- [x] `rembg`
- [x] `rename`
- [ ] `toImg`
- [x] `uptime`
- [x] `vcard`
- [x] `version`
- [ ] `s` / `s2` / `s3`
- [ ] `stickers`
- [ ] `stickerly`
- [x] `Feedback`
- [x] `Stats`

## 👾 Bugs

- [ ] `unmakeSticker` Error: EBUSY: resource busy or locked (on Windows)
- [x] `menu` Error: ENOENT: no such file or directory, scandir '/usr/src/app/dist/img/menu'