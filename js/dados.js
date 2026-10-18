/*
 * Escolhas da Dana — dados centrais do site.
 * Para trocar produtos, fotos e links, edite SOMENTE este arquivo.
 * Textos aceitam string simples ("Texto") ou objeto por idioma ({ pt: "Texto", en: "Text" }).
 */
window.DANA = {
  instagram: "https://www.instagram.com/onlydaninha30/",

  // false = esconde todos os produtos com `exemplo: true` (use antes de publicar).
  mostrarExemplos: true,

  // slug do produto exibido em "Destaque da vez".
  destaque: "necessaire-rosa",

  // Fotos da Dana. Deixe "" para mostrar o espaço reservado.
  // Ex.: "assets/img/dana-hero.webp"
  fotos: {
    hero: "",
    destaque: "",
    sobre1: "",
    sobre2: ""
  },
  fotosAlt: {
    hero: "Danielly Matos Dana",
    destaque: "Detalhe do produto em destaque",
    sobre1: "Danielly Matos Dana em viagem",
    sobre2: "Danielly Matos Dana em um momento da rotina"
  },

  // Só aparecem no filtro as categorias que tiverem produtos visíveis.
  categorias: [
    { id: "beleza", nome: { pt: "Beleza", en: "Beauty" } },
    { id: "moda", nome: { pt: "Moda e acessórios", en: "Fashion & accessories" } },
    { id: "casa", nome: { pt: "Casa e rotina", en: "Home & routine" } },
    { id: "viagem", nome: { pt: "Viagem", en: "Travel" } }
  ],

  lojas: {
    amazon: { nome: "Amazon", botao: { pt: "Ver na Amazon", en: "View on Amazon" } },
    shopee: { nome: "Shopee", botao: { pt: "Ver na Shopee", en: "View on Shopee" } },
    outra: { nome: { pt: "Loja parceira", en: "Partner store" }, botao: { pt: "Ver na loja", en: "View in store" } }
  },

  /*
   * Produtos. Campos:
   *  slug      — endereço direto: /#produto/<slug> (minúsculas, sem acento, com hífen)
   *  nome      — nome curto
   *  frase     — uma frase sobre a utilidade (sem "eu uso"/"eu testei" sem aprovação da Dana)
   *  categoria — id de uma categoria acima
   *  loja      — "amazon" | "shopee" | "outra"
   *  lojaNome  — opcional, nome da loja quando loja = "outra"
   *  link      — link de afiliado. Vazio = botão "Link em breve"
   *  imagem    — ex.: "assets/img/produtos/necessaire-rosa.webp"
   *  exemplo   — true = item demonstrativo da prévia
   */
  produtos: [
    {
      slug: "necessaire-rosa",
      nome: "Necessaire rosa",
      frase: "Organiza maquiagem e itens de cuidado em compartimentos separados, na bolsa ou na mala.",
      categoria: "viagem", loja: "amazon", link: "", imagem: "", exemplo: true
    },
    {
      slug: "escova-secadora",
      nome: "Escova secadora",
      frase: "Seca e modela os fios ao mesmo tempo, encurtando a rotina do cabelo.",
      categoria: "beleza", loja: "amazon", link: "", imagem: "", exemplo: true
    },
    {
      slug: "kit-pinceis",
      nome: "Kit de pincéis",
      frase: "Pincéis para base, pó e sombra reunidos em um estojo compacto.",
      categoria: "beleza", loja: "shopee", link: "", imagem: "", exemplo: true
    },
    {
      slug: "oculos-de-sol",
      nome: "Óculos de sol",
      frase: "Armação leve que acompanha do look de praia ao passeio na cidade.",
      categoria: "moda", loja: "shopee", link: "", imagem: "", exemplo: true
    },
    {
      slug: "bolsa-transversal",
      nome: "Bolsa transversal",
      frase: "Tamanho certo para celular, carteira e batom, com as mãos livres.",
      categoria: "moda", loja: "amazon", link: "", imagem: "", exemplo: true
    },
    {
      slug: "argolas-douradas",
      nome: "Argolas douradas",
      frase: "Um acessório simples que deixa qualquer produção mais arrumada.",
      categoria: "moda", loja: "outra", link: "", imagem: "", exemplo: true
    },
    {
      slug: "organizador-acrilico",
      nome: "Organizador acrílico",
      frase: "Deixa maquiagem e skincare à vista e em ordem sobre a bancada.",
      categoria: "casa", loja: "shopee", link: "", imagem: "", exemplo: true
    },
    {
      slug: "garrafa-termica",
      nome: "Garrafa térmica",
      frase: "Mantém a bebida na temperatura certa durante o dia fora de casa.",
      categoria: "casa", loja: "amazon", link: "", imagem: "", exemplo: true
    },
    {
      slug: "mala-de-bordo",
      nome: "Mala de bordo",
      frase: "Medidas de bagagem de mão, com rodinhas giratórias e divisórias internas.",
      categoria: "viagem", loja: "amazon", link: "", imagem: "", exemplo: true
    },
    {
      slug: "travesseiro-de-pescoco",
      nome: "Travesseiro de pescoço",
      frase: "Apoio macio para voos e viagens longas de carro ou ônibus.",
      categoria: "viagem", loja: "shopee", link: "", imagem: "", exemplo: true
    }
  ],

  /*
   * Seção "Do Instagram para cá" — três publicações escolhidas manualmente.
   *  capa    — imagem da publicação (sem interface do Instagram)
   *  link    — URL da publicação original
   *  produto — opcional, slug de um produto cadastrado
   */
  instagramPosts: [
    { capa: "", legenda: "Look do dia", link: "", produto: "bolsa-transversal", exemplo: true },
    { capa: "", legenda: "Arrumando a mala", link: "", produto: "mala-de-bordo", exemplo: true },
    { capa: "", legenda: "Rotina de beleza", link: "", produto: "escova-secadora", exemplo: true }
  ]
};
