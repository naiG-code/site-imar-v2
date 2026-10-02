/*
 * Depoimentos de clientes (carrossel na página inicial).
 * Use apenas depoimentos reais e com autorização de quem falou.
 *
 * Enquanto a lista estiver vazia, o carrossel aparece com espaços reservados
 * só no seu computador (npm run dev). No site publicado ele fica escondido,
 * para não mostrar caixas vazias para os clientes.
 */

export type Depoimento = { texto: string; autor: string; cargo: string; organizacao: string; foto?: string }

// TODO: conteúdo real — adicionar depoimentos, ex.:
// { texto: 'A IMar Júnior...', autor: 'Maria Silva', cargo: 'Coordenadora', organizacao: 'Escola X' },
export const depoimentos: Depoimento[] = []
