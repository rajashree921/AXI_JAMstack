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
    const queryResponse = await client.query(
      q.Login(
        q.Match(q.Index("emp_by_id"), "AXI001", { password: "111111" })
      )
    );
    const response = {
      statusCode: 200,
      body: data.empid + " " + data.password + " " + JSON.stringify(queryResponse)
    };
    return response;
  } catch (error) {
    const errorResponse = {
      statusCode: 400,
      body: data.empid + " " + data.password + " " + JSON.stringify(error)
    };
    return errorResponse;
  }
};
