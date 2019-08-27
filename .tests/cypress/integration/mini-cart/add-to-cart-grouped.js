// Disbale clearing localstorage
Cypress.LocalStorage.clear = function () {}

describe('Grouped product', function () {
  before(() => {
    // Hide premissions popup
    cy.setCookie('permission-cookies', 'true')
    cy.setCookie('permission-profiling', 'true')
    cy.setCookie('mage-cache-sessid', 'true')
    // Keep cookies beween tests
    Cypress.Cookies.defaults({
      whitelist: [
        'frontend',
        'X-Magento-Vary',
        'permission-profiling',
        'PHPSESSID',
        'form_key'
      ]
    })
  })

  it('Visits product', () => {
    cy.visit('/grouped-product-test')
    cy.get('.breadcrumbs__list').should('be.visible')
  })

  it('Check visiblility of content', () => {
    cy.get('.product-view__main-details').should('be.visible')
    cy.get('[data-ui-id=page-title-wrapper]').should('be.visible')
    cy.get('.product-view__information').should('be.visible')
    cy.get('.product-view__sku').should('be.visible').log('SKU VISIBLE')
    cy.get('#super-product-table').should('be.visible').log('Grouped product table visible')
    cy.get('#product-addtocart-button').should('be.visible')
    cy.get('.product-view__extra-actions').should('be.visible')
    cy.get('[data-testid=product-tab__title]').contains('Details').should('be.visible')
    cy.get('[data-testid=product-tab__title]').contains('Reviews').should('be.visible')
    cy.get('.fotorama__img').should('be.visible')
  })

  it('Test grouped product table', () => {
    cy.get('#super-product-table').should('be.visible').find('>tbody')
      .then((elements) => {
        cy.log(elements.length)
      })
    cy.get('.product-view__grouped-product-name')
      .then((productName) => {
        cy.log(productName.length)
      })
    cy.get('[data-price-type=finalPrice]')
      .then((finalPrice) => {
        cy.log(finalPrice.length)
      })
    cy.get('.qty')
      .then((quantity) => {
        cy.log(quantity.length)
      })
  })

  it('Choose product from table', () => {
    cy.get('#super-product-table')
    cy.get('.input__field.input-text.qty').each(el => cy.get(el).clear().type('1'))
  })

  it('Add product to cart', () => {
    cy.server({ whitelist: () => false })
    cy.route('POST', '/checkout/cart/add/uenc/*/product/*/').as('addToCart')
    cy.route('/customer/section/load/?sections=cart,messages*').as('getCartAndMessages')
    cy.get('#product-addtocart-button').click()
    cy.wait('@addToCart')
    cy.wait('@getCartAndMessages')
    cy.get('.messages').contains('You added Grouped Product to your shopping cart.')
  })

  after(() => {
    // Clear cookie after tests to enable running test several times
    cy.clearCookie('frontend')
    cy.clearCookie('permission-cookies')
    cy.clearCookie('permission-profiling')
    cy.clearCookie('form_key')
    cy.clearCookie('PHPSESSID')
    cy.clearCookie('mage-cache-sessid')
  })
})
