

document.getElementById('plusBtn').addEventListener('click', () => {
    
    var li = document.createElement("li");

    var feedback_format = 
    "<form id=\"serverSelect\">" 
        + "<input type=\"radio\" name=\"feedback\" value=\"1\">Positive<br>"
        + "<input type=\"radio\" name=\"feedback\" value=\"2\">Negative<br>"
        + "<input  type=\"text\">"
        + "<input  type=\"button\" value=\"Submit\">"
    + "</form>";

    li.innerHTML = feedback_format;
    document.getElementById('feedBackList').appendChild(li);    
});