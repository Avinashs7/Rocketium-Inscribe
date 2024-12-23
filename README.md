# Rocketium-Inscribe
Inscribe - application which allows users to create, draw, and download their custom drawings in both SVG and PNG formats. It provides an intuitive interface where users can interactively add various shapes (rectangles, circles, texts, etc.) and customize them with properties like size, color, and position.

## Project Structure

### Client

The client-side of the application is built using React and Tailwind CSS.

#### Directory Structure

```
client/
├── node_modules/
├── public/
├── src/
│   ├── assets/
│   ├── components/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
├── .gitignore
├── eslint.config.js
├── index.html
├── package-lock.json
├── package.json
├── postcss.config.js
├── README.md
├── tailwind.config.js
├── vite.config.js
```

### Server

The server-side is built using Node.js with Express.

#### Directory Structure

```
server/
├── controllers/
│   ├──canvas.controller.js
├──db/
│   ├──config.js
├──models/
│   ├──drawings.model.js
├── routes/
│   ├── canvasRouter.js
├── utils/
│   ├──ApiError.js
│   ├──ApiResponse.js
│   ├──AsyncHandler.js
│   ├──Logger.js
├── app.js
├──config.js
├── .env.sample
├──.prettierrc
├──.prettierignore
├──eslint.config.mjs
├── .gitignore
├── index.js
├── package-lock.json
├── package.json
LICENSE
README.md
```

## Features

- **Client**:

  - Drawing tools: rectangle, circle, and text.
  - Export canvas as SVG and PNG.
  - Clear the canvas.
  - Responsive design using Tailwind CSS.

- **Server**:
  - RESTful API endpoints for canvas operations.
  - File export and download capabilities.

## Setup Instructions

### Prerequisites

- Node.js
- MongoDB

### Installation

#### 1. Clone the Repository

```bash
git clone https://github.com/Avinashs7/Rocketium-Inscribe.git
cd Rocketium-Inscribe
```

#### 2. Install Dependencies

For client:

```bash
cd client
npm install
```

For server:

```bash
cd server
npm install
```

#### 3. Start the Application

Start the client:

```bash
cd client
npm run dev
```

Start the server:

```bash
cd server
npm start
```

The client will be available at `http://localhost:5173` (if using Vite) and the server at `http://localhost:8000`.

## API Endpoints

### Canvas API

- `POST /canvas`: Create a new canvas.
- `PATCH /canvas/:id`: It will helps to add element to the canvas such as rectangles, circles and texts.
- `DELETE /canvas/:id`: Clear the canvas.
- `GET /canvas/id/:id`: Fetch the canvas by id.
- `GET /canvas/:canvas_name`: Fetch the canvas by name.
- Exporting as svg and png is handled in the frontend by fetching the canvas elements initially.

[Postman collection link](https://www.postman.com/restless-meadow-857763/inscribe/collection/pksfcge/inscribe)

## Environment Variables

Create a `.env` file in the `server` directory with the help of `.env.sample`:

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Author

- [Avinash S](https://github.com/Avinashs7)