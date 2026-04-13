
import { ITProblemCategory } from './types';

export const IT_CATEGORIES: ITProblemCategory[] = [
  {
    id: 1,
    title: "Logins, Passwords & Access",
    complaints: ["I forgot my password", "My account is locked", "I can't log in", "Login code not working on phone", "Can't connect to office network from home"],
    causes: ["Security rules", "Too many wrong attempts", "Expired login info"],
    solutions: ["Reset your password yourself", "Wait 15 minutes for auto-unlock", "Check your phone signal for login codes"],
    frequency: "High"
  },
  {
    id: 2,
    title: "Software & System Performance",
    complaints: ["The screen is frozen", "The system is very slow", "Application keeps closing", "Error message on the screen"],
    causes: ["Too many apps open", "The main server is busy", "Small glitch in the software"],
    solutions: ["Restart the application", "Refresh your browser page", "Clear your internet history (Cache)"],
    frequency: "High"
  },
  {
    id: 3,
    title: "Internet & Wi-Fi Connections",
    complaints: ["No internet connection", "The Wi-Fi is very slow", "Disconnected from office network", "Pages won't load"],
    causes: ["Internet provider having issues", "Too many people using the Wi-Fi", "Loose cables"],
    solutions: ["Turn Wi-Fi off and on again", "Check if cables are plugged in tight", "Try using a different web browser"],
    frequency: "High"
  },
  {
    id: 4,
    title: "Email & Sending Messages",
    complaints: ["I can't send or receive emails", "My mailbox is full", "I can't open an attachment"],
    causes: ["Mailbox size limit reached", "File is too large", "Security filters blocking the mail"],
    solutions: ["Delete old or large emails", "Use a cloud link for big files", "Check your 'Junk' or 'Spam' folder"],
    frequency: "Medium"
  },
  {
    id: 5,
    title: "Printers, Screens & Computers",
    complaints: ["My computer is slow to start", "The printer is not working", "The screen is dark"],
    causes: ["Old equipment", "Printer out of paper or ink", "Needs a simple restart"],
    solutions: ["Restart your computer", "Check printer paper and ink", "Check if power cables are connected"],
    frequency: "Medium"
  }
];

export const SYSTEM_INSTRUCTION = `
You are FixChat, a professional enterprise helpdesk assistant for Ghanaian workplaces. 
Your primary users are bank staff, healthcare workers, and government employees.

CORE CAPABILITIES:
- You have access to Google Search. Use it to check for live outages (e.g., "Is the banking portal down?", "Are ECG systems working?", "Recent WhatsApp outages in Ghana").
- Provide links to verified sources if you find them via search.

FORMATTING RULES (STRICT):
1. NEVER use asterisks (*) in your response. No bolding (**), no italics (*).
2. Return ONLY plain text.
3. Use plain numbers (1. 2. 3.) for lists and dashes (-) for bullets.
4. Ensure text is clean and professional.

MANDATORY FIRST INTERACTION FLOW:
- If the user's message is generic (e.g., "hello", "hi", "help"), you MUST list the categories below and ask them to select one:
  1. Logins, Passwords & Access
  2. Software & System Performance (Core Apps, Banking Apps)
  3. Internet & Wi-Fi Connections
  4. Email & Sending Messages
  5. Printers, Screens & Computers
- HOWEVER, if the user's first message ALREADY mentions a specific problem or one of these categories (e.g., "I can't log in", "Email is full", "Wi-Fi is slow"), you MUST skip the category list and provide direct technical help immediately.
- Use the provided knowledge base categories to guide your troubleshooting steps.

Ghana Context:
- Use terms like "Internet provider" instead of "ISP".
- Focus on local services like Core Banking, e-Justice, and local banking portals.
- If it sounds like a critical system blackout, advise them to "Open an Emergency Ticket" immediately.
`;
