const chai = require('chai');
const expect = chai.expect;
const {Builder, By, Capabilities} = require('selenium-webdriver');
const UserModel = require("../models/user.model");

const caps = new Capabilities();
caps.setPageLoadStrategy("normal");

let driver;

describe("Login Feature", function(){
    describe("Unit Tests", function(){
        it('Given email and password as input, it should return user info (including password) when the email is found in the database', async () => {
            let userModel = new UserModel();
            let data = await userModel.getUser("testuser@test.com");
            expect(data.result).to.eql({
                "id": data.result.id,
                "email": data.result.email,
                "name": data.result.name,
                "password": data.result.password,
            });
        });

        it("Given email and password as input, it should return true when email and password is correct", async () => {
            let userModel = new UserModel();
            let data = {"email": "testuser@test.com", "password": "password123"};
            let result = await userModel.login(data);
            expect(result).to.eql(true);
        });
    });

    describe("Integration Tests", function(){
        this.timeout(5000);
        it("Expect correct message when user successfully logged in", async function(){
            try {
                driver = await new Builder().
                    withCapabilities(caps).
                    forBrowser('chrome').
                    usingServer('http://selenium_chrome:4444/wd/hub').
                    build();
        
                // Navigate to Url
                await driver.get("http://web_app:3000");
                await driver.findElement(By.name("email")).sendKeys("testuser@test.com");
                await driver.findElement(By.name("password")).sendKeys("password123");
                await driver.findElement(By.id("login_button")).click();
                await driver.get("http://web_app:3000/success");
                let message = await driver.findElement(By.tagName("h1")).getText();
                expect(message).to.equal("Hello, Anthony Dillahunty!");
            } catch (e) {
                console.log(e);
                throw new Error("error");
            } finally {
                if(driver){
                    await driver.quit();
                }
            }        
        });

        this.timeout(5000);
        it("Expect User ID to be displayed in the success page", async function(){
            try {
                driver = await new Builder().
                    withCapabilities(caps).
                    forBrowser('chrome').
                    usingServer('http://selenium_chrome:4444/wd/hub').
                    build();
        
                // Navigate to Url
                await driver.get("http://web_app:3000");
                await driver.findElement(By.name("email")).sendKeys("testuser@test.com");
                await driver.findElement(By.name("password")).sendKeys("password123");
                await driver.findElement(By.id("login_button")).click();
                await driver.get("http://web_app:3000/success");
                let message = await driver.findElement(By.tagName("h2")).getText();
                expect(message).to.equal("User ID: 1");
            } catch (e) {
                console.log(e);
                throw new Error("error");
            } finally {
                if(driver){
                    await driver.quit();
                }
            }        
        });
    });
});