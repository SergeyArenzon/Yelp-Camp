

document.getElementById('plusBtn').addEventListener('click', () => {

    var li = document.createElement("li");
    var feedback_format = 
    "<div id=\"serverSelect\">" 
        + "<input  type=\"text\"  name=\"posFB\" >"
    + "</div>";
    li.innerHTML = feedback_format;
    document.getElementById('posFeedBackList').appendChild(li);    
});


document.getElementById('minusBtn').addEventListener('click', () => {
    
    var li = document.createElement("li");

    var feedback_format = 
    "<div id=\"serverSelect\">" 
        + "<input  type=\"text\" name=\"negFB\">"
    + "</div>";
    li.innerHTML = feedback_format;
    document.getElementById('negFeedBackList').appendChild(li);    
});