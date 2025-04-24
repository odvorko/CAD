# app/controllers/products_controller.rb
class ProductsController < ApplicationController
  # Use a callback to find the product by ID before show, update, or destroy actions
  # This avoids repeating the same lookup code in multiple actions
  before_action :set_product, only: [ :show, :update, :destroy ]

  # GET /products
  # Retrieves all products
  def index
    @products = Product.all
    render json: @products
  end

  # GET /products/:id
  # Retrieves a specific product by its ID
  def show
    # @product is already set by the before_action callback
    render json: @product
  end

  # POST /products
  # Creates a new product
  def create
    @product = Product.new(product_params) # Use strong parameters for safe mass assignment

    if @product.save # Attempt to save the new product (triggers model validations)
      render json: @product, status: :created, location: @product # Success: respond with created product and 201 status
    else
      render json: @product.errors, status: :unprocessable_entity # Failure: respond with validation errors and 422 status
    end
  end

  # PATCH/PUT /products/:id
  # Updates an existing product
  def update
    # @product is already set by the before_action callback
    if @product.update(product_params) # Attempt to update the product (triggers model validations)
      render json: @product # Success: respond with the updated product
    else
      render json: @product.errors, status: :unprocessable_entity # Failure: respond with validation errors and 422 status
    end
  end

  # DELETE /products/:id
  # Deletes a product by its ID
  def destroy
    # @product is already set by the before_action callback
    @product.destroy # Attempt to destroy the product
    head :no_content # Success: respond with 204 No Content (standard for successful deletion with no content)
  end

  private
    # --- Private Methods ---

    # set_product: Callback to find a product by ID for specified actions.
    # Handles the case where the product is not found.
    def set_product
      # Find the product using the ID from the URL parameters
      @product = Product.find(params[:id])
    rescue ActiveRecord::RecordNotFound
      # If the product is not found, render a 404 Not Found response
      render json: { error: "Product not found" }, status: :not_found
    end

    # product_params: Uses strong parameters to explicitly permit
    # the allowed parameters for mass assignment. This is crucial for security.
    def product_params
      # Require the 'product' root key in the JSON body or parameters
      # Permit only the 'name', 'description', 'price', and 'available' attributes
      params.require(:product).permit(:name, :description, :price, :available)
    end
end
