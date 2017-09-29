import { AfterschoolWebPage } from './app.po';

describe('afterschool-web App', () => {
  let page: AfterschoolWebPage;

  beforeEach(() => {
    page = new AfterschoolWebPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
