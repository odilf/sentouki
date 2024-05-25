import pino from "pino";

export const logger = pino(
	{
		level: process.env.PINO_LOG_LEVEL || "debug",
		timestamp: pino.stdTimeFunctions.isoTime,
	},

	pino.transport({
		targets: [
			{
				target: "pino/file",
				options: {
					destination: "logs/test.log",
				},
			},
			{
				target: "pino-pretty",
				options: {
					minimumLevel: "trace",
				},
			},
		],
	}),
);
