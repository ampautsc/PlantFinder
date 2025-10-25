/**
 * Plays the game bonus sound effect.
 * Used when adding plants to the garden.
 * 
 * @param onStart - Optional callback triggered when audio playback starts
 */
export function playBonusSound(onStart?: () => void) {
  try {
    const audio = new Audio('/happy-pop-2-185287.mp3');
    audio.volume = 0.5; // Set to moderate volume
    audio.play()
      .then(() => {
        // Trigger callback when audio starts playing
        if (onStart) {
          onStart();
        }
      })
      .catch(error => {
        // Silently handle errors (e.g., user hasn't interacted with page yet)
        console.debug('Could not play bonus sound:', error);
        // Still trigger callback even if audio fails, to ensure visual effects play
        if (onStart) {
          onStart();
        }
      });
  } catch (error) {
    console.debug('Error creating audio:', error);
    // Still trigger callback even if audio creation fails
    if (onStart) {
      onStart();
    }
  }
}
