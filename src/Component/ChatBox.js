// // ChatApp.js

// import React, { useState } from "react";
// //import DocumentUpload from "./DocumentUpload";
// import "./ChatBox.css";
// import SendIcon from "@mui/icons-material/Send";
// import axios from "axios";
// import SideNav from "./SideNav";

// const ChatBox = () => {
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");
//   // const [uploadedDocuments, setUploadedDocuments] = useState([]);

//   const handleInputChange = (e) => {
//     setInput(e.target.value);
//   };

//   const handleSendMessage = () => {
//     if (input.trim() === "") return;

//     const userMessage = {
//       text: "User Message",
//       type: "system",
//     };

//     setMessages([...messages, userMessage]);
//     setInput("");

//     // TODO: Send input to your backend for document search and receive the response
//     // const searchResult = callYourSearchAPI(input);

//     // For the sake of this example, let's simulate a response
//     const systemResponse = {
//       text: "Your search result goes here...",
//       type: "system",
//     };

//     setMessages([...messages, systemResponse]);
//   };

//   // const handleSendMessage = async () => {
//   //   if (input.trim() === "") return;

//   //   // Send input to the Flask API
//   //   try {
//   //     const response = await axios.post("http://localhost:5000/process_query", {
//   //       user_query: input,
//   //     });

//   //     const systemResponse = {
//   //       text: response.data.output_result,
//   //       type: "system",
//   //     };

//   //     console.log(systemResponse);

//   //     setMessages([...messages, systemResponse]);
//   //     setInput("");
//   //   } catch (error) {
//   //     console.error("Error sending message:", error);
//   //   }
//   // };

//   //   const handleDocumentUpload = (document) => {
//   //     setUploadedDocuments([...uploadedDocuments, document]);
//   //   };

//   return (
//     <div className="chatbox-container">
//       <div className="side-nav-left">
//         <SideNav></SideNav>
//       </div>
//       <div className="chat-container">
//         <div className="chat-history">
//           {messages.map((message, index) => (
//             <div key={index} className={`message ${message.type}`}>
//               {message.text}
//             </div>
//           ))}
//         </div>
//         <div className="chat-input">
//           <input
//             type="text"
//             placeholder="Type your query..."
//             value={input}
//             onChange={handleInputChange}
//           />
//           <button onClick={handleSendMessage}>
//             <SendIcon />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;

//////////////////////////////////////////////
/////////////////////////////////////////////
/////////////////////////////////////////////

// import React, { useState } from "react";
// import "./ChatBox.css";
// import SendIcon from "@mui/icons-material/Send";
// import Navbar from "./Navbar";
// //import SideNav from "./SideNav";
// // import { Link, useNavigate, useLocation } from "react-router-dom";

// const ChatBox = ({ isAdmin }) => {
//   //const location = useLocation();
//   const [messages, setMessages] = useState([]);
//   const [input, setInput] = useState("");

//   const handleInputChange = (e) => {
//     setInput(e.target.value);
//   };

//   const handleSendMessage = () => {
//     if (input.trim() === "") return;

//     const userMessage = {
//       text: "User Message",
//       type: "user",
//     };

//     setMessages([...messages, userMessage]);
//     setInput("");

//     // TODO: Send input to your backend for document search and receive the response
//     // const searchResult = callYourSearchAPI(input);

//     // For the sake of this example, let's simulate a response
//     const systemResponse = {
//       text: "Your search result goes here...",
//       type: "user",
//     };

//     setMessages([...messages, systemResponse]);
//   };

//   return (
//     <div className="chatbox-container">
//       <div className="side-nav-left">
//         <Navbar />
//       </div>
//       <div className="chat-container">
//         <div className="chat-history">
//           {messages.map((message, index) => (
//             <div key={index} className={`message ${message.type}`}>
//               {message.text}
//             </div>
//           ))}
//         </div>
//         <div className="chat-input">
//           <input
//             type="text"
//             placeholder="Type your query..."
//             value={input}
//             onChange={handleInputChange}
//           />
//           <button className="send" onClick={handleSendMessage}>
//             <SendIcon />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ChatBox;
///////////////////////////////////////////////////
//////////////////////////////////////////////////
//////////////////////////////////////////////////

import React, { useState, useRef } from "react";
import "./ChatBox.css";
import SendIcon from "@mui/icons-material/Send";
import Navbar from "./Navbar";

const ChatBox = ({ isAdmin }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatHistoryRef = useRef(null);

  const handleInputChange = (e) => {
    setInput(e.target.value);
  };

  const handleSendMessage = async () => {
    if (input.trim() === "") return;

    // Set loading to true
    setLoading(true);

    // Store the user message in state
    const newUserMessage = { text: input.trim(), type: "user" };
    setMessages((prevMessages) => [...prevMessages, newUserMessage]);
    setInput("");

    const requestOptions = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: `"${input}"`,
    };

    try {
      const response = await fetch(
        "https://localhost:7003/api/Chat/ask",
        requestOptions
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      // Store the assistant content in state
      const newAssistantMessage = { text: result.content, type: "assistant" };
      setMessages((prevMessages) => [...prevMessages, newAssistantMessage]);
    } catch (error) {
      console.error("Error in API request:", error);
    } finally {
      // Set loading back to false after API call completes
      setLoading(false);
    }
    chatHistoryRef.current.scrollTop = chatHistoryRef.current.scrollHeight;

    // setInput("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); // Prevents the default behavior of the Enter key (e.g., new line in a textarea)
      handleSendMessage(); // Call the handleSendMessage function when Enter key is pressed
    }
  };

  return (
    <div className="chatbox-container">
      <div className="side-nav-left">
        <Navbar />
      </div>
      <div ref={chatHistoryRef} className="chat-container">
        <div className="chat-history">
          {messages.map((message, index) => (
            <div key={index} className={`message ${message.type}`}>
              {message.text}
            </div>
          ))}
          {/* {loading && <div className="message system">Loading... </div>} */}
          {loading && (
            <div className="message system">
              {Array.from("Loading...").map((letter, index) => (
                <span
                  key={index}
                  style={{ animationDelay: `${index * 0.1}s` }}
                  className="wave"
                >
                  {letter}
                </span>
              ))}
              <style>
                {`
        @keyframes wave {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }

        .message.system span {
          display: inline-block;
          animation: wave 1s infinite;
        }
      `}
              </style>
            </div>
          )}
        </div>

        <div className="chat-input">
          <input
            type="text"
            placeholder="Type your query..."
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />
          <button className="send-button" onClick={handleSendMessage}>
            <SendIcon />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatBox;
