const tailwindcss = require('@tailwindcss/postcss'); // ✅ this is now required for Next.js 15+

module.exports = {
  plugins: [
    tailwindcss(),         // ✅ call as function!
    require('autoprefixer')
  ],
};
