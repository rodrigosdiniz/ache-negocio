// tailwind.config.js
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {}
  },
  plugins: []
};

// postcss.config.js
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {}
  }
};

// .eslintrc.js
module.exports = {
  extends: "next/core-web-vitals",
  rules: {
    // Exemplo de regra personalizada
    "@next/next/no-img-element": "off"
  }
};

// .prettierrc
{
  "semi": true,
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "trailingComma": "es5"
}

// .eslintignore
node_modules
.next
out

// .prettierignore
node_modules
.next
out
