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
    const { operation, table, data, id, userId } = JSON.parse(event.body || '{}');
    
    console.log('🔄 Database operation:', operation, 'on table:', table);

    let result;

    // Initialize database schema
    if (operation === 'initialize') {
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

      result = { success: true, message: 'Database schema initialized' };
    } else {
      switch (operation) {
        case 'getAll':
          if (table === 'users') {
            result = await sql`SELECT * FROM users ORDER BY created_at DESC`;
            result = result.map(user => ({
              ...user,
              expertise: user.expertise || [],
              preferences: user.preferences || { notifications: true, emailUpdates: true, dataSharing: true }
            }));
          } else if (table === 'faqs') {
            result = await sql`SELECT * FROM faqs ORDER BY created_at DESC`;
            result = result.map(faq => ({
              ...faq,
              tags: faq.tags || [],
              media: faq.media || []
            }));
          } else if (table === 'daily_updates') {
            result = await sql`SELECT * FROM daily_updates ORDER BY created_at DESC`;
            result = result.map(update => ({
              ...update,
              tags: update.tags || [],
              media: update.media || []
            }));
          } else if (table === 'notifications') {
            result = await sql`SELECT * FROM notifications ORDER BY created_at DESC`;
          }
          break;
        
        case 'getById':
          if (table === 'users') {
            const [user] = await sql`SELECT * FROM users WHERE id = ${id}`;
            result = user ? {
              ...user,
              expertise: user.expertise || [],
              preferences: user.preferences || { notifications: true, emailUpdates: true, dataSharing: true }
            } : null;
          } else if (table === 'faqs') {
            const [faq] = await sql`SELECT * FROM faqs WHERE id = ${id}`;
            result = faq ? {
              ...faq,
              tags: faq.tags || [],
              media: faq.media || []
            } : null;
          } else if (table === 'daily_updates') {
            const [update] = await sql`SELECT * FROM daily_updates WHERE id = ${id}`;
            result = update ? {
              ...update,
              tags: update.tags || [],
              media: update.media || []
            } : null;
          } else if (table === 'notifications') {
            const [notification] = await sql`SELECT * FROM notifications WHERE id = ${id}`;
            result = notification || null;
          }
          break;
        
        case 'getByUserId':
          if (table === 'notifications') {
            result = await sql`SELECT * FROM notifications WHERE user_id = ${userId} ORDER BY created_at DESC`;
          }
          break;
        
        case 'create':
          if (table === 'users') {
            const [user] = await sql`
              INSERT INTO users (name, email, username, password, role, team, status, telegram_id, location, phone, organization, expertise, preferences)
              VALUES (${data.name}, ${data.email}, ${data.username}, ${data.password}, ${data.role}, ${data.team}, ${data.status}, ${data.telegramId || null}, ${data.location || null}, ${data.phone || null}, ${data.organization || null}, ${data.expertise || []}, ${JSON.stringify(data.preferences || {})})
              RETURNING *
            `;
            result = {
              ...user,
              expertise: user.expertise || [],
              preferences: user.preferences || { notifications: true, emailUpdates: true, dataSharing: true }
            };
          } else if (table === 'faqs') {
            const [faq] = await sql`
              INSERT INTO faqs (category, subcategory, question, answer, priority, tags, media, importance, view_count, status)
              VALUES (${data.category}, ${data.subcategory}, ${data.question}, ${data.answer}, ${data.priority}, ${data.tags || []}, ${data.media || []}, ${data.importance}, ${data.viewCount || 0}, ${data.status || 'active'})
              RETURNING *
            `;
            result = {
              ...faq,
              tags: faq.tags || [],
              media: faq.media || []
            };
          } else if (table === 'daily_updates') {
            const [update] = await sql`
              INSERT INTO daily_updates (title, content, type, priority, tags, media, scheduled_date, published_date, status)
              VALUES (${data.title}, ${data.content}, ${data.type}, ${data.priority}, ${data.tags || []}, ${data.media || []}, ${data.scheduledDate || null}, ${data.publishedDate || null}, ${data.status || 'draft'})
              RETURNING *
            `;
            result = {
              ...update,
              tags: update.tags || [],
              media: update.media || []
            };
          } else if (table === 'notifications') {
            const [notification] = await sql`
              INSERT INTO notifications (user_id, type, title, message, read)
              VALUES (${data.userId || null}, ${data.type}, ${data.title}, ${data.message}, ${data.read || false})
              RETURNING *
            `;
            result = notification;
          }
          break;
        
        case 'update':
          if (table === 'users') {
            const [user] = await sql`
              UPDATE users 
              SET name = ${data.name}, email = ${data.email}, username = ${data.username}, 
                  password = ${data.password}, role = ${data.role}, team = ${data.team}, 
                  status = ${data.status}, telegram_id = ${data.telegramId || null}, 
                  location = ${data.location || null}, phone = ${data.phone || null}, 
                  organization = ${data.organization || null}, expertise = ${data.expertise || []}, 
                  preferences = ${JSON.stringify(data.preferences || {})}, 
                  updated_at = CURRENT_TIMESTAMP, last_activity = CURRENT_TIMESTAMP
              WHERE id = ${id}
              RETURNING *
            `;
            result = {
              ...user,
              expertise: user.expertise || [],
              preferences: user.preferences || { notifications: true, emailUpdates: true, dataSharing: true }
            };
          } else if (table === 'faqs') {
            const [faq] = await sql`
              UPDATE faqs 
              SET category = ${data.category}, subcategory = ${data.subcategory}, 
                  question = ${data.question}, answer = ${data.answer}, 
                  priority = ${data.priority}, tags = ${data.tags || []}, 
                  media = ${data.media || []}, importance = ${data.importance}, 
                  view_count = ${data.viewCount || 0}, status = ${data.status || 'active'}, 
                  updated_at = CURRENT_TIMESTAMP
              WHERE id = ${id}
              RETURNING *
            `;
            result = {
              ...faq,
              tags: faq.tags || [],
              media: faq.media || []
            };
          } else if (table === 'daily_updates') {
            const [update] = await sql`
              UPDATE daily_updates 
              SET title = ${data.title}, content = ${data.content}, 
                  type = ${data.type}, priority = ${data.priority}, 
                  tags = ${data.tags || []}, media = ${data.media || []}, 
                  scheduled_date = ${data.scheduledDate || null}, 
                  published_date = ${data.publishedDate || null}, 
                  status = ${data.status || 'draft'}, 
                  updated_at = CURRENT_TIMESTAMP
              WHERE id = ${id}
              RETURNING *
            `;
            result = {
              ...update,
              tags: update.tags || [],
              media: update.media || []
            };
          }
          break;
        
        case 'markAsRead':
          if (table === 'notifications') {
            await sql`UPDATE notifications SET read = true WHERE id = ${id}`;
            result = { success: true };
          }
          break;
        
        case 'delete':
          if (table === 'users') {
            await sql`DELETE FROM users WHERE id = ${id}`;
          } else if (table === 'faqs') {
            await sql`DELETE FROM faqs WHERE id = ${id}`;
          } else if (table === 'daily_updates') {
            await sql`DELETE FROM daily_updates WHERE id = ${id}`;
          } else if (table === 'notifications') {
            await sql`DELETE FROM notifications WHERE id = ${id}`;
          }
          result = { success: true };
          break;
        
        default:
          throw new Error(`Unknown operation: ${operation}`);
      }
    }

    return {
      statusCode: 200,
      headers: {
        ...headers,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ success: true, data: result }),
    };

  } catch (error) {
    console.error('❌ Database error:', error);
    
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
