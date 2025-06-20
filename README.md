# pg-be
Powergotha backend 
# PowerGotha Backend

A production-ready Node.js backend application built with Express.js and TypeScript, following industry best practices and security standards.

## Tech Stack & Versions

- **Runtime**: Node.js v18.19.1 (LTS)
- **Package Manager**: pnpm v10.2.5
- **Language**: TypeScript v5.3.3
- **Framework**: Express.js v5.1.0
- **Database**: MySQL v8.2.0
- **ORM**: Sequelize v6.37.1
- **Authentication**: JWT (jsonwebtoken v9.0.2)
- **API Documentation**: Swagger/OpenAPI v3.0.0
- **Testing**: Jest v29.7.0
- **Linting**: ESLint v8.56.0
- **Formatting**: Prettier v3.2.5

## Features

- 🚀 **TypeScript** for type safety and better developer experience
- 🔒 **Security Features**:
  - Helmet for security headers
  - CORS with configurable origins
  - Rate limiting (100 requests per 15 minutes)
  - CSRF protection with Double Submit Cookie pattern
  - XSS protection with input sanitization
  - JWT authentication with refresh tokens
  - Secure session management
  - Password hashing with bcrypt
- 📝 **API Documentation** with Swagger/OpenAPI
- 🔍 **Request Validation** with Zod
- 📊 **Logging** with Winston
  - Console logging for development
  - File logging for production
  - Audit logging for security events
- 🎯 **Error Handling** with custom error classes
- 🔄 **Graceful Shutdown** handling
- 🧪 **Testing** setup with Jest
- 🔐 **Environment Validation** with strict type checking

## Prerequisites

- Node.js v18.19.1 or higher
- pnpm v10.2.5 or higher
- MySQL v8.2.0 or higher
- Git

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Ahex-Technologies-Pvt-ltd/pg-be.git
cd pg-be
```

2. Install dependencies:

```bash
pnpm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Update the `.env` file with your configuration:

```env
# Server
NODE_ENV=development
PORT=7777

# Database
DB_HOST=localhost
DB_PORT=3306
DB_DATABASE=powergotha
DB_USERNAME=your_username
DB_PASSWORD=your_password

# Security
SESSION_SECRET=your_session_secret_min_32_chars
CSRF_SECRET=your_csrf_secret_min_32_chars
JWT_ACCESS_SECRET=your_jwt_access_secret_min_32_chars
JWT_REFRESH_SECRET=your_jwt_refresh_secret_min_32_chars

# CORS
CORS_ORIGIN=http://localhost:3000

# Logging
LOG_LEVEL=info
```

## Development

Start the development server:

```bash
pnpm dev
```

The server will start on http://localhost:7777

## API

- Base URL: `http://localhost:7777/api/v1`
- Swagger Docs: `http://localhost:7777/api/v1/docs`

## Available Scripts

- `pnpm dev` - Start development server with hot reload
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm test` - Run tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report
- `pnpm lint` - Run linter
- `pnpm lint:fix` - Fix linting issues
- `pnpm format` - Format code with Prettier
- `pnpm type-check` - Run TypeScript type checking

## Project Structure

```
src/
├── config/         # Configuration files
│   ├── auth.config.ts
│   ├── database.ts
│   ├── env.ts
│   ├── env.validation.ts
│   └── logger.ts
├── constants/      # Constant values
├── controllers/    # Route controllers
├── middlewares/    # Custom middlewares
│   ├── auth.middleware.ts
│   ├── error.middleware.ts
│   ├── rateLimit.middleware.ts
│   └── validateRequest.ts
├── models/         # Database models
├── routes/         # API routes
├── services/       # Business logic
├── types/          # TypeScript types
├── utils/          # Utility functions
├── validations/    # Request validation schemas
└── app.ts          # Express app setup
.env.example        # Example environment variables
```

## Security Features

### Authentication & Authorization

- JWT-based authentication
- Refresh token rotation
- Role-based access control
- Token blacklisting
- Secure password hashing

### Request Security

- CSRF protection with Double Submit Cookie
- XSS protection with input sanitization
- Rate limiting per IP
- Request size limits
- CORS with configurable origins

### Data Security

- Environment variable validation
- Secure session management
- HTTP-only cookies
- Secure headers with Helmet
- SQL injection prevention with Sequelize

## Error Handling

The application uses a centralized error handling mechanism:

- Custom error classes for different scenarios
- Proper error logging
- Sanitized error responses
- Type-safe error handling
- Audit logging for security events

## Logging

Logging is implemented using Winston with:

- Different log levels (error, warn, info, debug)
- Console logging for development
- File logging for production
- Audit logging for security events
- Request/Response logging
- Error tracking

## Testing

The project uses Jest for testing:

- Unit tests
- Integration tests
- API tests
- Test coverage reporting
- Mocking utilities

Run tests with:

```bash
pnpm test
```

## Database Migrations

If you use Sequelize migrations, run:

```bash
pnpm sequelize db:migrate
```

## Production Deployment

1. Build the application:

```bash
pnpm build
```

2. Set production environment variables:

```bash
NODE_ENV=production
```

3. Start the server:

```bash
pnpm start
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Create a Pull Request

## License

This project is licensed under the ISC License.


