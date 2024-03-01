import fastify, { FastifyInstance } from "fastify";
import { userRoutes } from "./routes/user.route";
import { contactRoutes } from "./routes/contact.route";

const app: FastifyInstance = fastify({ logger: true });

app.register(userRoutes, {
	prefix: "/users",
});

app.register(contactRoutes, {
	prefix: "/contacts",
});

app.listen(
	{
		port: 3100,
	},
	() => console.log("Server is running on port 3100")
);
