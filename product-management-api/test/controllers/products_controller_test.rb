# test/controllers/products_controller_test.rb
require "test_helper"

# In Rails API mode, testing controller actions often involves
# making requests and checking the response status, headers, and body.
# Minitest::Rails provides ActionDispatch::IntegrationTest (referred to as "request tests" in documentation)
# which is suitable for this.
class ProductsControllerTest < ActionDispatch::IntegrationTest
  # Set up a fixture product for testing update/show/delete
  # Fixtures load data from test/fixtures/*.yml into the test database
  setup do
    @product = products(:one) # Assuming you create a fixture in test/fixtures/products.yml
    # Example product fixture setup (you'll need to create test/fixtures/products.yml):
    # one:
    #   name: "Fixture Product 1"
    #   description: "Description 1"
    #   price: 9.99
    #   available: true
  end

  # --- Test GET /products (index) ---
  test "should get index" do
    get products_url, as: :json # Make a GET request to the index action, specifying JSON format
    assert_response :success # Assert that the HTTP response status is 200 (success)

    # Optionally, parse the JSON response and check its content structure/size
    json_response = JSON.parse(response.body)
    assert_instance_of Array, json_response # Response body should be an array of products
    # Add more assertions about the number of products or specific product data if needed
  end

  # --- Test GET /products/:id (show) ---
  test "should show product" do
    get product_url(@product), as: :json # Make a GET request for a specific product
    assert_response :success # Assert status 200 (success)

    json_response = JSON.parse(response.body)
    assert_equal @product.name, json_response["name"] # Check a specific attribute
    # Add more assertions about the JSON response body if needed
  end

  test "should return not found for non-existent product" do
    get product_url(99999), as: :json # Try to get a product with a non-existent ID
    assert_response :not_found # Assert status 404 (not found)
    # Optionally, check the error message in the response body
    json_response = JSON.parse(response.body)
    assert_equal "Product not found", json_response["error"]
  end

  # --- Test POST /products (create) ---
  test "should create product" do
    # Define the data for the new product
    product_attributes = {
      name: "New Test Product",
      description: "A product created via test",
      price: 25.50,
      available: true # Or omit, relying on default
    }

    assert_difference("Product.count") do # Assert that the number of products in the database increases by 1
      post products_url, params: { product: product_attributes }, as: :json # Make a POST request with the product data
    end

    assert_response :created # Assert status 201 (created)

    json_response = JSON.parse(response.body)
    assert_equal product_attributes[:name], json_response["name"] # Check returned data
    assert_equal product_attributes[:price].to_s, json_response["price"] # Price might be stringified in JSON
    # Verify the default 'available' if it wasn't explicitly sent
    assert_equal true, json_response["available"]
  end

  test "should not create product with invalid data" do
     invalid_product_attributes = {
       name: "", # Invalid: name is required
       price: -10.00 # Invalid: price must be non-negative
     }

     assert_no_difference("Product.count") do # Assert that the product count does NOT change
       post products_url, params: { product: invalid_product_attributes }, as: :json
     end

     assert_response :unprocessable_entity # Assert status 422 (unprocessable entity - due to validation errors)

     json_response = JSON.parse(response.body)
     assert_includes json_response["name"], "can't be blank" # Check specific error messages
     assert_includes json_response["price"], "must be greater than or equal to 0"
  end


  # --- Test PATCH/PUT /products/:id (update) ---
  test "should update product" do
    updated_attributes = {
      name: "Updated Product Name",
      price: 99.00,
      available: false # Change availability
    }

    # Make a PATCH request to update the specific product
    patch product_url(@product), params: { product: updated_attributes }, as: :json
    assert_response :success # Assert status 200 (success)

    # Reload the product from the database to check if it was actually updated
    @product.reload
    assert_equal updated_attributes[:name], @product.name
    assert_equal updated_attributes[:price], @product.price
    assert_equal updated_attributes[:available], @product.available
  end

   test "should not update product with invalid data" do
     invalid_attributes = {
       name: "" # Invalid data
     }

     patch product_url(@product), params: { product: invalid_attributes }, as: :json
     assert_response :unprocessable_entity # Assert status 422

     # Ensure the product in the database was NOT updated
     @product.reload
     assert_not_equal invalid_attributes[:name], @product.name
   end

  test "should return not found when trying to update non-existent product" do
    patch product_url(99999), params: { product: { name: "Bogus Update" } }, as: :json
    assert_response :not_found # Assert status 404
  end


  # --- Test DELETE /products/:id (destroy) ---
  test "should destroy product" do
    assert_difference("Product.count", -1) do # Assert that the number of products decreases by 1
      delete product_url(@product), as: :json # Make a DELETE request
    end

    assert_response :no_content # Assert status 204 (no content)
  end

  test "should return not found when trying to destroy non-existent product" do
    delete product_url(99999), as: :json
    assert_response :not_found # Assert status 404
  end
end
