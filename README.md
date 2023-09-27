# JWT Authentication API with Node.js

This is a simple and secure JWT (JSON Web Token) authentication API built using Node.js. It provides a solid foundation for implementing user authentication in your Node.js applications. JWTs are widely used for securing APIs and web applications, as they allow for stateless and scalable authentication.

## Features

- User registration with encrypted password storage.
- User login with JWT generation.
- JWT verification middleware for protected routes.
- Configurable JWT expiration time.
- Easy integration into your Node.js projects.

## Prerequisites

Before getting started, ensure you have the following installed:

- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/) (Node Package Manager)
- [MongoDB](https://www.mongodb.com/) (or any other database of your choice)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/jwt-authentication-api.git
   ```

2. Change to the project directory:

   ```bash
   cd jwt-authentication-api
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Configure your environment variables by creating a `.env` file in the project root:

   ```env
   PORT=3000
   MONGODB_URI=mongodb://localhost/jwt-auth
   JWT_SECRET=your-secret-key
   JWT_EXPIRATION=3600
   ```

   Replace `your-secret-key` with your own secret key.

5. Start the server:

   ```bash
   npm start
   ```

## API Endpoints

### User Registration

- **POST /api/register**

  Create a new user account.

  Request Body:

  ```json
  {
    "username": "yourusername",
    "password": "yourpassword"
  }
  ```

### User Login

- **POST /api/login**

  Authenticate a user and generate a JWT.

  Request Body:

  ```json
  {
    "username": "yourusername",
    "password": "yourpassword"
  }
  ```

  Response:

  ```json
  {
    "token": "your-jwt-token"
  }
  ```

### Protected Route

- **GET /api/protected**

  Access a protected route by including the JWT token in the request header.

  Headers:

  ```
  Authorization: Bearer your-jwt-token
  ```

  Response:

  ```json
  {
    "message": "You have access to this route."
  }
  ```

## Customization

You can customize this API according to your project's requirements. Here are some possible enhancements:

- Add user roles and permissions.
- Implement password reset functionality.
- Store additional user information.
- Set up email verification for user registration.
- Implement rate limiting and request throttling for security.

## Security Considerations

- **Always use HTTPS**: Deploy this API behind a secure HTTPS server to protect against data interception.
- **Keep secrets secure**: Ensure that your JWT secret is kept confidential.
- **Validate user input**: Implement validation and sanitization of user input to prevent security vulnerabilities.
- **Use secure password storage**: Consider using a library like [bcrypt](https://www.npmjs.com/package/bcrypt) for password hashing.

## License

This project is licensed under the MIT License. Feel free to use it in your own projects.

## Contributing

If you have suggestions or find issues, please feel free to open an issue or create a pull request.

---

Happy coding!
