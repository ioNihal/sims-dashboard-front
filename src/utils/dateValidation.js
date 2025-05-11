

/**
 * Check that both dates are defined, in YYYY-MM-DD form, and that
 * start ≤ end ≤ today.
 *
 * @param {string} startDate  – “YYYY-MM-DD”
 * @param {string} endDate    – “YYYY-MM-DD”
 * @returns {{ valid: boolean, error?: string }}
 */
export function validateDateRange(startDate, endDate) {
    if (!startDate || !endDate) {
      return { valid: false, error: "Start date and end date are required." };
    }
  
    if (endDate < startDate) {
      return { valid: false, error: "End date cannot be before start date." };
    }
  
    const today = new Date().toISOString().slice(0, 10);
    if (endDate > today) {
      return { valid: false, error: "End date cannot be in the future." };
    }
  
    return { valid: true };
  }
  
  /**
   * Clamp a candidate start/end so that:
   *  - start is ≤ end
   *  - neither exceeds today
   *
   * @param {string} startDate 
   * @param {string} endDate 
   * @returns {{ start: string, end: string }}
   */
  export function clampDateRange(startDate, endDate) {
    const today = new Date().toISOString().slice(0, 10);
    let s = startDate || "";
    let e = endDate || "";
  
    if (s > today) s = today;
    if (e > today) e = today;
    if (s && e && e < s) {
      // if end came before start, reset end to start
      e = s;
    }
  
    return { start: s, end: e };
  }
  