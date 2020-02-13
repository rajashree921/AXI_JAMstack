require("dotenv").config();
const faunadb = require("faunadb");
const shortid = require("shortid");
const axios = require("axios");
const querystring = require("querystring");

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB
});

module.exports.handler = async event => {
  const data = querystring.parse(event.body);
  try {
    const queryResponse1 = await client.query(
      q.Login(q.Match(q.Index("emp_by_id"), data.empid), {
        password: data.password
      })
    );
    try {
      sessionStorage.setItem("token", queryResponse.secret);
      try {
        const queryResponse2 = await client.query(
          q.Get(q.Match(q.Index("emp_by_id"), data.empid))
        );
        sessionStorage.setItem("username", queryResponse2.data.FirstName);
      } catch (error) {
        const errorResponse = {
          statusCode: 400,
          body: JSON.stringify(error)
        };
        return errorResponse;
      }
    } catch (e) {
      if (e.code == 22) {
        alert("Session storage not available");
        sessionStorage.clear();
      }
    }
    const response = {
      statusCode: 302,
      body: JSON.stringify(queryResponse1) + JSON.stringify(queryResponse2)
      /*headers: {
        Location: `/dashboard`
      }*/
    };
    return response;
  } catch (error) {
    const errorResponse = {
      statusCode: 400,
      body: JSON.stringify(error)
    };
    return errorResponse;
  }
};
