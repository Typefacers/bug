/** @type {import('tailwindcss').Config} */
module.exports = {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	darkMode: "class",
	theme: {
		extend: {
			animation: {
				"leaf-fall": "leaf-fall 3s ease-in-out infinite",
				wind: "wind 10s ease-in-out infinite",
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
			},
		},
	},
	plugins: [],
};
