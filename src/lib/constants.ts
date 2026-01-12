// Page dimensions for US Letter size (8.5" x 11")
export const PAGE_CONFIG = {
  // Physical dimensions
  WIDTH_INCHES: 8.5,
  HEIGHT_INCHES: 11,
  MARGIN_INCHES: 1,
  
  // Pixels at 96 DPI (standard screen)
  DPI: 96,
  
  // Calculated pixel values
  get WIDTH_PX() {
    return this.WIDTH_INCHES * this.DPI; // 816px
  },
  get HEIGHT_PX() {
    return this.HEIGHT_INCHES * this.DPI; // 1056px
  },
  get MARGIN_PX() {
    return this.MARGIN_INCHES * this.DPI; // 96px
  },
  get CONTENT_WIDTH_PX() {
    return this.WIDTH_PX - (this.MARGIN_PX * 2); // 624px
  },
  get CONTENT_HEIGHT_PX() {
    return this.HEIGHT_PX - (this.MARGIN_PX * 2); // 864px
  },
} as const;

// Document typography (legal standard)
export const TYPOGRAPHY = {
  FONT_FAMILY: '"Times New Roman", Times, serif',
  FONT_SIZE_PT: 12,
  LINE_HEIGHT: 1.5,
} as const;
