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
    const { operation, table, data, id } = JSON.parse(event.body || '{}');
    
    console.log('🔄 Database operation:', operation, 'on table:', table);

    let result;

    switch (operation) {
      case 'getAll':
        result = await sql`SELECT * FROM ${sql(table)} ORDER BY created_at DESC`;
        break;
      
      case 'getById':
        result = await sql`SELECT * FROM ${sql(table)} WHERE id = ${id}`;
        result = result[0] || null;
        break;
      
      case 'create':
        const createFields = Object.keys(data).join(', ');
        const createValues = Object.values(data).map(val => 
          typeof val === 'object' ? JSON.stringify(val) : val
        );
        const createPlaceholders = createValues.map((_, i) => `$${i + 1}`).join(', ');
        
        result = await sql`
          INSERT INTO ${sql(table)} (${sql(createFields)})
          VALUES (${sql(createPlaceholders)})
          RETURNING *
        `;
        result = result[0];
        break;
      
      case 'update':
        const updateFields = Object.keys(data)
          .filter(key => key !== 'id')
          .map(key => `${key} = $${Object.keys(data).indexOf(key) + 1}`)
          .join(', ');
        const updateValues = Object.values(data);
        
        result = await sql`
          UPDATE ${sql(table)}
          SET ${sql(updateFields)}, updated_at = CURRENT_TIMESTAMP
          WHERE id = ${id}
          RETURNING *
        `;
        result = result[0];
        break;
      
      case 'delete':
        await sql`DELETE FROM ${sql(table)} WHERE id = ${id}`;
        result = { success: true };
        break;
      
      default:
        throw new Error(`Unknown operation: ${operation}`);
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
