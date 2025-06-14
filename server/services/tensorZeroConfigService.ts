import type {
  TensorZeroConfig,
  TensorZeroConfigBuilder,
  TensorZeroFunction,
  TensorZeroModel,
  TensorZeroVariant,
} from "~/shared/types/tensorzero";

export class TensorZeroConfigService implements TensorZeroConfigBuilder {
  private models = new Map<string, TensorZeroModel>();
  private functions = new Map<string, TensorZeroFunction>();
  private variants = new Map<string, TensorZeroVariant[]>();

  constructor(private supabase: any) {}

  async loadFromDatabase(): Promise<void> {
    await Promise.all([
      this.loadModels(),
      this.loadFunctions(),
      this.loadVariants(),
    ]);
  }

  private async loadModels(): Promise<void> {
    const { data: models } = await this.supabase
      .from("tensorzero_models")
      .select("*")
      .eq("is_active", true);

    if (models) {
      models.forEach((model: TensorZeroModel) => {
        this.models.set(model.name, model);
      });
    }
  }

  private async loadFunctions(): Promise<void> {
    const { data: functions } = await this.supabase
      .from("tensorzero_functions")
      .select("*")
      .eq("is_active", true);

    if (functions) {
      functions.forEach((func: TensorZeroFunction) => {
        this.functions.set(func.name, func);
      });
    }
  }

  private async loadVariants(): Promise<void> {
    const { data: variants } = await this.supabase
      .from("tensorzero_variants")
      .select(`
        *,
        tensorzero_models!inner(name, provider, model_type),
        tensorzero_functions!inner(name)
      `)
      .eq("is_active", true);

    if (variants) {
      variants.forEach((variant: any) => {
        const functionName = variant.tensorzero_functions.name;
        const existing = this.variants.get(functionName) || [];
        existing.push({
          ...variant,
          model_name: variant.tensorzero_models.name,
          model_provider: variant.tensorzero_models.provider,
          model_type: variant.tensorzero_models.model_type,
        });
        this.variants.set(functionName, existing);
      });
    }
  }

  addModel(model: TensorZeroModel): void {
    this.models.set(model.name, model);
  }

  addFunction(func: TensorZeroFunction): void {
    this.functions.set(func.name, func);
  }

  addVariant(variant: TensorZeroVariant): void {
    const functionName = this.getFunctionNameById(variant.function_id);
    if (functionName) {
      const existing = this.variants.get(functionName) || [];
      existing.push(variant);
      this.variants.set(functionName, existing);
    }
  }

  private getFunctionNameById(functionId: string): string | null {
    for (const [name, func] of this.functions.entries()) {
      if (func.id === functionId) {
        return name;
      }
    }
    return null;
  }

  getConfig(): TensorZeroConfig {
    return {
      models: Object.fromEntries(this.models),
      functions: Object.fromEntries(this.functions),
      variants: Object.fromEntries(this.variants),
    };
  }

  buildTomlConfig(): string {
    let toml = "";

    for (const [name, func] of this.functions.entries()) {
      toml += `[functions.${name}]\n`;
      toml += `type = "${func.type}"\n\n`;

      const functionVariants = this.variants.get(name) || [];
      for (const variant of functionVariants) {
        const model = this.models.get(variant.model_id);
        if (!model) continue;

        toml += `[functions.${name}.variants.${variant.name}]\n`;
        toml += `type = "${variant.type}"\n`;
        toml += `model = "${model.provider}::${model.model_type}"\n`;
        toml += `weight = ${variant.weight}\n`;

        if (variant.system_prompt) {
          toml += `system_template = "${
            this.escapeTomlString(variant.system_prompt)
          }"\n`;
        }

        if (variant.user_prompt) {
          toml += `user_template = "${
            this.escapeTomlString(variant.user_prompt)
          }"\n`;
        }

        if (variant.json_schema) {
          toml += `json_schema = ${JSON.stringify(variant.json_schema)}\n`;
        }

        toml += "\n";
      }
    }

    return toml;
  }

  private escapeTomlString(str: string): string {
    return str
      .replace(/\\/g, "\\\\")
      .replace(/"/g, '\\"')
      .replace(/\n/g, "\\n")
      .replace(/\r/g, "\\r");
  }

  async saveTomlFile(
    filePath: string = "tensorzero/tensorzero.toml",
  ): Promise<void> {
    const tomlContent = this.buildTomlConfig();
    await $fetch("/api/tensorzero/config", {
      method: "POST",
      body: {
        content: tomlContent,
        filePath,
      },
    });
  }

  async createModel(
    modelData: Omit<TensorZeroModel, "id" | "created_at">,
  ): Promise<TensorZeroModel> {
    const { data, error } = await this.supabase
      .from("tensorzero_models")
      .insert([{
        ...modelData,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;

    this.addModel(data);
    return data;
  }

  async createFunction(
    functionData: Omit<TensorZeroFunction, "id" | "created_at">,
  ): Promise<TensorZeroFunction> {
    const { data, error } = await this.supabase
      .from("tensorzero_functions")
      .insert([{
        ...functionData,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;

    this.addFunction(data);
    return data;
  }

  async createVariant(
    variantData: Omit<TensorZeroVariant, "id" | "created_at">,
  ): Promise<TensorZeroVariant> {
    const { data, error } = await this.supabase
      .from("tensorzero_variants")
      .insert([{
        ...variantData,
        created_at: new Date().toISOString(),
      }])
      .select()
      .single();

    if (error) throw error;

    this.addVariant(data);
    return data;
  }
}
