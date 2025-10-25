/**
 * Creates a sparkle burst animation radiating from an HTML element.
 * Used for celebration effects when adding plants to the garden.
 * 
 * @param el - The HTML element to center the burst animation on
 * @param n - Number of sparkle particles to create (default: 120)
 */
export function sparkleBurst(el: HTMLElement, n = 120) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const TAU = Math.PI * 2;
  
  // Constants for sparkle appearance and behavior
  const DOT_SIZE = 4;
  const DOT_RADIUS = DOT_SIZE / 2;
  
  // Define colors for sparkles
  const plantGreen = '#4CAF50';
  // Rainbow colors: 6 colors for 60 particles (10 each)
  const colors = [
    '#FF0000', // red
    '#FF9800', // orange
    '#FFFF00', // yellow
    '#00FF00', // green
    '#0000FF', // blue
    '#9C27B0', // purple
  ];
  
  for (let i = 0; i < n; i++) {
    const dot = document.createElement("div");
    
    // First 60 particles are plant green, remaining 60 distributed evenly among rainbow colors
    let color;
    if (i < 60) {
      color = plantGreen;
    } else {
      // Each rainbow color gets 10 particles
      const rainbowIndex = Math.floor((i - 60) / 10);
      color = colors[rainbowIndex];
    }
    
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
