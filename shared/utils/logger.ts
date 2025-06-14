type LoggerMessage =
  | number
  | string
  | object
  | boolean
  | undefined
  | null
  | unknown

type LoggerType = "info" | "error" | "warn" | "log"

const LOG_INFO = "info"
const LOG_ERROR = "error"
const LOG_WARN = "warn"
const LOG_LOG = "log"

const createCircularReplacer = () => {
  const seen = new WeakSet()
  return (key: string, value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return "[Circular Reference]"
      }
      seen.add(value)
    }
    return value
  }
}

export const logger = (...args: LoggerMessage[]) => {
  const parsedMessage = setupMessage(args)
  logMessage(parsedMessage, "log")
}

export const loggerInfo = (...args: LoggerMessage[]) => {
  const parsedMessage = setupMessage(args)
  logMessage(parsedMessage, "info")
}

export const loggerError = (...args: LoggerMessage[]) => {
  const parsedMessage = setupMessage(args)
  logMessage(parsedMessage, "error")
}

const setupMessage = (messages: LoggerMessage[]): string => {
  return `${
    messages
      .map((message) => {
        if (typeof message === "object") {
          try {
            return JSON.stringify(message, createCircularReplacer(), 2)
          } catch (error) {
            return `[Object: ${Object.prototype.toString.call(message)}]`
          }
        }
        return message?.toString() || "|||[undefined]|||"
      })
      .join("\n\n")
  }\n\x1b[35m===================\x1b[0m`
}

const logMessage = (message: string, type: LoggerType) => {
  const timestamp = new Date().toISOString()
  const coloredTimestamp = `\x1b[90m[${timestamp}]\x1b[0m`

  switch (type) {
    case LOG_INFO:
      console.info(`${coloredTimestamp} \x1b[36m[INFO]\x1b[0m ${message}`)
      break
    case LOG_ERROR:
      console.error(`${coloredTimestamp} \x1b[31m[ERROR]\x1b[0m ${message}`)
      break
    case LOG_WARN:
      console.warn(`${coloredTimestamp} \x1b[33m[WARN]\x1b[0m ${message}`)
      break
    case LOG_LOG:
    default:
      console.log(`${coloredTimestamp} \x1b[32m[LOG]\x1b[0m ${message}`)
      break
  }
}
