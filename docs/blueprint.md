# **App Name**: LexiRun

## Core Features:

- World Navigation: Display a side-scrolling game world where the player can move left and right using 'A' and 'D' keys, jump with the 'W' key, and duck using the 'S' key.
- Score Tracking: Implement a point counter in the top-right corner of the screen.
- Word Generation: Generate a tool to choose random words from a curated list, and position them randomly within the game world. Increase the average word length as the game continues, and points accumulate.
- Word Encounter: Detect when the player sprite collides with a generated word in the game world.  The user will only need to type letters, not move their avatar, during this interaction.
- Typing Challenge: When a player encounters a word, prompt the player to type the word correctly.
- Score Calculation: Track the time taken to type the word correctly. Award points based on typing speed; award more points for correctly typing more difficult or longer words. Award fewer or even zero points for an incorrect word. Reset word and regenerate a new word on success/failure.

## Style Guidelines:

- Primary color: HSL(50, 90%, 50%) - RGB(229, 204, 25). This saturated yellow invokes feelings of intellect, concentration, and focus, supporting the need to concentrate on the task of rapidly typing words.
- Background color: HSL(50, 20%, 95%) - RGB(247, 247, 232). A very pale yellow provides a calming backdrop that harmonizes with the primary without overwhelming it.
- Accent color: HSL(20, 90%, 45%) - RGB(229, 77, 25). This vivid orange, used sparingly, calls attention to notifications and changes in state within the app.
- Body and headline font: 'Inter', a grotesque-style sans-serif for a clean and readable interface.
- Use clean, minimalist icons that complement the sans-serif typography. Prefer outlined icons with a weight similar to 'Inter'.
- Maintain a clear, uncluttered layout to minimize distractions during gameplay.
- Subtle animations and transitions to provide feedback and enhance user engagement, like a short zoom in the world when encountering a word.