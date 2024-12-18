const chatInput = document.querySelector(".chat-input textarea");
const sendChatBtn = document.querySelector(".chat-input i");
const chatbox = document.querySelector(".chatbox");
// ---Defining the chatbotToggler---
const chatbotToggler  = document.querySelector(".chatbot-toggler");
const chatbotCloseBtn  = document.querySelector(".close-btn");


///-------awaiting the api key---////
const API_KEY = "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";
const inputInitHeight = chatInput.scrollHeight;

const createChatLi = (message, className) => {
    // ----Create a chat <li> element with passed messageand className--//
    const chatLi = document.createElement("li");
    chatLi.classList.add("chat", className);
    // ---to be able to send typed message and it appers---
    let chatContent = className === "outgoing" ? '<p></p>' : '<i class="fa fa-commenting"></i><p></p>';
    chatLi.innerHTML = chatContent;
    chatLi.querySelector("p").textContent = message;
    return chatLi;
};
// ----added the API URL----//
const generateResponse = (incomingchatLi) =>{
    const API_URL = "https://api.openai.com/v1/chat/completions";
    const mesaageElement =incomingchatLi.querySelector("p");

    //--define the properties and message for the API----//
    const requestOptions = {
        method: "POST",
        headers:{
            "Content-Type": "application/json",
            "Authorization": 'Bearer ${API_KEY}'

        },
        


                body:JSON.stringify(
                    {
                        model:"gpt-4o-mini",
                        message: [{role: "user", content: userMessage}]
                    }
                )

    }
//-----send POST request to API_KEY, get response---//
     fetch(API_URL,requestOptions).then(res => res.json()).then(data =>{
        mesaageElement.textContent =  data.choices[0].message.content;
     }) .catch((error) => {
        // ---- to style the error message--//
        mesaageElement.classList.add("error");
        mesaageElement.textContent =  "oops! something went wrong,please try again";
     }).finally(()=> chatbox.scrollTo(0,chatbox.scrollHeight));
}
let userMessage;
const handleChat = () => {
userMessage = chatInput.value.trim();
if(!userMessage) return;

// ---to make the message area blank after clicking on the send icon--
chatInput.value = "";

chatInput.style.height = '${inputInitHeight}px';
//   ---Append user's message to the chatbox--//
chatbox.appendChild(createChatLi(userMessage, "outgoing"));
chatbox.scrollTo(0,chatbox.scrollHeight);

setTimeout(() => {
//----display thinking... mesaage while waiting for the response---//
const incomingchatLi = createChatLi("Thinking....","incoming")
    chatbox.appendChild(incomingchatLi);
    chatbox.scrollTo(0,chatbox.scrollHeight);
    generateResponse(incomingchatLi)
},600)
}
chatInput.addEventListener("input",() => {
    // ---- To adjust the height of the input textare based on its content-----//
chatInput.style.height = '${inputInitHeight}px';
chatInput.style.height = '${chatInput.scrollHeight}px';
});
chatInput.addEventListener("keydown",(e) => {
    // ---- If Enter key is pressed without shift key and the window// width is greater than 800px,handle the chat--
if(e.key === "Enter" && !e.shiftKey && window.innerWidth > 800){
    e.preventDefault();
    handleChat();
}
});


// -----To make the chatbot apear and disapper when the message icon is click--
chatbotToggler.addEventListener("click", () => document.body.classList.toggle("show-chatbot"));

chatbotCloseBtn.addEventListener("click", () => document.body.classList.remove("show-chatbot"));

sendChatBtn.addEventListener("click", handleChat);



