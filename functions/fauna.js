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
      .then(response =>{
        const emp_respon = {
        statusCode: 201,
        body: JSON.stringify(response),
        };
        return emp_respon;
      }) 
      // .then(function(emp_res){
      //   const user_client = new faunadb.Client({
      //     secret: emp_res.secret,
      //   });
      //   user_client.query(
      //     q.Get(q.Match(q.Index("emp_id"), data.empid))
      //   )        
      // })
      // .then(function(emp_resp){
      //   const emp_respon = {
      //     statusCode: 201,
      //     body: JSON.stringify({
      //       secret: emp_res.secret,
      //       name: emp_resp.data.name,
      //     }),
      //   };
      //   return emp_respon;
      // })
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
      .then(function(admin_res){
        const admin_client = new faunadb.Client({
          secret: admin_res.secret,
        });
        admin_client.query(
          q.Get(q.Match(q.Index("admin_id"), data.empid))
        )
        
      })
      .then(function(admin_respo){
        const admin_response = {
          statusCode: 201,
          body: JSON.stringify({
            secret: admin_res.secret,
            data: admin_respo.data
          }),
        };
        return admin_response;
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
