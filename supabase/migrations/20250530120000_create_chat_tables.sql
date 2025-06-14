DO $$ BEGIN
    CREATE TYPE ai_tool_enum AS ENUM ('copywriter', 'seo', 'social_media', 'content_creator', 'marketing', 'sales', 'customer_support', 'product_management', 'project_management', 'design', 'development', 'other');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS user_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  openai_api_key TEXT DEFAULT NULL,
  anthropic_api_key TEXT DEFAULT NULL,
  google_api_key TEXT DEFAULT NULL,
  deepseek_api_key TEXT DEFAULT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  tool_id ai_tool_enum NOT NULL,
  title TEXT NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_message_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('user', 'bot', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS chat_feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID NOT NULL REFERENCES chat_messages(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(message_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_chat_sessions_user_id ON chat_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_tool_id ON chat_sessions(tool_id);
CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_feedback_message_id ON chat_feedback(message_id);

-- ALTER TABLE user_credentials ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE chat_sessions ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE chat_feedback ENABLE ROW LEVEL SECURITY;

-- CREATE POLICY "Usuários podem ver apenas suas próprias credenciais" 
--   ON user_credentials FOR SELECT 
--   USING (auth.uid() = user_id);

-- CREATE POLICY "Usuários podem ver apenas suas próprias sessões de chat" 
--   ON chat_sessions FOR SELECT 
--   USING (auth.uid() = user_id);

-- CREATE POLICY "Usuários podem ver apenas mensagens de suas sessões" 
--   ON chat_messages FOR SELECT 
--   USING (
--     session_id IN (
--       SELECT id FROM chat_sessions WHERE user_id = auth.uid()
--     )
--   );

-- CREATE POLICY "Usuários podem ver apenas seu próprio feedback" 
--   ON chat_feedback FOR SELECT 
--   USING (auth.uid() = user_id); 

  