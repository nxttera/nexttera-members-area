import type {
  TensorZeroConfig,
  TensorZeroFunction,
  TensorZeroModel,
  TensorZeroSaveConfigRequest,
  TensorZeroSaveConfigResponse,
  TensorZeroVariant,
} from "~/shared/types/tensorzero";

export const useTensorZero = () => {
  const models = ref<TensorZeroModel[]>([]);
  const functions = ref<TensorZeroFunction[]>([]);
  const variants = ref<TensorZeroVariant[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const loadModels = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const data = await $fetch<TensorZeroModel[]>("/api/tensorzero/models");
      models.value = data;
    } catch (err: any) {
      error.value = err.message || "Erro ao carregar modelos";
      loggerError("Erro ao carregar modelos TensorZero", err);
    } finally {
      isLoading.value = false;
    }
  };

  const loadFunctions = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const data = await $fetch<TensorZeroFunction[]>(
        "/api/tensorzero/functions",
      );
      functions.value = data;
    } catch (err: any) {
      error.value = err.message || "Erro ao carregar funções";
      loggerError("Erro ao carregar funções TensorZero", err);
    } finally {
      isLoading.value = false;
    }
  };

  const loadVariants = async (functionId?: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      const url = functionId
        ? `/api/tensorzero/variants?functionId=${functionId}`
        : "/api/tensorzero/variants";

      const data = await $fetch<TensorZeroVariant[]>(url);
      variants.value = data;
    } catch (err: any) {
      error.value = err.message || "Erro ao carregar variants";
      loggerError("Erro ao carregar variants TensorZero", err);
    } finally {
      isLoading.value = false;
    }
  };

  const createModel = async (
    modelData: Omit<TensorZeroModel, "id" | "created_at">,
  ) => {
    try {
      isLoading.value = true;
      error.value = null;

      const newModel = await $fetch<TensorZeroModel>("/api/tensorzero/models", {
        method: "POST",
        body: modelData,
      });

      models.value.unshift(newModel);
      return newModel;
    } catch (err: any) {
      error.value = err.message || "Erro ao criar modelo";
      loggerError("Erro ao criar modelo TensorZero", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const createFunction = async (
    functionData: Omit<TensorZeroFunction, "id" | "created_at">,
  ) => {
    try {
      isLoading.value = true;
      error.value = null;

      const newFunction = await $fetch<TensorZeroFunction>(
        "/api/tensorzero/functions",
        {
          method: "POST",
          body: functionData,
        },
      );

      functions.value.unshift(newFunction);
      return newFunction;
    } catch (err: any) {
      error.value = err.message || "Erro ao criar função";
      loggerError("Erro ao criar função TensorZero", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const createVariant = async (
    variantData: Omit<TensorZeroVariant, "id" | "created_at">,
  ) => {
    try {
      isLoading.value = true;
      error.value = null;

      const newVariant = await $fetch<TensorZeroVariant>(
        "/api/tensorzero/variants",
        {
          method: "POST",
          body: variantData,
        },
      );

      variants.value.unshift(newVariant);
      return newVariant;
    } catch (err: any) {
      error.value = err.message || "Erro ao criar variant";
      loggerError("Erro ao criar variant TensorZero", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const generateConfig = async () => {
    try {
      isLoading.value = true;
      error.value = null;

      const config = await $fetch<{ config: string }>(
        "/api/tensorzero/config/generate",
      );
      return config.config;
    } catch (err: any) {
      error.value = err.message || "Erro ao gerar configuração";
      loggerError("Erro ao gerar configuração TensorZero", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const saveConfig = async (config: string, filePath?: string) => {
    try {
      isLoading.value = true;
      error.value = null;

      await $fetch("/api/tensorzero/config", {
        method: "POST",
        body: {
          content: config,
          filePath,
        },
      });

      loggerInfo("Configuração TensorZero salva com sucesso");
    } catch (err: any) {
      error.value = err.message || "Erro ao salvar configuração";
      loggerError("Erro ao salvar configuração TensorZero", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const saveConfigToDatabase = async (
    configData: TensorZeroSaveConfigRequest,
  ) => {
    try {
      isLoading.value = true;
      error.value = null;

      const result = await $fetch<TensorZeroSaveConfigResponse>(
        "/api/tensorzero/config/save",
        {
          method: "POST",
          body: configData,
        },
      );

      if (result.data?.functions) {
        functions.value.unshift(...result.data.functions);
      }

      if (result.data?.variants) {
        variants.value.unshift(...result.data.variants);
      }

      loggerInfo("Configuração TensorZero salva no banco com sucesso");
      return result;
    } catch (err: any) {
      error.value = err.message || "Erro ao salvar configuração no banco";
      loggerError("Erro ao salvar configuração TensorZero no banco", err);
      throw err;
    } finally {
      isLoading.value = false;
    }
  };

  const activeModels = computed(() =>
    models.value.filter((model) => model.is_active)
  );

  const activeFunctions = computed(() =>
    functions.value.filter((func) => func.is_active)
  );

  const activeVariants = computed(() =>
    variants.value.filter((variant) => variant.is_active)
  );

  const getModelById = (id: string) =>
    models.value.find((model) => model.id === id);

  const getFunctionById = (id: string) =>
    functions.value.find((func) => func.id === id);

  const getVariantsByFunction = (functionId: string) =>
    variants.value.filter((variant) => variant.function_id === functionId);

  return {
    models: readonly(models),
    functions: readonly(functions),
    variants: readonly(variants),
    isLoading: readonly(isLoading),
    error: readonly(error),
    activeModels,
    activeFunctions,
    activeVariants,
    loadModels,
    loadFunctions,
    loadVariants,
    createModel,
    createFunction,
    createVariant,
    generateConfig,
    saveConfig,
    saveConfigToDatabase,
    getModelById,
    getFunctionById,
    getVariantsByFunction,
  };
};
