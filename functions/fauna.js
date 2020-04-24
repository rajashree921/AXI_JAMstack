require("dotenv").config();
const faunadb = require("faunadb");
const querystring = require("querystring");

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB,
});

module.exports.handler = async (event) => {
  const data = querystring.parse(event.body);
  const action = data.action;
  if (action == "login_emp") {
    client.query(
        q.Login(q.Match(q.Index("emp_id"), data.empid), {
          password: data.password,
        })
      )
      .then(function (r){
        const user_client = new faunadb.Client({
          secret: r.secret,
        });
        user_client.query(
          q.Get(q.Match(q.Index("emp_id"), data.empid))
        );
      })
      .then(function(re){
        const response1 = {
          statusCode: 201,
          body: JSON.stringify({
            secret: r.secret,
            data: re.data,
          }),
        };
        return response1;
      })
      .catch (function(error) {
      const errorResponse = {
        statusCode: 400,
        body: JSON.stringify(error),
      };
      return errorResponse;
    });
  } else if (action == "login_admin") {
    try {
      const queryResponse3 = await client.query(
        q.Login(q.Match(q.Index("admin_id"), data.empid), {
          password: data.password,
        })
      );
      const admin_client = new faunadb.Client({
        secret: queryResponse3.secret,
      });
      const queryResponse4 = await admin_client.query(
        q.Get(q.Match(q.Index("admin_id"), data.empid))
      );
      const response = {
        statusCode: 201,
        body: JSON.stringify({
          secret: queryResponse3.secret,
          data: queryResponse4.data,
        }),
      };
      return response;
    } catch (error) {
      const errorResponse = {
        statusCode: 400,
        body: JSON.stringify(error),
      };
      return errorResponse;
    }
  }
  const def = {
    statusCode: 201,
    body: data.action,
  };
  return def;
};
