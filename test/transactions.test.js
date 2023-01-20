const chaiHTTP = require("chai-http");
const chai = require("chai");
const { assert } = require("chai");
const { suite, test } = require("mocha");
const app = require("../app");

chai.use(chaiHTTP);

suite("Test on transaction routes", function () {
  const categoryBody = {
    name: "testTransactionCat",
    description: "testTransactionCat",
  };
  const userBody = {
    firstName: "testTrasactionUser",
    lastName: "testTrasactionUser",
    email: "testTrasactionUser@email.com",
    password: "testTrasactionUser",
  };
  let categoryID = 1;
  let userID;
  let transactionID;
  let token;
  // obtener token
  before((done) => {
    chai
      .request(app)
      .post("/api/auth/login")
      .send({
        email: "antonio@test.com",
        password: "1234",
      })
      .end((err, res) => {
        token = res.body.body.token;
        done();
      });
  });

  //  crear category temporal para pruebas
  before((done) => {
    chai
      .request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${token}`)
      .send(categoryBody)
      .end((err, res) => {
        categoryID = res.body.body.id;
        done();
      });
  });

  suite("transaction POST Routes", function () {
    test("Succesfully create transaction", function (done) {
      chai
        .request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          amount: 5000,
          date: "2022/10/28",
          user: userID,
          category: categoryID,
          description: "testDescription",
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
    });
    test("Trying to Post transaction with invalid UserID", function (done) {
      chai
        .request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          amount: 5000,
          date: "2022/10/28",
          user: 0,
          category: categoryID,
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          done();
        });
    });
    test("Trying to Post transaction with invalid categoryID", function (done) {
      chai
        .request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          amount: 5000,
          date: "2022/10/28",
          user: userID,
          category: 0,
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          done();
        });
    });
    test("Validation Error", function (done) {
      chai
        .request(app)
        .post("/api/transactions")
        .set("Authorization", `Bearer ${token}`)
        .send({
          amount: "",
          date: "",
          user: userID,
          category: categoryID,
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          done();
        });
    });
  });
  suite("transtaction UPDATE Routes", function () {
    test("Successfuly update transaction", function (done) {
      chai
        .request(app)
        .put(`/api/transactions/${transactionID}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          amount: 1,
          date: "2022/10/28",
          user: userID,
          category: categoryID,
        })
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
    });
    test("trying to update transaction with invalid categoryID", function (done) {
      chai
        .request(app)
        .put(`/api/transactions/${transactionID}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          amount: 5000,
          date: "2022/10/28",
          user: userID,
          category: 0,
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          done();
        });
    });
    test("trying to update transaction with invalid userID", function (done) {
      chai
        .request(app)
        .put(`/api/transactions/${transactionID}`)
        .set("Authorization", `Bearer ${token}`)
        .send({
          amount: 5000,
          date: "2022/10/28",
          user: 0,
          category: categoryID,
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          done();
        });
    });
    test("trying to update invalid transactionID", function (done) {
      chai
        .request(app)
        .put("/api/transactions/0")
        .set("Authorization", `Bearer ${token}`)
        .send({
          amount: 5000,
          date: "2022/10/28",
          user: 0,
          category: categoryID,
        })
        .end((err, res) => {
          assert.equal(res.status, 400);
          done();
        });
    });
  });
  suite("Get transactions GET routes", function () {
    test("", function (done) {
      chai
        .request(app)
        .get("/api/transactions")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
    });
    test("Get transactions by ID", function (done) {
      chai
        .request(app)
        .get(`/api/transactions/${transactionID}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
    });
    test("Trying to get unexistent transaction", function (done) {
      chai
        .request(app)
        .get("/api/transactions/0")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          assert.equal(res.status, 400);
          done();
        });
    });
  });
  suite("Delete transaction DELETE routes", function () {
    test("Succesfully delete transactions", function (done) {
      chai
        .request(app)
        .delete(`/api/transactions/${transactionID}`)
        .set("Authorization", `Bearer ${token}`)
        .send()
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
    });
    test("trying to delete with invalid  transaction ID", function (done) {
      chai
        .request(app)
        .delete("/api/transactions/0")
        .set("Authorization", `Bearer ${token}`)
        .send()
        .end((err, res) => {
          assert.equal(res.status, 400);
          done();
        });
    });
  });
  // Borrar usuario de prueba
  after((done) => {
    chai
      .request(app)
      .delete(`/api/users/${userID}`)
      .set("Authorization", `Bearer ${token}`)
      .send()
      .end((err, res) => {
        console.log("User testTrasactionUser@email.com DELETE successfully");
        done();
      });
  });
  // Borrar categoria de prueba
  after((done) => {
    chai
      .request(app)
      .delete(`/api/categories/${categoryID}`)
      .set("Authorization", `Bearer ${token}`)
      .send()
      .end((err, res) => {
        console.log("User testTrasactionUser@email.com DELETE successfully");
        done();
      });
  });
});
