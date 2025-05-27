import "winston-daily-rotate-file";
import { createLogger, format, transports } from "winston";
import { config } from "@/config/env.config";

const { combine, timestamp, errors, printf } = format;

const logFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  printf(({ level, message, timestamp, stack }) => {
    const logMessage = stack || message;
    return `${timestamp}, [${level.toUpperCase()}]: ${logMessage}`;
  }),
);

export const logger = createLogger({
  level: config.NODE_ENV === "production" ? "info" : "debug",
  format: logFormat,
  transports: [
    new transports.Console(),
    new transports.DailyRotateFile({
      dirname: "logs",
      filename: "%DATE%-app.log",
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
    }),
  ],
});

export const logError = (message: string, error: unknown) => {
  const err =
    error instanceof Error ? error.stack || error.message : String(error);
  logger.error(`${message} - ${err}`);
};
