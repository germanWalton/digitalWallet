const chaiHTTP = require("chai-http");
const chai = require("chai");
const { assert } = require("chai");
const { suite, test } = require("mocha");
const app = require("../app");

chai.use(chaiHTTP);

suite("Tests for Categories Routes", function () {
  const testReqBody = {
    name: "testCategory",
    description: "testCategory",
  };
  const updateReqBody = {
    name: "updateCategory",
    description: "updateCategory",
  };
  let categoryID = 11;
  let token;

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

  suite("Create categories: POST-route", function () {
    test("Succesfully create category", function (done) {
      chai
        .request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send(testReqBody)
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
    });
    test("Validation Error", function (done) {
      chai
        .request(app)
        .post("/api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send({})
        .end((err, res) => {
          assert.equal(res.status, 400);
          done();
        });
    });
  });
  suite("Update categories: PUT-route", function () {
    test("Succesfully Update category", function (done) {
      chai
        .request(app)
        .put(`/api/categories/${categoryID}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateReqBody)
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
    });
    test("Trying to update unexistent category", function (done) {
      chai
        .request(app)
        .put("api/categories/0")
        .set("Authorization", `Bearer ${token}`)
        .send(updateReqBody)
        .end((err, res) => {
          assert.equal(res.status, 400);
          done();
        });
    });
  });
  suite("Get categories: GET-route", function () {
    test("Get all categories", function (done) {
      chai
        .request(app)
        .get("api/categories")
        .set("Authorization", `Bearer ${token}`)
        .send(updateReqBody)
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
    });
    test("Get categories by ID", function (done) {
      chai
        .request(app)
        .get(`api/categories/${categoryID}`)
        .set("Authorization", `Bearer ${token}`)
        .send(updateReqBody)
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
    });
    test("trying to get unexistent categories", function (done) {
      chai
        .request(app)
        .get("/api/categories/0")
        .set("Authorization", `Bearer ${token}`)
        .send(updateReqBody)
        .end((err, res) => {
          assert.equal(res.status, 401);
          done();
        });
    });
  });
  suite("Delete categories", function () {
    test("succesfully delete category", function (done) {
      chai
        .request(app)
        .delete(`/api/categories/${categoryID}`)
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          assert.equal(res.status, 200);
          done();
        });
    });
    test("Trying to delete unexistent user", function (done) {
      chai
        .request(app)
        .delete("/api/categories/0")
        .set("Authorization", `Bearer ${token}`)
        .end((err, res) => {
          assert.equal(res.status, 401);
          done();
        });
    });
  });
});
