/**
 * Azure Function to detect user's location from IP address
 * This proxies requests to IP geolocation services to avoid CORS and ad-blocker issues
 */

import { app, HttpRequest, HttpResponseInit, InvocationContext } from "@azure/functions";

interface GeolocationResponse {
  state: string;
  stateFips?: string;
  county?: string;
  countyFips?: string;
}

const STATE_TO_FIPS: Record<string, string> = {
  'Alabama': '01', 'Alaska': '02', 'Arizona': '04', 'Arkansas': '05',
  'California': '06', 'Colorado': '08', 'Connecticut': '09', 'Delaware': '10',
  'District of Columbia': '11', 'Florida': '12', 'Georgia': '13', 'Hawaii': '15',
  'Idaho': '16', 'Illinois': '17', 'Indiana': '18', 'Iowa': '19',
  'Kansas': '20', 'Kentucky': '21', 'Louisiana': '22', 'Maine': '23',
  'Maryland': '24', 'Massachusetts': '25', 'Michigan': '26', 'Minnesota': '27',
  'Mississippi': '28', 'Missouri': '29', 'Montana': '30', 'Nebraska': '31',
  'Nevada': '32', 'New Hampshire': '33', 'New Jersey': '34', 'New Mexico': '35',
  'New York': '36', 'North Carolina': '37', 'North Dakota': '38', 'Ohio': '39',
  'Oklahoma': '40', 'Oregon': '41', 'Pennsylvania': '42', 'Rhode Island': '44',
  'South Carolina': '45', 'South Dakota': '46', 'Tennessee': '47', 'Texas': '48',
  'Utah': '49', 'Vermont': '50', 'Virginia': '51', 'Washington': '53',
  'West Virginia': '54', 'Wisconsin': '55', 'Wyoming': '56'
};

/**
 * Try to get location from ipapi.co
 */
async function getLocationFromIPAPI(clientIp: string): Promise<GeolocationResponse | null> {
  try {
    const url = clientIp 
      ? `https://ipapi.co/${clientIp}/json/`
      : 'https://ipapi.co/json/';
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('ipapi.co returned error:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (!data.region) {
      console.warn('No region in ipapi.co response');
      return null;
    }

    const stateName = data.region;
    const stateFips = STATE_TO_FIPS[stateName];
    
    if (!stateFips) {
      console.warn('Unknown state from ipapi.co:', stateName);
      return null;
    }

    return {
      state: stateName,
      stateFips: stateFips,
    };
  } catch (error) {
    console.error('Error calling ipapi.co:', error);
    return null;
  }
}

/**
 * Try to get location from ip-api.com (backup service)
 */
async function getLocationFromIPAPIcom(clientIp: string): Promise<GeolocationResponse | null> {
  try {
    const url = clientIp 
      ? `http://ip-api.com/json/${clientIp}`
      : 'http://ip-api.com/json/';
    
    const response = await fetch(url);
    
    if (!response.ok) {
      console.warn('ip-api.com returned error:', response.status);
      return null;
    }

    const data = await response.json();
    
    if (data.status !== 'success' || !data.regionName) {
      console.warn('No region in ip-api.com response');
      return null;
    }

    const stateName = data.regionName;
    const stateFips = STATE_TO_FIPS[stateName];
    
    if (!stateFips) {
      console.warn('Unknown state from ip-api.com:', stateName);
      return null;
    }

    return {
      state: stateName,
      stateFips: stateFips,
    };
  } catch (error) {
    console.error('Error calling ip-api.com:', error);
    return null;
  }
}

const httpTrigger = async function (req: HttpRequest, context: InvocationContext): Promise<HttpResponseInit> {
  context.log('Geolocation function triggered');

  // Get client IP from Azure headers
  // Azure Static Web Apps provides the client IP in these headers
  const clientIp = req.headers.get('x-forwarded-for') 
    || req.headers.get('x-real-ip')
    || req.headers.get('x-client-ip')
    || '';

  const ip = clientIp.split(',')[0].trim();

  context.log('Client IP:', ip);

  // Try primary service first
  let location = await getLocationFromIPAPI(ip);
  
  // If primary fails, try backup service
  if (!location) {
    context.log('Primary service failed, trying backup...');
    location = await getLocationFromIPAPIcom(ip);
  }

  if (location) {
    return {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      },
      jsonBody: location
    };
  } else {
    return {
      status: 503,
      headers: {
        'Content-Type': 'application/json'
      },
      jsonBody: {
        error: 'Unable to detect location from IP address'
      }
    };
  }
};

app.http('geolocation', {
  methods: ['GET'],
  authLevel: 'anonymous',
  route: 'geolocation',
  handler: httpTrigger
});
