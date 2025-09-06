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
    console.log('🌱 Starting database seeding...');

    // First, ensure tables exist
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'citizen',
        team VARCHAR(100) DEFAULT 'Team Alpha',
        status VARCHAR(50) DEFAULT 'active',
        telegram_id VARCHAR(100),
        location VARCHAR(255),
        phone VARCHAR(20),
        organization VARCHAR(255),
        expertise TEXT[],
        preferences JSONB DEFAULT '{"notifications": true, "emailUpdates": true, "dataSharing": true}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_activity TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS faqs (
        id SERIAL PRIMARY KEY,
        category VARCHAR(100) NOT NULL,
        subcategory VARCHAR(100) DEFAULT 'General',
        question TEXT NOT NULL,
        answer TEXT NOT NULL,
        priority VARCHAR(20) DEFAULT 'medium',
        tags TEXT[],
        media TEXT[],
        importance VARCHAR(20) DEFAULT 'normal',
        view_count INTEGER DEFAULT 0,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS daily_updates (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'announcement',
        priority VARCHAR(20) DEFAULT 'normal',
        tags TEXT[],
        media TEXT[],
        scheduled_date TIMESTAMP,
        published_date TIMESTAMP,
        status VARCHAR(20) DEFAULT 'draft',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id),
        type VARCHAR(50) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // Check if data already exists
    const existingFaqs = await sql`SELECT COUNT(*) as count FROM faqs`;
    const existingUsers = await sql`SELECT COUNT(*) as count FROM users`;
    const existingUpdates = await sql`SELECT COUNT(*) as count FROM daily_updates`;

    if (existingFaqs[0].count > 0 || existingUsers[0].count > 0 || existingUpdates[0].count > 0) {
      console.log('📊 Database already has data, skipping seed');
      return {
        statusCode: 200,
        headers: {
          ...headers,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          success: true, 
          message: 'Database already has data',
          counts: {
            faqs: existingFaqs[0].count,
            users: existingUsers[0].count,
            updates: existingUpdates[0].count
          }
        }),
      };
    }

    // Seed FAQ data
    console.log('📝 Adding FAQ data...');
    const faqData = [
      {
        category: 'ESCOM Organization',
        subcategory: 'Getting Started',
        question: 'What is ESCOM and how can I get involved?',
        answer: 'ESCOM (Environmental Science and Coastal Monitoring) is a citizen science organization focused on coastal environmental monitoring. You can get involved by joining our monitoring program, participating in training sessions, and contributing to data collection. We offer both online and in-person training opportunities.',
        priority: 'high',
        tags: ['getting-started', 'organization', 'volunteer'],
        media: [],
        importance: 'critical',
        view_count: 156,
        status: 'active'
      },
      {
        category: 'Monitoring',
        subcategory: 'Equipment',
        question: 'What parameters do we monitor and what equipment is needed?',
        answer: 'We monitor water temperature, salinity, pH levels, turbidity, dissolved oxygen, and overall water quality using specialized equipment. Basic monitoring requires: water testing kit, pH strips, thermometer, measuring tape, and a smartphone with the ESCOM app. Advanced monitoring may include: dissolved oxygen meter, turbidity tube, and GPS device.',
        priority: 'high',
        tags: ['monitoring', 'equipment', 'parameters'],
        media: [],
        importance: 'critical',
        view_count: 234,
        status: 'active'
      },
      {
        category: 'Data Collection',
        subcategory: 'Best Practices',
        question: 'How often should I collect data and what are the best practices?',
        answer: 'We recommend collecting data weekly during normal conditions and daily during extreme weather events. Best practices include: ensuring hands are clean, testing area is stable, recording measurements immediately, submitting data within 2 hours of collection, and working in pairs when possible for safety.',
        priority: 'high',
        tags: ['data-collection', 'frequency', 'best-practices', 'safety'],
        media: [],
        importance: 'critical',
        view_count: 189,
        status: 'active'
      },
      {
        category: 'Safety',
        subcategory: 'Field Work',
        question: 'What safety precautions should I take during monitoring?',
        answer: 'Always check weather conditions before monitoring, wear appropriate safety gear, work in pairs when possible, avoid monitoring during severe weather, bring a first aid kit, inform someone of your location and expected return time, and follow all local safety regulations.',
        priority: 'high',
        tags: ['safety', 'field-work', 'weather', 'precautions'],
        media: [],
        importance: 'critical',
        view_count: 178,
        status: 'active'
      },
      {
        category: 'Training',
        subcategory: 'Certification',
        question: 'How do I get certified for monitoring and what training is available?',
        answer: 'Complete our online training modules, attend a hands-on workshop, and pass the certification test. Certification is valid for 2 years and includes ongoing support. We offer both basic and advanced monitoring certifications, as well as specialized training for different types of coastal environments.',
        priority: 'medium',
        tags: ['training', 'certification', 'workshop', 'education'],
        media: [],
        importance: 'high',
        view_count: 145,
        status: 'active'
      },
      {
        category: 'Data Submission',
        subcategory: 'Technical',
        question: 'How do I submit my monitoring data through the app?',
        answer: 'Open the ESCOM app, navigate to the Submit Reading section, fill in all required fields including location, time, and measurements, take photos if applicable, review your data for accuracy, and submit. Data should be submitted within 2 hours of collection for best accuracy.',
        priority: 'medium',
        tags: ['data-submission', 'app', 'technical', 'process'],
        media: [],
        importance: 'high',
        view_count: 123,
        status: 'active'
      },
      {
        category: 'Troubleshooting',
        subcategory: 'Equipment',
        question: 'What should I do if my equipment is not working properly?',
        answer: 'First, check if the equipment needs calibration or battery replacement. Clean all sensors according to manufacturer instructions. If problems persist, contact your team leader or the equipment support team. Always have backup equipment available and never submit data from malfunctioning equipment.',
        priority: 'medium',
        tags: ['troubleshooting', 'equipment', 'maintenance', 'support'],
        media: [],
        importance: 'normal',
        view_count: 89,
        status: 'active'
      },
      {
        category: 'Community',
        subcategory: 'Events',
        question: 'What community events and activities does ESCOM organize?',
        answer: 'ESCOM organizes monthly coastal cleanup events, data review meetings, training workshops, research collaboration sessions, and annual conferences. We also host online webinars, virtual training sessions, and community forums for knowledge sharing and networking.',
        priority: 'low',
        tags: ['community', 'events', 'networking', 'collaboration'],
        media: [],
        importance: 'normal',
        view_count: 67,
        status: 'active'
      }
    ];

    for (const faq of faqData) {
      await sql`
        INSERT INTO faqs (category, subcategory, question, answer, priority, tags, media, importance, view_count, status)
        VALUES (${faq.category}, ${faq.subcategory}, ${faq.question}, ${faq.answer}, ${faq.priority}, ${faq.tags}, ${faq.media}, ${faq.importance}, ${faq.view_count}, ${faq.status})
      `;
    }

    // Seed User data
    console.log('👥 Adding User data...');
    const userData = [
      {
        name: 'Dr. Maria Santos',
        email: 'maria.santos@escom.org',
        username: 'maria.santos',
        password: 'admin123',
        role: 'admin',
        team: 'Research Team',
        status: 'active',
        telegram_id: '@maria_santos',
        location: 'San Francisco, CA',
        phone: '+1-555-0123',
        organization: 'ESCOM Research',
        expertise: ['Marine Biology', 'Data Analysis', 'Coastal Ecology'],
        preferences: { notifications: true, emailUpdates: true, dataSharing: true }
      },
      {
        name: 'Carlos Silva',
        email: 'carlos.silva@email.com',
        username: 'carlos.silva',
        password: 'password123',
        role: 'citizen',
        team: 'Team Alpha',
        status: 'active',
        telegram_id: '@carlos_silva',
        location: 'Los Angeles, CA',
        phone: '+1-555-0124',
        organization: 'Local Community Group',
        expertise: ['Water Quality', 'Field Monitoring'],
        preferences: { notifications: true, emailUpdates: false, dataSharing: true }
      },
      {
        name: 'Emily Johnson',
        email: 'emily.johnson@email.com',
        username: 'emily.johnson',
        password: 'password123',
        role: 'citizen',
        team: 'Team Beta',
        status: 'active',
        telegram_id: '@emily_johnson',
        location: 'Seattle, WA',
        phone: '+1-555-0125',
        organization: 'Environmental Club',
        expertise: ['Marine Conservation', 'Public Education'],
        preferences: { notifications: true, emailUpdates: true, dataSharing: false }
      },
      {
        name: 'David Kim',
        email: 'david.kim@email.com',
        username: 'david.kim',
        password: 'password123',
        role: 'citizen',
        team: 'Team Gamma',
        status: 'inactive',
        telegram_id: '@david_kim',
        location: 'Portland, OR',
        phone: '+1-555-0126',
        organization: 'University Research',
        expertise: ['Oceanography', 'Climate Science'],
        preferences: { notifications: false, emailUpdates: true, dataSharing: true }
      }
    ];

    for (const user of userData) {
      await sql`
        INSERT INTO users (name, email, username, password, role, team, status, telegram_id, location, phone, organization, expertise, preferences)
        VALUES (${user.name}, ${user.email}, ${user.username}, ${user.password}, ${user.role}, ${user.team}, ${user.status}, ${user.telegram_id}, ${user.location}, ${user.phone}, ${user.organization}, ${user.expertise}, ${JSON.stringify(user.preferences)})
      `;
    }

    // Seed Daily Updates data
    console.log('📰 Adding Daily Updates data...');
    const updateData = [
      {
        title: 'New Monitoring Equipment Available',
        content: 'We have received new water quality monitoring equipment including advanced pH meters and turbidity sensors. Training sessions will be scheduled next week. Please contact your team leader to reserve your spot.',
        type: 'announcement',
        priority: 'high',
        tags: ['equipment', 'training', 'monitoring'],
        media: [],
        status: 'published',
        published_date: new Date().toISOString()
      },
      {
        title: 'Monthly Data Review Meeting',
        content: 'Join us for our monthly data review meeting where we analyze trends and discuss findings. All citizen scientists welcome! We\'ll be reviewing January data and planning February monitoring activities.',
        type: 'meeting',
        priority: 'medium',
        tags: ['meeting', 'data-review', 'collaboration'],
        media: [],
        status: 'published',
        published_date: new Date().toISOString()
      },
      {
        title: 'Weather Alert: Storm Approaching',
        content: 'Heavy rainfall expected this weekend. Please avoid monitoring during severe weather conditions for safety. Data collection can resume once conditions improve.',
        type: 'alert',
        priority: 'high',
        tags: ['weather', 'safety', 'alert'],
        media: [],
        status: 'published',
        published_date: new Date().toISOString()
      },
      {
        title: 'Coastal Cleanup Event',
        content: 'Join our monthly coastal cleanup event this Saturday. We\'ll be cleaning up Beach Point A and collecting data on marine debris. Bring your monitoring equipment!',
        type: 'event',
        priority: 'medium',
        tags: ['cleanup', 'event', 'volunteer'],
        media: [],
        status: 'published',
        published_date: new Date().toISOString()
      }
    ];

    for (const update of updateData) {
      await sql`
        INSERT INTO daily_updates (title, content, type, priority, tags, media, status, published_date)
        VALUES (${update.title}, ${update.content}, ${update.type}, ${update.priority}, ${update.tags}, ${update.media}, ${update.status}, ${update.published_date})
      `;
    }

    // Seed Notifications data
    console.log('🔔 Adding Notifications data...');
    const notificationData = [
      {
        user_id: null, // Global notification
        type: 'info',
        title: 'Welcome to ESCOM!',
        message: 'Thank you for joining our coastal monitoring community. Complete your profile to get started.',
        read: false
      },
      {
        user_id: null,
        type: 'success',
        title: 'Data Submission Successful',
        message: 'Your water quality readings have been recorded. Great work!',
        read: false
      },
      {
        user_id: null,
        type: 'warning',
        title: 'Equipment Maintenance Due',
        message: 'Your pH meter is due for calibration. Schedule maintenance within the next week.',
        read: false
      }
    ];

    for (const notification of notificationData) {
      await sql`
        INSERT INTO notifications (user_id, type, title, message, read)
        VALUES (${notification.user_id}, ${notification.type}, ${notification.title}, ${notification.message}, ${notification.read})
      `;
    }

    console.log('✅ Database seeding completed successfully');

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        success: true, 
        message: 'Database seeded successfully',
        data: {
          faqs: faqData.length,
          users: userData.length,
          updates: updateData.length,
          notifications: notificationData.length
        }
      }),
    };

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    
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
