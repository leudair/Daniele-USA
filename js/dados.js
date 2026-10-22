/*
 * Escolhas da Dana — dados centrais do site.
 * Para trocar produtos, fotos e links, edite SOMENTE este arquivo.
 * Textos aceitam string simples ("Texto") ou objeto por idioma ({ pt: "Texto", en: "Text" }).
 */
window.DANA = {
  instagram: "https://www.instagram.com/onlydaninha30/",

  // Endereço oficial do site (usado em compartilhamento e Google). Troque quando tiver domínio próprio.
  siteUrl: "https://escolhasdadana.com",

  // Outras redes. O ícone aparece no rodapé mesmo sem link (fica como "em breve").
  redes: {
    tiktok: "",
    pinterest: ""
  },

  // Contato para parcerias com marcas. Deixe "" para mostrar só o Instagram.
  emailParcerias: "",

  // true = a Dana participa do programa Amazon Associates (EUA): mostra o aviso exigido pela Amazon.
  amazonAssociate: false,

  // Vitrines completas da Dana em cada plataforma. Deixe url "" enquanto não tiver.
  vitrines: [
    { id: "amazon", nome: "Amazon Storefront", mercado: "us", url: "" },
    { id: "ltk", nome: "LTK", mercado: "us", url: "" },
    { id: "shopmy", nome: "ShopMy", mercado: "us", url: "" }
  ],

  // Medição de cliques: ID do Google Analytics 4 (ex.: "G-XXXXXXX"). Vazio = desligado.
  ga4Id: "",

  // false = esconde todos os produtos com `exemplo: true` (use antes de publicar).
  mostrarExemplos: true,

  // slug do produto exibido em "Destaque da vez".
  destaque: "necessaire-rosa",

  // Fotos da Dana. Deixe "" para mostrar o espaço reservado.
  // Ex.: "/assets/img/dana-hero.webp"
  fotos: {
    hero: "/assets/img/dana-hero.webp",
    destaque: "/assets/img/destaque.webp",
    sobre1: "/assets/img/dana-sobre.webp",
    sobre2: "/assets/img/sobre-detalhe.webp"
  },
  fotosAlt: {
    hero: "Danielly Matos Dana",
    destaque: { pt: "Detalhe do produto em destaque", en: "Close-up of the featured product" },
    sobre1: { pt: "Danielly Matos Dana em viagem", en: "Danielly Matos Dana traveling" },
    sobre2: { pt: "Óculos de sol de tartaruga e argolas douradas sobre tecido rosa", en: "Tortoiseshell sunglasses and gold hoop earrings on pink fabric" }
  },

  // Só aparecem no filtro as categorias que tiverem produtos visíveis.
  imagemTodos: "/assets/img/indicacoes.webp",
  categorias: [
    { id: "beleza", nome: { pt: "Beleza", en: "Beauty" }, imagem: "/assets/img/cat-beleza.webp" },
    { id: "moda", nome: { pt: "Moda e acessórios", en: "Fashion & accessories" }, imagem: "/assets/img/cat-moda.webp" },
    { id: "casa", nome: { pt: "Casa e rotina", en: "Home & routine" }, imagem: "/assets/img/cat-casa.webp" },
    { id: "viagem", nome: { pt: "Viagem", en: "Travel" }, imagem: "/assets/img/cat-viagem.webp" }
  ],

  /*
   * Coleções (guias). Um produto pode estar em várias: campo `colecoes`.
   */
  colecoes: [
    { id: "amazon-finds", nome: { pt: "Achados da Amazon", en: "Amazon Finds" } },
    { id: "ate-50", nome: { pt: "Até US$ 50", en: "Under $50" } },
    { id: "viagem", nome: { pt: "Essenciais de viagem", en: "Travel Essentials" } },
    { id: "presentes", nome: { pt: "Ideias de presente", en: "Gift Ideas" } }
  ],

  /*
   * Lojas. mercado: "us" (Estados Unidos) ou "br" (Brasil).
   */
  lojas: {
    amazon:  { nome: "Amazon", mercado: "us", botao: { pt: "Ver na Amazon", en: "Shop on Amazon" } },
    ltk:     { nome: "LTK", mercado: "us", botao: { pt: "Ver no LTK", en: "Shop on LTK" } },
    shopmy:  { nome: "ShopMy", mercado: "us", botao: { pt: "Ver no ShopMy", en: "Shop on ShopMy" } },
    sephora: { nome: "Sephora", mercado: "us", botao: { pt: "Ver na Sephora", en: "Shop at Sephora" } },
    shopee:  { nome: "Shopee", mercado: "br", botao: { pt: "Ver na Shopee", en: "Shop on Shopee" } },
    outra:   { nome: { pt: "Loja parceira", en: "Partner store" }, mercado: "us", botao: { pt: "Ver na loja", en: "Shop now" } }
  },

  /*
   * Produtos. Campos:
   *  slug      — endereço direto: /#produto/<slug> (minúsculas, sem acento, com hífen)
   *  nome      — nome curto
   *  frase     — uma frase sobre a utilidade (sem "eu uso"/"eu testei" sem aprovação da Dana)
   *  categoria — id de uma categoria acima
   *  loja      — uma das lojas acima (amazon, ltk, shopmy, sephora, shopee, outra)
   *  lojaNome  — opcional, nome da loja quando loja = "outra"
   *  mercado   — opcional, "us" ou "br" (se vazio, usa o da loja)
   *  colecoes  — opcional, ids das coleções acima. Ex.: ["amazon-finds", "ate-50"]
   *  link      — link de afiliado. Vazio = botão "Link em breve"
   *  imagem    — ex.: "/assets/img/produtos/necessaire-rosa.webp"
   *  exemplo   — true = item demonstrativo da prévia
   */
  produtos: [
    {
      slug: "necessaire-rosa",
      nome: { pt: "Necessaire rosa", en: "Pink makeup bag" },
      frase: { pt: "Organiza maquiagem e itens de cuidado em compartimentos separados, na bolsa ou na mala.", en: "Keeps makeup and beauty essentials organized in separate compartments, in your purse or suitcase." },
      categoria: "viagem", loja: "amazon", colecoes: ["amazon-finds", "ate-50", "viagem"], link: "", imagem: "", exemplo: true
    },
    {
      slug: "escova-secadora",
      nome: { pt: "Escova secadora", en: "Hot air brush" },
      frase: { pt: "Seca e modela os fios ao mesmo tempo, encurtando a rotina do cabelo.", en: "Dries and styles your hair at the same time, cutting down your hair routine." },
      categoria: "beleza", loja: "sephora", colecoes: ["presentes"], link: "", imagem: "", exemplo: true
    },
    {
      slug: "kit-pinceis",
      nome: { pt: "Kit de pincéis", en: "Makeup brush set" },
      frase: { pt: "Pincéis para base, pó e sombra reunidos em um estojo compacto.", en: "Brushes for foundation, powder and eyeshadow in one compact case." },
      categoria: "beleza", loja: "sephora", colecoes: ["ate-50", "presentes"], link: "", imagem: "", exemplo: true
    },
    {
      slug: "oculos-de-sol",
      nome: { pt: "Óculos de sol", en: "Sunglasses" },
      frase: { pt: "Armação leve que acompanha do look de praia ao passeio na cidade.", en: "A lightweight frame that goes from beach looks to city strolls." },
      categoria: "moda", loja: "shopee", colecoes: [], link: "", imagem: "", exemplo: true
    },
    {
      slug: "bolsa-transversal",
      nome: { pt: "Bolsa transversal", en: "Crossbody bag" },
      frase: { pt: "Tamanho certo para celular, carteira e batom, com as mãos livres.", en: "Just the right size for your phone, wallet and lipstick, hands-free." },
      categoria: "moda", loja: "ltk", colecoes: ["presentes"], link: "", imagem: "", exemplo: true
    },
    {
      slug: "argolas-douradas",
      nome: { pt: "Argolas douradas", en: "Gold hoop earrings" },
      frase: { pt: "Um acessório simples que deixa qualquer produção mais arrumada.", en: "A simple accessory that makes any outfit look more polished." },
      categoria: "moda", loja: "shopmy", colecoes: ["ate-50", "presentes"], link: "", imagem: "", exemplo: true
    },
    {
      slug: "organizador-acrilico",
      nome: { pt: "Organizador acrílico", en: "Acrylic organizer" },
      frase: { pt: "Deixa maquiagem e skincare à vista e em ordem sobre a bancada.", en: "Keeps makeup and skincare visible and tidy on your vanity." },
      categoria: "casa", loja: "shopee", colecoes: [], link: "", imagem: "", exemplo: true
    },
    {
      slug: "garrafa-termica",
      nome: { pt: "Garrafa térmica", en: "Insulated bottle" },
      frase: { pt: "Mantém a bebida na temperatura certa durante o dia fora de casa.", en: "Keeps your drink at the right temperature all day on the go." },
      categoria: "casa", loja: "amazon", colecoes: ["ate-50", "viagem"], link: "", imagem: "", exemplo: true
    },
    {
      slug: "mala-de-bordo",
      nome: { pt: "Mala de bordo", en: "Carry-on suitcase" },
      frase: { pt: "Medidas de bagagem de mão, com rodinhas giratórias e divisórias internas.", en: "Carry-on size, with spinner wheels and interior dividers." },
      categoria: "viagem", loja: "amazon", colecoes: ["amazon-finds", "viagem"], link: "", imagem: "", exemplo: true
    },
    {
      slug: "travesseiro-de-pescoco",
      nome: { pt: "Travesseiro de pescoço", en: "Travel neck pillow" },
      frase: { pt: "Apoio macio para voos e viagens longas de carro ou ônibus.", en: "Soft support for flights and long car or bus rides." },
      categoria: "viagem", loja: "shopee", colecoes: ["viagem"], link: "", imagem: "", exemplo: true
    }
  ],

  /*
   * Seção "Do Instagram para cá" — três publicações escolhidas manualmente.
   *  capa    — imagem da publicação (sem interface do Instagram)
   *  link    — URL da publicação original
   *  produtos — opcional, slugs dos produtos do look ("Compre o look")
   */

  /*
   * Lifestyle: momentos do dia a dia da Dana (o lado "vida" do Instagram).
   * `categoria` liga o momento ao filtro da vitrine ("Ver indicações").
   * Troque as fotos pelas fotos reais de lifestyle dela.
   */
  lifestyle: {
    frase: { pt: "Viver bem é feito de pequenos rituais.", en: "Living well is made of small rituals." },
    momentos: [
      { foto: "/assets/img/cat-casa.webp", categoria: "casa",
        titulo: { pt: "Manhãs sem pressa", en: "Slow mornings" },
        texto: { pt: "Café, flores frescas e um tempo só meu antes do dia começar.", en: "Coffee, fresh flowers and a moment for myself before the day begins." } },
      { foto: "/assets/img/insta-3.webp", categoria: "viagem",
        titulo: { pt: "Pelo mundo", en: "Around the world" },
        texto: { pt: "Hotéis, terraços e lugares que guardo no coração.", en: "Hotels, terraces and places I keep close to my heart." } },
      { foto: "/assets/img/insta-1.webp", categoria: "beleza",
        titulo: { pt: "Ritual de beleza", en: "Beauty ritual" },
        texto: { pt: "Perfumes, cuidados e o que faz eu me sentir eu.", en: "Fragrances, self-care and what makes me feel like me." } },
      { foto: "/assets/img/insta-2.webp", categoria: "moda",
        titulo: { pt: "Look do dia", en: "Outfit of the day" },
        texto: { pt: "Peças leves, tons suaves e detalhes dourados.", en: "Light pieces, soft tones and golden details." } }
    ]
  },

  instagramPosts: [
    { capa: "/assets/img/insta-1.webp", legenda: { pt: "Detalhes em dourado", en: "Golden details" }, link: "", produtos: ["argolas-douradas"] },
    { capa: "/assets/img/insta-2.webp", legenda: { pt: "Look do dia", en: "Outfit of the day" }, link: "", produtos: ["bolsa-transversal", "oculos-de-sol"] },
    { capa: "/assets/img/insta-3.webp", legenda: { pt: "Tons de rosa", en: "Shades of pink" }, link: "", produtos: ["bolsa-transversal", "argolas-douradas"] }
  ]
};
