# Accent Detection Integration Guide

This document explains how the US accent detection feature is integrated into the AureaVoice frontend application.

## Overview

The result view displays the confidence level of a user's US accent based on their recorded speech. The system expects to receive a response in the following format:

```json
{
  "us_confidence": 85.67
}
```

## Components

### 1. ResultView (`src/views/ResultView.js`)
- Displays the main confidence percentage
- Shows descriptive feedback based on confidence level
- Includes a "Try Again" button to restart the process
- Follows the same UI patterns as WelcomeView and TestView

### 2. ResultPresenter (`src/presenters/ResultPresenter.js`)
- Manages the ResultView lifecycle
- Handles result data updates
- Follows the MVP pattern used throughout the app

### 3. AccentDetectionService (`src/utils/AccentDetectionService.js`)
- Handles API communication for accent detection
- Processes audio recordings and sends them to the backend
- Currently includes mock data for development/testing
- Manages navigation to the result page

## API Integration

### Current Implementation
The `AccentDetectionService` is configured to send POST requests to `/api/accent-detection` with the following:

- **Method**: POST
- **Content-Type**: multipart/form-data
- **Body**: FormData containing the audio file as 'audio' field
- **Expected Response**: JSON with `us_confidence` field (number)

### To Connect Your API
1. Update the `apiEndpoint` in `AccentDetectionService.js`:
   ```javascript
   this.apiEndpoint = 'https://your-api-domain.com/accent-detection';
   ```

2. Modify authentication if needed:
   ```javascript
   const response = await fetch(this.apiEndpoint, {
     method: 'POST',
     body: formData,
     headers: {
       'Authorization': 'Bearer your-token',
       // Don't set Content-Type for FormData
     }
   });
   ```

3. Remove or modify the mock data fallback in the `analyzeAccent` method

## User Flow

1. User clicks microphone on welcome page → navigates to test page
2. User reads the test text while recording
3. User clicks microphone again to stop recording
4. Recording is saved to IndexedDB
5. `AccentDetectionService.processRecordingAndShowResult()` is called
6. Audio is sent to accent detection API
7. Result is received and user is navigated to result page
8. Result page displays confidence level and descriptive feedback
9. User can click "Try Again" to return to welcome page

## Confidence Level Descriptions

The result view provides different feedback messages based on confidence levels:

- **90%+**: "Excellent! Your American accent is very strong and clear."
- **80-89%**: "Great job! You have a good American accent with room for minor improvements."
- **70-79%**: "Good work! Your American accent is developing well. Keep practicing!"
- **60-69%**: "Not bad! You're on the right track. More practice will help improve your accent."
- **50-59%**: "You're making progress! Focus on pronunciation and intonation patterns."
- **<50%**: "Keep practicing! Every expert was once a beginner. You'll improve with time."

## Styling

The result view follows the same design patterns as other views:
- Consistent typography and spacing
- Smooth entrance animations
- Responsive design for mobile and tablet
- Neutral, eye-friendly color scheme

## Error Handling

- Network errors fall back to mock data during development
- API errors show user-friendly error messages
- Recording errors are handled gracefully
- Navigation errors default to welcome page

## Testing

For development and testing purposes, the service includes mock data generation. The mock results generate random confidence levels between 50-95% to simulate various scenarios.

To test the result view:
1. Navigate to `http://localhost:5173/#/result` directly (will show 0% confidence)
2. Use the recording flow to test with mock data
3. Modify the mock data in `getMockResult()` for specific test cases

## Future Enhancements

Potential improvements for the accent detection feature:
- Progress indicator during API processing
- Detailed breakdown of accent features
- Historical results tracking
- Pronunciation tips based on confidence level
- Audio playback of the analyzed recording
