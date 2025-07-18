import { app } from "./app.ts";
import { env } from "./env.ts";

app
	.listen({
		host: "0.0.0.0",
		port: env.PORT,
	})
	.then(() => {
		console.log("🚀 HTTP Server Running!");
	});
