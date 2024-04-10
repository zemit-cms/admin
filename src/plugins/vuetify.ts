import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import {createVuetify, ThemeDefinition} from 'vuetify'
import {en, fr} from 'vuetify/locale'

// User Theme
// const userPrefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches
const userPrefersDarkMode = false
const defaultTheme = localStorage.getItem('theme') || (userPrefersDarkMode ? 'dark' : 'light')

const light: ThemeDefinition = {
  dark: false,
  colors: {
    'background': '#FAFAFA',        // Off-white background for a softer look
    'surface': '#FFFFFF',           // White surface
    'surface-bright': '#F5F5F5',  // Soft grey to differentiate from pure white
    'surface-light': '#EEEEEE',   // Light grey for subtle differentiation
    'surface-variant': '#E0E0E0', // Lighter grey for more contrast
    'on-surface-variant': '#757575', // Grey text on light background for readability

    'primary': '#5C6BC0',           // Softened primary color
    'primary-darken-1': '#3949AB', // Darkened version of the softened primary color

    'secondary': '#80CBC4',         // Softened secondary color
    'secondary-darken-1': '#4DB6AC', // Darkened version of the softened secondary color

    'error': '#E57373',             // Softened color for errors
    'info': '#64B5F6',              // Softened color for informational messages
    'success': '#81C784',           // Softened color for success messages
    'warning': '#FFB74D',           // Softened color for warnings

    // Additional colors can be defined here as needed
  },
  variables: {
    // 'border-color': '#BDBDBD',    // Softened color for borders
    // 'border-opacity': 0.12,       // Opacity for borders
    // 'high-emphasis-opacity': 0.87,// Opacity for high emphasis text
    // 'medium-emphasis-opacity': 0.60, // Opacity for medium emphasis text
    // 'disabled-opacity': 0.38,     // Opacity for disabled elements
    // 'idle-opacity': 0.04,         // Opacity for idle elements
    // 'hover-opacity': 0.04,        // Opacity for hover states
    // 'focus-opacity': 0.12,        // Opacity for focus states
    // 'selected-opacity': 0.08,     // Opacity for selected elements
    // 'activated-opacity': 0.12,    // Opacity for activated elements
    // 'pressed-opacity': 0.12,      // Opacity for pressed elements
    // 'dragged-opacity': 0.08,      // Opacity for dragged elements
    //
    // 'theme-kbd': '#212529',       // Color for keyboard input elements
    // 'theme-on-kbd': '#FFFFFF',    // Text color on keyboard input elements
    // 'theme-code': '#F5F5F5',      // Background color for code elements
    // 'theme-on-code': '#000000',   // Text color for code elements

    // Additional variables can be defined here as needed
  },
}

const dark: ThemeDefinition = {
  dark: true,
  colors: {
    'background': '#121212',         // Very dark grey for the background
    'surface': '#1E1E1E',            // Dark grey for the surface
    'surface-bright': '#242424',   // Slightly lighter grey for differentiation
    'surface-light': '#2E2E2E',    // Lighter grey for subtle contrast
    'surface-variant': '#373737',  // Variant surface color for more depth
    'on-surface-variant': '#BDBDBD', // Muted text color on dark surfaces

    'primary': '#7986CB',            // Muted primary color for dark theme
    'primary-darken-1': '#5C6BC0', // Darkened version of the muted primary color

    'secondary': '#4DB6AC',          // Muted secondary color
    'secondary-darken-1': '#26A69A', // Darkened version of the muted secondary color

    'error': '#EF9A9A',              // Muted color for errors
    'info': '#4FC3F7',               // Muted color for informational messages
    'success': '#A5D6A7',            // Muted color for success messages
    'warning': '#FFCC80',            // Muted color for warnings

    // Additional colors can be defined here as needed
  },
  variables: {
    'border-color': '#616161',     // Muted color for borders
    'border-opacity': 0.12,        // Opacity for borders
    'high-emphasis-opacity': 0.87, // Opacity for high emphasis text
    'medium-emphasis-opacity': 0.60, // Opacity for medium emphasis text
    'disabled-opacity': 0.38,      // Opacity for disabled elements
    'idle-opacity': 0.04,          // Opacity for idle elements
    'hover-opacity': 0.04,         // Opacity for hover states
    'focus-opacity': 0.12,         // Opacity for focus states
    'selected-opacity': 0.08,      // Opacity for selected elements
    'activated-opacity': 0.12,     // Opacity for activated elements
    'pressed-opacity': 0.12,       // Opacity for pressed elements
    'dragged-opacity': 0.08,       // Opacity for dragged elements

    'theme-kbd': '#424242',        // Muted color for keyboard input elements
    'theme-on-kbd': '#E0E0E0',     // Light text color on keyboard input elements
    'theme-code': '#333333',       // Dark background color for code elements
    'theme-on-code': '#FFFFFF',    // White text color for code elements

    // Additional variables can be defined here as needed
  },
}


// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
export default createVuetify({
  theme: {
    defaultTheme: defaultTheme,
    cspNonce: 'dQw4w9WgXcQ',
    themes: {
      light: light,
      dark: dark,
    },
  },
  locale: {
    locale: 'en',
    fallback: 'en',
    messages: {en, fr},
  },
  icons: {
    defaultSet: 'mdi',
  },
})
