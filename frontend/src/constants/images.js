const noImageSvg = `
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'>
    <rect width='100' height='100' fill='#f3f4f6'/>
    <g stroke='#9ca3af' stroke-width='3' fill='none' stroke-linecap='round' stroke-linejoin='round'>
      <rect x='20' y='25' width='60' height='50' rx='4'/>
      <circle cx='35' cy='40' r='5'/>
      <path d='M20 65l18-18 12 12 15-15 15 15'/>
    </g>
  </svg>
`;

export const NO_IMAGE_URL = `data:image/svg+xml;base64,${btoa(noImageSvg)}`;