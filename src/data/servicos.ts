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
  resumo: string
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
    pontos: ['Escopo construído com você', 'Equipe interdisciplinar', 'Foco em impacto positivo'],
    icone: 'bussola',
  },
]
