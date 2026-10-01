/*
 * Textos das seções do site. Edite só o que está entre aspas.
 */

export const hero = {
  /** A palavra em itálico troca sozinha entre as opções abaixo. */
  linha1: 'Soluções sustentáveis',
  linha2: 'com a',
  palavras: ['profundidade', 'ciência', 'energia', 'leveza'],
  linha3: 'do oceano.',
  texto:
    'Ajudamos empresas, escolas, organizações e eventos da Baixada Santista a adotar práticas sustentáveis, com ciência de verdade e preço de Empresa Júnior.',
}

export const valores = ['Transparência', 'Resiliência', 'Ética', 'Protagonismo', 'Inconformismo', 'União', 'Proatividade']

export const sobre = {
  titulo: 'Estudantes do mar, trabalhando em terra firme.',
  manifesto:
    'Somos uma Empresa Júnior que leva a ciência do Instituto do Mar da Unifesp para fora dos laboratórios: para dentro das empresas, das escolas e dos eventos do litoral paulista.',
  texto: [
    'Fundada em 2015, a IMar Júnior é vinculada ao Instituto do Mar da Universidade Federal de São Paulo, no campus Baixada Santista.',
    'Nosso propósito é fomentar a interdisciplinaridade, formar jovens empreendedores, estimular a inovação e promover a sustentabilidade em cada projeto.',
  ],
  cursos: [
    { sigla: 'BICT', nome: 'Ciência e Tecnologia do Mar' },
    { sigla: 'ENG·AMB', nome: 'Engenharia Ambiental' },
    { sigla: 'ENG·PET', nome: 'Engenharia de Petróleo' },
    { sigla: 'OCEANO', nome: 'Oceanografia' },
  ],
  missao:
    'Criar hoje as soluções sustentáveis e profissionais que vão mover o futuro do mercado, formando pessoas comprometidas com o desenvolvimento da sociedade e do meio ambiente.',
  visao:
    'Ser referência na formação de líderes capacitados e na excelência em soluções sustentáveis, consolidando a IMar Jr. como referência em sustentabilidade no litoral paulista.',
}

/** Para quem trabalhamos. `servicos` usa os `id` de servicos.ts. */
export const publicos = [
  {
    nome: 'Empresas',
    texto: 'Reduza custos e riscos, cumpra a legislação e mostre ao mercado o seu compromisso ESG.',
    servicos: ['consultoria-esg', 'pgrs', 'licenciamento'],
  },
  {
    nome: 'Escolas',
    texto: 'Feiras, aulas e oficinas que fazem alunos e professores se apaixonarem pelo oceano.',
    servicos: ['educacao-ambiental', 'personalizado'],
  },
  {
    nome: 'Eventos',
    texto: 'Eventos com menos resíduo e mais propósito, do coffee break à destinação final.',
    servicos: ['coffee-break', 'pgrs', 'educacao-ambiental'],
  },
  {
    nome: 'Organizações',
    texto: 'ONGs, associações e poder público com projetos sob medida e base científica.',
    servicos: ['personalizado', 'educacao-ambiental', 'consultoria-esg'],
  },
]

export const porqueEJ = [
  { simbolo: '+', titulo: 'Qualidade', texto: 'Projetos feitos por quem estuda o tema a fundo, com a base científica do Instituto do Mar.' },
  { simbolo: '−', titulo: 'Custo', texto: 'Preço abaixo do mercado, sem abrir mão do rigor técnico.' },
  { simbolo: '∞', titulo: 'Impacto', texto: 'Cada projeto forma novos profissionais e gera valor para a Baixada Santista.' },
]

export const metodo = [
  { titulo: 'Reunião inicial', texto: 'Entendemos o seu negócio, seus desafios e seus objetivos. Sem custo e sem compromisso.' },
  { titulo: 'Diagnóstico', texto: 'Levantamento técnico dos processos, resíduos e pontos de impacto.' },
  { titulo: 'Proposta sob medida', texto: 'Escopo, prazo e investimento pensados para a sua realidade.' },
  { titulo: 'Execução e entrega', texto: 'Implementação acompanhada, relatório final e orientação contínua.' },
]

