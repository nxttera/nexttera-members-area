import { writeFile } from "fs/promises";
import { resolve } from "path";

export default defineEventHandler(async (event) => {
  const { content, filePath = "tensorzero/tensorzero.toml" } = await readBody(
    event,
  );

  if (!content) {
    throw createError({
      statusCode: 400,
      statusMessage: "Content is required",
    });
  }

  try {
    const fullPath = resolve(filePath);
    await writeFile(fullPath, content, "utf8");

    return {
      success: true,
      message: "Configuration saved successfully",
      filePath: fullPath,
    };
  } catch (error: any) {
    throw createError({
      statusCode: 500,
      statusMessage: `Failed to write config file: ${error.message}`,
    });
  }
});
