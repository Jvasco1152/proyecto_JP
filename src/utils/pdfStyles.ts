export const PDF_COLORS = {
  primary: [30, 64, 175] as [number, number, number],     // #1e40af
  primaryLight: [219, 234, 254] as [number, number, number], // #dbeafe
  success: [22, 163, 74] as [number, number, number],      // #16a34a
  successLight: [220, 252, 231] as [number, number, number],
  danger: [220, 38, 38] as [number, number, number],       // #dc2626
  dangerLight: [254, 226, 226] as [number, number, number],
  warning: [245, 158, 11] as [number, number, number],     // #f59e0b
  warningLight: [254, 243, 199] as [number, number, number],
  gray: [107, 114, 128] as [number, number, number],       // #6b7280
  grayLight: [243, 244, 246] as [number, number, number],  // #f3f4f6
  white: [255, 255, 255] as [number, number, number],
  black: [15, 23, 42] as [number, number, number],         // #0f172a
  textDark: [30, 41, 59] as [number, number, number],      // #1e293b
  textMuted: [100, 116, 139] as [number, number, number],  // #64748b
};

export const PDF_FONTS = {
  titleSize: 22,
  subtitleSize: 14,
  headingSize: 12,
  bodySize: 10,
  smallSize: 8,
};

export const PDF_MARGINS = {
  left: 20,
  right: 20,
  top: 20,
  bottom: 20,
};

export const STATUS_LABELS: Record<string, string> = {
  cumple: 'Cumple',
  no_cumple: 'No Cumple',
  no_aplica: 'N/A',
};
