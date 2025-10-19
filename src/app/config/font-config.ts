/**
 * Font and Padding Configuration
 *
 * This file controls the global font and padding scaling for the entire application.
 * Change the FONT_SCALE and PADDING_SCALE values to adjust all text sizes and paddings proportionally.
 *
 * Examples:
 * - 0.8 = 80% of original size (smaller)
 * - 0.9 = 90% of original size (smaller)
 * - 1.0 = 100% of original size (default)
 * - 1.1 = 110% of original size (larger)
 * - 1.2 = 120% of original size (larger)
 */

export const FONT_CONFIG = {
  // Global font scale factor
  // Change this value to scale all fonts in the application
  FONT_SCALE: 0.85, // 85% of original size - good for A4 format

  // Alternative scale values for testing:
  // FONT_SCALE: 0.8,  // 80% - very small
  // FONT_SCALE: 0.9,  // 90% - small
  // FONT_SCALE: 1.0,  // 100% - normal
  // FONT_SCALE: 1.1,  // 110% - large
  // FONT_SCALE: 1.2,  // 120% - very large
};

export const PADDING_CONFIG = {
  // Global padding scale factor
  // Change this value to scale all paddings in the application
  PADDING_SCALE: 0.8, // 80% of original size - good for A4 format

  // Alternative scale values for testing:
  // PADDING_SCALE: 0.6,  // 60% - very tight
  // PADDING_SCALE: 0.7,  // 70% - tight
  // PADDING_SCALE: 0.8,  // 80% - compact
  // PADDING_SCALE: 0.9,  // 90% - slightly compact
  // PADDING_SCALE: 1.0,  // 100% - normal
  // PADDING_SCALE: 1.1,  // 110% - spacious
};

export const PROFILE_FONT_CONFIG = {
  // Profile font scale factor (for name and title)
  // Change this value to scale profile fonts independently
  PROFILE_FONT_SCALE: 1.0, // 100% of original size

  // Alternative scale values for testing:
  // PROFILE_FONT_SCALE: 0.8,  // 80% - smaller
  // PROFILE_FONT_SCALE: 0.9,  // 90% - slightly smaller
  // PROFILE_FONT_SCALE: 1.0,  // 100% - normal
  // PROFILE_FONT_SCALE: 1.2,  // 120% - larger
  // PROFILE_FONT_SCALE: 1.4,  // 140% - much larger
};

/**
 * Apply font scale to the document
 * Call this function to update the font scale dynamically
 */
export function applyFontScale(scale: number): void {
  document.documentElement.style.setProperty('--font-scale', scale.toString());
}

/**
 * Get current font scale
 */
export function getCurrentFontScale(): number {
  const scale = getComputedStyle(document.documentElement).getPropertyValue('--font-scale');
  return parseFloat(scale) || 1.0;
}

/**
 * Apply padding scale to the document
 * Call this function to update the padding scale dynamically
 */
export function applyPaddingScale(scale: number): void {
  document.documentElement.style.setProperty('--padding-scale', scale.toString());
}

/**
 * Get current padding scale
 */
export function getCurrentPaddingScale(): number {
  const scale = getComputedStyle(document.documentElement).getPropertyValue('--padding-scale');
  return parseFloat(scale) || 1.0;
}

/**
 * Apply profile font scale to the document
 * Call this function to update the profile font scale dynamically
 */
export function applyProfileFontScale(scale: number): void {
  document.documentElement.style.setProperty('--profile-font-scale', scale.toString());
}

/**
 * Get current profile font scale
 */
export function getCurrentProfileFontScale(): number {
  const scale = getComputedStyle(document.documentElement).getPropertyValue('--profile-font-scale');
  return parseFloat(scale) || 1.0;
}
