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
        // const user_client = new faunadb.Client({
        //   secret: res.secret,
        // });
        // user_client.query(
        //   q.Get(q.Match(q.Index("emp_id"), data.empid))
        // )
        // .then(function(resp){
        //   const respon = {
        //     statusCode: 201,
        //     body: JSON.stringify({
        //       secret: res.secret,
        //       name: resp.data.name,
        //     }),
        //   };
        //   return respon;
        // })
        const respon = {
          statusCode: 201,
          body: JSON.stringify({
            secret: res.secret,
          }),
        };
        return respon;
      })
      .catch(function(error){
        const errorResponse1 = {
          statusCode: 400,
          body: JSON.stringify(error),
        };
        return errorResponse1;
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
        .then(function(respo){
          const response = {
            statusCode: 201,
            body: JSON.stringify({
              secret: res.secret,
              data: respo.data
            }),
          };
          return response;
        })
      })
      .catch(function(error){
        const errorResponse2 = {
          statusCode: 400,
          body: JSON.stringify(error),
        };
        return errorResponse2;
      });
    default:
      const errorResponse3 = {
        statusCode: 400,
        body: "default case",
      };
      return errorResponse3;
  }
};
