import { When } from 'cypress-cucumber-preprocessor/steps'
import { confirmActionDialogSel } from '../../../selectors/editDashboard'

When('A 500 error is thrown when I delete the dashboard', () => {
    cy.intercept('DELETE', '/dashboards', { statusCode: 500 })
    cy.clickEditActionButton('Delete')
    cy.get(confirmActionDialogSel).find('button').contains('Delete').click()
})