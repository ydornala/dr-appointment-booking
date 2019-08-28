/* tslint:disable no-unused-expression */
import { browser, element, by, protractor } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import AppointmentComponentsPage from './appointment.page-object';
import { AppointmentDeleteDialog } from './appointment.page-object';
import AppointmentUpdatePage from './appointment-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Appointment e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let appointmentUpdatePage: AppointmentUpdatePage;
  let appointmentComponentsPage: AppointmentComponentsPage;
  let appointmentDeleteDialog: AppointmentDeleteDialog;

  before(async () => {
    await browser.get('/');
    navBarPage = new NavBarPage();
    signInPage = await navBarPage.getSignInPage();
    await signInPage.waitUntilDisplayed();

    await signInPage.username.sendKeys('admin');
    await signInPage.password.sendKeys('admin');
    await signInPage.loginButton.click();
    await signInPage.waitUntilHidden();
    await waitUntilDisplayed(navBarPage.entityMenu);
  });

  it('should load Appointments', async () => {
    await navBarPage.getEntityPage('appointment');
    appointmentComponentsPage = new AppointmentComponentsPage();
    expect(await appointmentComponentsPage.getTitle().getText()).to.match(/Appointments/);
  });

  it('should load create Appointment page', async () => {
    await appointmentComponentsPage.clickOnCreateButton();
    appointmentUpdatePage = new AppointmentUpdatePage();
    expect(await appointmentUpdatePage.getPageTitle().getText()).to.match(/Create or edit a Appointment/);
    await appointmentUpdatePage.cancel();
  });

  it('should create and save Appointments', async () => {
    async function createAppointment() {
      await appointmentComponentsPage.clickOnCreateButton();
      await appointmentUpdatePage.setFixedDateInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
      expect(await appointmentUpdatePage.getFixedDateInput()).to.contain('2001-01-01T02:30');
      await appointmentUpdatePage.setSymptomsInput('symptoms');
      expect(await appointmentUpdatePage.getSymptomsInput()).to.match(/symptoms/);
      await appointmentUpdatePage.statusSelectLastOption();
      await appointmentUpdatePage.setStartTimeInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
      expect(await appointmentUpdatePage.getStartTimeInput()).to.contain('2001-01-01T02:30');
      await appointmentUpdatePage.setEndTimeInput('01/01/2001' + protractor.Key.TAB + '02:30AM');
      expect(await appointmentUpdatePage.getEndTimeInput()).to.contain('2001-01-01T02:30');
      await appointmentUpdatePage.patientSelectLastOption();
      await waitUntilDisplayed(appointmentUpdatePage.getSaveButton());
      await appointmentUpdatePage.save();
      await waitUntilHidden(appointmentUpdatePage.getSaveButton());
      expect(await appointmentUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createAppointment();
    await appointmentComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await appointmentComponentsPage.countDeleteButtons();
    await createAppointment();

    await appointmentComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await appointmentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Appointment', async () => {
    await appointmentComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await appointmentComponentsPage.countDeleteButtons();
    await appointmentComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    appointmentDeleteDialog = new AppointmentDeleteDialog();
    expect(await appointmentDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/wisestepApp.appointment.delete.question/);
    await appointmentDeleteDialog.clickOnConfirmButton();

    await appointmentComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await appointmentComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
