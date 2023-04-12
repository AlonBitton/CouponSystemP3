package com.Alon.CouponSystemP2.services;

import com.Alon.CouponSystemP2.entites.Category;
import com.Alon.CouponSystemP2.entites.Company;
import com.Alon.CouponSystemP2.entites.Coupon;
import com.Alon.CouponSystemP2.entites.Customer;
import com.Alon.CouponSystemP2.exception.CouponSystemException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;


/**
 * The initService class is responsible for initializing the system's data and ensuring its consistency.
 * It populates the system with dummy data such as companies, customers, and coupons for testing purposes.
 * This class utilizes the repositories and services for the Company, Customer, and Coupon entities.
 * The initData() method is the main method in this class and uses @PostConstruct annotation to be executed after
 * the initialization of the bean. It populates the system with dummy data, adds companies and coupons to the system,
 * and makes purchases on behalf of customers. The dummy data includes random names, emails, and passwords for customers and companies,
 * as well as random coupon data with different categories, start/end dates, quantities, and prices.
 * This class utilizes the following entities: Category, Company, Coupon, Customer. It also utilizes the following repositories:
 * CompanyRepo, CouponRepo, CustomerRepo. Furthermore, it uses the following services: CouponService, AdminService,
 * CustomerService, and CompanyService.
 * Overall, this class serves as an essential tool for initializing the system and ensuring its smooth operation during testing.
 */


@Service
public class initService extends Services {

    private static final String[] EMAIL_DOMAINS = {"gmail.com", "yahoo.com", "hotmail.com", "outlook.com"};
    private static final String[] FIRST_NAMES = {"Emma", "Liam", "Olivia", "Noah", "Ava", "Ethan", "Sophia", "Logan", "Isabella", "Mia"};
    private static final String[] LAST_NAMES = {"Smith", "Johnson", "Brown", "Jones", "Garcia", "Miller", "Davis", "Rodriguez", "Martinez", "Lee"};
    private static final String[] companyNames = {"Acme Inc", "Globex Corporation", "Initech", "Wayne Enterprises", "Stark Industries", "Soylent Corporation", "Wonka Industries", "Dunder Mifflin", "Prestige Worldwide", "Strickland Propane", "Soviet Corporation", "Aperture Science", "Oscorp Industries", "Weyland-Yutani Corporation", "Tyrell Corporation", "Cyberdyne Systems", "Umbrella Corporation", "Nakatomi Corporation", "Monarch Sciences", "Jurassic Park"};
    private static final Random random = new Random();
    int randomNumber = random.nextInt(10) + 1;
    @Autowired
    private AdminService adminService;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private CompanyService companyService;

    private static String getDomain(String companyName) {
        String domain = EMAIL_DOMAINS[random.nextInt(EMAIL_DOMAINS.length)];
        return companyName + "@" + domain;
    }

    private static String getRandomPassword() {
        // generate a random 8-character password
        StringBuilder password = new StringBuilder();
        String chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (int i = 0; i < 8; i++) {
            int index = random.nextInt(chars.length());
            password.append(chars.charAt(index));
        }
        return password.toString();
    }

    @PostConstruct
    public void initData() throws CouponSystemException {

        List<Company> companies = new ArrayList<>();

        if (companyRepo.count() == 0) {
            Company company = new Company("TestCompany", "Company@company.com", "company");
            companies.add(company);
            for (int i = 0; i < companyNames.length; i++) {
                Company newCompany = new Company(companyNames[i], getDomain(companyNames[i]), getRandomPassword());
                companies.add(newCompany);
            }

            for (Company c : companies) {
                adminService.addCompany(c);
            }

        }

        if (couponRepo.count() == 0) {

            int bound = companies.size() + 1;
            Coupon coupon1 = new Coupon(0, (random.nextInt(bound)), Category.Electricity, "Samsung Galaxy S21", "Get the latest Samsung Galaxy S21 with a 10% discount",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 50, 1999.99, "");

            Coupon coupon2 = new Coupon(0, (random.nextInt(bound)), Category.Restaurant, "Burger Joint", "Enjoy a 20% discount on all burgers and fries",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 100, 49.99, "");

            Coupon coupon3 = new Coupon(0, (random.nextInt(bound)), Category.Vacation, "Hawaii Vacation Package", "Book a Hawaii vacation package and get 25% off",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 10, 7999.99, "");

            Coupon coupon4 = new Coupon(0, (random.nextInt(bound)), Category.Fashion, "Nike Running Shoes", "Get the latest Nike running shoes with a 15% discount",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 30, 299.99, "");

            Coupon coupon5 = new Coupon(0, (random.nextInt(bound)), Category.Books, "Best-Selling Books Bundle", "Get the latest best-selling books bundle with a 20% discount",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 50, 149.99, "");

            Coupon coupon6 = new Coupon(0, (random.nextInt(bound)), Category.Restaurant, "Pizza Night", "Buy one large pizza and get one free",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 100, 39.99, "");

            Coupon coupon7 = new Coupon(0, (random.nextInt(bound)), Category.Vacation, "Europe Tour Package", "Book a Europe tour package and get 30% off",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 5, 11999.99, "");

            Coupon coupon8 = new Coupon(0, (random.nextInt(bound)), Category.Electricity, "Apple Watch Series 7", "Get the latest Apple Watch Series 7 with a 12% discount",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), bound, 1799.99, "");

            Coupon coupon9 = new Coupon(0, (random.nextInt(bound)), Category.Beauty, "Makeup Products", "Get 15% off on all makeup products",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 50, 99.99, "");

            Coupon coupon10 = new Coupon(0, (random.nextInt(bound)), Category.Vacation, "Caribbean Cruise", "Book a Caribbean cruise and get 20% off",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 10, 5999.99, "");

            Coupon coupon11 = new Coupon(0, (random.nextInt(bound)), Category.Restaurant, "Steak Night", "Enjoy a 25% discount on all steaks",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 50, 69.99, "");

            Coupon coupon12 = new Coupon(0, (random.nextInt(bound)), Category.Beauty, "Hair Care Products", "Get 10% off on all hair care",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 50, 49.99, "");

            Coupon coupon13 = new Coupon(0, (random.nextInt(bound)), Category.Fashion, "Glamorous Gowns", "Get 20% off on glamorous gowns for your next party",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 50, 199.99, "");

            Coupon coupon14 = new Coupon(0, (random.nextInt(bound)), Category.Restaurant, "Pizza Mania", "Buy one pizza and get one free",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 100, 25.99, "");

            Coupon coupon15 = new Coupon(0, (random.nextInt(bound)), Category.Beauty, "Glow Up", "Get 30% off on all beauty products",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 75, 49.99, "");

            Coupon coupon16 = new Coupon(0, (random.nextInt(bound)), Category.Vacation, "Cruise Deals", "Enjoy 15% off on all cruise bookings",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), bound, 500.00, "");

