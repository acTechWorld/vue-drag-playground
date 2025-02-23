
// convert-tailwind-to-css.js

import fs from 'fs';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';

// Generated CSS indent spaces count
const indentSpaces = 2;
// Generated CSS output file
const outputCSS = './src/assets/index.css';

// Convert Tailwind CSS to native CSS
postcss([ 
  tailwindcss({
    content: ['./src/**/*.vue'],
    theme: {
      extend: {},
    },
    variants: {
      extend: {},
    },
    plugins: [],
  }),
])
  .process('@tailwind utilities; @tailwind components;', { from: undefined })
  .then((result) => {
    // Format and write the CSS output
    let formattedCSS = result.css
      .replaceAll(' '.repeat(4), ' '.repeat(indentSpaces)) // Handle indentation
      .replace(/([^{;\s]+:[^;}]+)(\s*?)\n(\s*})/g, '$1;\n$3'); // Insert semicolon before newline and closing brace, preserving indentation

    //Init all tailwind vars
    formattedCSS = `${formattedCSS} 
*, ::before, ::after {
  --tw-border-spacing-x: 0;
  --tw-border-spacing-y: 0;
  --tw-translate-x: 0;
  --tw-translate-y: 0;
  --tw-rotate: 0;
  --tw-skew-x: 0;
  --tw-skew-y: 0;
  --tw-scale-x: 1;
  --tw-scale-y: 1;
  --tw-pan-x:  ;
  --tw-pan-y:  ;
  --tw-pinch-zoom:  ;
  --tw-scroll-snap-strictness: proximity;
  --tw-gradient-from-position:  ;
  --tw-gradient-via-position:  ;
  --tw-gradient-to-position:  ;
  --tw-ordinal:  ;
  --tw-slashed-zero:  ;
  --tw-numeric-figure:  ;
  --tw-numeric-spacing:  ;
  --tw-numeric-fraction:  ;
  --tw-ring-inset:  ;
  --tw-ring-offset-width: 0px;
  --tw-ring-offset-color: #fff;
  --tw-ring-color: rgb(59 130 246 / 0.5);
  --tw-ring-offset-shadow: 0 0 #0000;
  --tw-ring-shadow: 0 0 #0000;
  --tw-shadow: 0 0 #0000;
  --tw-shadow-colored: 0 0 #0000;
  --tw-blur:  ;
  --tw-brightness:  ;
  --tw-contrast:  ;
  --tw-grayscale:  ;
  --tw-hue-rotate:  ;
  --tw-invert:  ;
  --tw-saturate:  ;
  --tw-sepia:  ;
  --tw-drop-shadow:  ;
  --tw-backdrop-blur:  ;
  --tw-backdrop-brightness:  ;
  --tw-backdrop-contrast:  ;
  --tw-backdrop-grayscale:  ;
  --tw-backdrop-hue-rotate:  ;
  --tw-backdrop-invert:  ;
  --tw-backdrop-opacity:  ;
  --tw-backdrop-saturate:  ;
  --tw-backdrop-sepia:  ;
  --tw-contain-size:  ;
  --tw-contain-layout:  ;
  --tw-contain-paint:  ;
  --tw-contain-style:  ;
}`
    
    fs.writeFileSync(outputCSS, formattedCSS, 'utf8');
    console.log(`Native CSS generated: ${outputCSS}`);
  })
  .catch((err) => console.error('An error occurred:', err));