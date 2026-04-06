# ToxicTracker

**ToxicTracker** is a professional privacy-focused tool to analyze your Instagram followers and following without ever sharing your password. Discover who unfollowed you, who doesn't follow you back, and track your digital circle with 100% local data processing.

## Project Structure

This is a professional setup focused on client-side privacy:

- `/frontend`: React + Vite + TailwindCSS (Modern, glossy UI)
- `/extension`: The Chrome extension used for local data extraction
- `/backend`: Legacy Spring Boot application (Optional)

## Getting Started

### Prerequisites

- **Node.js**: v18 or higher
- **Java**: JDK 17
- **Maven**: (mvnw included in backend)

### Setup & Run

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Run All Services**:
   ```bash
   # From the root directory
   npm run dev:frontend
   ```
   *(The backend server is no longer strictly required since analysis runs directly in the browser via the extension)*.

## Privacy First (Cybersecurity)

ToxicTracker is built with a security-first mindset. Unlike other apps that request your Instagram credentials, we only process local data using a native Chrome extension. The extension fetches your relationship data directly from your active browser session and computes the mathematical differences locally in React. Your account is never at risk, and your data never leaves your device.

## Technology Stack

- **Frontend**: React, Framer Motion, Lucide React, TailwindCSS, Vite.
- **Extension**: Manifest V3, pure JavaScript.
- **Data Storage**: LocalStorage (100% ephemeral and browser-based).

---
© 2026 ToxicTracker - Independent Community Project.
