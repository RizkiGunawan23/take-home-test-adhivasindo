/* eslint-disable perfectionist/sort-union-types */
/* eslint-disable perfectionist/sort-objects */
/* eslint-disable perfectionist/sort-interfaces */
import { z } from "zod";

export interface SchemaAnalysis {
    expectedFields: string[];
    requiredFields: string[];
}

export interface ValidationResult {
    expectedFields: string[];
    missingFields: string[];
    unexpectedFields: string[];
    fieldErrors?: Record<string, string[]>;
}

export const SchemaUtil = {
    /**
     * Analyze a Zod schema to extract information about expected and required fields
     */
    analyzeSchema(schema: z.ZodType): SchemaAnalysis {
        const expectedFields: string[] = [];
        const requiredFields: string[] = [];

        try {
            // For object schemas, we can analyze the shape
            if (schema instanceof z.ZodObject) {
                const shape = schema.shape;

                for (const [key, fieldSchema] of Object.entries(shape)) {
                    expectedFields.push(key);

                    // Check if field is required (not optional)
                    if (!(fieldSchema instanceof z.ZodOptional)) {
                        requiredFields.push(key);
                    }
                }
            }
        } catch (error) {
            // If analysis fails, return empty arrays
            console.warn("Schema analysis failed:", error);
        }

        return {
            expectedFields,
            requiredFields,
        };
    },

    /**
     * Analyze request body against schema and return structured validation result
     */
    analyzeRequestFields(
        requestBody: Record<string, unknown>,
        schema: z.ZodType,
    ): ValidationResult {
        const analysis = this.analyzeSchema(schema);
        const requestFields = Object.keys(requestBody);

        // For nested schemas like { body: {...} }, we need to analyze the inner schema
        let actualExpectedFields = analysis.expectedFields;
        let actualRequiredFields = analysis.requiredFields;

        // Handle nested body schema
        if (
            schema instanceof z.ZodObject &&
            schema.shape.body instanceof z.ZodObject
        ) {
            const bodyAnalysis = this.analyzeSchema(schema.shape.body);
            actualExpectedFields = bodyAnalysis.expectedFields;
            actualRequiredFields = bodyAnalysis.requiredFields;
        }

        const missingFields = actualRequiredFields.filter(
            (field) => !requestFields.includes(field),
        );

        const unexpectedFields = requestFields.filter(
            (field) => !actualExpectedFields.includes(field),
        );

        return {
            expectedFields: actualExpectedFields,
            missingFields,
            unexpectedFields,
        };
    },

    /**
     * Get schema for a given route and method
     */
    getSchemaForRoute(path: string, method: string): z.ZodType | null {
        // Normalize path by removing /api/v1 prefix if present
        const normalizedPath = path.replace(/^\/api\/v1/, "");

        // For now, we'll handle login route specifically
        // In a larger application, this could be expanded to a registry
        if (normalizedPath === "/auth/login" && method === "POST") {
            // Return a flag to indicate login schema should be used
            return "login" as unknown as z.ZodType;
        }

        return null;
    },

    /**
     * Check if there are any structural issues (missing/extra fields)
     */
    hasStructuralErrors(result: ValidationResult): boolean {
        return (
            result.missingFields.length > 0 ||
            result.unexpectedFields.length > 0
        );
    },
};
