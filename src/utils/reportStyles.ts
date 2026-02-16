export const REPORT_COLORS = {
  primary: '#1e40af',
  primaryLight: '#dbeafe',
  success: '#16a34a',
  successLight: '#dcfce7',
  danger: '#dc2626',
  dangerLight: '#fee2e2',
  warning: '#f59e0b',
  warningLight: '#fef3c7',
  amber: '#d97706',
  amberLight: '#fef3c7',
  gray: '#6b7280',
  grayLight: '#f3f4f6',
  white: '#ffffff',
  black: '#0f172a',
  textDark: '#1e293b',
  textMuted: '#64748b',
};

export const STATUS_LABELS: Record<string, string> = {
  cumple: 'Cumple',
  cumple_parcial: 'C. Parcial',
  no_cumple: 'No Cumple',
  no_aplica: 'N/A',
};

export const STATUS_COLORS: Record<string, string> = {
  cumple: REPORT_COLORS.success,
  cumple_parcial: REPORT_COLORS.amber,
  no_cumple: REPORT_COLORS.danger,
  no_aplica: REPORT_COLORS.gray,
};
