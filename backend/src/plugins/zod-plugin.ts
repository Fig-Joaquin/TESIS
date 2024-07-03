import { ZodSchema } from 'zod';

export class ZodValidationAdapter {
  constructor(private zodSchema: ZodSchema<any>) {}

  validate(data: any) {
    const parseResult = this.zodSchema.safeParse(data);
    if (!parseResult.success) {
      return { errors: parseResult.error.errors };
    }
    return null;
  }
}
