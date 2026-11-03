# Papo 70

Chat em tempo real com uma sala geral e limite de **70 conexões simultâneas**.

## Requisitos
- Node.js 18 ou superior
- Uma hospedagem que aceite aplicações Node.js e conexões WebSocket

## Rodar no computador
1. Instale o Node.js.
2. Abra um terminal nesta pasta.
3. Execute `npm install`.
4. Execute `npm start`.
5. Abra `http://localhost:3000` no navegador.

Para testar com outras pessoas, publique o projeto em uma hospedagem Node.js. O endereço local só funciona no seu próprio computador/rede.

## Limite de conexões
O servidor recusa novas conexões quando já existem 70 conexões simultâneas. Para garantir o limite em produção, execute **uma única instância** do servidor ou implemente um contador compartilhado (por exemplo, Redis) antes de escalar para vários servidores.

## Importante antes de abrir ao público
Este é um protótipo inicial, não um serviço pronto para uma comunidade pública. Antes de divulgar, adicione moderação humana, denúncia e bloqueio, regras claras, proteção contra spam e abuso, política de privacidade e HTTPS. Não colete dados pessoais desnecessários. As mensagens não ficam salvas depois que o servidor reinicia e não há conversas privadas nesta primeira versão.
