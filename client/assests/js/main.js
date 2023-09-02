const sendMessage = document.getElementById("send-message");

sendMessage.addEventListener("click", (event) =>{
   const socket = new WebSocket("ws://localhost:8080");

   socket.addEventListener("open", (event) => {

      
    console.log("event",)
    socket.send(sendMessage.innerText);
   });

   socket.addEventListener("error", (error) => {
    console.log(error)
   })

   socket.addEventListener('message', (event) => {
      console.log('Message from server', event);
   })
});




console.log(sendMessage)
console.log("in js file")