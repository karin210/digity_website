// server/api/chat.post.ts
import { GoogleGenAI, Type } from "@google/genai";
import { servicesMap } from "../../../utils/servicesData";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

export default defineEventHandler(async (event) => {
  const { message } = await readBody(event);

  if (!message) {
    throw createError({
      statusCode: 400,
      statusMessage: "Message body is missing parameters.",
    });
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const systemInstruction = `
      Eres un asistente de clasificación para una agencia de desarrollo de software en México y América Latina.
      Analiza la descripción del negocio del usuario y clasifícalo en EXACTAMENTE una de estas categorías:

      - "alimentos": restaurantes, hoteles, cafés, dark kitchens, bares, fondas
      - "belleza": barberías, salones de belleza, spas, gimnasios, centros de bienestar
      - "salud": farmacias, clínicas dentales, hospitales, laboratorios, veterinarias, consultorios médicos
      - "profesional": despachos de abogados, consultoras, firmas de contabilidad, firmas de auditoría, agencias inmobiliarias, coworking
      - "comercio": supermercados, tiendas, boutiques de moda, ferreterías, imprentas
      - "industrial": servicios automotrices, constructoras, talleres de reparación de electrónicos
      - "eventos": salones de eventos, planificación de eventos, estudios de fotografía
      - "movilidad": agencias de viajes, venta de autos, transporte
      - "mas": cualquier otro tipo de negocio no contemplado en las categorías anteriores

      IMPORTANTE:
      - Responde EXCLUSIVAMENTE en español latinoamericano (LATAM) con tono profesional, cercano y empático.
      - Evita modismos de España (como "vosotros" o "vuestro").
      - En tu respuesta, saluda al usuario, reconoce su tipo de negocio con nombre específico si lo menciona,
        y anticipa brevemente que le mostrarás los servicios digitales más útiles para su industria.
    `;

  try {
    // 2. Call the recommended general-purpose model
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: message,
      config: {
        systemInstruction: systemInstruction,
        // 3. Enforce strict JSON structure via a schema map
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            reply: {
              type: Type.STRING,
              description:
                "Una respuesta breve y personalizada reconociendo su industria en español LATAM.",
            },
            category: {
              type: Type.STRING,
              enum: [
                "alimentos",
                "belleza",
                "salud",
                "profesional",
                "comercio",
                "industrial",
                "eventos",
                "movilidad",
                "mas",
              ],
              description:
                "El id de industria que mejor describe el negocio del usuario. Debe coincidir exactamente con una de las opciones del enum.",
            },
          },
          required: ["reply", "category"],
        },
      },
    });

    // response.text is guaranteed to be a stringified JSON matching the schema rules
    const parsedResult = JSON.parse(response.text || "{}");

    // 4. Extract services from your server/utils/servicesData layer
    const matchedServices = servicesMap[parsedResult.category] || [];

    return {
      reply: parsedResult.reply,
      services: matchedServices,
    };
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw createError({
      statusCode: 500,
      statusMessage: "Failed processing Gemini content classification.",
    });
  }
});
