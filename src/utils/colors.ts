let context: CanvasRenderingContext2D | null = null;

/**
 * Resolves a CSS color custom property to an `rgba()` string.
 * Chart.js cannot parse `oklch()`, the notation of the Tailwind palette.
 */
export function readCssColor(property: string, alpha = 1): string {
  const value = getComputedStyle(document.documentElement)
    .getPropertyValue(property)
    .trim();

  if (!context) {
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = 1;
    context = canvas.getContext("2d", { willReadFrequently: true });
  }
  if (!context || !value) return `rgba(0, 0, 0, ${alpha})`;

  context.clearRect(0, 0, 1, 1);
  context.fillStyle = value;
  context.fillRect(0, 0, 1, 1);
  const [r, g, b] = context.getImageData(0, 0, 1, 1).data;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
