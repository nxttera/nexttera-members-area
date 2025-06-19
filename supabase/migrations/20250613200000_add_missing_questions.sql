-- =====================================================
-- ADICIONAR PERGUNTAS FALTANTES PARA MISSÕES
-- =====================================================

-- Mission 3: Plano e Batalhas (id=3)
INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(16, 3, 'Quais foram os passos específicos que você traçou logo após a epifania?', 'Descreva as metas e cronograma que você definiu', 'textarea', null, true, 1),
(17, 3, 'Que ferramentas, metodologias ou parceiros você envolveu no processo?', 'Recursos e pessoas que foram fundamentais na execução', 'textarea', null, true, 2),
(18, 3, 'Como você comunicou esse plano para sua equipe ou clientes?', 'Estratégia de comunicação e alinhamento utilizada', 'textarea', null, true, 3),
(19, 3, 'Quais foram as duas maiores barreiras encontradas depois de iniciar o plano?', 'Obstáculos práticos que surgiram durante a execução', 'textarea', null, true, 4);

-- Mission 4: Conquista e Transformação (id=4)
INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(20, 4, 'Quais resultados quantificáveis você obteve?', 'Números de vendas, alcance, satisfação ou outras métricas', 'textarea', null, true, 1),
(21, 4, 'Que feedback dos clientes ou stakeholders confirmou seu sucesso?', 'Depoimentos, avaliações ou reconhecimentos recebidos', 'textarea', null, true, 2),
(22, 4, 'O que mudou em você e na cultura da sua marca após essa jornada?', 'Transformações pessoais e organizacionais observadas', 'textarea', null, true, 3),
(23, 4, 'Que lição universal sua história transmite aos clientes?', 'Mensagem-chave que você gostaria que as pessoas absorvessem', 'textarea', null, true, 4);

-- Mission 5: Crenças Revolucionárias (id=5)
INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(24, 5, 'O que você acredita que o torna único e diferente de todo mundo?', 'Sua essência incomparável no mercado', 'textarea', null, true, 1),
(25, 5, 'Quais princípios você não abre mão e que a maioria dos concorrentes ignora?', 'Seus inegociáveis que definem sua identidade', 'textarea', null, true, 2),
(26, 5, 'Cite quatro revoltas que você tem com o seu mercado', 'Práticas do mercado que você faz diferente ou gostaria de mudar', 'textarea', null, true, 3),
(27, 5, 'Quais são os maiores erros defendidos pela maioria e que você abomina?', 'Práticas comuns do mercado que você considera prejudiciais', 'textarea', null, true, 4),
(28, 5, 'Como as práticas que você combate prejudicam o seu cliente ideal?', 'Impacto negativo das práticas tradicionais nos seus clientes', 'textarea', null, true, 5),
(29, 5, 'Que resultado positivo seu credo entrega que outros não conseguem?', 'Benefício único da sua abordagem diferenciada', 'textarea', null, true, 6);

-- Mission 6: Portfólio de Ofertas (id=6)
INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(30, 6, 'Quais produtos/serviços você oferece hoje?', 'Liste do menor para o maior valor', 'textarea', null, true, 1),
(31, 6, 'Qual dor principal cada oferta resolve?', 'Problema específico que cada produto/serviço endereça', 'textarea', null, true, 2),
(32, 6, 'Existe uma oferta de baixo risco para atrair leads?', 'Free trial, diagnóstico gratuito ou similar', 'select', '["Sim, tenho", "Não, mas gostaria de criar", "Não acho necessário"]', true, 3),
(33, 6, 'Há lacunas entre a oferta de entrada e a principal?', 'Produtos intermediários que poderiam nutrir melhor o cliente', 'textarea', null, true, 4),
(34, 6, 'Que solução premium mantém o cliente na jornada?', 'Upgrade natural que aumenta o valor do cliente', 'textarea', null, true, 5);

