/*
 * Serviços. Cada bloco { ... } vira um card na seção "Serviços"
 * e uma opção no formulário de contato.
 * Para adicionar um serviço, copie um bloco inteiro e mude os textos.
 * Ícones disponíveis: 'onda', 'folha', 'ciclo', 'xicara', 'farol', 'bussola'.
 */

export type Servico = {
  id: string
  sigla: string
  titulo: string
  paraQuem: string
  /** Frase curta usada no carrossel da página inicial. */
  resumo: string
  /** Texto completo usado na página de Serviços (baseado no portfólio 2026). */
  descricao: string
  pontos: string[]
  icone: 'onda' | 'folha' | 'ciclo' | 'xicara' | 'farol' | 'bussola'
  /** Texto curto em destaque no card (opcional). */
  selo?: string
}

export const servicos: Servico[] = [
  {
    id: 'educacao-ambiental',
    sigla: 'EDU',
    titulo: 'Educação Ambiental',
    paraQuem: 'Empresas · Escolas · Eventos',
    resumo:
      'Palestras, aulas, oficinas e feiras que transformam ciência do mar em experiência. Metodologia interativa, multidisciplinar e adaptada a cada público, do ensino infantil ao chão de fábrica.',
    descricao:
      'Estabelecido para atender tanto empresas quanto escolas, com o intuito de introduzir, ensinar e aprimorar conhecimentos ambientais e de sustentabilidade. Usamos uma metodologia interativa, multidisciplinar e adaptável, com palestras, aulas, feiras e dinâmicas de conscientização pensadas para cada público.',
    pontos: ['Feiras e circuitos interativos', 'Palestras e aulas', 'Dinâmicas de conscientização', 'Conteúdo adaptado ao público'],
    icone: 'onda',
    selo: 'Carro-chefe',
  },
  {
    id: 'consultoria-esg',
    sigla: 'ESG',
    titulo: 'Consultoria ESG',
    paraQuem: 'Empresas · Eventos',
    resumo:
      'Diagnóstico completo de processos e estratégias alinhadas aos pilares Ambiental, Social e de Governança, para ganhar eficiência e fortalecer a reputação.',
    descricao:
      'Oferecemos um diagnóstico completo para empresas e eventos, analisando processos e desenvolvendo estratégias alinhadas aos pilares Ambiental, Social e de Governança (ESG). Apoiamos sua organização na incorporação de práticas sustentáveis, fortalecendo a eficiência operacional, a responsabilidade socioambiental e a reputação no mercado.',
    pontos: ['Diagnóstico de processos e práticas', 'Estratégia nos três pilares ESG', 'Eficiência operacional', 'Reputação fortalecida'],
    icone: 'folha',
  },
  {
    id: 'pgrs',
    sigla: 'PGRS',
    titulo: 'Plano de Gestão de Resíduos Sólidos',
    paraQuem: 'Empresas · Eventos',
    resumo:
      'Elaboramos e implementamos o PGRS com as diretrizes de manejo, segregação, transporte e destinação final dos resíduos, em conformidade com a legislação.',
    descricao:
      'Elaboramos e implementamos o Plano de Gestão de Resíduos Sólidos para empresas e eventos, estabelecendo as diretrizes corretas para o manejo, a segregação, o transporte e a destinação final dos resíduos. Garantimos eficiência operacional, redução de impactos ambientais e total conformidade com a legislação vigente.',
    pontos: ['Manejo e segregação', 'Transporte e destinação final', 'Redução de impactos', 'Conformidade legal'],
    icone: 'ciclo',
  },
  {
    id: 'coffee-break',
    sigla: 'COFFEE',
    titulo: 'Coffee Break Sustentável',
    paraQuem: 'Eventos',
    resumo:
      'Do cardápio ao descarte: eventos com menos resíduos e mais consumo consciente, com insumos locais e materiais reutilizáveis ou compostáveis.',
    descricao:
      'Soluções para eventos focadas na redução de resíduos e no consumo consciente. Priorizamos insumos locais e de baixo impacto ambiental, materiais reutilizáveis ou compostáveis e o correto direcionamento dos resíduos gerados para reciclagem e compostagem.',
    pontos: ['Insumos locais e de baixo impacto', 'Materiais reutilizáveis ou compostáveis', 'Reciclagem e compostagem dos resíduos'],
    icone: 'xicara',
  },
  {
    id: 'licenciamento',
    sigla: 'LIC',
    titulo: 'Licenciamento Ambiental',
    paraQuem: 'Empresas · Empreendimentos',
    resumo:
      'Apoio técnico no licenciamento do seu empreendimento, com orientação sobre as exigências dos órgãos ambientais em cada etapa.',
    descricao:
      'Apoio técnico no processo de licenciamento ambiental do seu empreendimento: levantamos os requisitos legais, organizamos a documentação técnica e acompanhamos as exigências dos órgãos ambientais em cada etapa.',
    pontos: ['Levantamento de requisitos legais', 'Organização da documentação técnica', 'Acompanhamento das exigências'],
    icone: 'farol',
  },
  {
    id: 'personalizado',
    sigla: 'CUSTOM',
    titulo: 'Projetos Personalizados',
    paraQuem: 'Qualquer organização',
    resumo:
      'Tem um desafio que não cabe em nenhuma caixinha? Construímos o escopo junto com você, com uma equipe interdisciplinar do Instituto do Mar.',
    descricao:
      'Projetos em sustentabilidade desenvolvidos de acordo com os desafios e objetivos da sua organização. Construímos o escopo junto com você, com uma equipe interdisciplinar do Instituto do Mar. Conta pra gente o que você precisa.',
    pontos: ['Escopo construído com você', 'Equipe interdisciplinar', 'Foco em impacto positivo'],
    icone: 'bussola',
  },
]
