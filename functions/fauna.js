require("dotenv").config();
const faunadb = require("faunadb");
const querystring = require("querystring");

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB,
});

module.exports.handler = async (event) => {
  const data = querystring.parse(event.body);
  switch (data.action) {
    case "login_emp":
      client.query(
        q.Login(q.Match(q.Index("emp_id"), data.empid), {
          password: data.password,
        })
      )
      .then(function(res){
        const user_client = new faunadb.Client({
          secret: res.secret,
        });
        user_client.query(
          q.Get(q.Match(q.Index("emp_id"), data.empid))
        )
        .then(function(resp){
          const response = {
            statusCode: 201,
            body: JSON.stringify({
              secret: res.secret,
              name: resp.data.name,
            }),
          };
          return response;
        })
      })
      .catch(function(error){
        const errorResponse = {
          statusCode: 400,
          body: JSON.stringify(error),
        };
        return errorResponse;
      });
    break;
    case "login_admin":
      client.query(
        q.Login(q.Match(q.Index("admin_id"), data.empid), {
          password: data.password,
        })
      )
      .then(function(res){
        const user_client = new faunadb.Client({
          secret: res.secret,
        });
        user_client.query(
          q.Get(q.Match(q.Index("admin_id"), data.empid))
        )
        .then(function(response){
          const response = {
            statusCode: 201,
            body: JSON.stringify({
              secret: res.secret,
            }),
          };
          return response;
        })
      })
      .catch(function(error){
        const errorResponse = {
          statusCode: 400,
          body: JSON.stringify(error),
        };
        return errorResponse;
      });
    default:
      const errorResponse = {
        statusCode: 400,
        body: "default case",
      };
      return errorResponse;
  }
};
