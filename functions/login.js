require("dotenv").config();
const faunadb = require("faunadb");
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
      const user_client = new faunadb.Client({
        secret: queryResponse1.secret
      });
      const queryResponse2 = await user_client.query(
        q.Get(q.Match(q.Index("emp_by_id"), data.empid))
      );
      const response = {
        statusCode: 201,
        body: JSON.stringify(queryResponse2)
      };
      return response;
    } catch (error) {
      const errorResponse = {
        statusCode: 400,
        body: JSON.stringify(error) + "error2"
      };
      return errorResponse;
    }
  } catch (error) {
    const errorResponse = {
      statusCode: 400,
      body: JSON.stringify(error) + " error1 " + data.empid + " " + data.password
    };
    return errorResponse;
  }
};
