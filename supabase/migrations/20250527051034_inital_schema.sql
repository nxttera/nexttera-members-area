DO $$ BEGIN
    CREATE TYPE credential_status_enum AS ENUM ('active', 'inactive', 'error', 'configuring');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END $$;


CREATE TABLE user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NULL,
  company TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  parent_id uuid NULL REFERENCES user_profiles(id)
);

CREATE TABLE user_profiles_roles (
  id uuid REFERENCES user_profiles(id),
  role TEXT NOT NULL,
  CONSTRAINT user_profiles_roles_pkey PRIMARY KEY (id, role)
);

CREATE TABLE user_profiles_permissions (
  id uuid REFERENCES user_profiles(id),
  permission TEXT NOT NULL,
  CONSTRAINT user_profiles_permissions_pkey PRIMARY KEY (id, permission)
);


CREATE TABLE form_field_mappings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL,
  selector TEXT NOT NULL, 
  field_name TEXT NOT NULL, 
  priority INTEGER NOT NULL DEFAULT 1, 
  ignore_patterns TEXT[] NULL, 
  validation_regex TEXT NULL, 
  transform_function TEXT NULL, 
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE TABLE supabase_instances (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL,
  instance_id TEXT NOT NULL, 
  project_ref TEXT NOT NULL, 
  api_url TEXT NOT NULL, 
  anon_key TEXT NOT NULL, 
  service_key TEXT NULL, 
  publishable_key TEXT NULL,
  secret_key TEXT NULL,
  settings JSONB NULL, 
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  CONSTRAINT supabase_instances_instance_id_unique UNIQUE (instance_id)
);

CREATE TABLE user_credentials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL,
  deleted_at TIMESTAMP WITH TIME ZONE NULL,
  expires_at TIMESTAMP WITH TIME ZONE NULL,
  last_sync_at TIMESTAMP WITH TIME ZONE NULL,
  user_id uuid REFERENCES auth.users(id),
  status credential_status_enum NOT NULL DEFAULT 'configuring',
  auth_type TEXT NOT NULL, -- 'oauth2', 'api_key', 'basic', etc.
  callback_url TEXT NULL,
  redirect_url TEXT NULL,
  client_id TEXT NULL,
  client_secret TEXT NULL,
  refresh_token TEXT NULL,
  access_token TEXT NULL,
  token_type TEXT NULL,
  scope TEXT NULL,
  credentials JSONB NOT NULL,
  encrypted_credentials TEXT NULL, -- Versão criptografada quando necessário
  error_message TEXT NULL
);


CREATE TABLE form_ignore_rules (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NULL,
  rule_type TEXT NOT NULL,
  rule_value TEXT NOT NULL, 
  description TEXT NULL, 
  is_active BOOLEAN NOT NULL DEFAULT TRUE
);

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (
    id,
    name,
    email,
    is_active,
    created_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'name', NEW.email),
    NEW.email,
    true,
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile" ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);

ALTER TABLE public.user_profiles_roles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own roles" ON public.user_profiles_roles
  FOR SELECT USING (auth.uid() = id);

ALTER TABLE public.user_profiles_permissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own permissions" ON public.user_profiles_permissions
  FOR SELECT USING (auth.uid() = id);

CREATE INDEX idx_form_field_mappings_selector ON form_field_mappings(selector);
CREATE INDEX idx_form_field_mappings_field_name ON form_field_mappings(field_name);
CREATE INDEX idx_form_field_mappings_is_active ON form_field_mappings(is_active);
CREATE INDEX idx_supabase_instances_instance_id ON supabase_instances(instance_id);
CREATE INDEX idx_supabase_instances_is_active ON supabase_instances(is_active);
CREATE INDEX idx_form_ignore_rules_rule_type ON form_ignore_rules(rule_type);
CREATE INDEX idx_form_ignore_rules_is_active ON form_ignore_rules(is_active); 
