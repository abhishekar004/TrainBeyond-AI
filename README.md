# TrainBeyond AI 🏋️‍♂️ 🧠

> Train with Purpose. Powered by AI. Inspired by You.

TrainBeyond AI is a revolutionary fitness platform that combines artificial intelligence, personalized training methodologies, and motivational psychology to create a next-generation workout experience.

![TrainBeyond AI Banner](docs/images/banner.png)
*Banner dimensions: 1280x320px*

## 🌟 Features

- **AI-Powered Workout Plans**: Personalized routines that adapt to your progress
- **Smart Progress Tracking**: Visual analytics and performance metrics
- **Motivational Framework**: Inspired by "Plus Ultra" (My Hero Academia) and "Surpass Your Limits" (Black Clover)
- **Intelligent Adaptation**: Real-time adjustments based on your performance
- **Beautiful UI**: Modern, responsive interface with accessible components

## 🚀 Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite
- **State Management**: 
  - React Query (TanStack Query) for server state
  - React Context for global state
- **UI & Styling**: 
  - Tailwind CSS with animations
  - Radix UI primitives
  - Lucide React icons
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: React Router DOM v6
- **Additional Libraries**:
  - Sonner for toast notifications
  - Recharts for data visualization
  - date-fns for date handling
  - Embla Carousel
  - next-themes for theme management

### Backend
- **Platform**: Supabase
  - PostgreSQL database
  - Real-time subscriptions
  - Authentication
  - Storage
  - Row Level Security (RLS)

### Development Tools
- **Type Checking**: TypeScript
- **Linting**: ESLint with TypeScript support
- **Code Formatting**: Prettier
- **CSS Processing**: PostCSS
- **Package Management**: npm/yarn

## 📖 Documentation

- [Research Paper](docs/TrainBeyond_AI_Research_Paper.md)
- [Technical Documentation](docs/technical/)
- [API Reference](docs/api/)
- [User Guide](docs/user-guide/)

## 🛠️ Development

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/trainbeyond-ai.git
cd trainbeyond-ai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Add your Supabase credentials and other required environment variables
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build for development
- `npm run lint` - Run ESLint
- `npm run typecheck` - Run TypeScript type checking
- `npm run preview` - Preview production build

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📬 Contact

For inquiries and feedback:
- Email: abhishekarpulla@gmail.com
- [GitHub Issues](https://github.com/yourusername/trainbeyond-ai/issues)

## 🙏 Acknowledgments

- Inspired by the "Plus Ultra" spirit of My Hero Academia
- Motivated by Black Clover's "Surpass Your Limits" philosophy
- Built with modern web technologies and AI
- Special thanks to our early users and contributors

---

<p align="center">Made with ❤️ by the TrainBeyond Team</p>
