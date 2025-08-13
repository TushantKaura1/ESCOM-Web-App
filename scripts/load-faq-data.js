// load-faq-data.js - Load sample FAQ data into MongoDB
const mongoose = require('mongoose');
require('dotenv').config();

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/escom';

// FAQ Schema
const FAQSchema = new mongoose.Schema({
  category: { type: String, required: true },
  subcategory: { type: String, required: true },
  question: { type: String, required: true },
  answer: { type: String, required: true },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const FAQ = mongoose.model('FAQ', FAQSchema);

// Sample FAQ data
const sampleFAQs = [
  // ESCOM Organization
  {
    category: 'ESCOM Organization',
    subcategory: 'Getting Involved',
    question: 'How much time does participation require?',
    answer: 'Once a month for approximately 1 hour, with flexible scheduling.',
    order: 1
  },
  {
    category: 'ESCOM Organization',
    subcategory: 'Getting Involved',
    question: 'Is there a deadline to join?',
    answer: 'You can join anytime! Support continues until November 2024.',
    order: 2
  },
  {
    category: 'ESCOM Organization',
    subcategory: 'Getting Involved',
    question: 'Do I need prior scientific knowledge?',
    answer: 'No prior knowledge required—just enthusiasm!',
    order: 3
  },
  {
    category: 'ESCOM Organization',
    subcategory: 'Benefits',
    question: 'What do I gain from participating?',
    answer: 'Certificate and valuable coastal science skills.',
    order: 1
  },
  {
    category: 'ESCOM Organization',
    subcategory: 'Benefits',
    question: 'How does this benefit my community?',
    answer: 'Your data helps make informed coastal management decisions.',
    order: 2
  },
  
  // Monitoring
  {
    category: 'Monitoring',
    subcategory: 'Parameters',
    question: 'What parameters do we monitor?',
    answer: 'Water quality, temperature, salinity, pH levels, and coastal erosion.',
    order: 1
  },
  {
    category: 'Monitoring',
    subcategory: 'Parameters',
    question: 'How often should I take measurements?',
    answer: 'Monthly measurements recommended, with additional readings during extreme weather.',
    order: 2
  },
  {
    category: 'Monitoring',
    subcategory: 'Protocols',
    question: 'What safety protocols should I follow?',
    answer: 'Wear safety gear, never monitor alone in dangerous conditions.',
    order: 1
  },
  {
    category: 'Monitoring',
    subcategory: 'Protocols',
    question: 'How do I calibrate my instruments?',
    answer: 'Calibration instructions are provided in your training manual.',
    order: 2
  },
  
  // Training
  {
    category: 'Training',
    subcategory: 'Resources',
    question: 'Where can I find training materials?',
    answer: 'Access our comprehensive wiki and training manuals through the ESCOM portal.',
    order: 1
  },
  {
    category: 'Training',
    subcategory: 'Resources',
    question: 'Are there video tutorials?',
    answer: 'Yes, we offer video tutorials covering all monitoring procedures.',
    order: 2
  },
  
  // Data
  {
    category: 'Data',
    subcategory: 'Entry',
    question: 'How do I enter my monitoring data?',
    answer: 'Use our mobile app or web portal to enter data immediately after collection.',
    order: 1
  },
  {
    category: 'Data',
    subcategory: 'Entry',
    question: 'What if I make an error in data entry?',
    answer: 'Contact your team leader immediately for corrections.',
    order: 2
  },
  {
    category: 'Data',
    subcategory: 'Sharing',
    question: 'Who owns the data I collect?',
    answer: 'You retain ownership while contributing to community research.',
    order: 1
  },
  {
    category: 'Data',
    subcategory: 'Sharing',
    question: 'How is data shared with researchers?',
    answer: 'Data is shared anonymously with your explicit consent.',
    order: 2
  },
  
  // Partners
  {
    category: 'Partners',
    subcategory: 'Dalhousie',
    question: 'What is Dalhousie\'s role?',
    answer: 'Dalhousie provides scientific oversight, training, and research collaboration.',
    order: 1
  },
  {
    category: 'Partners',
    subcategory: 'Dalhousie',
    question: 'Can I interact with Dalhousie researchers?',
    answer: 'Yes, regular webinars and Q&A sessions are held.',
    order: 2
  }
];

async function loadFAQData() {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB');

    // Clear existing FAQs
    await FAQ.deleteMany({});
    console.log('🗑️ Cleared existing FAQ data');

    // Load sample FAQs
    for (const faq of sampleFAQs) {
      const newFAQ = new FAQ(faq);
      await newFAQ.save();
      console.log(`📝 FAQ loaded: ${faq.category} - ${faq.subcategory} - ${faq.question.substring(0, 50)}...`);
    }

    console.log(`✅ Successfully loaded ${sampleFAQs.length} FAQ entries`);
    
    // Verify loaded FAQs
    const totalFAQs = await FAQ.countDocuments();
    console.log(`📊 Total FAQs in database: ${totalFAQs}`);

  } catch (error) {
    console.error('❌ Error loading FAQ data:', error);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
  }
}

// Run the script
if (require.main === module) {
  loadFAQData();
}

module.exports = { loadFAQData }; 