            Coupon coupon17 = new Coupon(0, (random.nextInt(bound)), Category.Health, "Healthy Habits", "Get 10% off on all health supplements",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 50, 100.00, "");

            Coupon coupon18 = new Coupon(0, (random.nextInt(bound)), Category.Electricity, "Tech Savvy", "Buy a laptop and get a free wireless mouse",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 10, 1499.99, "");

            Coupon coupon19 = new Coupon(0, (random.nextInt(bound)), Category.Fashion, "Trendy Tees", "Get 2 trendy t-shirts for the price of 1",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 100, 29.99, "");

            Coupon coupon20 = new Coupon(0, (random.nextInt(bound)), Category.Restaurant, "Fine Dining", "Get a 3 course meal for only $50",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 25, 50.00, "");

            Coupon coupon21 = new Coupon(0, (random.nextInt(bound)), Category.Vacation, "Safari Adventure", "Book a 5-day safari and get a free night stay",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 5, 2000.00, "");

            Coupon coupon22 = new Coupon(0, (random.nextInt(bound)), Category.Beauty, "Makeup Must-Haves", "Get 15% off on all makeup products",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 50, 99.99, "");

            Coupon coupon23 = new Coupon(0, (random.nextInt(bound)), Category.Health, "Healthy Choices", "Get 25% off on all organic food products",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 100, 50.00, "");

            Coupon coupon24 = new Coupon(0, (random.nextInt(bound)), Category.Food, "Foodie's Delight", "Enjoy a 20% discount on all restaurant meals",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 200, 75.00, "");

            Coupon coupon25 = new Coupon(0, (random.nextInt(bound)), Category.Vacation, "Globe Trotter", "Get $100 off on your next international flight booking",
                    LocalDate.now().plusDays(random.nextInt(randomNumber)), LocalDate.now().plusWeeks(randomNumber), 50, 500.00, "");

            companyService.addCoupon(coupon1);
            companyService.addCoupon(coupon2);
            companyService.addCoupon(coupon3);
            companyService.addCoupon(coupon4);
            companyService.addCoupon(coupon5);
            companyService.addCoupon(coupon6);
            companyService.addCoupon(coupon7);
            companyService.addCoupon(coupon8);
            companyService.addCoupon(coupon9);
            companyService.addCoupon(coupon10);
            companyService.addCoupon(coupon11);
            companyService.addCoupon(coupon12);
            companyService.addCoupon(coupon13);
            companyService.addCoupon(coupon14);
            companyService.addCoupon(coupon15);
            companyService.addCoupon(coupon16);
            companyService.addCoupon(coupon17);
            companyService.addCoupon(coupon18);
            companyService.addCoupon(coupon19);
            companyService.addCoupon(coupon20);
            companyService.addCoupon(coupon21);
            companyService.addCoupon(coupon22);
            companyService.addCoupon(coupon23);
            companyService.addCoupon(coupon24);
            companyService.addCoupon(coupon25);


        }

        if (customerRepo.count() == 0) {
            Customer customer = new Customer(0, "Test", "Customer", "Customer@customer.com", "customer");
            adminService.addCustomer(customer);
            for (int i = 0; i < 25; i++) {
                String firstName = FIRST_NAMES[new Random().nextInt(FIRST_NAMES.length)];
                String lastName = LAST_NAMES[new Random().nextInt(LAST_NAMES.length)];
                String email = String.format("%s.%s@%s", firstName.toLowerCase(), lastName.toLowerCase(), random.nextInt(100) + 1, EMAIL_DOMAINS[random.nextInt(EMAIL_DOMAINS.length)]);
                String password = getRandomPassword();
                Customer NewCustomer = new Customer(0, firstName, lastName, email, password);
                adminService.addCustomer(NewCustomer);
            }

            for (int i = 1; i < 20; i++) {
                customerService.purchaseCoupon(i, i);
            }
        }

    }


}