-- Mission 7: Ganhos Transformadores (id=7)
INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(35, 7, 'Que métrica melhora com sua solução?', 'Tempo, custo, receita - quantifique o benefício', 'textarea', null, true, 1),
(36, 7, 'Como o cliente se sente após usar a solução?', 'Impacto emocional: confiança, alívio, orgulho', 'textarea', null, true, 2),
(37, 7, 'Quanto tempo o benefício perdura sem nova intervenção?', 'Sustentabilidade dos resultados entregues', 'select', '["Até 1 mês", "1-3 meses", "3-6 meses", "6-12 meses", "Mais de 1 ano", "Permanente"]', true, 3),
(38, 7, 'Que ganhos inesperados surgem?', 'Efeitos colaterais positivos: network, aprendizado, status', 'textarea', null, true, 4),
(39, 7, 'Cite o caso mais emblemático que comprova a transformação', 'História de sucesso que exemplifica seus resultados', 'textarea', null, true, 5);

-- Mission 8: Dores Resolvidas (id=8)
INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(40, 8, 'Qual é a reclamação que o cliente verbaliza?', 'Sintoma visível do problema que eles expressam', 'textarea', null, true, 1),
(41, 8, 'Quanto essa dor custa em dinheiro, tempo ou estresse?', 'Custo oculto e quantificável do problema', 'textarea', null, true, 2),
(42, 8, 'Por que as soluções atuais não resolvem ou pioram o problema?', 'Falhas das alternativas disponíveis no mercado', 'textarea', null, true, 3),
(43, 8, 'O que acontece se o cliente adiar a solução?', 'Urgência e consequências da procrastinação', 'textarea', null, true, 4),
(44, 8, 'Qual obstáculo desaparece imediatamente após contratar você?', 'Barreira removida instantaneamente com sua solução', 'textarea', null, true, 5);

-- =====================================================
-- PERGUNTAS ADICIONAIS MISSIONS 1 E 2 (CAPÍTULO 1)
-- =====================================================

-- Mission 1: Origens - Pergunta adicional
INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(45, 1, 'Por que esse desejo era importante para você?', 'Descreva sua visão de futuro e o legado que queria construir', 'textarea', null, true, 7);

-- Mission 2: O Grande Desafio - Perguntas adicionais
INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(46, 2, 'Como esse obstáculo afetava seu dia a dia emocional e prático?', 'Impacto real na sua vida pessoal e profissional', 'textarea', null, true, 5),
(47, 2, 'Como você percebeu que havia uma nova oportunidade ou solução?', 'O momento da descoberta e reconhecimento da oportunidade', 'textarea', null, true, 6);

-- Mission 3: Plano e Batalhas - Perguntas adicionais
INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(48, 3, 'Que dúvidas ou "vozes internas" quase te fizeram desistir?', 'Medos, críticas internas ou externas que enfrentou', 'textarea', null, true, 5),
(49, 3, 'Como você adaptou o plano para superar esses desafios?', 'Mudanças e ajustes que fez durante o processo', 'textarea', null, true, 6);

-- Mission 4: Conquista e Transformação - Perguntas adicionais
INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(50, 4, 'Como esses resultados se comparam às suas expectativas iniciais?', 'Análise entre o planejado e o alcançado', 'textarea', null, true, 5),
(51, 4, 'Como você convida o leitor a fazer parte dessa nova realidade?', 'Sua chamada à ação baseada na sua jornada', 'textarea', null, true, 6);

-- =====================================================
-- NOVA MISSION: MARCOS & CAPÍTULOS (CAPÍTULO 1)
-- =====================================================

-- Primeiro, adicionar a nova mission se não existir
INSERT INTO missions (id, chapter_id, title, description, order_number, total_questions) VALUES
(23, 1, 'Marcos & Capítulos', 'Linha do tempo dos marcos que definem a evolução da marca', 6, 5)
ON CONFLICT (id) DO NOTHING;

-- Perguntas da Mission 23: Marcos & Capítulos
INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(52, 23, 'Qual acontecimento colocou a marca no mapa?', 'O evento inaugural que marcou o início da sua jornada', 'textarea', null, true, 1),
(53, 23, 'Que conquista provou o valor da proposta?', 'Validação de mercado que confirmou sua direção', 'textarea', null, true, 2),
(54, 23, 'Que desafio obrigou a marca a evoluir rapidamente?', 'Momento de crise que forçou reinvenção', 'textarea', null, true, 3),
(55, 23, 'Qual expansão ou pivot destravou crescimento exponencial?', 'Ponto de escala que acelerou os resultados', 'textarea', null, true, 4),
(56, 23, 'Que iniciativa recente aponta para o futuro da marca?', 'Próximo capítulo que está sendo construído', 'textarea', null, true, 5);

