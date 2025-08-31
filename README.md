# Kazi Mtaani

A comprehensive workforce management platform designed for construction and labor management in Kenya. Built with modern web technologies to streamline worker coordination, attendance tracking, and project supervision.

## 🌟 Features

### For Workers
- **Dashboard**: Personal dashboard with attendance tracking and group assignments
- **Attendance Management**: Clock in/out functionality with location tracking
- **Group Participation**: Join and manage work groups
- **Profile Management**: Update personal information and skills

### For Supervisors
- **Worker Management**: Assign workers to groups and projects
- **Attendance Monitoring**: Real-time attendance tracking and approval
- **Alert System**: Send notifications and alerts to workers
- **Analytics & Reports**: Comprehensive reporting on worker performance and attendance

### Core Features
- **Authentication**: Secure login with Clerk authentication
- **Role-based Access**: Different interfaces for workers and supervisors
- **Real-time Updates**: Live notifications and status updates
- **Mobile Responsive**: Optimized for mobile and desktop use

## 🚀 Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Clerk
- **Deployment**: Vercel
- **Build Tool**: Turbopack

## 📋 Prerequisites

- Node.js 18+ 
- pnpm (recommended) or npm
- PostgreSQL database
- Clerk account for authentication

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/kazi-mtaani.git
   cd kazi-mtaani
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Environment Setup**
   Create a `.env.local` file in the root directory:
   ```bash
   # Database
   DATABASE_URL="your_postgresql_connection_string"
   
   # Clerk Authentication
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="your_clerk_publishable_key"
   CLERK_SECRET_KEY="your_clerk_secret_key"
   WEBHOOK_SECRET="your_clerk_webhook_secret"
   
   # App URLs
   NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
   NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/worker/dashboard"
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/worker/dashboard"
   ```

4. **Database Setup**
   ```bash
   # Generate and run migrations
   pnpm db:generate
   pnpm db:migrate
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   ```

   Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🏗️ Project Structure

```
kazi-mtaani/
├── app/                    # Next.js App Router
│   ├── (auth)/            # Authentication pages
│   ├── api/               # API routes
│   ├── supervisor/        # Supervisor dashboard
│   └── worker/            # Worker dashboard
├── components/            # Reusable UI components
│   ├── landing-page/      # Landing page components
│   ├── supervisor/        # Supervisor-specific components
│   └── ui/                # Base UI components
├── lib/                   # Utilities and configurations
│   ├── db/                # Database actions and schema
│   └── utils/             # Helper functions
├── public/                # Static assets
└── docs/                  # Documentation
```

## 🔧 Available Scripts

- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm db:generate` - Generate database migrations
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Drizzle Studio

## 🌐 Deployment

The application is deployed on Vercel. For your own deployment:

1. **Deploy to Vercel**
   ```bash
   vercel --prod
   ```

2. **Environment Variables**
   Add all environment variables from `.env.local` to your Vercel project settings.

3. **Webhook Configuration**
   Configure Clerk webhooks to point to your deployed URL:
   ```
   https://your-app.vercel.app/api/webhooks/clerk
   ```

## 📚 API Documentation

### Webhook Endpoints
- `POST /api/webhooks/clerk` - Handles Clerk user events (creation, updates)

### Database Actions
- User management (create, update, fetch)
- Attendance tracking
- Group management
- Alert system

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team

## 🔗 Links

- **Live Application**: [https://kazi-mtaani-three.vercel.app](https://kazi-mtaani-three.vercel.app)
- **Documentation**: See `/docs` directory
- **API Reference**: See `/docs/scanner-api.md`

---

Built with ❤️ for the Kenyan workforce community.
