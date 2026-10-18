# Escolhas da Dana

Vitrine de indicações com links de afiliados de Danielly Matos Dana ([@onlydaninha30](https://www.instagram.com/onlydaninha30/)).
Site estático (HTML, CSS e JS puro), sem build: basta hospedar a pasta (Vercel, Netlify, GitHub Pages).

## Estrutura

```
index.html          página única (8 seções)
privacidade.html    política de privacidade
css/style.css       visual
js/dados.js         ← produtos, fotos, destaque, posts do Instagram (editar aqui)
js/i18n.js          textos da interface por idioma
js/app.js           comportamento (filtro, carrossel, endereço direto)
assets/img/         fotos (dana-*.webp, produtos/, instagram/)
```

## Como atualizar

Tudo em `js/dados.js`:

- **Produto novo:** copie um bloco de `produtos`, troque `slug`, `nome`, `frase`, `categoria`, `loja`, `link`, `imagem` e remova `exemplo: true`.
- **Link ausente:** deixe `link: ""`. O botão mostra “Link em breve”.
- **Destaque da vez:** troque `destaque` pelo `slug` do produto do Story.
- **Fotos da Dana:** preencha `fotos.hero`, `fotos.sobre1`, `fotos.sobre2` (e opcionalmente `fotos.destaque`).
- **Instagram:** preencha `capa`, `link` e `produto` (opcional) em `instagramPosts`.

### Link direto para os Stories

`https://SEU-DOMINIO/#produto/<slug>`, por exemplo `/#produto/necessaire-rosa`.
A página rola até a vitrine, encontra o produto (mesmo fora da tela ou de outro filtro) e o destaca.

### Imagens

WebP, até 1200px na maior largura, ~150 KB. Produtos e posts em 4:5; hero em retrato.
Use as fotos originais, sem interface do Instagram, textos de Stories ou barras do navegador.

## Antes de publicar

- [ ] `mostrarExemplos: false` em `js/dados.js` (esconde os 10 itens demonstrativos)
- [ ] Somente produtos reais aprovados, com link de afiliado
- [ ] Biografia (seção 1) e texto “Por trás das escolhas” (seção 5) aprovados pela Dana
- [ ] Nenhuma frase “eu uso / eu testei” sem confirmação dela
- [ ] Fotos reais no lugar dos espaços reservados
- [ ] Revisar `privacidade.html` se algum serviço de medição for adicionado

## Português / Inglês

- Botão **PT | EN** no topo. A escolha fica salva no navegador.
- Sem escolha salva: navegador em português abre em português; qualquer outro idioma abre em inglês.
- Link direto por idioma: `?lang=en` ou `?lang=pt` (ex.: `/?lang=en#produto/necessaire-rosa`).
- Textos fixos: `js/i18n.js` (`en`). Produtos, legendas e fotos: `{ pt: "...", en: "..." }` em `js/dados.js`.
- Ao cadastrar um produto novo, preencha `nome` e `frase` nos dois idiomas.
