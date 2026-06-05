import { GoogleGenAI, Type } from "@google/genai";
import { businessActivitiesMap } from "../../../utils/servicesData";
import { enforceRateLimit } from "../../utils/rateLimit";

const GEMINI_API_KEY = process.env.GOOGLE_API_KEY ?? process.env.GEMINI_API_KEY;

/** Maximum number of chat requests allowed per client within the window. */
const RATE_LIMIT = 10;
/** Rolling rate-limit window: 10 minutes. */
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
/** Maximum accepted length of a user message, in characters. */
const MAX_MESSAGE_LENGTH = 500;

export default defineEventHandler(async (event) => {
  enforceRateLimit(event, {
    limit: RATE_LIMIT,
    windowMs: RATE_LIMIT_WINDOW_MS,
  });

  const { message } = await readBody(event);

  if (typeof message !== "string" || !message.trim()) {
    throw createError({
      statusCode: 400,
      statusMessage: "Message body is missing parameters.",
    });
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    throw createError({
      statusCode: 413,
      statusMessage: `El mensaje no puede exceder ${MAX_MESSAGE_LENGTH} caracteres.`,
    });
  }

  const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });

  const systemInstruction = `
      Eres un asistente de clasificación para una agencia de desarrollo de software en México y América Latina.

      Analiza la descripción del negocio del usuario y clasifícalo en el tipo de negocio que mejor le corresponda de esta lista:

      - "Restaurante": venta de platillos y bebidas; opera por reservaciones, servicio para llevar o a domicilio
      - "Hotel": hospedaje, uso de amenidades, renta de espacios para eventos; opera por reservaciones y recepción
      - "Cafetería": venta de café, repostería y alimentos ligeros; opera para llevar, en el lugar o preordenes en línea
      - "Barbería": cortes de cabello, venta de productos de cuidado personal; opera por citas o sin cita previa
      - "Salón de belleza": servicios cosméticos, estilismo, venta de productos de belleza; opera por agenda de citas
      - "Gimnasio": membresías, entrenamiento personal, venta de suplementos, clases grupales; opera por registro en recepción
      - "Farmacia": venta de medicamentos con y sin receta, consulta médica; opera en tienda y a domicilio
      - "Clínica dental": procedimientos dentales, ortodoncia; opera por agenda de citas y emergencias
      - "Hospital": procedimientos médicos, hospitalización, urgencias, consultas externas; opera 24/7
      - "Laboratorio": pruebas de diagnóstico médico, kits de detección; opera por cita o en clínicas de toma de muestras
      - "Veterinaria": tratamientos para mascotas, vacunación, venta de alimento; opera por cita o urgencias animales
      - "Despacho de abogados": igualas legales, consultoría jurídica por hora; opera por consultas y portales de clientes
      - "Firma de contabilidad": preparación de impuestos, igualas mensuales de contabilidad; opera con software contable
      - "Firma de auditoría": auditorías de cumplimiento, informes de evaluación de riesgos; opera con evaluaciones presenciales
      - "Agencia inmobiliaria": comisiones por venta/renta de propiedades; opera por portales de listado y visitas guiadas
      - "Coworking": membresías de escritorios compartidos y dedicados, renta de salas de juntas; opera por apps de reserva
      - "Supermercado": venta de abarrotes al por menor y mayor; opera por cajas en tienda y entrega programada
      - "Tienda": venta al por menor de productos generales; opera por mostradores de punto de venta
      - "Boutique de moda": venta de ropa y accesorios personalizados; opera en tienda física y perfiles en línea
      - "Ferretería": venta de herramientas y suministros, renta de equipo; opera por mostradores técnicos
      - "Imprenta": producción de impresión por volumen, procesamiento de diseño gráfico; opera por envío digital y recogida
      - "Servicios automotrices": reparación de autos, venta de refacciones; opera por bahías de servicio y diagnóstico digital
      - "Constructora": contratos de construcción, cotización de planos civiles; opera por licitaciones y consultoría en sitio
      - "Reparación de electrónicos": reparación de hardware, diagnóstico de dispositivos; opera por mostradores técnicos y envío
      - "Venta de autos": venta y financiamiento de vehículos; opera en concesionarios y catálogos web
      - "Agencia de viajes": paquetes vacacionales personalizados, seguros de viaje; opera por consultoría digital y telefónica
      - "Salón de eventos": renta de espacios, catering por niveles; opera por visitas guiadas y reservación de fechas
      - "Planeación de eventos": coordinación de eventos, gestión de proveedores; opera por portafolios y revisión digital
      - "Estudio de Fotografía": sesiones fotográficas profesionales, venta de impresiones y activos digitales; opera por reserva de estudios

      Si el negocio del usuario no corresponde exactamente a ningún tipo, selecciona el más cercano.

      IMPORTANTE:
      - En el campo "reply", saluda al usuario, identifica su tipo de negocio con nombre específico si lo menciona, y anticipa
        brevemente que le mostrarás los servicios digitales que más valor pueden aportar a su operación.
      - Responde EXCLUSIVAMENTE en español latinoamericano (LATAM) con tono profesional, cercano y empático.
      - Evita modismos de España (como "vosotros" o "vuestro").
    `;

  const generateConfig = {
    model: "gemini-2.5-flash",
    contents: message,
    config: {
      systemInstruction: systemInstruction,
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          reply: {
            type: Type.STRING,
            description:
              "Respuesta breve y personalizada en español LATAM reconociendo el negocio del usuario.",
          },
          businessType: {
            type: Type.STRING,
            enum: businessActivitiesMap.map((b) => b.businessName),
            description:
              "El tipo de negocio que mejor describe al usuario, tomado exactamente de la lista proporcionada.",
          },
        },
        required: ["reply", "businessType"],
      },
    },
  };

  const MAX_RETRIES = 3;

  for (let attempt = 0; attempt < MAX_RETRIES; attempt++) {
    try {
      const response = await ai.models.generateContent(generateConfig);

      const parsedResult = JSON.parse(response.text || "{}");

      const match = businessActivitiesMap.find(
        (b) => b.businessName === parsedResult.businessType,
      );
      const matchedServices = match?.commonNeedings ?? [];

      return {
        reply: parsedResult.reply,
        services: matchedServices,
      };
    } catch (error: unknown) {
      const is503 =
        typeof error === "object" &&
        error !== null &&
        "status" in error &&
        (error as { status: number }).status === 503;

      if (is503 && attempt < MAX_RETRIES - 1) {
        await new Promise((resolve) =>
          setTimeout(resolve, 1000 * 2 ** attempt),
        );
        continue;
      }

      console.error("Gemini API Error:", error);
      throw createError({
        statusCode: 500,
        statusMessage: "Failed processing Gemini content classification.",
      });
    }
  }
});
