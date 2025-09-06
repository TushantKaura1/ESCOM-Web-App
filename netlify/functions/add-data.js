import { neon } from '@netlify/neon';

const sql = neon();

export const handler = async (event, context) => {
  // Enable CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  };

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: '',
    };
  }

  try {
    console.log('🌱 Adding additional data to database...');

    // Add more comprehensive FAQ data
    console.log('📝 Adding comprehensive FAQ data...');
    const additionalFaqs = [
      {
        category: 'Data Analysis',
        subcategory: 'Interpretation',
        question: 'How do I interpret my water quality measurements?',
        answer: 'Water quality measurements should be compared to established standards and baseline data. pH should be between 6.5-8.5, temperature variations should be noted, and turbidity readings indicate water clarity. Always consider seasonal variations and local environmental factors when interpreting results.',
        priority: 'high',
        tags: ['data-analysis', 'interpretation', 'standards', 'measurements'],
        media: [],
        importance: 'high',
        view_count: 0,
        status: 'active'
      },
      {
        category: 'Equipment',
        subcategory: 'Maintenance',
        question: 'How often should I calibrate my monitoring equipment?',
        answer: 'Calibrate pH meters before each use, thermometers monthly, and other equipment according to manufacturer recommendations. Keep calibration records and replace equipment that cannot be properly calibrated. Regular maintenance ensures accurate data collection.',
        priority: 'medium',
        tags: ['equipment', 'calibration', 'maintenance', 'accuracy'],
        media: [],
        importance: 'high',
        view_count: 0,
        status: 'active'
      },
      {
        category: 'Safety',
        subcategory: 'Emergency',
        question: 'What should I do in case of an emergency during monitoring?',
        answer: 'If you encounter an emergency, prioritize your safety first. Call emergency services if needed, move to a safe location, and inform your team leader immediately. Always carry a communication device and inform someone of your monitoring schedule and location.',
        priority: 'high',
        tags: ['safety', 'emergency', 'procedures', 'communication'],
        media: [],
        importance: 'critical',
        view_count: 0,
        status: 'active'
      },
      {
        category: 'Community',
        subcategory: 'Collaboration',
        question: 'How can I collaborate with other citizen scientists?',
        answer: 'Join our online forums, participate in team meetings, attend training workshops, and connect through our social media channels. Collaboration includes sharing data, discussing findings, and supporting each other\'s monitoring efforts.',
        priority: 'medium',
        tags: ['community', 'collaboration', 'networking', 'support'],
        media: [],
        importance: 'normal',
        view_count: 0,
        status: 'active'
      },
      {
        category: 'Research',
        subcategory: 'Contributions',
        question: 'How does my data contribute to scientific research?',
        answer: 'Your data helps scientists understand coastal ecosystem health, track environmental changes over time, identify pollution sources, and develop conservation strategies. Citizen science data is published in research papers and used for policy decisions.',
        priority: 'medium',
        tags: ['research', 'contributions', 'science', 'impact'],
        media: [],
        importance: 'high',
        view_count: 0,
        status: 'active'
      }
    ];

    for (const faq of additionalFaqs) {
      await sql`
        INSERT INTO faqs (category, subcategory, question, answer, priority, tags, media, importance, view_count, status)
        VALUES (${faq.category}, ${faq.subcategory}, ${faq.question}, ${faq.answer}, ${faq.priority}, ${faq.tags}, ${faq.media}, ${faq.importance}, ${faq.view_count}, ${faq.status})
      `;
    }

    // Add more users
    console.log('👥 Adding additional users...');
    const additionalUsers = [
      {
        name: 'Sarah Chen',
        email: 'sarah.chen@email.com',
        username: 'sarah.chen',
        password: 'password123',
        role: 'citizen',
        team: 'Team Delta',
        status: 'active',
        telegram_id: '@sarah_chen',
        location: 'Miami, FL',
        phone: '+1-555-0127',
        organization: 'Marine Conservation Society',
        expertise: ['Marine Biology', 'Data Collection'],
        preferences: { notifications: true, emailUpdates: true, dataSharing: true }
      },
      {
        name: 'Michael Rodriguez',
        email: 'michael.rodriguez@email.com',
        username: 'michael.rodriguez',
        password: 'password123',
        role: 'citizen',
        team: 'Team Epsilon',
        status: 'active',
        telegram_id: '@michael_rodriguez',
        location: 'San Diego, CA',
        phone: '+1-555-0128',
        organization: 'Ocean Research Institute',
        expertise: ['Oceanography', 'Water Quality'],
        preferences: { notifications: true, emailUpdates: false, dataSharing: true }
      }
    ];

    for (const user of additionalUsers) {
      await sql`
        INSERT INTO users (name, email, username, password, role, team, status, telegram_id, location, phone, organization, expertise, preferences)
        VALUES (${user.name}, ${user.email}, ${user.username}, ${user.password}, ${user.role}, ${user.team}, ${user.status}, ${user.telegram_id}, ${user.location}, ${user.phone}, ${user.organization}, ${user.expertise}, ${JSON.stringify(user.preferences)})
      `;
    }

    // Add more daily updates
    console.log('📰 Adding additional daily updates...');
    const additionalUpdates = [
      {
        title: 'New Training Module Available',
        content: 'We\'ve released a new online training module on advanced data analysis techniques. This module covers statistical analysis, trend identification, and data visualization. All certified monitors are encouraged to complete this training.',
        type: 'announcement',
        priority: 'medium',
        tags: ['training', 'education', 'data-analysis'],
        media: [],
        status: 'published',
        published_date: new Date().toISOString()
      },
      {
        title: 'Research Collaboration Opportunity',
        content: 'We\'re partnering with the University of Marine Sciences on a new research project studying coastal water quality trends. Citizen scientists with 6+ months of data collection experience are invited to participate.',
        type: 'research',
        priority: 'high',
        tags: ['research', 'collaboration', 'university'],
        media: [],
        status: 'published',
        published_date: new Date().toISOString()
      },
      {
        title: 'Equipment Loan Program',
        content: 'We\'re launching an equipment loan program for citizen scientists who need specialized monitoring tools. Contact your team leader to learn about available equipment and loan procedures.',
        type: 'announcement',
        priority: 'medium',
        tags: ['equipment', 'loan', 'resources'],
        media: [],
        status: 'published',
        published_date: new Date().toISOString()
      }
    ];

    for (const update of additionalUpdates) {
      await sql`
        INSERT INTO daily_updates (title, content, type, priority, tags, media, status, published_date)
        VALUES (${update.title}, ${update.content}, ${update.type}, ${update.priority}, ${update.tags}, ${update.media}, ${update.status}, ${update.published_date})
      `;
    }

    // Add more notifications
    console.log('🔔 Adding additional notifications...');
    const additionalNotifications = [
      {
        user_id: null,
        type: 'info',
        title: 'New Features Available',
        message: 'Check out the latest app updates including improved data visualization and new monitoring parameters.',
        read: false
      },
      {
        user_id: null,
        type: 'success',
        title: 'Monthly Report Ready',
        message: 'Your monthly monitoring report is now available. View your progress and achievements.',
        read: false
      },
      {
        user_id: null,
        type: 'info',
        title: 'Community Challenge',
        message: 'Join our monthly data collection challenge! The team with the most accurate readings wins a prize.',
        read: false
      }
    ];

    for (const notification of additionalNotifications) {
      await sql`
        INSERT INTO notifications (user_id, type, title, message, read)
        VALUES (${notification.user_id}, ${notification.type}, ${notification.title}, ${notification.message}, ${notification.read})
      `;
    }

    // Get final counts
    const faqCount = await sql`SELECT COUNT(*) as count FROM faqs`;
    const userCount = await sql`SELECT COUNT(*) as count FROM users`;
    const updateCount = await sql`SELECT COUNT(*) as count FROM daily_updates`;
    const notificationCount = await sql`SELECT COUNT(*) as count FROM notifications`;

    console.log('✅ Additional data added successfully');

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Additional data added successfully',
        counts: {
          faqs: faqCount[0].count,
          users: userCount[0].count,
          updates: updateCount[0].count,
          notifications: notificationCount[0].count
        }
      }),
    };

  } catch (error) {
    console.error('❌ Error adding data:', error);
    
    return {
      statusCode: 500,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
    };
  }
};
