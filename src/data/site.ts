/*
 * Informações gerais da IMar Júnior.
 * Edite só o que está entre aspas. Não apague vírgulas nem chaves.
 */

export const site = {
  nome: 'IMar Júnior',
  slogan: 'Consultoria e Projetos',
  descricao:
    'Empresa Júnior do Instituto do Mar da Unifesp. Consultoria ESG, educação ambiental, PGRS, licenciamento e coffee break sustentável para empresas, escolas, organizações e eventos da Baixada Santista.',
  fundacao: 2015,

  email: 'contato@imarjunior.com.br',

  whatsapp: {
    /** Só números: 55 + DDD + número */
    numero: '5511948294434',
    exibicao: '(11) 94829-4434',
    mensagem: 'Olá, IMar Júnior! Vim pelo site e gostaria de agendar uma reunião.',
  },

  redes: {
    instagram: { usuario: '@imarjr', url: 'https://www.instagram.com/imarjr/' },
    linkedin: { usuario: 'IMar Júnior', url: 'https://br.linkedin.com/company/imarjr' },
    // TODO: confirmar o @ do TikTok
    tiktok: { usuario: '@imarjr', url: 'https://www.tiktok.com/@imarjr' },
  },

  /*
   * Formulário de contato (Web3Forms, gratuito).
   * 1. Acesse https://web3forms.com, digite contato@imarjunior.com.br e clique em "Create Access Key".
   * 2. A chave chega por e-mail. Cole-a abaixo, entre as aspas.
   * Enquanto estiver vazio, o formulário abre o app de e-mail da pessoa com a mensagem pronta.
   */
  web3formsKey: '',
}

export const whatsappLink = (mensagem = site.whatsapp.mensagem) =>
  `https://wa.me/${site.whatsapp.numero}?text=${encodeURIComponent(mensagem)}`

export const anosDeAtuacao = () => new Date().getFullYear() - site.fundacao
