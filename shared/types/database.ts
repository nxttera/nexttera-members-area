export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      chat_feedback: {
        Row: {
          comment: string | null
          created_at: string
          id: string
          message_id: string
          rating: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          id?: string
          message_id: string
          rating?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          id?: string
          message_id?: string
          rating?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_feedback_message_id_fkey"
            columns: ["message_id"]
            isOneToOne: false
            referencedRelation: "chat_messages"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          metadata: Json | null
          session_id: string
          type: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          metadata?: Json | null
          session_id: string
          type: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          session_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_sessions: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          last_message_at: string
          title: string
          tool_id: Database["public"]["Enums"]["ai_tool_enum"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_message_at?: string
          title: string
          tool_id: Database["public"]["Enums"]["ai_tool_enum"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          last_message_at?: string
          title?: string
          tool_id?: Database["public"]["Enums"]["ai_tool_enum"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      form_field_mappings: {
        Row: {
          created_at: string
          field_name: string
          id: number
          ignore_patterns: string[] | null
          is_active: boolean
          priority: number
          selector: string
          transform_function: string | null
          updated_at: string | null
          validation_regex: string | null
        }
        Insert: {
          created_at?: string
          field_name: string
          id?: number
          ignore_patterns?: string[] | null
          is_active?: boolean
          priority?: number
          selector: string
          transform_function?: string | null
          updated_at?: string | null
          validation_regex?: string | null
        }
        Update: {
          created_at?: string
          field_name?: string
          id?: number
          ignore_patterns?: string[] | null
          is_active?: boolean
          priority?: number
          selector?: string
          transform_function?: string | null
          updated_at?: string | null
          validation_regex?: string | null
        }
        Relationships: []
      }
      form_ignore_rules: {
        Row: {
          created_at: string
          description: string | null
          id: number
          is_active: boolean
          rule_type: string
          rule_value: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          rule_type: string
          rule_value: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
          is_active?: boolean
          rule_type?: string
          rule_value?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      supabase_instances: {
        Row: {
          anon_key: string
          api_url: string
          created_at: string
          id: number
          instance_id: string
          is_active: boolean
          project_ref: string
          service_key: string | null
          settings: Json | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          anon_key: string
          api_url: string
          created_at?: string
          id?: number
          instance_id: string
          is_active?: boolean
          project_ref: string
          service_key?: string | null
          settings?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          anon_key?: string
          api_url?: string
          created_at?: string
          id?: number
          instance_id?: string
          is_active?: boolean
          project_ref?: string
          service_key?: string | null
          settings?: Json | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      tensorzero_functions: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_active: boolean
          name: string
          type: Database["public"]["Enums"]["tensorzero_function_type"]
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name: string
          type: Database["public"]["Enums"]["tensorzero_function_type"]
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_active?: boolean
          name?: string
          type?: Database["public"]["Enums"]["tensorzero_function_type"]
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tensorzero_functions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      tensorzero_models: {
        Row: {
          api_key_field: string
          created_at: string
          id: string
          is_active: boolean
          max_tokens: number | null
          model_type: Database["public"]["Enums"]["tensorzero_model_type"]
          name: string
          provider: Database["public"]["Enums"]["tensorzero_model_provider"]
          temperature: number | null
          updated_at: string | null
        }
        Insert: {
          api_key_field: string
          created_at?: string
          id?: string
          is_active?: boolean
          max_tokens?: number | null
          model_type: Database["public"]["Enums"]["tensorzero_model_type"]
          name: string
          provider: Database["public"]["Enums"]["tensorzero_model_provider"]
          temperature?: number | null
          updated_at?: string | null
        }
        Update: {
          api_key_field?: string
          created_at?: string
          id?: string
          is_active?: boolean
          max_tokens?: number | null
          model_type?: Database["public"]["Enums"]["tensorzero_model_type"]
          name?: string
          provider?: Database["public"]["Enums"]["tensorzero_model_provider"]
          temperature?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      tensorzero_prompt_templates: {
        Row: {
          created_at: string
          id: string
          is_active: boolean
          name: string
          template: string
          updated_at: string | null
          variables: string[]
          variant_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_active?: boolean
          name: string
          template: string
          updated_at?: string | null
          variables?: string[]
          variant_id: string
        }
        Update: {
          created_at?: string
          id?: string
          is_active?: boolean
          name?: string
          template?: string
          updated_at?: string | null
          variables?: string[]
          variant_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tensorzero_prompt_templates_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "tensorzero_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      tensorzero_variants: {
        Row: {
          created_at: string
          function_id: string
          id: string
          is_active: boolean
          json_schema: Json | null
          model_id: string
          name: string
          system_prompt: string | null
          type: Database["public"]["Enums"]["tensorzero_variant_type"]
          updated_at: string | null
          user_prompt: string | null
          weight: number
        }
        Insert: {
          created_at?: string
          function_id: string
          id?: string
          is_active?: boolean
          json_schema?: Json | null
          model_id: string
          name: string
          system_prompt?: string | null
          type: Database["public"]["Enums"]["tensorzero_variant_type"]
          updated_at?: string | null
          user_prompt?: string | null
          weight?: number
        }
        Update: {
          created_at?: string
          function_id?: string
          id?: string
          is_active?: boolean
          json_schema?: Json | null
          model_id?: string
          name?: string
          system_prompt?: string | null
          type?: Database["public"]["Enums"]["tensorzero_variant_type"]
          updated_at?: string | null
          user_prompt?: string | null
          weight?: number
        }
        Relationships: [
          {
            foreignKeyName: "tensorzero_variants_function_id_fkey"
            columns: ["function_id"]
            isOneToOne: false
            referencedRelation: "tensorzero_functions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tensorzero_variants_model_id_fkey"
            columns: ["model_id"]
            isOneToOne: false
            referencedRelation: "tensorzero_models"
            referencedColumns: ["id"]
          },
        ]
      }
      user_credentials: {
        Row: {
          anthropic_api_key: string | null
          created_at: string
          deepseek_api_key: string | null
          google_api_key: string | null
          id: string
          openai_api_key: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          anthropic_api_key?: string | null
          created_at?: string
          deepseek_api_key?: string | null
          google_api_key?: string | null
          id?: string
          openai_api_key?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          anthropic_api_key?: string | null
          created_at?: string
          deepseek_api_key?: string | null
          google_api_key?: string | null
          id?: string
          openai_api_key?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          company: string | null
          created_at: string
          email: string
          id: string
          is_active: boolean
          name: string
          parent_id: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          company?: string | null
          created_at?: string
          email: string
          id: string
          is_active?: boolean
          name: string
          parent_id?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          company?: string | null
          created_at?: string
          email?: string
          id?: string
          is_active?: boolean
          name?: string
          parent_id?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles_permissions: {
        Row: {
          id: string
          permission: string
        }
        Insert: {
          id: string
          permission: string
        }
        Update: {
          id?: string
          permission?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_permissions_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles_roles: {
        Row: {
          id: string
          role: string
        }
        Insert: {
          id: string
          role: string
        }
        Update: {
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_profiles_roles_id_fkey"
            columns: ["id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      ai_tool_enum:
        | "copywriter"
        | "seo"
        | "social_media"
        | "content_creator"
        | "marketing"
        | "sales"
        | "customer_support"
        | "product_management"
        | "project_management"
        | "design"
        | "development"
        | "other"
      tensorzero_function_type: "chat" | "json"
      tensorzero_model_provider: "openai" | "anthropic"
      tensorzero_model_type:
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
        | "claude-3-7-sonnet"
      tensorzero_variant_type:
        | "chat_completion"
        | "experimental_best_of_n"
        | "experimental_chain_of_thought"
        | "experimental_dynamic_in_context_learning"
        | "experimental_mixture_of_n"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      ai_tool_enum: [
        "copywriter",
        "seo",
        "social_media",
        "content_creator",
        "marketing",
        "sales",
        "customer_support",
        "product_management",
        "project_management",
        "design",
        "development",
        "other",
      ],
      tensorzero_function_type: ["chat", "json"],
      tensorzero_model_provider: ["openai", "anthropic"],
      tensorzero_model_type: [
        "gpt-4.1",
        "gpt-4.1-mini",
        "gpt-4.1-nano",
        "gpt-4o",
        "gpt-4o-mini",
        "o1",
        "o1-mini",
        "o3",
        "o3-mini",
        "o4-mini",
        "o4-mini-high",
        "claude-opus-4",
        "claude-sonnet-4",
        "claude-3-7-sonnet",
      ],
      tensorzero_variant_type: [
        "chat_completion",
        "experimental_best_of_n",
        "experimental_chain_of_thought",
        "experimental_dynamic_in_context_learning",
        "experimental_mixture_of_n",
      ],
    },
  },
} as const

