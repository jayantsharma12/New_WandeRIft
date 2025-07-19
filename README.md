# EduWander Travel Planner

An AI-powered travel planning platform for students, featuring Google Gemini AI integration for personalized mountain adventure itineraries.

## Features

- 🏔️ Mountain adventure planning for students
- 🤖 Google Gemini AI-powered itinerary generation
- 💰 Budget-friendly pricing in Indian Rupees (₹)
- 🎓 Educational and cultural experiences
- 📱 Responsive design with EduWander branding

## Setup Instructions

### 1. Install Dependencies

\`\`\`bash
npm install
\`\`\`

### 2. Configure Google Gemini API

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create a new API key
3. Copy your API key
4. Create a `.env.local` file in the root directory
5. Add your API key:

\`\`\`env
GOOGLE_GEMINI_API_KEY=your_actual_api_key_here
\`\`\`

### 3. Run the Development Server

\`\`\`bash
npm run dev
\`\`\`

### 4. Open in Browser

Navigate to [http://localhost:3000](http://localhost:3000)

## Demo Mode

If you don't configure the Google Gemini API key, the app will run in demo mode with mock itineraries. This allows you to test all functionality without requiring an API key.

## API Key Setup Guide

1. **Get Google Gemini API Key:**
   - Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Sign in with your Google account
   - Click "Create API Key"
   - Copy the generated key

2. **Add to Environment:**
   \`\`\`env
   GOOGLE_GEMINI_API_KEY=AIzaSyBxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   \`\`\`

3. **Restart the Development Server:**
   \`\`\`bash
   npm run dev
   \`\`\`

## Features

- **AI-Powered Planning:** Uses Google Gemini 1.5 Flash for intelligent itinerary generation
- **Student-Focused:** Designed specifically for college students and educational travel
- **Budget-Friendly:** All pricing in Indian Rupees with student discounts
- **Mountain Adventures:** Specializes in Himalayan and hill station destinations
- **Cultural Learning:** Emphasizes educational and cultural experiences

## Tech Stack

- **Framework:** Next.js 14 with App Router
- **Styling:** Tailwind CSS
- **AI:** Google Gemini 1.5 Flash
- **Icons:** Lucide React
- **Components:** Radix UI

## Deployment

The app is ready for deployment on Vercel:

1. Push to GitHub
2. Connect to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

## Support

For issues or questions, please check the console logs for detailed error messages and ensure your Google Gemini API key is properly configured.
