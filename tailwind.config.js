/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			animation: {
				"leaf-fall": "leaf-fall 3s ease-in-out infinite",
				wind: "wind 10s ease-in-out infinite",
				// Shadcn UI animations
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out",
				"fade-in": "fade-in 0.5s ease-out",
				"fade-out": "fade-out 0.5s ease-out",
				"zoom-in": "zoom-in 0.2s ease-out",
				"zoom-out": "zoom-out 0.2s ease-out",
				"slide-in-from-left": "slide-in-from-left 0.3s ease-out",
				"slide-in-from-right": "slide-in-from-right 0.3s ease-out",
				"slide-out-to-left": "slide-out-to-left 0.3s ease-out",
				"slide-out-to-right": "slide-out-to-right 0.3s ease-out",
			},
			keyframes: {
				"leaf-fall": {
					"0%, 100%": { transform: "translateY(0) rotate(0deg)" },
					"50%": { transform: "translateY(20px) rotate(10deg)" },
				},
				wind: {
					"0%, 100%": { transform: "translateX(0)" },
					"50%": { transform: "translateX(10px)" },
				},
				// Shadcn UI keyframes
				"accordion-down": {
					from: { height: 0 },
					to: { height: "var(--radix-accordion-content-height)" },
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: 0 },
				},
				"fade-in": {
					from: { opacity: 0 },
					to: { opacity: 1 },
				},
				"fade-out": {
					from: { opacity: 1 },
					to: { opacity: 0 },
				},
				"zoom-in": {
					from: { transform: "scale(0.95)", opacity: 0 },
					to: { transform: "scale(1)", opacity: 1 },
				},
				"zoom-out": {
					from: { transform: "scale(1)", opacity: 1 },
					to: { transform: "scale(0.95)", opacity: 0 },
				},
				"slide-in-from-left": {
					from: { transform: "translateX(-100%)", opacity: 0 },
					to: { transform: "translateX(0)", opacity: 1 },
				},
				"slide-in-from-right": {
					from: { transform: "translateX(100%)", opacity: 0 },
					to: { transform: "translateX(0)", opacity: 1 },
				},
				"slide-out-to-left": {
					from: { transform: "translateX(0)", opacity: 1 },
					to: { transform: "translateX(-100%)", opacity: 0 },
				},
				"slide-out-to-right": {
					from: { transform: "translateX(0)", opacity: 1 },
					to: { transform: "translateX(100%)", opacity: 0 },
				},
			},
		},
	},
	plugins: [require("tailwindcss-animate")],
};
