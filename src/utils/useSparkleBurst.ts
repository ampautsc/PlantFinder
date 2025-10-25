// Sparkle burst effect for celebration
export function sparkleBurst(el: HTMLElement, n = 24) {
  const rect = el.getBoundingClientRect();
  const cx = rect.left + rect.width / 2;
  const cy = rect.top + rect.height / 2;
  const TAU = Math.PI * 2;
  
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
    const colorIndex = Math.random() < 0.6 
      ? Math.floor(Math.random() * 4) // 60% chance of plant green shades
      : Math.floor(Math.random() * colors.length); // 40% chance of any color
    const color = colors[colorIndex];
    
    dot.style.cssText = `
      position: fixed;
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: ${color};
      box-shadow: 0 0 10px ${color};
      pointer-events: none;
      z-index: 9999;
    `;
    
    document.body.appendChild(dot);
    
    const ang = (i / n) * TAU;
    const dist = 40 + Math.random() * 30;
    const tx = cx + Math.cos(ang) * dist;
    const ty = cy + Math.sin(ang) * dist;
    
    dot.style.left = cx - 3 + "px";
    dot.style.top = cy - 3 + "px";
    
    dot.animate(
      [
        { transform: "translate(0,0)", opacity: 1 },
        { transform: `translate(${tx - (cx - 3)}px,${ty - (cy - 3)}px)`, opacity: 0 }
      ],
      {
        duration: 600 + Math.random() * 300,
        easing: "cubic-bezier(.2,.6,.2,1)"
      }
    ).onfinish = () => dot.remove();
  }
}
