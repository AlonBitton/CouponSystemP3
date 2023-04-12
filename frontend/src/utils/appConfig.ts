class AppConfig {
  public loginUrl = 'http://localhost:8080/api/auth/';
  public userUrl = 'http://localhost:8080/api/user/';
  public adminUrl = 'http://localhost:8080/api/admin/';
  public companyUrl = 'http://localhost:8080/api/company/';
  public customerUrl = 'http://localhost:8080/api/customer/';
}

const appConfig = new AppConfig(); // Singleton

export default appConfig;
