/* tslint:disable no-unused-expression */
import { browser, element, by } from 'protractor';

import NavBarPage from './../../page-objects/navbar-page';
import SignInPage from './../../page-objects/signin-page';
import PatientComponentsPage from './patient.page-object';
import { PatientDeleteDialog } from './patient.page-object';
import PatientUpdatePage from './patient-update.page-object';
import { waitUntilDisplayed, waitUntilHidden } from '../../util/utils';

const expect = chai.expect;

describe('Patient e2e test', () => {
  let navBarPage: NavBarPage;
  let signInPage: SignInPage;
  let patientUpdatePage: PatientUpdatePage;
  let patientComponentsPage: PatientComponentsPage;
  let patientDeleteDialog: PatientDeleteDialog;

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

  it('should load Patients', async () => {
    await navBarPage.getEntityPage('patient');
    patientComponentsPage = new PatientComponentsPage();
    expect(await patientComponentsPage.getTitle().getText()).to.match(/Patients/);
  });

  it('should load create Patient page', async () => {
    await patientComponentsPage.clickOnCreateButton();
    patientUpdatePage = new PatientUpdatePage();
    expect(await patientUpdatePage.getPageTitle().getText()).to.match(/Create or edit a Patient/);
    await patientUpdatePage.cancel();
  });

  it('should create and save Patients', async () => {
    async function createPatient() {
      await patientComponentsPage.clickOnCreateButton();
      await patientUpdatePage.setFullnameInput('fullname');
      expect(await patientUpdatePage.getFullnameInput()).to.match(/fullname/);
      await patientUpdatePage.genderSelectLastOption();
      await patientUpdatePage.setPhoneInput('phone');
      expect(await patientUpdatePage.getPhoneInput()).to.match(/phone/);
      await patientUpdatePage.setAddressInput('address');
      expect(await patientUpdatePage.getAddressInput()).to.match(/address/);
      await patientUpdatePage.setEmailInput('email');
      expect(await patientUpdatePage.getEmailInput()).to.match(/email/);
      await patientUpdatePage.setBirthdateInput('01-01-2001');
      expect(await patientUpdatePage.getBirthdateInput()).to.eq('2001-01-01');
      await waitUntilDisplayed(patientUpdatePage.getSaveButton());
      await patientUpdatePage.save();
      await waitUntilHidden(patientUpdatePage.getSaveButton());
      expect(await patientUpdatePage.getSaveButton().isPresent()).to.be.false;
    }

    await createPatient();
    await patientComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeCreate = await patientComponentsPage.countDeleteButtons();
    await createPatient();

    await patientComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeCreate + 1);
    expect(await patientComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeCreate + 1);
  });

  it('should delete last Patient', async () => {
    await patientComponentsPage.waitUntilLoaded();
    const nbButtonsBeforeDelete = await patientComponentsPage.countDeleteButtons();
    await patientComponentsPage.clickOnLastDeleteButton();

    const deleteModal = element(by.className('modal'));
    await waitUntilDisplayed(deleteModal);

    patientDeleteDialog = new PatientDeleteDialog();
    expect(await patientDeleteDialog.getDialogTitle().getAttribute('id')).to.match(/wisestepApp.patient.delete.question/);
    await patientDeleteDialog.clickOnConfirmButton();

    await patientComponentsPage.waitUntilDeleteButtonsLength(nbButtonsBeforeDelete - 1);
    expect(await patientComponentsPage.countDeleteButtons()).to.eq(nbButtonsBeforeDelete - 1);
  });

  after(async () => {
    await navBarPage.autoSignOut();
  });
});
