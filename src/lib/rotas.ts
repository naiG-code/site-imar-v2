/*
 * Endereços das páginas. `url()` já coloca o prefixo certo quando o site
 * está publicado numa subpasta (ex.: usuario.github.io/site-imar-v2/).
 */
export const base = import.meta.env.BASE_URL.replace(/\/?$/, '/')
export const url = (caminho = '') => base + caminho.replace(/^\//, '')

export const paginas = [
  { href: '', label: 'Início' },
  { href: 'quem-somos', label: 'Quem somos' },
  { href: 'servicos', label: 'Serviços' },
  { href: 'projetos', label: 'Projetos' },
  { href: 'contato', label: 'Contato' },
]

/** Link para o formulário com o serviço já escolhido. */
export const contatoServico = (id: string) => `${url('contato')}?servico=${id}#formulario`
