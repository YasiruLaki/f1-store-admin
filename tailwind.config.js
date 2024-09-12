/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/Items.js",
    "./src/pages/Login.js",
    "./src/pages/Orders.js",
    "./src/pages/Settings.js",
    "./src/components/Navbar.js",
    "./src/components/Sidebar.js",
    "./src/components/InputField.js",
    "./src/components/Button.js",
    "./src/components/ProductAddModal.js",
  ],
  theme: {
    extend: {},
  },
  colors: {
    'red': '#FF0000',
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}

