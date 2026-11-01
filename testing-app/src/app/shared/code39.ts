// Code 39 barcode encoder (no extra npm package needed).
// Each character is a string of modules: 1 = black bar, 0 = white space.
// Characters are separated by one narrow white space.
const CODE39: { [ch: string]: string } = {
  '0': '101000111011101',
  '1': '111010001010111',
  '2': '101110001010111',
  '3': '111011100010101',
  '4': '101000111010111',
  '5': '111010001110101',
  '6': '101110001110101',
  '7': '101000101110111',
  '8': '111010001011101',
  '9': '101110001011101',
  'A': '111010100010111',
  'B': '101110100010111',
  'C': '111011101000101',
  'D': '101011100010111',
  'E': '111010111000101',
  'F': '101110111000101',
  'G': '101010001110111',
  'H': '111010100011101',
  'I': '101110100011101',
  'J': '101011100011101',
  'K': '111010101000111',
  'L': '101110101000111',
  'M': '111011101010001',
  'N': '101011101000111',
  'O': '111010111010001',
  'P': '101110111010001',
  'Q': '101010111000111',
  'R': '111010101110001',
  'S': '101110101110001',
  'T': '101011101110001',
  'U': '111000101010111',
  'V': '100011101010111',
  'W': '111000111010101',
  'X': '100010111010111',
  'Y': '111000101110101',
  'Z': '100011101110101',
  '-': '100010101110111',
  '.': '111000101011101',
  ' ': '100011101011101',
  '$': '100010001000101',
  '/': '100010001010001',
  '+': '100010100010001',
  '%': '101000100010001',
  '*': '100010111011101',
};

export function isCode39Text(text: string): boolean {
  return text.toUpperCase().split('').every(ch => ch !== '*' && CODE39[ch] !== undefined);
}

/** Returns the full module pattern (including start/stop '*'). */
export function code39Pattern(text: string): string {
  const chars = ('*' + text.toUpperCase() + '*').split('');
  return chars.map(ch => {
    const p = CODE39[ch];
    if (!p) { throw new Error('Character not allowed in Code 39: ' + ch); }
    return p;
  }).join('0');
}

/**
 * Builds an SVG string for the given text.
 * @param moduleWidth width of one narrow module in px
 * @param height bar height in px
 */
export function code39Svg(text: string, moduleWidth = 2, height = 70): string {
  const pattern = code39Pattern(text);
  const quiet = 10 * moduleWidth;
  const width = pattern.length * moduleWidth + quiet * 2;
  let rects = '';
  let i = 0;
  while (i < pattern.length) {
    if (pattern[i] === '1') {
      let j = i;
      while (j < pattern.length && pattern[j] === '1') { j++; }
      rects += `<rect x="${quiet + i * moduleWidth}" y="0" width="${(j - i) * moduleWidth}" height="${height}"/>`;
      i = j;
    } else {
      i++;
    }
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" ` +
    `viewBox="0 0 ${width} ${height}" shape-rendering="crispEdges">` +
    `<rect width="100%" height="100%" fill="#fff"/><g fill="#000">${rects}</g></svg>`;
}
