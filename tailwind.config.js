/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{html,ts}'],
  theme: {
    extend: {
      spacing: {
        4: '6rem', // Valor que habías establecido para mb-4
        // Añade o sobrescribe otros valores de espaciado según sea necesario
      },
      fontSize: {
        xs: ['0.65rem', { lineHeight: '1rem' }],
        sm: ['0.75rem', { lineHeight: '1.25rem' }],
        base: ['0.875rem', { lineHeight: '1.5rem' }],
        lg: ['1rem', { lineHeight: '1.75rem' }],
        xl: ['1.125rem', { lineHeight: '1.75rem' }],
        // Puedes añadir más o ajustar estos si quieres que sean aún más pequeños
      },
    },
  },
  plugins: [],
};
