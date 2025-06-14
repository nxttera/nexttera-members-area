-- =====================================================
-- BRAND POSITIONING GAMIFICATION SYSTEM
-- =====================================================

-- Create enums
CREATE TYPE session_status AS ENUM ('draft', 'in_progress', 'completed');
CREATE TYPE question_type AS ENUM ('text', 'textarea', 'select', 'multi_select');

-- =====================================================
-- TABLES
-- =====================================================

-- Chapters (static data)
CREATE TABLE chapters (
  id integer PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  icon text NOT NULL,
  order_number integer NOT NULL UNIQUE,
  total_missions integer NOT NULL DEFAULT 0,
  reward_title text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Missions (static data)
CREATE TABLE missions (
  id integer PRIMARY KEY,
  chapter_id integer NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  order_number integer NOT NULL,
  total_questions integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(chapter_id, order_number)
);

-- Questions (static data)
CREATE TABLE questions (
  id integer PRIMARY KEY,
  mission_id integer NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  text text NOT NULL,
  description text,
  question_type question_type NOT NULL DEFAULT 'textarea',
  options json,
  is_required boolean NOT NULL DEFAULT true,
  order_number integer NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(mission_id, order_number)
);

-- User sessions
CREATE TABLE brand_positioning_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  status session_status NOT NULL DEFAULT 'draft',
  current_chapter integer REFERENCES chapters(id),
  current_mission integer REFERENCES missions(id),
  total_progress integer NOT NULL DEFAULT 0 CHECK (total_progress >= 0 AND total_progress <= 100),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- User answers
CREATE TABLE session_answers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES brand_positioning_sessions(id) ON DELETE CASCADE,
  question_id integer NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
  answer text NOT NULL,
  answered_at timestamptz DEFAULT now(),
  UNIQUE(session_id, question_id)
);

-- Session progress tracking
CREATE TABLE session_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id uuid NOT NULL REFERENCES brand_positioning_sessions(id) ON DELETE CASCADE,
  chapter_id integer NOT NULL REFERENCES chapters(id) ON DELETE CASCADE,
  mission_id integer NOT NULL REFERENCES missions(id) ON DELETE CASCADE,
  is_chapter_completed boolean NOT NULL DEFAULT false,
  is_mission_completed boolean NOT NULL DEFAULT false,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  UNIQUE(session_id, chapter_id, mission_id)
);

-- =====================================================
-- INDEXES
-- =====================================================

CREATE INDEX idx_sessions_user_id ON brand_positioning_sessions(user_id);
CREATE INDEX idx_sessions_status ON brand_positioning_sessions(status);
CREATE INDEX idx_answers_session_id ON session_answers(session_id);
CREATE INDEX idx_answers_question_id ON session_answers(question_id);
CREATE INDEX idx_progress_session_id ON session_progress(session_id);
CREATE INDEX idx_progress_chapter_id ON session_progress(chapter_id);
CREATE INDEX idx_missions_chapter_id ON missions(chapter_id);
CREATE INDEX idx_questions_mission_id ON questions(mission_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Update updated_at on sessions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_sessions_updated_at 
  BEFORE UPDATE ON brand_positioning_sessions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE brand_positioning_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_answers ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_progress ENABLE ROW LEVEL SECURITY;

-- Policy for sessions: only master users can access their own sessions
CREATE POLICY "Users can only access their own sessions and must be master" 
ON brand_positioning_sessions 
FOR ALL 
USING (
  auth.uid() = user_id 
  AND EXISTS (
    SELECT 1 FROM auth.users 
    WHERE id = auth.uid() 
    AND raw_user_meta_data->>'parent_id' IS NULL
  )
);

-- Policy for answers: only owners can access
CREATE POLICY "Users can only access answers from their own sessions" 
ON session_answers 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM brand_positioning_sessions 
    WHERE id = session_answers.session_id 
    AND user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'parent_id' IS NULL
    )
  )
);

-- Policy for progress: only owners can access
CREATE POLICY "Users can only access progress from their own sessions" 
ON session_progress 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM brand_positioning_sessions 
    WHERE id = session_progress.session_id 
    AND user_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM auth.users 
      WHERE id = auth.uid() 
      AND raw_user_meta_data->>'parent_id' IS NULL
    )
  )
);

-- =====================================================
-- SEED DATA - CHAPTERS
-- =====================================================

