# config/initializers/cors.rb
# Be sure to restart your server when you modify this file.

# Configure Rack::Cors as a middleware.
# This middleware will listen for preflight requests (OPTIONS method)
# and set appropriate CORS headers in the responses.
Rails.application.config.middleware.insert_before 0, Rack::Cors do
  allow do
    # In development, you might want to allow requests from any origin
    # This is helpful when your frontend runs on a different port (e.g., 3001, 5173)
    # or different domain than your backend (e.g., 3000).
    # IMPORTANT SECURITY WARNING: For production, NEVER use '*' here.
    # Replace '*' with the actual origin(s) of your frontend application(s).
    # Example for specific origins:
    # origins 'http://localhost:3001', 'http://your-react-prod-domain.com', 'http://your-html-prod-domain.com'
    origins "*"

    # Allow all standard headers
    resource "*",
      headers: :any,
      # Allow the necessary HTTP methods for your API (GET, POST, PUT, PATCH, DELETE, OPTIONS)
      methods: [ :get, :post, :put, :patch, :delete, :options, :head ]
  end
end