-- =====================================================
-- PERGUNTAS FALTANTES MISSION 9 (CAPÍTULO 3)
-- =====================================================

-- Mission 9: Perfil Demográfico - Perguntas adicionais
INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(57, 9, 'Existe algum gênero predominante no seu público?', 'Distribuição por gênero dos seus clientes', 'select', '["Masculino", "Feminino", "Equilibrado", "Não identificado"]', true, 6),
(58, 9, 'Qual o nível de experiência digital do seu cliente?', 'Familiaridade com tecnologia e plataformas digitais', 'select', '["Iniciante", "Intermediário", "Avançado", "Expert"]', true, 7);

-- =====================================================
-- PERGUNTAS MISSION 10: DORES E DESEJOS PROFUNDOS
-- =====================================================

INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(59, 10, 'Quais as 3 principais dores do seu público?', 'Problemas mais críticos que eles enfrentam', 'textarea', null, true, 1),
(60, 10, 'Quais os 3 principais desejos do seu público?', 'Aspirações e objetivos que mais perseguem', 'textarea', null, true, 2),
(61, 10, 'Qual a principal meta do seu público?', 'Objetivo central que define suas decisões', 'textarea', null, true, 3),
(62, 10, 'Qual o principal desafio que o impede de alcançar essa meta?', 'Maior obstáculo na jornada do cliente ideal', 'textarea', null, true, 4),
(63, 10, 'Há outras metas secundárias que ele deseja alcançar?', 'Objetivos complementares importantes', 'textarea', null, true, 5),
(64, 10, 'Quais desafios impedem essas outras metas?', 'Obstáculos para objetivos secundários', 'textarea', null, true, 6);

-- =====================================================
-- PERGUNTAS MISSION 11: COMPORTAMENTO DE COMPRA
-- =====================================================

INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(65, 11, 'Quais as objeções mais comuns sobre preço?', 'Resistências relacionadas ao investimento', 'textarea', null, true, 1),
(66, 11, 'Quais as objeções mais comuns sobre risco?', 'Medos sobre possíveis resultados negativos', 'textarea', null, true, 2),
(67, 11, 'Quais as objeções mais comuns sobre tempo?', 'Preocupações com prazos e disponibilidade', 'textarea', null, true, 3),
(68, 11, 'Qual o "medo final" que bloqueia a compra?', 'A insegurança mais profunda que impede a decisão', 'textarea', null, true, 4),
(69, 11, 'Quais critérios de decisão ele avalia para comprar?', 'Fatores que influenciam a escolha final', 'textarea', null, true, 5),
(70, 11, 'Onde e como ele descobre, pesquisa e converte?', 'Jornada completa desde conhecimento até compra', 'textarea', null, true, 6);

-- =====================================================
-- PERGUNTAS MISSION 12: ANTI-PERSONA
-- =====================================================

INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(71, 12, 'Qual o público que você não quer atrair?', 'Perfil de cliente que não se alinha com sua proposta', 'textarea', null, true, 1),
(72, 12, 'O que ele faz ou pensa que conflita com sua proposta?', 'Comportamentos ou crenças incompatíveis', 'textarea', null, true, 2),
(73, 12, 'Quais sinais de alerta na qualificação identificam anti-personas?', 'Red flags durante o processo de vendas', 'textarea', null, true, 3),
(74, 12, 'Por que esse perfil não seria um bom cliente?', 'Razões específicas para evitar esse público', 'textarea', null, true, 4);

-- =====================================================
-- PERGUNTAS MISSION 13: MAPA COMPETITIVO
-- =====================================================

INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(75, 13, 'Quais 3 concorrentes diretos oferecem soluções similares?', 'Concorrentes com propostas parecidas e faixa de preço', 'textarea', null, true, 1),
(76, 13, 'Quais 3 concorrentes indiretos resolvem a dor de outra forma?', 'Alternativas que atendem a mesma necessidade diferentemente', 'textarea', null, true, 2),
(77, 13, 'Como o mercado percebe cada concorrente?', 'Posicionamento percebido: premium, básico, nicho', 'textarea', null, true, 3),
(78, 13, 'Que ponto forte/fraco mais salta aos olhos em cada concorrente?', 'Principal vantagem e desvantagem de cada um', 'textarea', null, true, 4);

