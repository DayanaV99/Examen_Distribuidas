const AWS = require("aws-sdk");

const dynamodb = new AWS.DynamoDB.DocumentClient();

// Endpoint para consultar todos los libros
exports.getBooks = async (event) => {
  try {
    const result = await dynamodb
      .scan({
        TableName: "BooksTableNew",  // Nombre actualizado de la tabla
      })
      .promise();

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ 
        books: result.Items,
        count: result.Count 
      }),
    };
  } catch (error) {
    console.error("Error retrieving books:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Error retrieving books", 
        error: error.message 
      }),
    };
  }
};

// Endpoint para consultar un libro específico por BookID
exports.getBookById = async (event) => {
  const bookId = event.pathParameters.bookId;

  if (!bookId) {
    return {
      statusCode: 400,
      body: JSON.stringify({ message: "BookID is required" }),
    };
  }

  const params = {
    TableName: "BooksTableNew",  // Nombre actualizado de la tabla
    Key: {
      BookID: bookId,
    },
  };

  try {
    const result = await dynamodb.get(params).promise();

    if (!result.Item) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Book not found" }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "OPTIONS,GET",
        "Access-Control-Allow-Headers": "Content-Type",
      },
      body: JSON.stringify({ book: result.Item }),
    };
  } catch (error) {
    console.error("Error retrieving book:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        message: "Error retrieving book", 
        error: error.message 
      }),
    };
  }
};
