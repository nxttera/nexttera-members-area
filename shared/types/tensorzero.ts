export type TensorZeroModelProvider =
  | "openai"
  | "anthropic";

export type TensorZeroModelType =
  | "gpt-4.1"
  | "gpt-4.1-mini"
  | "gpt-4.1-nano"
  | "gpt-4o"
  | "gpt-4o-mini"
  | "o1"
  | "o1-mini"
  | "o3"
  | "o3-mini"
  | "o4-mini"
  | "o4-mini-high"
  | "claude-opus-4"
  | "claude-sonnet-4"
  | "claude-3-7-sonnet";

export type TensorZeroFunctionType =
  | "chat"
  | "json";

export type TensorZeroVariantType = "chat_completion";

export interface TensorZeroModel {
  id: string;
  name: string;
  provider: TensorZeroModelProvider;
  model_type: TensorZeroModelType;
  api_key_field: string;
  max_tokens?: number;
  temperature?: number;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TensorZeroFunction {
  id: string;
  user_id: string;
  name: string;
  type: TensorZeroFunctionType;
  description?: string;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TensorZeroVariant {
  id: string;
  function_id: string;
  name: string;
  type: TensorZeroVariantType;
  model_id: string;
  weight: number;
  system_prompt?: string;
  user_prompt?: string;
  json_schema?: Record<string, any>;
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TensorZeroPromptTemplate {
  id: string;
  variant_id: string;
  name: string;
  template: string;
  variables: string[];
  is_active: boolean;
  created_at: string;
  updated_at?: string;
}

export interface TensorZeroConfig {
  models: Record<string, TensorZeroModel>;
  functions: Record<string, TensorZeroFunction>;
  variants: Record<string, TensorZeroVariant[]>;
}

export interface TensorZeroConfigBuilder {
  buildTomlConfig(): string;
  getConfig(): TensorZeroConfig;
  addModel(model: TensorZeroModel): void;
  addFunction(func: TensorZeroFunction): void;
  addVariant(variant: TensorZeroVariant): void;
}

export interface TensorZeroSaveConfigRequest {
  functions: Array<{
    name: string;
    type: TensorZeroFunctionType;
    description?: string;
  }>;
  variants: Array<{
    function_name: string;
    name: string;
    type: TensorZeroVariantType;
    model_name: string;
    weight?: number;
    system_prompt?: string;
    user_prompt?: string;
    json_schema?: Record<string, any>;
  }>;
  userId: string;
  generateFile?: boolean;
  filePath?: string;
}

export interface TensorZeroSaveConfigResponse {
  success: boolean;
  message: string;
  data: {
    functions: TensorZeroFunction[];
    variants: TensorZeroVariant[];
    tomlContent: string | null;
    filePath: string | null;
  };
}
