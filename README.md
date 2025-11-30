<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# AI Studio - Run and Deploy Your App

This repository contains everything you need to run and deploy your AI Studio application locally and to production.

View your app in AI Studio: https://ai.studio/apps/drive/1MKcpWpjeJ-0mx7qXoXmwix9PMIGyGnj9

## 🚀 Quick Start

### Run Locally

**Prerequisites:** Node.js 18+

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set the `GEMINI_API_KEY` in [`.env.local`](.env.local) to your Gemini API key:
   ```bash
   GEMINI_API_KEY=your_api_key_here
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Build for Production

Build the application for production:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## 🌐 Deployment

This project is configured for deployment on multiple platforms. Choose the one that best fits your needs:

### Deploy to Vercel (Recommended)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/bairwanitin51-netizen/Ai-studio)

**Manual Deployment:**

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

3. For production deployment:
   ```bash
   vercel --prod
   ```

**Environment Variables:**
- Set `GEMINI_API_KEY` in your Vercel project settings

### Deploy to Netlify

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/bairwanitin51-netizen/Ai-studio)

**Manual Deployment:**

1. Install Netlify CLI:
   ```bash
   npm install -g netlify-cli
   ```

2. Build and deploy:
   ```bash
   npm run build
   netlify deploy --prod
   ```

**Environment Variables:**
- Set `GEMINI_API_KEY` in Netlify site settings under Environment Variables

### Deploy to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase (if not already done):
   ```bash
   firebase init hosting
   ```

4. Build and deploy:
   ```bash
   npm run build
   firebase deploy --only hosting
   ```

**Configuration:**
- Update the project ID in [`.firebaserc`](.firebaserc) with your Firebase project ID
- Set `GEMINI_API_KEY` as an environment variable during build

## 🔄 Automated Deployment with GitHub Actions

This repository includes GitHub Actions workflows for automated deployment:

### Production Deployment
- Automatically deploys to production when code is pushed to the `main` branch
- Deploys to both Vercel and Firebase simultaneously

### Preview Deployment
- Automatically creates preview deployments for pull requests
- Provides preview URLs in PR comments

### Required Secrets

Configure these secrets in your GitHub repository settings (Settings → Secrets and variables → Actions):

**For Vercel:**
- `VERCEL_TOKEN` - Your Vercel authentication token
- `VERCEL_ORG_ID` - Your Vercel organization ID
- `VERCEL_PROJECT_ID` - Your Vercel project ID

**For Firebase:**
- `FIREBASE_SERVICE_ACCOUNT` - Firebase service account JSON

**General:**
- `GEMINI_API_KEY` - Your Gemini API key

## 🛠️ Tech Stack

- **Framework:** React 19 with TypeScript
- **Build Tool:** Vite
- **AI Integration:** Google Gemini API
- **Styling:** Tailwind CSS
- **Deployment:** Vercel, Netlify, Firebase Hosting

## 📝 Project Structure

```
ai-studio/
├── components/          # React components
│   ├── ide/            # IDE workspace components
│   ├── ModelSelector.tsx
│   └── Navigation.tsx
├── features/           # Feature modules
│   ├── ChatInterface.tsx
│   ├── CodeStudio.tsx
│   ├── IdeWorkspace.tsx
│   ├── OmegaDashboard.tsx
│   └── ToolHub.tsx
├── services/           # Business logic and services
│   ├── agentEngine.ts
│   ├── deploymentService.ts
│   ├── fileExportService.ts
│   ├── geminiService.ts
│   ├── omegaEngine.ts
│   ├── persistenceService.ts
│   ├── projectTemplates.ts
│   └── virtualFileSystem.ts
├── .github/workflows/  # CI/CD workflows
├── App.tsx            # Main application component
├── index.tsx          # Application entry point
└── vite.config.ts     # Vite configuration
```

## 🔐 Environment Variables

Create a `.env.local` file in the root directory:

```env
GEMINI_API_KEY=your_gemini_api_key_here
```

## 📄 License

This project is part of AI Studio. See the AI Studio terms of service for more information.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support and questions, please refer to the [AI Studio documentation](https://ai.studio/docs).
