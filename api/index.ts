import { app } from "../server/app.js";
import { connectDatabase } from "../server/database.js";

export default async function handler(req: Parameters<typeof app>[0], res: Parameters<typeof app>[1]) {
	try {
		await connectDatabase();
		return app(req, res);
	} catch (error) {
		console.error("No se pudo preparar la conexión de MongoDB para la API.", error);
		return res.status(503).json({
			success: false,
			message: "La API no está disponible temporalmente.",
		});
	}
}
