const express = require('express');
const router = express.Router();
const axios = require('axios');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

/**
 * Dynamically fetch the N8N_CHAT_URL from process.env or server/.env
 */
function getN8nUrl(req) {
  // Check header first
  if (req.headers['x-n8n-chat-url'] && req.headers['x-n8n-chat-url'].trim()) {
    return req.headers['x-n8n-chat-url'].trim();
  }

  // Reload .env if present to catch live changes without requiring server restart
  const envPath = path.resolve(__dirname, '../.env');
  if (fs.existsSync(envPath)) {
    try {
      const envConfig = dotenv.parse(fs.readFileSync(envPath));
      if (envConfig.N8N_CHAT_URL) {
        return envConfig.N8N_CHAT_URL.trim();
      }
    } catch (e) {
      // Fallback to process.env if parsing fails
    }
  }

  return process.env.N8N_CHAT_URL ? process.env.N8N_CHAT_URL.trim() : null;
}

/**
 * Helper function to extract reply text from various n8n response payload formats
 */
function extractN8nReply(data) {
  if (!data) return null;

  // Handle string response directly
  if (typeof data === 'string') return data;

  // Handle array returned by n8n nodes e.g. [ { output: "..." } ] or [ { text: "..." } ]
  if (Array.isArray(data) && data.length > 0) {
    return extractN8nReply(data[0]);
  }

  // Handle JSON object returned by n8n
  if (typeof data === 'object') {
    if (data.json) return extractN8nReply(data.json);
    
    const possibleTextKeys = ['text', 'output', 'message', 'reply', 'response', 'result'];
    for (const key of possibleTextKeys) {
      if (typeof data[key] === 'string' && data[key].trim()) {
        return data[key];
      }
    }

    if (typeof data.body === 'string') return data.body;
    if (typeof data.data === 'string') return data.data;
  }

  return null;
}

router.post('/', async (req, res) => {
  const { message, conversationHistory, sessionId } = req.body;
  
  if (!message || !message.trim()) {
    return res.status(400).json({ error: "Message content cannot be empty." });
  }

  const n8nUrl = getN8nUrl(req);

  if (
    !n8nUrl ||
    n8nUrl.includes('PASTE_YOUR_N8N_URL_HERE') ||
    n8nUrl.includes('your-n8n-instance.com') ||
    n8nUrl.trim() === ''
  ) {
    return res.status(530).json({
      error: "N8N_CHAT_URL is set to a placeholder or is not configured.",
      reply: "Please paste your real n8n production webhook URL into server/.env (N8N_CHAT_URL=...)"
    });
  }

  try {
    const payload = {
      message: message,
      chatInput: message,
      sessionId: sessionId || "mahakal-user-session",
      history: conversationHistory || []
    };

    const headers = {
      'Content-Type': 'application/json'
    };

    if (process.env.N8N_BEARER_TOKEN) {
      headers['Authorization'] = `Bearer ${process.env.N8N_BEARER_TOKEN}`;
    }

    const n8nResponse = await axios.post(n8nUrl, payload, {
      headers,
      timeout: 45000 // 45s timeout for AI workflows
    });

    const replyText = extractN8nReply(n8nResponse.data);

    if (!replyText) {
      return res.status(500).json({
        error: "Empty or unexpected response structure received from n8n workflow.",
        reply: "Received an unparseable response format from n8n workflow."
      });
    }

    return res.json({
      reply: replyText,
      success: true
    });

  } catch (error) {
    console.error("[n8n Chatbot Integration Error]:", error.message);
    
    if (error.code === 'ECONNABORTED') {
      return res.status(504).json({
        error: "n8n response timed out.",
        reply: "The AI assistant took too long to respond. Please try again."
      });
    }

    if (error.response) {
      return res.status(error.response.status || 502).json({
        error: `n8n returned error status ${error.response.status}`,
        reply: `n8n chatbot server returned an error (${error.response.status}). Please check your n8n workflow.`
      });
    }

    return res.status(502).json({
      error: `Failed to communicate with n8n endpoint (${error.message})`,
      reply: `Unable to connect to n8n URL (${error.message}). Please verify the N8N_CHAT_URL in server/.env.`
    });
  }
});

module.exports = router;


