let mysql = require("mysql2/promise");
require("dotenv").config();

let pool = mysql.createPool({
  host: "127.0.0.1",
  database: process.env.MYSQL_DATABASE,
  user: process.env.MYSQL_USER,
  connectionLimit: 10,
});

exports.create = async (email) => {

    try {
        const query = 'INSERT INTO Users (email) Values(?)';

        return await pool.query(query,email);
    } catch (error) {
        console.log("error occurred creating user", error.message);
        throw error; 
    }


};

exports.getOne = async (email) => {
  try {
    const query = "SELECT * FROM Users where email = ?";
    const [rows] = await pool.query(query, email);

    if (rows.length == 0) {
      return null;
    }

    return rows[0];
  } catch (error) {
    console.log("error occurred getting users", error.message);
    throw error;
  }
  // pool.query(`SELECT * FROM Users where email = "${data.email}"`, function(error, result){
  //     if(error){
  //         console.log(error);
  //         throw error;
  //     }
  //     console.log(result);
  //     return result;
  // })
};
