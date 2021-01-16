import app from "../server";
import User from "../entities/user";
import Contact from "../entities/contact";
import expected from "chai";
import request from "supertest";

const { expect } = expected;

let user;
let newUser;
let contact;
let token;
let newContact;

describe("Test for User and Contact API endpoints", () => {
  before(done => {
    User.deleteMany().exec()
    Contact.deleteMany().exec()

    user = { name: "Matthew Okoh", username: "OKoh", password: "okoh", email: "okoh@gmail.com" };
    done()
  })

  after(done => {
    User.deleteMany();
    Contact.deleteMany()
    done();
  });

 
  it("should create a new signup", (done) => {
    request(app).post("/auth/signup")
      .send(user)
      .end((err, res) => {
        const body = res.body;
        newUser = body;

        expect(200)
        expect(res.body).to.contain.property("_id")
        done();
      })
  })

  it("should log a user in", (done) => {
    const loginData = { username: "okoh", password: "okoh" }
    request(app).post("/auth/login")
      .send(loginData)
      .end((err, res) => {
        token = res.body.token
        const body = res.body;

        expect(200)
        expect(body).to.contain.property("token")
        expect(body).to.contain.property("user")
        done();
      })
  })

  // Test case for forgot password
  it("Should send a password reset link to user email address", (done) => {
    const data = { email: newUser.email };
    request(app).post("/auth/forgotPassword")
      .send(data)
      .end((err, res) => {
        const body = res.body;
        console.log(body, " forgot password");
        expect(body).to.contain.property("message");
        expect(body.message).to.equal("Email sent");
        done()
      })
  })

  // Test for failure due to unauthorized access
  it("should throw unauthorized error", (done) => {
    contact = { createdBy: newUser._id, name: "Matthew Elizabeth", phone: "080123456778", officePhone: "09012324563", address: "somewhere in the world", email: "elizabeth@gmail.com" };

    request(app).post("/contact/new")
      .send(contact)
      .end((err,res) => {
        const body = res.body;

        expect(body.error).to.equals("Access denied. No token provided");
        done();
      })
  })

  // Creates a new contact successfully
  it("Should create a new contact", (done) => {
    contact = { createdBy: newUser._id, name: "Matthew Elizabeth", phone: "08012345678", officePhone: "09012324563", address: "somewhere in the world", email: "elizabeth@gmail.com" };
    
    request(app).post("/contact/new")
      .set("x-auth-token", token)
      .send(contact)
      .end((err, res) => {
        const body = res.body;
        newContact = body;

        expect(body).to.contain.property("name");
        expect(body).to.contain.property("email");
        expect(body).to.contain.property("phone");
        expect(200)
        done()
      })
  })

  // Test for successfull fetching Contact
  it("Should fetch contact", (done) => {
    request(app).get("/contact/all")
      .set("x-auth-token", token)
      .end((err, res)  => {
        const body = res.body;

        expect(body).to.be.instanceOf(Object)
        done()
      })
  })

  // Test case for fetching a single contact with authorized token
  it("Should fetch a single contact", (done) => {
    const contactId = newContact._id;

    request(app).get(`/contact/${contactId}`)
      .set("x-auth-token", token)
      .end((err, res) => {
        const body = res.body;

        expect(body).to.be.instanceOf(Object);
        expect(body._id).to.equal(contactId);
        done()
      })
  });

  // Test case for updating a contact
  it("Should update a contact phone number", (done) => {
    const newPhoneNumber = "09022331144";
    const contactId = newContact._id;

    const data = { contactId, phone: newPhoneNumber };

    request(app).put("/contact/update")
      .set("x-auth-token", token)
      .send(data)
      .end((err, res) => {
        const body = res.body;

        expect(body).to.instanceOf(Object);
        expect(body).to.contain.property("phone");
        expect(body.phone).to.equals(newPhoneNumber);
        done();
      })
  })
  // Test case for unathorized access to fetch a contact
  it("Should failed to fetch a contact", (done) => {
    const contactId = newContact._id;

    request(app).get(`/contact/${contactId}`)
      .end((err, res) => {
        const body = res.body;

        expect(body.error).to.equal("Access denied. No token provided");
        done();
      })
  })

  // Test case for deleting a contact
  it("Should delete a contact", (done) => {
    const contactId = newContact._id;

    request(app).delete(`/contact/delete/${contactId}`)
      .set("x-auth-token", token)
      .end((err, res) => {
        const body = res.body;

        expect(body).to.contain.property("message");
        expect(body.message).to.equal("Contact deleted");
        done();
      })
  })


})