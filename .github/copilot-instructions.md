<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Counterfeit Alcohol Detection App

This is a React TypeScript application for detecting counterfeit alcohol through image analysis. The app uses:

- React with TypeScript for the frontend
- File upload functionality for image processing  
- Integration with FastAPI backend for counterfeit detection
- Material-UI or simple styling for user interface
- Image preview and processing states

## Key Features
- Image upload via file input or drag-and-drop
- Real-time image preview
- API integration with backend detection service
- Loading states and error handling
- Results display with confidence scores

## API Integration
The app connects to a FastAPI backend at: `https://fastapi-tf-79035170475.africa-south1.run.app/`
- Endpoint for image upload and analysis
- JSON response with detection results
- Error handling for network issues

When generating code, focus on:
- Clean, maintainable React components
- Proper TypeScript typing
- User-friendly interface design
- Robust error handling
- Responsive design principles
