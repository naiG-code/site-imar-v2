/*
 * Membros da equipe (página Quem somos).
 * Para colocar a foto: salve em public/img/equipe/ (de preferência quadrada,
 * ~600×600 px) e preencha  foto: 'img/equipe/nome.jpg'
 * Sem foto, aparece um espaço reservado com as iniciais.
 */

export type Membro = { nome: string; cargo: string; foto?: string; linkedin?: string }

// TODO: conteúdo real — nomes, cargos e fotos da gestão atual
export const equipe: Membro[] = [
  { nome: 'Nome', cargo: 'Cargo' },
  { nome: 'Nome', cargo: 'Cargo' },
  { nome: 'Nome', cargo: 'Cargo' },
  { nome: 'Nome', cargo: 'Cargo' },
  { nome: 'Nome', cargo: 'Cargo' },
  { nome: 'Nome', cargo: 'Cargo' },
  { nome: 'Nome', cargo: 'Cargo' },
  { nome: 'Nome', cargo: 'Cargo' },
]
