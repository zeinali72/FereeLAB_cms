# FereeLAB CMS - Chatbot Web Application

FereeLAB CMS is a modern chatbot web application built with Next.js for the frontend and Django for the backend. The application integrates with OpenRouter APIs for AI model access and uses MongoDB as its database. It's designed for a smooth, responsive user experience with a modern UI built using the HeroUI component library.

## Features

- **AI-powered Chat Interface**: Interact with various AI models through OpenRouter APIs
- **Conversation Management**: Save, categorize, and search through past conversations
- **Message Features**: Edit messages, regenerate AI responses, provide feedback
- **Token Tracking**: Monitor token usage and associated costs
- **Responsive Design**: Fully responsive UI that works on mobile and desktop
- **Reply Context**: Reply to specific messages to maintain context
- **Real-time Animations**: Typing animations and smooth transitions

## Tech Stack

### Frontend
- **Framework**: Next.js
- **UI Components**: HeroUI component library
- **Styling**: Tailwind CSS
- **State Management**: React hooks and context
- **Animations**: CSS animations and transitions

### Backend
- **Framework**: Django
- **API**: RESTful API with Django REST framework
- **Database**: MongoDB
- **AI Integration**: OpenRouter APIs
- **Deployment**: Heroku

## Project Structure

```
FereeLAB_cms/
├── frontend/           # Next.js frontend
│   ├── components/     # Reusable UI components
│   ├── pages/          # Next.js pages
│   ├── hooks/          # Custom React hooks
│   ├── styles/         # Global styles
│   └── utils/          # Utility functions
├── backend/            # Django backend
│   ├── api/            # API endpoints
│   ├── chatbot/        # Chatbot service logic
│   └── core/           # Core settings
├── docker-compose.yml  # Docker configuration
└── README.md           # Project documentation
```

## Getting Started

### Prerequisites
- Node.js (v14 or later)
- Python (v3.8 or later)
- MongoDB
- Docker and Docker Compose (optional)

### Installation

#### Clone the repository
```bash
git clone https://github.com/yourusername/FereeLAB_cms.git
cd FereeLAB_cms
```

#### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

#### Backend Setup
```bash
cd backend
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

#### Using Docker (Optional)
```bash
docker-compose up -d
```

## Development

### Available Scripts

#### Frontend
- `npm run dev`: Start development server
- `npm run build`: Build for production
- `npm start`: Start production server
- `npm run lint`: Run linter

#### Backend
- `python manage.py runserver`: Start development server
- `python manage.py test`: Run tests
- `python manage.py makemigrations`: Create new migrations
- `python manage.py migrate`: Apply migrations

## Project Branches

- `main`: Production-ready code
- `development`: Active development branch
- `ui-ux-refactor`: UI/UX design improvements
- `feature/*`: Individual feature branches

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- OpenRouter for providing the AI model access
- HeroUI for the component library
- Next.js and Django communities for their excellent documentation
