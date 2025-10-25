/**
 * Plays the game bonus sound effect.
 * Used when adding plants to the garden.
 */
export function playBonusSound() {
  try {
    const audio = new Audio('/happy-pop-2-185287.mp3');
    audio.volume = 0.5; // Set to moderate volume
    audio.play().catch(error => {
      // Silently handle errors (e.g., user hasn't interacted with page yet)
      console.debug('Could not play bonus sound:', error);
    });
  } catch (error) {
    console.debug('Error creating audio:', error);
  }
}
