export function getTemperature(message: string, contextType: 'diet' | 'workout'): number {
    message = message.toLowerCase();

    const patterns = {
        factual: [
            'cuánto', 'cuantos', 'qué es', 'como se', 'explica', 'diferencia',
            'calorías', 'proteínas', 'peso', 'series', 'repeticiones'
        ],
        conversational: [
            'qué opinas', 'que piensas', 'como crees', 'sugieres', 'recomiendas',
            'motivación', 'consejos'
        ],
        creative: [
            'rutina', 'plan', 'menú', 'alternativas', 'opciones',
            'personaliza', 'adapta'
        ]
    };

    const isFactual = patterns.factual.some(p => message.includes(p));
    const isConversational = patterns.conversational.some(p => message.includes(p));
    const isCreative = patterns.creative.some(p => message.includes(p));

    if (isFactual) {
        return 0;
    }

    if (contextType === 'diet') {
        if (isCreative) {
            return 0.3;
        }
        return 0.2;
    }

    if (contextType === 'workout') {
        if (isCreative) {
            return 0.4;
        }
        return 0.2;
    }

    if (isConversational) {
        return 0.6;
    }

    return 0.2;
}