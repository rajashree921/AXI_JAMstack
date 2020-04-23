require("dotenv").config();
const faunadb = require("faunadb");
const querystring = require("querystring");

const q = faunadb.query;
const client = new faunadb.Client({
  secret: process.env.FAUNADB,
});

module.exports.handler = async (event) => {
  const data = querystring.parse(event.body);
  const response ={
    statusCode: 201,
    body: JSON.stringify(data) + " " + typeof(data.action)
  }
  return response;
  // switch (data.action) {
  //   case "login_emp":
  //     try {
  //       const queryResponse1 = await client.query(
  //         q.Login(q.Match(q.Index("emp_id"), data.empid), {
  //           password: data.password,
  //         })
  //       );
  //       const user_client = new faunadb.Client({
  //         secret: queryResponse1.secret,
  //       });
  //       const queryResponse2 = await user_client.query(
  //         q.Get(q.Match(q.Index("emp_by_id"), data.empid))
  //       );
  //       const response = {
  //         statusCode: 201,
  //         body: JSON.stringify({
  //           secret: queryResponse1.secret,
  //           data: queryResponse2.data,
  //         }),
  //       };
  //       return response;
  //     } catch (error) {
  //       const errorResponse = {
  //         statusCode: 400,
  //         body: JSON.stringify(error),
  //       };
  //       return errorResponse;
  //     }
  //     break;
  //   case "login_admin":
  //     try {
  //       const queryResponse3 = await client.query(
  //         q.Login(q.Match(q.Index("emp_id"), data.empid), {
  //           password: data.password,
  //         })
  //       );
  //       const admin_client = new faunadb.Client({
  //         secret: queryResponse3.secret,
  //       });
  //       const queryResponse4 = await admin_client.query(
  //         q.Get(q.Match(q.Index("emp_by_id"), data.empid))
  //       );
  //       const response = {
  //         statusCode: 201,
  //         body: JSON.stringify({
  //           secret: queryResponse3.secret,
  //           data: queryResponse4.data,
  //         }),
  //       };
  //       return response;
  //     } catch (error) {
  //       const errorResponse = {
  //         statusCode: 400,
  //         body: JSON.stringify(error),
  //       };
  //       return errorResponse;
  //     }
  //     break;
  //   default:
  //     const errorResponse3 = {
  //       statusCode: 400,
  //       body: "default case",
  //     };
  //     return errorResponse3;
  // }
};
