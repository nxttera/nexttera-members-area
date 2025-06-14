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

-- Atualizar contagem de perguntas das missões
UPDATE missions SET total_questions = (
  SELECT COUNT(*) FROM questions WHERE mission_id = missions.id
) WHERE id IN (3, 4, 5, 6, 7, 8); 