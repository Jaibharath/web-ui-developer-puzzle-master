describe('When: I use the reading list feature', () => {
  beforeEach(() => {
    cy.startAt('/');
  });

  it('Then: I should see my reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();

    cy.get('[data-testing="reading-list-container"]').should(
      'contain.text',
      'My Reading List'
    );
  });

  it('Then: I should be able to search books by title', () => {
    cy.get('input[type="search"]').type('javascript');
    cy.get('form').submit();
    cy.get('.mat-focus-indicator.mat-flat-button.mat-button-base.mat-primary').first().click();
    cy.get('[data-testing="book-item"]').should('have.length.greaterThan', 1);
  });

  it('When: we have one item read finshed in reading list', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('[data-testing="update-reading-list"]').click();
    cy.startAt('/');
    cy.get('input[type="search"]').type('javascript');
    cy.get('form').submit();
  });

  it('Then: Remove the reading list and check finished label reverted', () => {
    cy.get('[data-testing="toggle-reading-list"]').click();
    cy.get('[data-testing="remove-reading-list"]').click();
    cy.startAt('/');
    cy.get('input[type="search"]').type('javascript');
    cy.get('form').submit();
  });

});
