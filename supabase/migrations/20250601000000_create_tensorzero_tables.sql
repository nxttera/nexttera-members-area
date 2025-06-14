CREATE TYPE tensorzero_model_provider AS ENUM (
  'openai',
  'anthropic'
);

CREATE TYPE tensorzero_model_type AS ENUM (
  'gpt-4.1',
  'gpt-4.1-mini',
  'gpt-4.1-nano',
  'gpt-4o',
  'gpt-4o-mini',
  'o1',
  'o1-mini',
  'o3',
  'o3-mini',
  'o4-mini',
  'o4-mini-high',
  'claude-opus-4',
  'claude-sonnet-4',
  'claude-3-7-sonnet'
);

CREATE TYPE tensorzero_function_type AS ENUM (
  'chat',
  'json'
);

CREATE TYPE tensorzero_variant_type AS ENUM (
  'chat_completion',
  'experimental_best_of_n',
  'experimental_chain_of_thought',
  'experimental_dynamic_in_context_learning',
  'experimental_mixture_of_n'
);

CREATE TABLE tensorzero_models (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL,
  name TEXT NOT NULL UNIQUE,
  provider tensorzero_model_provider NOT NULL,
  model_type tensorzero_model_type NOT NULL,
  api_key_field TEXT NOT NULL,
  max_tokens INTEGER NULL,
  temperature REAL NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE tensorzero_functions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL,
  user_id uuid NOT NULL REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type tensorzero_function_type NOT NULL,
  description TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(user_id, name)
);

CREATE TABLE tensorzero_variants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL,
  function_id uuid NOT NULL REFERENCES tensorzero_functions(id) ON DELETE CASCADE,
  model_id uuid NOT NULL REFERENCES tensorzero_models(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type tensorzero_variant_type NOT NULL,
  weight INTEGER NOT NULL DEFAULT 1,
  system_prompt TEXT NULL,
  user_prompt TEXT NULL,
  json_schema JSONB NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE(function_id, name)
);

CREATE TABLE tensorzero_prompt_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL,
  variant_id uuid NOT NULL REFERENCES tensorzero_variants(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  template TEXT NOT NULL,
  variables TEXT[] NOT NULL DEFAULT '{}',
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE INDEX idx_tensorzero_models_provider ON tensorzero_models(provider);
CREATE INDEX idx_tensorzero_models_is_active ON tensorzero_models(is_active);
CREATE INDEX idx_tensorzero_functions_user_id ON tensorzero_functions(user_id);
CREATE INDEX idx_tensorzero_functions_type ON tensorzero_functions(type);
CREATE INDEX idx_tensorzero_functions_is_active ON tensorzero_functions(is_active);
CREATE INDEX idx_tensorzero_variants_function_id ON tensorzero_variants(function_id);
CREATE INDEX idx_tensorzero_variants_model_id ON tensorzero_variants(model_id);
CREATE INDEX idx_tensorzero_variants_is_active ON tensorzero_variants(is_active);
CREATE INDEX idx_tensorzero_prompt_templates_variant_id ON tensorzero_prompt_templates(variant_id);

INSERT INTO tensorzero_models (name, provider, model_type, api_key_field, max_tokens, temperature) VALUES
-- OpenAI Models (2025 - mais recentes)
('gpt-4.1', 'openai', 'gpt-4.1', 'openai_api_key', 1047576, 0.7),
('gpt-4.1-mini', 'openai', 'gpt-4.1-mini', 'openai_api_key', 1047576, 0.7),
('gpt-4.1-nano', 'openai', 'gpt-4.1-nano', 'openai_api_key', 1047576, 0.8),
('gpt-4o', 'openai', 'gpt-4o', 'openai_api_key', 128000, 0.7),
('gpt-4o-mini', 'openai', 'gpt-4o-mini', 'openai_api_key', 128000, 0.7),
('o1', 'openai', 'o1', 'openai_api_key', 200000, 1.0),
('o1-mini', 'openai', 'o1-mini', 'openai_api_key', 128000, 1.0),
('o3', 'openai', 'o3', 'openai_api_key', 200000, 1.0),
('o3-mini', 'openai', 'o3-mini', 'openai_api_key', 200000, 1.0),
('o4-mini', 'openai', 'o4-mini', 'openai_api_key', 200000, 1.0),
('o4-mini-high', 'openai', 'o4-mini-high', 'openai_api_key', 200000, 1.0),

-- Anthropic Models (2025 - mais recentes)
('claude-opus-4', 'anthropic', 'claude-opus-4', 'anthropic_api_key', 200000, 0.7),
('claude-sonnet-4', 'anthropic', 'claude-sonnet-4', 'anthropic_api_key', 200000, 0.7),
('claude-3-7-sonnet', 'anthropic', 'claude-3-7-sonnet', 'anthropic_api_key', 200000, 0.7);

-- Functions e variants serão criadas pelos usuários através da API 