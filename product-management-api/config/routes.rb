# config/routes.rb
Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Resources route for the Product model.
  # 'only' option restricts the generated routes to just the standard CRUD operations we've implemented.
  resources :products, only: [ :index, :show, :create, :update, :destroy ]

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

  # Defines the root path route ("/") - not typically needed for an API-only app
  # root "posts#index"
end
