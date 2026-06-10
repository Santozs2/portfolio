import { Milestone, Experiment, ToolCategory, FutureGoal } from './types';

export const MILESTONES: Milestone[] = [
  {
    id: 'html',
    title: 'HTML',
    subtitle: 'Estruturação Semântica',
    status: 'completo',
    year: '2025',
    description: 'Compreensão inicial da web. Domínio das tags semânticas, acessibilidade digital (a11y) e estruturação robusta de documentos digitais.',
    challengeSolved: 'Substituição de layouts orientados a tabelas por hierarquias semânticas limpas e amigáveis para leitores de tela.',
    technicalImpact: 'Indexação SEO otimizada em 40% em projetos pessoais iniciais e conformidade estrita com padrões W3C.',
    codeSnippet: '<article className="feed-item" aria-labelledby="post-title">\n  <header>\n    <h3 id="post-title">Estrutura Semântica</h3>\n    <time dateTime="2026-06">Junho, 2026</time>\n  </header>\n</article>',
    category: 'frontend'
  },
  {
    id: 'css',
    title: 'CSS',
    subtitle: 'Design de Interação e Layout',
    status: 'completo',
    year: '2025',
    description: 'Estudo profundo de CSS Grid, Flexbox, metodologias BEM, animações de alta performance e responsividade desktop-first vs mobile-first.',
    challengeSolved: 'Criação de transições de estado fluidas a 60fps sem sobrecarregar a thread principal de renderização do navegador.',
    technicalImpact: 'Redução de 65% na redundância de estilos adotando variáveis CSS e sistemas utilitários modulares.',
    codeSnippet: '.experimental-canvas {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n  will-change: transform, opacity;\n  transform: translateZ(0);\n}',
    category: 'frontend'
  },
  {
    id: 'js',
    title: 'JavaScript',
    subtitle: 'Lógica Assíncrona e ES6+',
    status: 'completo',
    year: '2025',
    description: 'Manipulação de DOM profunda, Promises, Closures, Event Loop, destructuring, programação funcional aplicada e comunicação assíncrona robusta.',
    challengeSolved: 'Orquestração de requisições paralelas concorrentes com tratamento resiliente contra perdas de conexão.',
    technicalImpact: 'Criação de Single Page Applications nativas (sem frameworks) com roteador client-side de ultra-baixa latência.',
    codeSnippet: 'async function fetchTelemetry(endpoint) {\n  try {\n    const response = await fetch(endpoint);\n    if (!response.ok) throw new Error("Data broken");\n    return await response.json();\n  } catch (err) {\n    return fallbackCache(endpoint);\n  }\n}',
    category: 'frontend'
  },
  {
    id: 'react',
    title: 'React',
    subtitle: 'Componentização e Gerenciamento de Estado',
    status: 'foco',
    year: '2026',
    description: 'Ciclo de vida, hooks avançados (useMemo, useCallback, useRef), reconciliação (Fiber) e gerenciamento de estado global otimizado para evitar re-fires desnecessários.',
    challengeSolved: 'Manutenibilidade de formulários dinâmicos complexos e dashboards interativos sem re-renderizações em cascata.',
    technicalImpact: 'Melhorias significativas na pontuação de Core Web Vitals (LCP, FID) através de code-splitting e lazy loading seletivo.',
    codeSnippet: 'const TelemetryDisplay = React.memo(({ metrics }) => {\n  const formatted = useMemo(() => processMetrics(metrics), [metrics]);\n  return <span className="font-mono text-xs">{formatted}</span>;\n});',
    category: 'frontend'
  },
  {
    id: 'django',
    title: 'Django',
    subtitle: 'Arquitetura Sólida e MVC Robusto',
    status: 'foco',
    year: '2026',
    description: 'Transição para o desenvolvimento full-stack. Estudo do ecossistema Python, Django MVT, ORM poderoso, middlewares personalizados e autenticação segura.',
    challengeSolved: 'Normalização de dados relacionais complexos em pipelines de ingestão sem onerar o banco de dados principal.',
    technicalImpact: 'Centralização de segurança com tratamento robusto contra CSRF, SQL Injection e vazamento de cabeçalhos de autenticação.',
    codeSnippet: 'class IngestionPipeline(models.Model):\n    stream_id = models.UUIDField(default=uuid.uuid4, editable=False)\n    payload = models.JSONField()\n    created_at = models.DateTimeField(auto_now_add=True)\n\n    class Meta:\n        indexes = [models.Index(fields=["stream_id", "created_at"])]',
    category: 'backend'
  },
  {
    id: 'apis',
    title: 'APIs',
    subtitle: 'Arquitetura RESTful e Integrações',
    status: 'foco',
    year: '2026',
    description: 'Design de endpoints intuitivos com Django REST Framework, serialização ultra-veloz, paginação flexível e controle de taxa de requisições (rate limiting).',
    challengeSolved: 'Desenvolvimento de uma camada unificada de consulta capaz de sincronizar dados de múltiplos serviços de terceiros de maneira idempotente.',
    technicalImpact: 'Documentação viva via Swagger/Redoc que reduziu o tempo de integração de novos frontends de dias para minutos.',
    codeSnippet: '@api_view(["POST"])\n@throttle_classes([CustomAnonymousRateThrottle])\ndef dispatch_experiment(request):\n    serializer = ExperimentSerializer(data=request.data)\n    serializer.is_valid(raise_exception=True)\n    return Response(serializer.data, status=201)',
    category: 'backend'
  },
  {
    id: 'database',
    title: 'Banco de Dados',
    subtitle: 'Persistência, Indexação e Modelagem',
    status: 'completo',
    year: '2025',
    description: 'Modelagem relacional avancada no PostgreSQL/MySQL. Indexações parciais, triggers de auditoria, queries analíticas complexas e prevenção de gargalos N+1.',
    challengeSolved: 'Otimização de rotinas de batch update de milhares de linhas, eliminando travamentos de tabelas (table locks).',
    technicalImpact: 'Redução média de latência de queries de 450ms para menos de 18ms em tabelas com milhões de registros.',
    codeSnippet: 'CREATE INDEX CONCURRENTLY idx_users_active_status \nON users (last_login_at) \nWHERE status = \'ACTIVE\';',
    category: 'backend'
  },
  {
    id: 'docker',
    title: 'Docker',
    subtitle: 'Conteinerização e Reprodutibilidade',
    status: 'foco',
    year: '2026',
    description: 'Isolamento completo de ambientes de desenvolvimento, testes e deploy. Criação de imagens multi-stage otimizadas, redes internas e orquestração estável com Compose.',
    challengeSolved: 'Garantir que os bugs do tipo "na minha máquina funciona" fossem extintos unificando o OS de desenvolvimento e produção.',
    technicalImpact: 'Imagens finais de produção reduzidas de 800MB para apenas 120MB utilizando bases alpine e multi-stage builds corretivos.',
    codeSnippet: 'FROM node:20-alpine AS builder\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci\nCOPY . .\nRUN npm run build\n\nFROM nginx:stable-alpine\nCOPY --from=builder /app/dist /usr/share/nginx/html',
    category: 'devops'
  },
  {
    id: 'software-engineering',
    title: 'Software Engineering',
    subtitle: 'Padrões de Projeto e Arquitetura',
    status: 'foco',
    year: '2026',
    description: 'A transformação definitiva. Estudo avançado de Clean Architecture, SOLID, Design Patterns (Factory, Strategy, Observer), testes automatizados estruturais e design orientado a domínio (DDD).',
    challengeSolved: 'Desacoplamento de controllers e frameworks das regras essenciais de negócio, permitindo mudanças de infraestrutura sem traumas no core code.',
    technicalImpact: 'Métricas de cobertura de teste unitário ampliadas para 90% com código altamente testável e auto-documentado.',
    codeSnippet: 'interface IngestionUseCase {\n  execute(data: RawTelemetricPayload): Promise<ProcessedTelemetry>;\n}\n\nclass SecureIngestor implements IngestionUseCase {\n  constructor(private readonly validator: Validator, private readonly repo: Repository) {}\n}',
    category: 'architecture'
  }
];
export const TOOL_CATEGORIES: ToolCategory[] = [
  {
    name: 'Frontend',
    status: 'active',
    items: [
      { name: 'React', level: 'avançada', utility: 'Construção de SPAs otimizadas com renderização reativa e hooks complexos.' },
      { name: 'TypeScript', level: 'primária', utility: 'Tipagem estática estrita para eliminação de bugs em tempo de design.' },
      { name: 'Next.js', level: 'avançada', utility: 'Arquitetura híbrida (SSR, SSG) e roteamento de servidor eficiente.' },
      { name: 'Tailwind CSS', level: 'primária', utility: 'Estilização ágil de alta performance alinhada com sistemas de design.' }
    ]
  },
  {
    name: 'Backend',
    status: 'active',
    items: [
      { name: 'Django', level: 'avançada', utility: 'Modelagem full-stack corporativa com forte acoplamento de segurança.' },
      { name: 'Node.js', level: 'avançada', utility: 'Servidores de entrada e saída rápidos e orquestradores lightweight assíncronos.' }
    ]
  },
  {
    name: 'Banco de Dados',
    status: 'active',
    items: [
      { name: 'MySQL / PostgreSQL', level: 'avançada', utility: 'Modelagem SQL estruturada, normalização e otimização de subqueries.' },
      { name: 'Supabase', level: 'avançada', utility: 'BaaS com PostgreSQL nativo reativo de escala instantânea.' }
    ]
  },
  {
    name: 'Ferramentas de Suporte',
    status: 'active',
    items: [
      { name: 'Git', level: 'primária', utility: 'Ramificação cirúrgica, rebase asséptico e gerenciamento limpo de histórico.' },
      { name: 'GitHub', level: 'primária', utility: 'Automação CI/CD (GitHub Actions) e fluxos colaborativos de Pull Request.' },
      { name: 'Figma', level: 'fundacional', utility: 'Interpretação e extração cirúrgica de tokens de design e wireframes.' },
      { name: 'Vercel', level: 'avançada', utility: 'Pipelines automatizados de deploy e servidores de borda (edge function).' }
    ]
  },
  {
    name: 'Em Próxima Versão',
    status: 'learning',
    items: [
      { name: 'Docker', level: 'absorvendo', utility: 'Isolamento reprodutível e conteinerização em pipelines multiplataforma.' },
      { name: 'Arquitetura de Software', level: 'absorvendo', utility: 'Clean Architecture, Modularidade Extrema e Engenharia de Resiliência.' },
      { name: 'Engenharia de Software', level: 'absorvendo', utility: 'Escalabilidade de sistemas, estruturas distribuídas de baixa latência.' }
    ]
  }
];

export const FUTURE_GOALS: FutureGoal[] = [
  {
    title: 'Engenharia de Software ',
    timeframe: '2027',
    description: 'Deixar de considerar tecnologias específicas (como simples empilhadores de HTML/CSS) para focar na Engenharia de Software Agnóstica.',
    milestones: [
      'Abstração completa de banco de dados por camadas de Repositório desacopladas',
      'Implementação de pipelines automáticos de testes unitários com Mock de dados em CI/CD',
      'Orquestração distribuída via Kubernetes e microsserviços integrados de telemetria'
    ],
    codeName: 'ENGSOFT-2027'
  }
];
