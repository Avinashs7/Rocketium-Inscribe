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
- Create a new canvas or open an existing one.
- Draw rectangles, circles, and text on the canvas.
- Customize text with different font styles and colors.
- Export the drawing as SVG or PNG.
- Revisit and modify the canvas anytime if you remember the unique canvas name.

## Getting Started

### 1. Create a New Canvas or Open an Existing One
- **To Create a New Canvas:** Enter a unique name for your new canvas.
- **To Open an Existing Canvas:** You must know the unique name of the canvas you want to open.

### 2. Drawing on the Canvas
- Once the canvas is open, you can draw the following:
  - **Rectangle:** Select the rectangle tool from the toolbar and draw on the canvas.
  - **Circle:** Select the circle tool and draw on the canvas.
  - **Text:** Select the text tool, click anywhere on the canvas, and type the content. You can customize the font style and color of the text.

### 3. Persisting the Canvas
- Your drawing is automatically saved persistently under the given canvas name.

### 4. Exporting the Canvas
- Anytime, you can export your drawing as an **SVG** or **PNG** file.

### 5. Revisiting and Modifying the Canvas
- If you remember the unique name of a previously created canvas, you can open and modify it at any time.

## Setup Instructions

### Prerequisites

- [MongoDB](https://gist.github.com/nrollr/9f523ae17ecdbb50311980503409aeb3)
- [Node](https://nodejs.org/en/download/) ^20.0.0
- [npm](https://nodejs.org/en/download/package-manager/)

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

Create a `.env` file in the `server` directory with the help of `.env.sample`

# Enhancements

- **Authentication/Authorization**:
Implement authentication and authorization features to store user-specific canvases and provide security for user data. This ensures that users can securely manage their drawings and only access their own canvases.

- **History of the User's Drawings**:
Enable users to view a history of their previously created canvases. This will allow them to revisit and modify past drawings, enhancing the overall user experience.

- **Resizing Diagrams for Responsive View**:
Ensure that the canvas or drawings automatically resize and adjust to fit various screen sizes and devices, providing a seamless experience on desktops, tablets, and mobile phones.

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Author

- [Avinash S](https://github.com/Avinashs7)