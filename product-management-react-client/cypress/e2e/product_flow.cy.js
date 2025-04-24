// product-management-react-client/cypress/e2e/product_flow.cy.js

describe('Product Management Full Flow (React Client)', () => {
    beforeEach(() => {
      cy.visit('/'); // Visit React app base URL
    });
  
    it('should perform CRUD operations for a product', () => {
      // Generate unique product data
      const uniqueId = Cypress._.random(0, 1e6);
      const productName = `Test Product ${uniqueId}`;
      const productDescription = 'This is a test description.';
      const productPrice = 123.45;
      const updatedProductName = `${productName} Updated`;
      const updatedProductDescription = `${productDescription} -- UPDATED`;
      const updatedProductPrice = 987.65;
  
      // CREATE
      cy.contains('Add New Product').click();
      cy.get('#name').type(productName);
      cy.get('#description').type(productDescription);
      cy.get('#price').type(productPrice);
      cy.get('#available').should('be.checked');
      cy.contains('Add Product').click();
  
      // Assert create success
      cy.contains(productName).closest('li').within(() => {
        cy.root().should('contain.text', productName);
        cy.root().should('contain.text', ` - $ ${productPrice.toFixed(2)} (`);
        cy.root().should('contain.text', '(Available)');
        cy.contains('View').should('be.visible');
        cy.contains('Edit').should('be.visible');
        cy.contains('Delete').should('be.visible');
      });
  
      // VIEW DETAILS
      cy.contains(productName).closest('li').contains('View').click();
      cy.contains(`Product Details: ${productName}`);
      cy.get('body').should('contain.text', `Name: ${productName}`);
      cy.get('body').should('contain.text', `Description: ${productDescription}`);
      cy.get('body').should('contain.text', `Price: $${productPrice.toFixed(2)}`);
      cy.get('body').should('contain.text', 'Available: Yes');
      cy.contains('Back to List').click();
  
      // UPDATE
      cy.contains(productName).closest('li').contains('Edit').click();
      cy.get('#name').clear().type(updatedProductName);
      cy.get('#description').clear().type(updatedProductDescription);
      cy.get('#price').clear().type(updatedProductPrice);
      cy.get('#available').uncheck();
      cy.contains('Update Product').click();
  
      // Assert update success
      cy.contains(updatedProductName).closest('li').within(() => {
        cy.root().should('contain.text', updatedProductName);
        cy.root().should('contain.text', ` - $ ${updatedProductPrice.toFixed(2)} (`);
        cy.root().should('contain.text', '(Not Available)');
      });
  
      // DELETE
      cy.contains(updatedProductName).closest('li').contains('Delete').click();
      cy.contains(updatedProductName).should('not.exist');
    });
  });