-- =====================================================
-- PERGUNTAS MISSION 14: DIFERENCIAIS ÚNICOS
-- =====================================================

INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(79, 14, 'Qual recurso, processo ou abordagem só a sua marca oferece?', 'Sua vantagem competitiva exclusiva', 'textarea', null, true, 1),
(80, 14, 'Que prova tangível sustenta essa diferença?', 'Evidências concretas da sua vantagem', 'textarea', null, true, 2),
(81, 14, 'Como esse diferencial impacta o resultado do cliente?', 'Benefício prático da sua abordagem única', 'textarea', null, true, 3),
(82, 14, 'Quais concorrentes tentam copiar, mas falham? Por quê?', 'Tentativas de imitação e razões do insucesso', 'textarea', null, true, 4);

-- =====================================================
-- PERGUNTAS MISSION 15: ARGUMENTO DE ESCOLHA
-- =====================================================

INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(83, 15, 'Em uma frase, por que o cliente deve escolher você?', 'Proposta única de valor condensada', 'textarea', null, true, 1),
(84, 15, 'Qual benefício principal e prova sustentam essa frase?', 'Fundamento do seu argumento de escolha', 'textarea', null, true, 2),
(85, 15, 'Existe número ou métrica comparativa que fortaleça o argumento?', 'Dados quantitativos que comprovam superioridade', 'textarea', null, true, 3),
(86, 15, 'Como essa promessa se traduz em headline de anúncio?', 'Versão publicitária do seu argumento', 'textarea', null, true, 4);

-- =====================================================
-- PERGUNTAS MISSION 16: ÍCONES VISUAIS
-- =====================================================

INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(87, 16, 'Qual imagem ou logotipo identifica a marca à primeira vista?', 'Símbolo principal da identidade visual', 'textarea', null, true, 1),
(88, 16, 'Quais 2-3 cores formam a assinatura visual? Por quê?', 'Paleta de cores característica e significado', 'textarea', null, true, 2),
(89, 16, 'Há alguma figura, mascote ou forma geométrica recorrente?', 'Elementos visuais distintivos da marca', 'textarea', null, true, 3),
(90, 16, 'Onde estes ícones aparecem?', 'Aplicação prática: site, app, materiais', 'textarea', null, true, 4);

-- =====================================================
-- PERGUNTAS MISSION 17: RITUAIS E EXPERIÊNCIAS
-- =====================================================

INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(91, 17, 'Há webinar, live ou desafio mensal que reúne a comunidade?', 'Evento âncora que conecta seguidores', 'textarea', null, true, 1),
(92, 17, 'Como é feita a iniciação de novos membros da comunidade?', 'Processo de primeiro contato e boas-vindas', 'textarea', null, true, 2),
(93, 17, 'Existem ações diárias/semanais que você faz e seguidores repetem?', 'Rituais de uso recorrente', 'textarea', null, true, 3),
(94, 17, 'Como vocês comemoram conquistas de clientes?', 'Celebração de marcos: cases, selos, reconhecimento', 'textarea', null, true, 4);

-- =====================================================
-- PERGUNTAS MISSION 18: LÉXICO DA MARCA
-- =====================================================

INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(95, 18, 'Quais termos são usados e repetidos por quem te segue?', 'Palavras sagradas da comunidade', 'textarea', null, true, 1),
(96, 18, 'Quais hashtags unem o conteúdo da comunidade?', 'Tags proprietárias da marca', 'textarea', null, true, 2),
(97, 18, 'Algum bordão ou acrônimo que só insiders entendem?', 'Expressões internas exclusivas', 'textarea', null, true, 3),
(98, 18, 'Como garantir que time e clientes usem esse vocabulário?', 'Estratégia de consistência linguística', 'textarea', null, true, 4);

-- =====================================================
-- PERGUNTAS MISSION 19: INVENTÁRIO ATUAL
-- =====================================================

INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(99, 19, 'Quais plataformas de tráfego pago você usa hoje?', 'Google, Meta, LinkedIn, TikTok, etc.', 'multi_select', '["Google Ads", "Meta Ads", "LinkedIn Ads", "TikTok Ads", "YouTube Ads", "Twitter Ads", "Pinterest Ads", "Não uso"]', true, 1),
(100, 19, 'Quais canais de tráfego orgânico você utiliza?', 'SEO, blog, YouTube, podcast, redes sociais', 'multi_select', '["SEO/Blog", "YouTube", "Instagram", "LinkedIn", "TikTok", "Facebook", "Podcast", "Pinterest", "Twitter"]', true, 2),
(101, 19, 'Que tipo de funis de vendas você tem implementados?', 'Funil de aplicação, isca de valor, lançamento', 'multi_select', '["Funil de Aplicação", "Isca de Valor", "Lançamento", "Webinar", "Mini-curso", "Quiz/Diagnóstico", "Não tenho funis"]', true, 3),
(102, 19, 'Você faz prospecção ativa (outbound)?', 'Social selling, cold email, cold call', 'multi_select', '["Social Selling", "Cold Email", "Cold Call", "LinkedIn Outreach", "WhatsApp", "Não faço outbound"]', true, 4),
(103, 19, 'Tem parcerias ou programa de afiliados?', 'Influenciadores, colaborações, network', 'textarea', null, true, 5),
(104, 19, 'Participa de eventos ou cria experiências?', 'Webinars, feiras, meetups, workshops', 'textarea', null, true, 6);

-- =====================================================
-- PERGUNTAS MISSION 20: DIAGNÓSTICO DE PERFORMANCE
-- =====================================================

INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(105, 20, 'Qual o CAC (Custo de Aquisição de Cliente) atual?', 'Valor médio investido para adquirir um cliente', 'textarea', null, true, 1),
(106, 20, 'Qual o CPL (Custo Por Lead) dos seus canais?', 'Investimento médio para gerar um lead qualificado', 'textarea', null, true, 2),
(107, 20, 'Qual o ROI dos seus principais canais?', 'Retorno sobre investimento por canal', 'textarea', null, true, 3),
(108, 20, 'Qual o principal gargalo hoje?', 'Maior limitador: criativo, audiência, oferta, follow-up', 'select', '["Criativos/Conteúdo", "Audiência/Targeting", "Oferta/Produto", "Follow-up/Nutrição", "Budget/Investimento", "Time/Recursos"]', true, 4);

-- =====================================================
-- PERGUNTAS MISSION 21: NOVOS CANAIS
-- =====================================================

INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(109, 21, 'Qual dor do ICP ainda não é endereçada pelos seus conteúdos?', 'Oportunidade de conteúdo não explorada', 'textarea', null, true, 1),
(110, 21, 'Existe canal onde seus concorrentes performam bem e você não está?', 'Gap competitivo em plataformas', 'textarea', null, true, 2),
(111, 21, 'Algum formato emergente alinhado ao seu ICP?', 'TikTok B2B, Shorts, novas plataformas', 'textarea', null, true, 3),
(112, 21, 'Qual parceria estratégica poderia alavancar autoridade?', 'Colaborações que amplificariam seu alcance', 'textarea', null, true, 4);

-- =====================================================
-- PERGUNTAS MISSION 22: ESTRATÉGIA OMNICHANNEL
-- =====================================================

INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(113, 22, 'Qual frase ou promessa aparece em todos os canais?', 'Gancho central unificado', 'textarea', null, true, 1),
(114, 22, 'Qual a oferta padrão em todos os pontos de contato?', 'CTA único: lead magnet, demo, consulta', 'textarea', null, true, 2),
(115, 22, 'Quantas interações são necessárias até conversão?', 'Sequência de toques na jornada', 'select', '["1-2 toques", "3-5 toques", "6-10 toques", "11-15 toques", "Mais de 15 toques"]', true, 3),
(116, 22, 'Como garantir consistência visual em todos os canais?', 'Aplicação de ícones e cores da marca', 'textarea', null, true, 4);

-- =====================================================
-- ATUALIZAR CONTAGENS
-- =====================================================

-- Atualizar contagem de perguntas das missões
UPDATE missions SET total_questions = (
  SELECT COUNT(*) FROM questions WHERE mission_id = missions.id
) WHERE id IN (1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23);

-- Atualizar contagem de missões do capítulo 1 (agora tem 6 missões com a nova)
UPDATE chapters SET total_missions = (
  SELECT COUNT(*) FROM missions WHERE chapter_id = chapters.id
) WHERE id = 1; 