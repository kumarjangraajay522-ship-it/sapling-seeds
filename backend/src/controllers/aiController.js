/**
 * Sapling Seeds Assistant - Real-time AI Logic
 * This controller handles conversational queries about sustainability and the brand.
 */

const KNOWLEDGE_BASE = {
  greetings: [
    "Hi there! I'm your Sapling Seeds Assistant. How can I help you save the planet today? 🌿",
    "Hello! Ready to make some sustainable choices? I'm here to guide you. 🌍",
    "Hi! Welcome to the green side. How can I assist you? 🌱",
    "Greetings, Earth Saver! 👋 I'm here to help you navigate our eco-friendly collection."
  ],
  sustainability: [
    "Sustainability is at the heart of everything we do. By choosing bamboo over plastic, you're helping reduce waste that takes 500 years to decompose! 🌿",
    "Every small swap counts. A bamboo toothbrush might seem small, but if everyone made the switch, we'd save billions of plastic brushes from landfills. 🌍",
    "We use 100% plastic-free packaging. Our mailers are made of recycled paper and our tape is water-activated. 📦",
    "Did you know? Bamboo is the fastest-growing plant on Earth and requires no pesticides to grow. It's truly nature's miracle material! 🎋"
  ],
  shipping: [
    "We offer carbon-neutral shipping across India! 🚚 It usually takes 3-5 business days. Free shipping on orders over ₹499!",
    "Your order is packed with love and zero plastic. We track every delivery to ensure it reaches you sustainably. ♻️",
    "We use recycled kraft paper and water-based inks for all our shipping labels. Even the tape is biodegradable! 🏷️"
  ],
  products: [
    "Our bestsellers include the Herbal Neem Combs and the Seed Pens (yes, you can plant them after use!). 🌿",
    "Looking for gifts? Our Eco Gift Sets are perfect for any occasion and come in premium, Earth-friendly packaging. 🎁",
    "Check out our new Bamboo Toothbrushes! They come in Charcoal and Soft Fibre variants to suit your preference. 🪥"
  ],
  bamboo: [
    "Bamboo is incredibly strong yet completely biodegradable. Our products use sustainably harvested bamboo that doesn't interfere with panda habitats! 🐼🎋",
    "Bamboo products naturally resist bacteria and odors, making them perfect for oral care and kitchenware. ✨"
  ]
};

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "No message provided" });
    
    const msg = message.toLowerCase();
    let response = "";

    // Comprehensive Intent Matching
    if (msg.includes("hi") || msg.includes("hello") || msg.includes("hey")) {
      response = KNOWLEDGE_BASE.greetings[Math.floor(Math.random() * KNOWLEDGE_BASE.greetings.length)];
    } else if (msg.includes("sustainable") || msg.includes("sustainability") || msg.includes("plastic") || msg.includes("planet") || msg.includes("earth") || msg.includes("environment")) {
      response = KNOWLEDGE_BASE.sustainability[Math.floor(Math.random() * KNOWLEDGE_BASE.sustainability.length)];
    } else if (msg.includes("shipping") || msg.includes("delivery") || msg.includes("track") || msg.includes("order") || msg.includes("receive")) {
      response = KNOWLEDGE_BASE.shipping[Math.floor(Math.random() * KNOWLEDGE_BASE.shipping.length)];
    } else if (msg.includes("product") || msg.includes("best") || msg.includes("gift") || msg.includes("buy") || msg.includes("recommend")) {
      response = KNOWLEDGE_BASE.products[Math.floor(Math.random() * KNOWLEDGE_BASE.products.length)];
    } else if (msg.includes("bamboo") || msg.includes("material") || msg.includes("wood")) {
      response = KNOWLEDGE_BASE.bamboo[Math.floor(Math.random() * KNOWLEDGE_BASE.bamboo.length)];
    } else if (msg.includes("who are you") || msg.includes("name") || msg.includes("assistant") || msg.includes("bamboo buddy")) {
      response = "I'm the Sapling Seeds Assistant! My mission is to help you transition to a zero-waste lifestyle with ease and style. 🌿✨";
    } else if (msg.includes("price") || msg.includes("cost") || msg.includes("expensive")) {
      response = "Sustainability shouldn't be a luxury! Our products start as low as ₹99. We keep our prices accessible so everyone can join the green revolution. 💚";
    } else {
      // Dynamic fallback
      const fallbacks = [
        "That's a great point! 🌿 While I'm still evolving, I can tell you that every purchase at Sapling & Seeds contributes to a cleaner Earth. What else would you like to know?",
        "I'm learning more every day! 🌱 Currently, I'm an expert on our bamboo range and zero-waste shipping. Would you like to hear about those?",
        "Love your curiosity! 🌍 Feel free to ask about our eco-friendly combs, toothbrushes, or how we pack our orders without plastic."
      ];
      response = fallbacks[Math.floor(Math.random() * fallbacks.length)];
    }

    // Artificial "Real-time" delay for better UX
    const delay = Math.max(800, Math.min(2000, msg.length * 15));
    
    setTimeout(() => {
      res.status(200).json({
        success: true,
        reply: response,
        botName: "Sapling Seeds Assistant"
      });
    }, delay);

  } catch (error) {
    console.error("AI Controller Error:", error);
    res.status(500).json({ success: false, error: "My brain hit a snag! Please try again in a moment. 🌿" });
  }
};
