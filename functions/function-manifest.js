// create metadata for all the available functions to pass to completions API
const tools = [
  {
    type: 'function',
    function: {
      name: 'checkInventory',
      description: 'Check the inventory of airpods, airpods pro or airpods max.',
      parameters: {
        type: 'object',
        properties: {
          model: {
            type: 'string',
            'enum': ['airpods', 'airpods pro', 'airpods max'],
            description: 'The model of airpods, either the airpods, airpods pro or airpods max',
          },
        },
        required: ['model'],
      },
      returns: {
        type: 'object',
        properties: {
          stock: {
            type: 'integer',
            description: 'An integer containing how many of the model are in currently in stock.'
          }
        }
      }
    },
  },
  {
    "type": "function",
    "function": {
      "name": "extractMeetingDetails",
      "description": "Extracts meeting details such as attendees' email addresses, the date, time, and the topic from the given speech text.",
      "parameters": {
        "type": "object",
        "properties": {
          "model": {
            "type": "string",
            "description": "The transcribed user speech text from which to extract the meeting details."
          }
        },
        "required": ["model"]
      },
      "returns": {
        "type": "object",
        "properties": {
          "attendees_email_address": {
            "type": "array",
            "items": {
              "type": "string"
            },
            "description": "An array of email addresses of the meeting attendees."
          },
          "date": {
            "type": "string",
            "description": "The date of the meeting."
          },
          "time": {
            "type": "string",
            "description": "The time of the meeting."
          },
          "topic": {
            "type": "string",
            "description": "The topic of discussion for the meeting."
          }
        }
      }
    },
    "prompt": "Given the transcribed text of user speech regarding a meeting, analyze the text and extract the specific meeting details required. The details to find are the attendees' email addresses, the date and time of the meeting, and the topic being discussed. Present the extracted information in a structured format with each detail clearly labeled."
  },
  {
    "type": "function",
    "function": {
      "name": "getOrderStatus",
      "description": "Fetches a list of order statuses associated with the given phone number.",
      "parameters": {
        "type": "object",
        "properties": {
          "model": {
            "type": "string",
            "description": "The phone number for which to fetch associated order statuses."
          }
        },
        "required": ["model"]
      },
      "returns": {
        "type": "object",
        "properties": {
          "orderStatuses": {
            "type": "array",
            "items": {
              "type": "object",
              "properties": {
                "orderId": {
                  "type": "string",
                  "description": "The unique identifier of the order."
                },
                "status": {
                  "type": "string",
                  "description": "The current status of the order."
                },
                "date": {
                  "type": "string",
                  "description": "The date when the order was placed."
                }
              }
            },
            "description": "A list of orders with their statuses and other relevant details."
          },
        }
      }
    },
    "prompt": "Given a phone number as input, verify its validity and then retrieve all orders associated with that number. For each order, provide the order ID, the current status of the order, and the date it was placed. The output should include a list of these orders with their details, along with a boolean indicating whether the phone number is valid and associated with any orders."
  },
  {
    type: 'function',
    function: {
      name: 'checkPrice',
      description: 'Check the price of given model of airpods, airpods pro or airpods max.',
      parameters: {
        type: 'object',
        properties: {
          model: {
            type: 'string',
            'enum': ['airpods', 'airpods pro', 'airpods max'],
            description: 'The model of airpods, either the airpods, airpods pro or airpods max',
          },
        },
        required: ['model'],
      },
      returns: {
        type: 'object',
        properties: {
          price: {
            type: 'integer',
            description: 'the price of the model'
          }
        }
      }
    },
  },
  {
    type: 'function',
    function: {
      name: 'placeOrder',
      description: 'Places an order for a set of airpods.',
      parameters: {
        type: 'object',
        properties: {
          model: {
            type: 'string',
            'enum': ['airpods', 'airpods pro'],
            description: 'The model of airpods, either the regular or pro',
          },
          quantity: {
            type: 'integer',
            description: 'The number of airpods they want to order',
          },
        },
        required: ['type', 'quantity'],
      },
      returns: {
        type: 'object',
        properties: {
          price: {
            type: 'integer',
            description: 'The total price of the order including tax'
          },
          orderNumber: {
            type: 'integer',
            description: 'The order number associated with the order.'
          }
        }
      }
    },
  },
];

module.exports = tools;