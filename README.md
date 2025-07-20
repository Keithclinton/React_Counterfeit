# 🍾 Counterfeit Alcohol Detection App

A simple React TypeScript application that helps detect counterfeit alcohol products through image analysis. Users can upload images of alcohol products and receive real-time analysis results using machine learning.

## ✨ Features

- **Image Upload**: Support for file selection and drag-and-drop functionality
- **Real-time Preview**: Instant image preview before analysis
- **AI Analysis**: Integration with FastAPI backend for counterfeit detection
- **Results Display**: Clear indication of genuine vs counterfeit products with confidence scores
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Loading States**: Visual feedback during image processing
- **Error Handling**: Graceful handling of network errors and invalid files

## 🚀 Getting Started

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app) using the TypeScript template.

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd React-Counterfeit
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view the app in your browser.

## 📱 How to Use

1. **Upload an Image**: Click the upload area or drag and drop an image file
2. **Wait for Analysis**: The app will automatically send the image to the backend for processing  
3. **View Results**: Get instant feedback on whether the product is genuine or counterfeit
4. **Check Confidence**: Review the confidence score and detailed analysis

## 🛠️ Available Scripts

### `npm start`

Runs the app in development mode. The page will reload when you make edits.

### `npm test`

Launches the test runner in interactive watch mode.

### `npm run build`

Builds the app for production to the `build` folder with optimized performance.

## 🔧 Backend Integration

The app connects to a FastAPI backend hosted at:
`https://fastapi-tf-79035170475.africa-south1.run.app/`

### API Endpoint
- **POST** `/predict` - Upload image for counterfeit detection
- **Request**: multipart/form-data with image file
- **Response**: JSON with detection results

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ImageUploader.tsx      # Image upload component
│   ├── ImageUploader.css      # Upload component styles  
│   ├── DetectionResult.tsx    # Results display component
│   └── DetectionResult.css    # Results component styles
├── App.tsx                    # Main application component
├── App.css                    # Main application styles
└── index.tsx                  # Application entry point
```

## 🎨 Technologies Used

- **React 18** with TypeScript
- **CSS3** with custom styling and animations
- **Fetch API** for HTTP requests
- **HTML5** drag-and-drop API
- **FileReader API** for image previews

## ⚠️ Important Notes

- **File Support**: Accepts JPG, PNG, and GIF image formats
- **Network Required**: Internet connection needed for backend analysis
- **Security**: Results are for informational purposes only
- **Verification**: Always verify products through official channels

## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

### `npm run eject`

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

To learn React, check out the [React documentation](https://reactjs.org/).
