# test/models/product_test.rb
require "test_helper"

class ProductTest < ActiveSupport::TestCase
  # Test if a product can be saved with valid attributes
  test "should be valid" do
    product = Product.new(name: "Sample Product", price: 19.99)
    assert product.valid? # Use assert product.valid? instead of assert product.save
                          # We are testing model validity, not database save success itself here
  end

  # Test presence validation for name
  test "should require a name" do
    product = Product.new(price: 19.99)
    assert_not product.valid?, "Product should not be valid without a name"
    # You can also check specific errors
    assert_includes product.errors[:name], "can't be blank"
  end

  # Test presence validation for price
  test "should require a price" do
    product = Product.new(name: "Sample Product")
    assert_not product.valid?, "Product should not be valid without a price"
    assert_includes product.errors[:price], "can't be blank"
  end

  # Test numericality validation for price
  test "should have a numerical price greater than or equal to zero" do
    product = Product.new(name: "Sample Product", description: "Description")

    # Test with invalid (non-numeric) price
    product.price = "invalid"
    assert_not product.valid?, "Price should be numerical"
    assert_includes product.errors[:price], "is not a number"

    # Test with negative price
    product.price = -5.00
    assert_not product.valid?, "Price should be greater than or equal to 0"
    assert_includes product.errors[:price], "must be greater than or equal to 0"

    # Test with zero price (should be valid)
    product.price = 0.00
    assert product.valid?, "Price can be 0"

    # Test with valid positive price
    product.price = 10.50
    assert product.valid?, "Price should be a positive number"
  end

  # Test default value for 'available' attribute
  test "available should default to true" do
    # When creating a product without explicitly setting 'available'
    product = Product.new(name: "Default Product", price: 5.00)
    # It should be valid (based on other validations)
    assert product.valid?
    # And the available attribute should be true
    assert_equal true, product.available, "Default value for available should be true"
    assert product.available? # Alternative syntax for asserting boolean true
  end
end