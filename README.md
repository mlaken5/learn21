 Learn 21 - Blackjack Trainer

An interactive web application to help users learn and practice blackjack hand calculations.

## Features

- Interactive card display
- Hand value calculation practice
- Split hand functionality
- Dealer play simulation
- Mobile-friendly design
- Welcome modal with game rules
- Install prompt for PWA support

## How to Play

1. **Start a New Game**: Click the "New" button to begin.
2. **Select Cards**: Choose your cards and enter the total value of your hand.
3. **Actions**: You can hit, stay, double, or split your hand.
   - **Hit**: Draw another card.
   - **Stay**: Keep your current hand.
   - **Double**: Double your bet and receive one more card (you cannot hit again after doubling).
   - **Split**: If you have two cards of the same rank, you can split them into two separate hands.

## Scoring

- Each hand starts with a base value of 1 point.
- Doubling a hand increases its value to 2 points.
- Split hands are treated independently, with each hand starting at 1 point.
- If a split hand is doubled, its value becomes 2 points, but this only applies to that specific hand.

## Tech Stack

- React
- TypeScript
- Tailwind CSS
- Vite

## Development

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## PWA Support

- The application can be added to your home screen for offline access.
- A prompt will appear on mobile devices to install the app.

## License

This project is licensed under the MIT License.