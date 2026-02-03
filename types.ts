
export enum Shift {
  MORNING = 'SERVIDOR',
  AFTERNOON = 'TERCEIRIZADO',
  INTEGRAL = 'CONTRATO',
  ALL = 'Todos'
}

export interface Occurrence {
  id: string;
  funcionarioId: string;
  groupId?: string;
  date: string;
  title: string;
  description: string;
  category: 'Comportamental' | 'Acadêmica' | 'Médica' | 'Outros';
  registeredBy: string;
}

export interface Funcionario {
  id_func: string;
  rf: string;
  vc: string;
  empresa: string;
  status: string; // Was 'Ativo' | 'Inativo' ... might need to be loose string for now or mapped
  vinculo: string;
  categoria: string;
  nome_func: string;
  cargo_base: string;
  cargo: string;
  funcao: string;
  subfuncao: string;
  qpe: string;
  jornada: string;
  inicio_exercicio: string; // Date string
  inicio_ue: string; // Date string
  ue_lotacao: string;
  ue_exercicio: string;
  ue_acumulo: string;
  email_sme: string;
  email_edu: string;
  foto_func: string;
  cpf_func?: string;
  rg_func?: string;
  data_nascimento_func?: string;
  cep_func?: string; // string mainly for masking, though DB might be int
  logradouro_func?: string;
  "n°_func"?: string; // Quoted because of special character
  compl_func?: string;
  bairro_func?: string;
  cidade_func?: string;
  estado_func?: string;
}

export interface AuthUser {
  id: string; // Mapped from id_func
  name: string; // Mapped from nome_func
  role: 'Admin' | 'Teacher' | 'Funcionario';
  email: string;
}
