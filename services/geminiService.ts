
import { IT_CATEGORIES } from '../constants';
import { ITProblemCategory } from '../types';

type ChatHistory = { role: 'user' | 'model'; parts: { text: string }[] }[];

const CATEGORY_LIST = IT_CATEGORIES.map(c => `${c.id}. ${c.title}`).join('\n');

function detectCategory(text: string): ITProblemCategory | null {
  const lower = text.toLowerCase();
  if (/\b(1|login|password|access|locked|account|forgot|reset|credentials|otp|2fa|vpn|remote|sign in|sign-in)\b/.test(lower)) return IT_CATEGORIES[0];
  if (/\b(2|slow|frozen|crash|error|software|app|system|performance|loading|stuck|freezing|not responding|lagging)\b/.test(lower)) return IT_CATEGORIES[1];
  if (/\b(3|internet|wifi|wi-fi|network|connection|offline|disconnected|browser|no signal|pages)\b/.test(lower)) return IT_CATEGORIES[2];
  if (/\b(4|email|mail|outlook|inbox|attachment|send|receive|mailbox|spam|junk|storage)\b/.test(lower)) return IT_CATEGORIES[3];
  if (/\b(5|printer|print|screen|monitor|computer|dark|startup|hardware|keyboard|mouse|projector|paper jam)\b/.test(lower)) return IT_CATEGORIES[4];
  return null;
}

function isGreeting(text: string): boolean {
  return /^(hi+|hello+|hey+|good\s+(morning|afternoon|evening)|help|start|begin|akwaaba|please\s+help)[\s!?.]*$/i.test(text.trim());
}

function buildCategoryResponse(cat: ITProblemCategory): string {
  const causes = cat.causes.map(c => `- ${c}`).join('\n');
  const steps = cat.solutions.map((s, i) => `${i + 1}. ${s}`).join('\n');
  return `I can help you with that. This looks like a ${cat.title} issue.\n\nCommon causes:\n${causes}\n\nSteps to resolve:\n${steps}\n\nIf these steps do not fix the issue, click the Escalate button below to open an Emergency Ticket and a human IT agent will assist you shortly.`;
}

function buildResponse(userMessage: string, history: ChatHistory): string {
  const lower = userMessage.toLowerCase().trim();

  // Category number shortcut (1-5) — match even if user types "5." or "5 " etc.
  const numMatch = lower.match(/^[1-5][\s.)]?$/);
  if (numMatch) {
    return buildCategoryResponse(IT_CATEGORIES[parseInt(numMatch[0]) - 1]);
  }

  // Greeting or short unclear input
  if (isGreeting(lower) || lower.length <= 3) {
    return `Akwaaba! I am your FixChat IT Helpdesk Assistant.\n\nPlease select a category or describe your IT problem:\n\n${CATEGORY_LIST}\n\nOr simply type your issue and I will help you directly.`;
  }

  // Critical/outage keywords — suggest escalation immediately
  if (/\b(urgent|emergency|critical|outage|whole office|everyone affected|server down|system down|cannot work)\b/i.test(lower)) {
    return `This sounds like a critical issue that needs immediate attention.\n\nI recommend opening an Emergency Ticket right away using the Escalate button below. Our IT team will prioritise your case.\n\nWhile waiting:\n- Check if colleagues are also affected.\n- Note the exact error message if any.\n- Do not restart any shared server without IT approval.`;
  }

  // Previous steps didn't work
  if (history.length >= 2 && /\b(still|didn't work|not working|same issue|tried that|already did|no luck|doesn't help)\b/i.test(lower)) {
    return `I understand those steps did not resolve your issue. Let us escalate this.\n\n1. Note the exact error message shown on your screen.\n2. Take a screenshot if possible.\n3. Click the Escalate button below to open an Emergency Ticket.\n\nInclude as much detail as possible and our human IT support team will contact you directly.`;
  }

  // Thank you / resolved
  if (/\b(thank|thanks|solved|fixed|working now|it works|great|awesome|perfect)\b/i.test(lower)) {
    return `You are welcome! I am glad the issue is resolved.\n\nIf you ever run into another IT problem, do not hesitate to reach out. Have a productive day!`;
  }

  // Category-matched response
  const cat = detectCategory(lower);
  if (cat) {
    return buildCategoryResponse(cat);
  }

  // Fallback
  return `Thank you for reaching out to FixChat IT Helpdesk.\n\nI could not find an exact match for your issue. Please select a category below or describe your problem in more detail:\n\n${CATEGORY_LIST}\n\nAlternatively, click the Escalate button to open an Emergency Ticket for direct human IT support.`;
}

class LocalChatService {
  async *sendMessageStream(history: ChatHistory, prompt: string) {
    const response = buildResponse(prompt, history);

    // Simulate typing effect by yielding word by word
    const words = response.split(' ');
    for (let i = 0; i < words.length; i++) {
      yield { text: words[i] + (i < words.length - 1 ? ' ' : '') };
      await new Promise<void>(resolve => setTimeout(resolve, 18));
    }
  }
}

export const geminiService = new LocalChatService();