INSERT INTO chapters (id, title, description, icon, order_number, total_missions, reward_title) VALUES
(1, 'História & Credo', 'Descubra as origens e crenças fundamentais da sua marca', '📖', 1, 5, 'Guardião da História'),
(2, 'Proposta de Valor', 'Defina ofertas, ganhos e dores que sua marca resolve', '💎', 2, 3, 'Mestre do Valor'),
(3, 'Cliente Ideal', 'Mapeie profundamente seu ICP e anti-personas', '🎯', 3, 4, 'Caçador de Personas'),
(4, 'Batalha Competitiva', 'Analise concorrentes e posicionamento único', '⚔️', 4, 3, 'Estrategista de Guerra'),
(5, 'Elementos de Marca', 'Crie ícones, rituais e léxicos da sua marca', '🏛️', 5, 3, 'Arquiteto da Marca'),
(6, 'Canais de Demanda', 'Estruture canais e táticas de geração de demanda', '🚀', 6, 4, 'Maestro da Demanda');

-- =====================================================
-- SEED DATA - MISSIONS
-- =====================================================

-- Chapter 1: História & Credo
INSERT INTO missions (id, chapter_id, title, description, order_number, total_questions) VALUES
(1, 1, 'Origens', 'História de origem, situação inicial e motivações', 1, 6),
(2, 1, 'O Grande Desafio', 'Obstáculos enfrentados e epifanias transformadoras', 2, 4),
(3, 1, 'Plano e Batalhas', 'Estratégias executadas e conflitos superados', 3, 4),
(4, 1, 'Conquista e Transformação', 'Resultados alcançados e lições aprendidas', 4, 4),
(5, 1, 'Crenças Revolucionárias', 'Princípios únicos e revoltas contra o status quo', 5, 6);

-- Chapter 2: Proposta de Valor  
INSERT INTO missions (id, chapter_id, title, description, order_number, total_questions) VALUES
(6, 2, 'Portfólio de Ofertas', 'Mapeamento completo de produtos e serviços', 1, 5),
(7, 2, 'Ganhos Transformadores', 'Benefícios tangíveis e emocionais entregues', 2, 5),
(8, 2, 'Dores Resolvidas', 'Problemas críticos que sua marca elimina', 3, 5);

-- Chapter 3: Cliente Ideal
INSERT INTO missions (id, chapter_id, title, description, order_number, total_questions) VALUES
(9, 3, 'Perfil Demográfico', 'Características básicas e localização do ICP', 1, 7),
(10, 3, 'Dores e Desejos Profundos', 'Motivações emocionais e racionais', 2, 6),
(11, 3, 'Comportamento de Compra', 'Critérios de decisão e jornada de aquisição', 3, 6),
(12, 3, 'Anti-Persona', 'Perfil de quem você não quer atrair', 4, 4);

-- Chapter 4: Batalha Competitiva
INSERT INTO missions (id, chapter_id, title, description, order_number, total_questions) VALUES
(13, 4, 'Mapa Competitivo', 'Concorrentes diretos, indiretos e alternativas', 1, 4),
(14, 4, 'Diferenciais Únicos', 'Vantagens competitivas e provas tangíveis', 2, 4),
(15, 4, 'Argumento de Escolha', 'Por que escolher sua marca vs. concorrentes', 3, 4);

-- Chapter 5: Elementos de Marca
INSERT INTO missions (id, chapter_id, title, description, order_number, total_questions) VALUES
(16, 5, 'Ícones Visuais', 'Símbolos, cores e formas que identificam a marca', 1, 4),
(17, 5, 'Rituais e Experiências', 'Ações recorrentes que criam senso de pertencimento', 2, 4),
(18, 5, 'Léxico da Marca', 'Vocabulário único e expressões proprietárias', 3, 4);

-- Chapter 6: Canais de Demanda
INSERT INTO missions (id, chapter_id, title, description, order_number, total_questions) VALUES
(19, 6, 'Inventário Atual', 'Canais em uso e performance atual', 1, 6),
(20, 6, 'Diagnóstico de Performance', 'Métricas, gargalos e oportunidades', 2, 4),
(21, 6, 'Novos Canais', 'Canais potenciais para teste e expansão', 3, 4),
(22, 6, 'Estratégia Omnichannel', 'Mensagem unificada e priorização de budget', 4, 4);

-- =====================================================
-- SEED DATA - QUESTIONS (Sample from each mission)
-- =====================================================

