# Multi-Clock App

A modern, interactive clock application featuring three different clock types: Digital, Dots, and Analog. Built with TypeScript, Vite, and a clean MVC architecture.

## Features

### 🕐 Three Clock Types

- **Digital Clock**: Clean 24-hour format with blinking separator
- **Dots Clock**: Unique circular dot-based visualization with color-coded hands
- **Analog Clock**: Traditional clock face with smooth hand movements

### ✨ Key Highlights

- **Real-time Updates**: All clocks update in perfect sync with system time
- **Smooth Animations**: Analog clock hands move smoothly between positions
- **Responsive Design**: Adapts seamlessly to mobile, tablet, and desktop screens
- **User Preference**: Remembers your last selected clock type
- **Clean Architecture**: MVC pattern with TypeScript for maintainability

## Getting Started

### Prerequisites

- Node.js (v18 or higher recommended)
- npm (comes with Node.js)

### Installation

1. Clone the repository:
```
bash
git clone <your-repo-url>
cd multi-clock-app
```
2. Install dependencies:
```
bash
npm install
```
3. Start the development server:
```
bash
npm run dev
```
4. Open your browser and navigate to:
```

http://localhost:5173
```
### Build for Production

```bash
npm run build
```
```


The built files will be in the `dist` directory.

### Preview Production Build

```shell script
npm run preview
```


## Project Structure

```
src/
├── adapters/           # DOM adapters for rendering
│   └── WebDOMAdapter.ts
├── controllers/        # Application controllers
│   └── ClockController.ts
├── managers/          # High-level orchestration
│   └── ClockManager.ts
├── models/            # Data models
│   └── ClockModel.ts
├── renderers/         # Clock rendering logic
│   ├── ClockRenderer.interface.ts
│   ├── DigitalClockRenderer.ts
│   ├── DotsClockRenderer.ts
│   ├── AnalogClockRenderer.ts
│   └── ClockRendererFactory.ts
├── styles/            # CSS stylesheets
│   ├── main.css
│   ├── variables.css
│   ├── digital-clock.css
│   ├── dots-clock.css
│   └── analog-clock.css
├── types/             # TypeScript type definitions
│   └── clock.types.ts
└── index.ts           # Application entry point
```


## Architecture

The application follows a clean MVC (Model-View-Controller) architecture:

- **Model** (`ClockModel`): Manages time data
- **View** (Renderers): Transform time data into visual representations
- **Controller** (`ClockController`): Coordinates between model and view
- **Manager** (`ClockManager`): Handles clock switching and user interactions
- **Adapter** (`WebDOMAdapter`): Handles DOM updates for different clock types

## Clock Types

### Digital Clock
- 24-hour format (00:00:00 - 23:59:59)
- Large, easy-to-read display
- Blinking colon separator
- White glow effect

### Dots Clock
- Three circular displays for hours, minutes, and seconds
- Illuminated dots indicate current time
- Color-coded:
    - 🔴 Red: Hours
    - 🟡 Yellow: Minutes
    - 🟢 Green: Seconds
- 3D neumorphic design

### Analog Clock
- Traditional 12-hour clock face
- Hour, minute, and second hands
- Major and minor tick marks
- Numbered hours (1-12)
- Smooth hand movement
- Color-coded hands matching dots clock

## Technologies Used

- **TypeScript 5.0**: Type-safe JavaScript
- **Vite 5.0**: Lightning-fast build tool
- **Vitest 1.0**: Unit testing framework
- **CSS3**: Modern styling with animations
- **LocalStorage API**: Preference persistence

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization

### Changing Clock Colors

Edit `src/styles/variables.css`:

```css
:root {
    --clr-hours: #ff2972;    /* Red */
    --clr-minutes: #fee800;   /* Yellow */
    --clr-seconds: #04fc43;   /* Green */
}
```


### Clock Configuration

Each clock type accepts configuration options:

```typescript
// Digital Clock
{
    use24Hour: true,
    showSeconds: true,
    showDate: false
}

// Analog Clock
{
    showSecondHand: true,
    smoothSeconds: false,
    showNumbers: true,
    numberStyle: '12' // '12', '24', 'roman', or 'none'
}

// Dots Clock
{
    secondsTotal: 60,
    minutesTotal: 60,
    hoursTotal: 12
}
```


## Development

### Run Tests

```shell script
npm run test
```


### Type Checking

```shell script
npm run type-check
```


### Linting

```shell script
npm run lint
```


## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Inspired by modern clock designs
- Built with modern web technologies
- Font: [Poppins](https://fonts.google.com/specimen/Poppins) from Google Fonts

## Author

Your Name - [Your GitHub](https://github.com/yourusername)

## Support

If you like this project, please give it a ⭐️!

---

Made with ❤️ and TypeScript
```
This README includes:
- Clear project description
- Feature highlights
- Installation instructions
- Project structure overview
- Architecture explanation
- Customization options
- Development commands
- Contributing guidelines
- License information

Feel free to customize the sections, add screenshots, or include additional information specific to your project!
```
