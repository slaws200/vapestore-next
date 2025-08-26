// tailwind.config.js or tailwind.config.ts
const config = {
  content: ["./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      keyframes: {
        checkmark: {
          "0%": { opacity: "0", transform: "scale(0) rotate(-45deg)" },
          "100%": { opacity: "1", transform: "scale(1) rotate(-45deg)" },
        },
      },
      animation: {
        // includes delay and forwards fill
        checkmark: "checkmark 2s ease-out forwards 0.1s",
      },
    },
  },
  plugins: [],
};

export default config;
