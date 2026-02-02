
import { Funcionario, Shift } from './types';

export const INSTITUTIONAL_BLUE = '#3b5998';

export const SERVIDORES_ROLES = [
  'GESTAO',
  'COORDENAÇÃO',
  'DOCENCIA',
  'ADMINISTRATIVO'
];

export const TERCEIRIZADOS_ROLES = [
  'LIMPEZA',
  'COZINHA',
  'SEGURANÇA'
];

export const CONTRATOS_ROLES = [
  'ABAE',
  'AVE',
  'ESTAGIÁRIO',
  'PROFESSOR DE MUSICA'
];

export const GRADES = [
  'Administrativo',
  'Limpeza',
  'Copa/Cozinha',
  'Segurança',
  'Manutenção',
  'Outros'
];

export const MOCK_FUNCIONARIOS: Funcionario[] = [
  {
    id_func: '1',
    nome_func: 'JOÃO DA SILVA',
    rf: '123.456.7',
    vc: '1',
    empres: 'PREFEITURA',
    vinculo: 'EFETIVO',
    categoria: 'SERVIDOR',
    cargo_base: 'PROF. ED. INF. E FUND. I',
    cargo: 'PROF. ED. INF. E FUND. I',
    funcao: 'DOCENCIA',
    subfuncao: 'REGENCIA',
    qpe: 'QPE-14A',
    jornada: 'J30',
    inicio_exercicio: '2010-02-01',
    inicio_ue: '2015-03-10',
    ue_lotacao: 'EMEF TARSILA DO AMARAL',
    ue_exercicio: 'EMEF TARSILA DO AMARAL',
    ue_acumulo: '',
    email_sme: 'joao.silva@sme.prefeitura.sp.gov.br',
    email_edu: 'joao.silva@edu.sme.prefeitura.sp.gov.br',
    foto_func: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&h=400&fit=crop',
    status: 'Ativo'
  },
  {
    id_func: '2',
    nome_func: 'MARIA OLIVEIRA',
    rf: '765.432.1',
    vc: '1',
    empres: 'PREFEITURA',
    vinculo: 'EFETIVO',
    categoria: 'SERVIDOR',
    cargo_base: 'COORDENADOR PEDAGOGICO',
    cargo: 'COORDENADOR PEDAGOGICO',
    funcao: 'GESTAO',
    subfuncao: 'COORDENACAO',
    qpe: 'QPE-18C',
    jornada: 'J40',
    inicio_exercicio: '2008-05-20',
    inicio_ue: '2018-02-01',
    ue_lotacao: 'EMEF TARSILA DO AMARAL',
    ue_exercicio: 'EMEF TARSILA DO AMARAL',
    ue_acumulo: '',
    email_sme: 'maria.oliveira@sme.prefeitura.sp.gov.br',
    email_edu: 'maria.oliveira@edu.sme.prefeitura.sp.gov.br',
    foto_func: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&h=400&fit=crop',
    status: 'Ativo'
  },
  {
    id_func: '3',
    nome_func: 'CARLOS SANTOS',
    rf: '987.654.3',
    vc: '1',
    empres: 'PREFEITURA',
    vinculo: 'EFETIVO',
    categoria: 'SERVIDOR',
    cargo_base: 'DIRETOR DE ESCOLA',
    cargo: 'DIRETOR DE ESCOLA',
    funcao: 'GESTAO',
    subfuncao: 'DIRECAO',
    qpe: 'QPE-22E',
    jornada: 'J40',
    inicio_exercicio: '2000-01-15',
    inicio_ue: '2012-07-01',
    ue_lotacao: 'EMEF TARSILA DO AMARAL',
    ue_exercicio: 'EMEF TARSILA DO AMARAL',
    ue_acumulo: '',
    email_sme: 'carlos.santos@sme.prefeitura.sp.gov.br',
    email_edu: 'carlos.santos@edu.sme.prefeitura.sp.gov.br',
    foto_func: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
    status: 'Ativo'
  },
  {
    id_func: '4',
    nome_func: 'ANA PEREIRA',
    rf: '111.222.3',
    vc: '1',
    empres: 'PREFEITURA',
    vinculo: 'EFETIVO',
    categoria: 'SERVIDOR',
    cargo_base: 'AUXILIAR TECNICO DE EDUCACAO',
    cargo: 'AUXILIAR TECNICO DE EDUCACAO',
    funcao: 'APOIO',
    subfuncao: 'SECRETARIA',
    qpe: 'QPE-05B',
    jornada: 'J40',
    inicio_exercicio: '2019-03-10',
    inicio_ue: '2019-03-10',
    ue_lotacao: 'EMEF TARSILA DO AMARAL',
    ue_exercicio: 'EMEF TARSILA DO AMARAL',
    ue_acumulo: '',
    email_sme: 'ana.pereira@sme.prefeitura.sp.gov.br',
    email_edu: 'ana.pereira@edu.sme.prefeitura.sp.gov.br',
    foto_func: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop',
    status: 'Ativo'
  },
  {
    id_func: '5',
    nome_func: 'PEDRO COSTA',
    rf: '444.555.6',
    vc: '1',
    empres: 'TERCEIRIZADA',
    vinculo: 'CONTRATO',
    categoria: 'TERCEIRIZADO',
    cargo_base: 'VIGIA',
    cargo: 'VIGIA',
    funcao: 'SEGURANÇA',
    subfuncao: 'PORTARIA',
    qpe: '',
    jornada: '12x36',
    inicio_exercicio: '2021-01-01',
    inicio_ue: '2021-01-01',
    ue_lotacao: '',
    ue_exercicio: 'EMEF TARSILA DO AMARAL',
    ue_acumulo: '',
    email_sme: '',
    email_edu: '',
    foto_func: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
    status: 'Ativo'
  },
  {
    id_func: '6',
    nome_func: 'JULIANA LIMA',
    rf: '777.888.9',
    vc: '1',
    empres: 'CONTRATADA',
    vinculo: 'CONTRATO',
    categoria: 'CONTRATO',
    cargo_base: 'AVE',
    cargo: 'AVE',
    funcao: 'APOIO',
    subfuncao: 'INCLUSAO',
    qpe: '',
    jornada: 'J30',
    inicio_exercicio: '2022-02-15',
    inicio_ue: '2022-02-15',
    ue_lotacao: '',
    ue_exercicio: 'EMEF TARSILA DO AMARAL',
    ue_acumulo: '',
    email_sme: 'juliana.lima@edu.sme.prefeitura.sp.gov.br',
    email_edu: '',
    foto_func: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop',
    status: 'Ativo'
  }
];
