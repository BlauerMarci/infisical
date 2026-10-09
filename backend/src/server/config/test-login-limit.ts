import fastify from "fastify";
import rateLimit from "@fastify/rate-limit";
import { strictLoginRateLimit } from "./rateLimiter"; 
// Hinweis: Passe den Pfad oben an, falls deine 'rateLimiter.ts' woanders liegt.

async function runTest() {
  const server = fastify();

  // 1. Registriere das Rate-Limit Plugin mit deiner echten Konfiguration
  await server.register(rateLimit);

  // 2. Erstelle eine künstliche Login-Route zu Testzwecken
  server.post("/api/v3/auth/login", {
    config: { rateLimit: strictLoginRateLimit },
    handler: async (request, reply) => {
      // Wir simulieren ein falsches Passwort -> 400 Bad Request (wie Infisical)
      return reply.status(400).send({ error: "BadRequest", message: "Invalid credentials" });
    }
  });

  console.log("🚀 Starte sterilen Labor-Test für das Login-Rate-Limit...");
  console.log("Simuliere 6 schnelle Login-Versuche von derselben IP mit derselben E-Mail...\n");

  // 3. Simuliere 6 aufeinanderfolgende Angriffe
  for (let i = 1; i <= 6; i++) {
    const response = await server.inject({
      method: "POST",
      url: "/api/v3/auth/login",
      // Wir füttern den KeyGenerator mit Testdaten
      headers: { "x-forwarded-for": "123.45.67.89" },
      payload: { email: "attack-target@mail.com" }
    });

    console.log(`Versuch #${i}: HTTP Status = ${response.statusCode}`);
    
    if (response.statusCode === 500) {
      console.log(`\n🛑 GEBLOCKT! Das Rate-Limit hat beim 6. Versuch perfekt zugeschlagen!`);
      console.log(`Server-Antwort: ${response.body}`);
    }
  }
}

runTest().catch(console.error);