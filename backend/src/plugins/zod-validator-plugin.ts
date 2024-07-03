import { ZodSchema } from 'zod';
import validator from 'validator'; 

export class ZodValidatorAdapter {
  constructor(private zodSchema: ZodSchema<any>) {}

  validateAndSanitize(data: any) {
    // Sanitizar datos
    const sanitizedData = this.sanitizeData(data);

    // Validar datos con Zod
    const parseResult = this.zodSchema.safeParse(sanitizedData);
    if (!parseResult.success) {
      return { errors: parseResult.error.errors };
    }
    return null;
  }

  private sanitizeData(data: any) {
    const sanitizedData = { ...data };
    for (const key in sanitizedData) {
      if (sanitizedData.hasOwnProperty(key) && typeof sanitizedData[key] === 'string') {
        sanitizedData[key] = validator.escape(sanitizedData[key]); // Ejemplo de sanitización
      }
    }
    return sanitizedData;
  }
}
