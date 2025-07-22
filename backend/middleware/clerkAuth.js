const { createClerkClient } = require("@clerk/backend");

// Creating Clerk client instance
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

const auth = async (req, res, next) => {
  try {
    // Convert Express request to Web API Request for Clerk
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
    const headers = new Headers();
    
    // Copy headers from Express request
    Object.entries(req.headers).forEach(([key, value]) => {
      if (typeof value === 'string') {
        headers.set(key, value);
      } else if (Array.isArray(value)) {
        headers.set(key, value.join(', '));
      }
    });

    // Create Web API Request object
    const webRequest = new Request(url, {
      method: req.method,
      headers: headers,
    });

    const authResult = await clerkClient.authenticateRequest(webRequest, {
      // Optional: Add JWT key if you have one
      ...(process.env.CLERK_JWT_KEY && { jwtKey: process.env.CLERK_JWT_KEY }),
      
      // Authorized parties (domains that can make requests)
      authorizedParties: [
        process.env.FRONTEND_URL,
        'http://localhost:5173',
      ],
    });

    if (!authResult.isSignedIn) {
      console.log('User not signed in');
      return res.status(401).json({
        error: "Unauthorized", 
        message: "Authentication required"
      });
    }

    // Get auth details
    const auth = authResult.toAuth();

    // Get user details from Clerk
    const user = await clerkClient.users.getUser(auth.userId);

    // Attach to request
    req.auth = {
      userId: auth.userId,
      sessionId: auth.sessionId,
      claims: auth.claims
    };

    req.user = {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    next();

  } catch (error) {
    console.error("Auth error:", error.message);
    
    return res.status(401).json({
      error: "Unauthorized",
      message: "Authentication failed",
      ...(process.env.NODE_ENV === 'development' && { details: error.message })
    });
  }
};

module.exports = {
  auth,
};