/*
 * Projetos em destaque.
 * Para trocar a foto: coloque o arquivo em public/img/ e mude `imagem`.
 * Sem `imagem`, o card mostra uma arte de ondas.
 */
export const projetos: {
  tag: string
  titulo: string
  local: string
  texto: string
  parceiros: string
  imagem?: string
  alt?: string
}[] = [
  {
    tag: 'Educação Ambiental',
    titulo: 'Feira de Educação Ambiental',
    local: 'Cultura Inglesa',
    // TODO: conteúdo real — confirmar texto, cidade, público e colocar foto da feira
    texto:
      'Em parceria com a Cultura Inglesa, levamos o oceano para dentro da escola: uma feira de educação ambiental com estações interativas, experimentos e muita conversa sobre o mar e o consumo consciente.',
    parceiros: 'Parceria · Cultura Inglesa',
  },
  {
    tag: 'Comunidade',
    titulo: 'Ilha Diana',
    local: 'Santos · SP',
    texto:
      'Junto com a IO Jr. e o IPT, desenvolvemos um projeto para reduzir a vulnerabilidade socioambiental e melhorar as condições ambientais da comunidade da Ilha Diana, formada por pescadores artesanais.',
    parceiros: 'Parceria · IO Jr. · IPT',
    imagem: 'img/banner-time.jpg',
    alt: 'Membros da IMar Júnior segurando a bandeira da empresa',
  },
]

/*
 * Quem já navegou com a gente (faixa de logos logo abaixo do topo).
 * Para colocar um logo: salve o arquivo em public/img/parceiros/ (de preferência
 * .svg ou .png com fundo transparente) e preencha `logo`, ex.: logo: 'img/parceiros/ambev.svg'
 * Sem `logo`, aparece o nome escrito. `mostrarNome: true` mostra o logo e o nome juntos.
 * `escala` aumenta ou diminui um logo que ficou grande ou pequeno demais (1 = normal).
 */
export const parceiros: { nome: string; logo?: string; mostrarNome?: boolean; escala?: number }[] = [
  { nome: 'Ambev', logo: 'img/parceiros/ambev.png', escala: 0.8 },
  { nome: 'Bloom Ocean', logo: 'img/parceiros/bloom.png' },
  { nome: 'Unifesp', logo: 'img/parceiros/unifesp.png', escala: 1.6 },
  { nome: 'Projeto Mantas do Brasil' }, // TODO: logo (site oficial fora do ar)
  { nome: 'Cultura Inglesa', logo: 'img/parceiros/cultura.png' },
  { nome: 'Seiva Jr.', logo: 'img/parceiros/seiva.png', mostrarNome: true },
  { nome: 'IPT', logo: 'img/parceiros/ipt.png' },
  { nome: 'IO Jr.', logo: 'img/parceiros/iojr.png', escala: 1.25 },
]

export const ods = [
  { numero: 4, cor: '#C5192D', titulo: 'Educação de qualidade', texto: 'Palestras, aulas e feiras de educação ambiental para escolas e empresas.' },
  { numero: 11, cor: '#FD9D24', titulo: 'Cidades e comunidades sustentáveis', texto: 'Gestão de resíduos e projetos com comunidades do litoral paulista.' },
  { numero: 13, cor: '#3F7E44', titulo: 'Ação contra a mudança do clima', texto: 'Estratégias ESG que reduzem impactos e emissões das operações.' },
  { numero: 14, cor: '#0A97D9', titulo: 'Vida na água', texto: 'Conservação dos ecossistemas marinhos: o que nos trouxe até aqui.' },
]

export const facaParte = {
  titulo: 'É aluno do Instituto do Mar?',
  texto:
    'BICT Mar, Engenharia Ambiental, Engenharia de Petróleo ou Oceanografia: venha viver o Movimento Empresa Júnior com a gente. Acompanhe o Instagram para saber quando abre o próximo processo seletivo.',
}

export const contato = {
  titulo: 'Transforme desafios em oportunidades.',
  texto:
    'Conte o que você precisa. A primeira reunião é gratuita e sem compromisso, e a gente volta com uma proposta pensada para a sua realidade.',
}