-- Mission 1: Origens
INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(1, 1, 'Qual era a situação antes de você iniciar sua jornada?', 'Descreva as circunstâncias do seu dia a dia antes de empreender', 'textarea', null, true, 1),
(2, 1, 'Quem são as pessoas mais importantes na sua história?', 'Família, mentores, parceiros que influenciaram sua jornada', 'textarea', null, true, 2),
(3, 1, 'Que crenças ou valores moldavam suas decisões naquele momento?', 'Princípios que guiavam suas escolhas antes do negócio', 'textarea', null, true, 3),
(4, 1, 'Que resultado concreto você buscava alcançar?', 'Meta objetiva, tangível que você perseguia', 'textarea', null, true, 4),
(5, 1, 'Que sentimento você desejava transformar em si mesmo?', 'Medo, insegurança, frustração que queria superar', 'textarea', null, true, 5),
(6, 1, 'Qual é o seu tipo de negócio principal?', 'Selecione a categoria que melhor descreve sua oferta', 'select', '["Produto físico", "Serviço digital", "SaaS/Software", "Consultoria", "E-commerce", "Infoproduto", "Agência", "Marketplace"]', true, 6);

-- Mission 2: O Grande Desafio  
INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(7, 2, 'Qual foi o momento exato em que tudo "travou"?', 'Descreva o evento específico que forçou uma mudança', 'textarea', null, true, 1),
(8, 2, 'Que recursos ou condições faltavam para você avançar?', 'Tempo, dinheiro, conhecimento, network - o que estava em falta', 'textarea', null, true, 2),
(9, 2, 'O que você leu, ouviu ou experimentou que mudou sua percepção?', 'Livro, conversa, curso que trouxe o insight decisivo', 'textarea', null, true, 3),
(10, 2, 'Quais foram os primeiros sinais de que essa nova direção poderia funcionar?', 'Resultados iniciais que validaram a mudança', 'textarea', null, true, 4);

-- Mission 9: Perfil Demográfico (Chapter 3)
INSERT INTO questions (id, mission_id, text, description, question_type, options, is_required, order_number) VALUES
(11, 9, 'Qual a faixa etária predominante do seu cliente ideal?', 'Idade aproximada da maioria dos seus melhores clientes', 'select', '["18-25 anos", "26-35 anos", "36-45 anos", "46-55 anos", "56-65 anos", "65+ anos"]', true, 1),
(12, 9, 'Em que região geográfica seus clientes se concentram?', 'Localização principal do seu mercado', 'select', '["Todo Brasil", "Sudeste", "Sul", "Nordeste", "Norte", "Centro-Oeste", "Internacional"]', true, 2),
(13, 9, 'Qual a ocupação/cargo típico do seu cliente ideal?', 'Função profissional mais comum', 'textarea', null, true, 3),
(14, 9, 'Qual a faixa de renda ou orçamento mensal?', 'Poder de compra aproximado', 'select', '["Até R$ 3k", "R$ 3k-8k", "R$ 8k-15k", "R$ 15k-30k", "R$ 30k-50k", "R$ 50k+"]', true, 4),
(15, 9, 'Quais canais digitais seu cliente mais utiliza?', 'Redes sociais e plataformas onde ele está presente', 'multi_select', '["Instagram", "Facebook", "LinkedIn", "YouTube", "TikTok", "Twitter/X", "WhatsApp", "Telegram", "Email", "Google"]', true, 5);

-- Update mission question counts
UPDATE missions SET total_questions = (
  SELECT COUNT(*) FROM questions WHERE mission_id = missions.id
);

-- Update chapter mission counts  
UPDATE chapters SET total_missions = (
  SELECT COUNT(*) FROM missions WHERE chapter_id = chapters.id
);

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Function to calculate session progress
CREATE OR REPLACE FUNCTION calculate_session_progress(session_uuid uuid)
RETURNS integer AS $$
DECLARE
  total_questions integer;
  answered_questions integer;
  progress integer;
BEGIN
  -- Get total questions across all missions
  SELECT COUNT(*) INTO total_questions
  FROM questions q
  JOIN missions m ON q.mission_id = m.id
  JOIN chapters c ON m.chapter_id = c.id;
  
  -- Get answered questions for this session
  SELECT COUNT(*) INTO answered_questions
  FROM session_answers sa
  WHERE sa.session_id = session_uuid;
  
  -- Calculate progress percentage
  IF total_questions > 0 THEN
    progress := ROUND((answered_questions::float / total_questions::float) * 100);
  ELSE
    progress := 0;
  END IF;
  
  -- Update session progress
  UPDATE brand_positioning_sessions 
  SET total_progress = progress,
      updated_at = now()
  WHERE id = session_uuid;
  
  RETURN progress;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update progress when answers are inserted/updated/deleted
CREATE OR REPLACE FUNCTION trigger_update_session_progress()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM calculate_session_progress(OLD.session_id);
    RETURN OLD;
  ELSE
    PERFORM calculate_session_progress(NEW.session_id);
    RETURN NEW;
  END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_progress_on_answer_change
  AFTER INSERT OR UPDATE OR DELETE ON session_answers
  FOR EACH ROW EXECUTE FUNCTION trigger_update_session_progress();
