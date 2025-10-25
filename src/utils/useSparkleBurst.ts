/**
 * Creates a sparkle burst animation radiating from an HTML element.
 * Used for celebration effects when adding plants to the garden.
 * 
 * @param el - The HTML element to center the burst animation on
 * @param n - Number of sparkle particles to create (default: 60)
 */
export function sparkleBurst(el: HTMLElement, n = 60) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const TAU = Math.PI * 2;
  
  // Constants for sparkle appearance and behavior
  const DOT_SIZE = 120;
  const DOT_RADIUS = DOT_SIZE / 2;
  const PLANT_GREEN_WEIGHT = 0.6; // 60% chance of plant green colors
  const PLANT_GREEN_COUNT = 4; // Number of plant green color variants
  
  // Define plant green with rainbow flecks colors
  const colors = [
    '#4CAF50', // Plant green
    '#66BB6A', // Light plant green
    '#2E7D32', // Dark plant green
    '#8BC34A', // Lime green
    '#FF6B6B', // Rainbow red
    '#4ECDC4', // Rainbow cyan
    '#FFE66D', // Rainbow yellow
    '#9C27B0', // Rainbow purple
    '#FF9800', // Rainbow orange
  ];
  
  for (let i = 0; i < n; i++) {
    const dot = document.createElement("div");
    
    // Pick a color (favor plant greens, with occasional rainbow)
    const colorIndex = Math.random() < PLANT_GREEN_WEIGHT
      ? Math.floor(Math.random() * PLANT_GREEN_COUNT) // Plant green shades
      : Math.floor(Math.random() * colors.length); // Any color including rainbow
    const color = colors[colorIndex];
    
    dot.style.cssText = `
      position: fixed;
      width: ${DOT_SIZE}px;
      height: ${DOT_SIZE}px;
      border-radius: 50%;
      background: ${color};
      box-shadow: 0 0 20px ${color};
      pointer-events: none;
      z-index: 9999;
    `;
    
    document.body.appendChild(dot);
    
    const ang = (i / n) * TAU;
    const dist = 100 + Math.random() * 150;
    const tx = cx + Math.cos(ang) * dist;
    const ty = cy + Math.sin(ang) * dist;
    
    dot.style.left = cx - DOT_RADIUS + "px";
    dot.style.top = cy - DOT_RADIUS + "px";
    
    // Use requestAnimationFrame to ensure the DOM has painted before animating
    requestAnimationFrame(() => {
      const animation = dot.animate(
        [
          { transform: "translate(0,0)", opacity: 1 },
          { transform: `translate(${tx - (cx - DOT_RADIUS)}px,${ty - (cy - DOT_RADIUS)}px)`, opacity: 0 }
        ],
        {
          duration: 600 + Math.random() * 300,
          easing: "cubic-bezier(.2,.6,.2,1)"
        }
      );
      animation.onfinish = () => dot.remove();
    });
  }
}
