<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://ai.google.dev/static/site-assets/images/share-ais-513315318.png" />
</div>

# COLOUR TONE frontend

This is the React/Vite frontend for the COLOUR TONE decorative wall-texture and painting-services website. The customer account and booking APIs live in the sibling `backend` folder.

View your app in AI Studio: https://ai.studio/apps/658ae005-88f5-4a72-93cc-eb3f4644b408

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies: `npm install`
2. Copy `.env.example` to `.env.local`.
3. Set `VITE_API_URL` to the running backend URL, normally `http://localhost:4000/api`.
4. Set `VITE_WHATSAPP_NUMBER=919972717446` for the COLOUR TONE WhatsApp and SMS contact
   buttons. It is a digits-only international number and is used only to prepare messages;
   customers still review and send them manually.
5. Run the app: `npm run dev`

The frontend uses HTTP-only cookie sessions through the backend; authentication data and passwords are not stored in localStorage.
