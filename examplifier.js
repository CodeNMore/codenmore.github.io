function examplify(){
    var id = document.getElementById("excode");
    var code = id.value;
    
    code = code.replace(/\</g, "&lt;");
    code = code.replace(/\>/g, "&gt;");
    code = code.replace(/\n/g, "<br>");
    
    id.value = code;
}

function oldstyle(){
    var id = document.getElementById("excode");
    var code = id.value;
    
    code = code.replace(/\>/g, "!<!");
    
    id.value = code;
}

function linify(){
    var id = document.getElementById("excode");
    var code = id.value;
    
    code = code.replace(/\s+/g, "");
    
    id.value = code;
}