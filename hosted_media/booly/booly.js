var tokens,
    pc,
    ir,
    mem,
    memlimit,
    loops,
    debuglooplimit;

function execute(){
    while(pc < tokens.length){
        ++loops;//DEBUG
        
        if(execStep())
            return;
        if(loops > debuglooplimit){//DEBUG
            alert("TERMINATED DUE TO DEBUG LOOP LIMIT");
            return;
        }
    }
}

function execStep(){
    ir = tokens[pc];
    
    if(ir == "!"){
        mem.invert();
        mem.incPtr(1);
    }else if(ir == "<"){
        mem.incPtr(-1);
    }else if(ir == ">"){
        mem.incPtr(1);
    }else if(ir == "."){
        output(mem.get());
    }else if(ir == "#"){
        outputbyte();
    }else if(ir == "^"){
        var d = prompt("Booly is asking for input:");
        if(!d || d == "0"){//0
            if(mem.get())
                mem.invert();
        }else{//1
            if(!mem.get())
                mem.invert();
        }
    }else if(ir == "["){
        if(mem.get()){//Is 1, start loop
            ++pc;
            execute();
        }else{//Is 0, skip looping
            while(pc < tokens.length){
                if(tokens[pc] == "]")
                    break;
                ++pc;
            }
        }
    }else if(ir == "]"){
        if(mem.get()){//Is 1, restart loop
            while(pc > -1 && pc < tokens.length){
                if(tokens[pc] == "[")
                    break;
                --pc;
            }
        }else{//Is 0, do not loop over
            ++pc;
            return true;
        }
    }//Anything else is a comment!
    
    ++pc;
    printmem();
    
    return false;
}

function go(){
    tokens = tokenize(document.getElementById("code").value);
    memlimit = document.getElementById("memlimit").value;
    debuglooplimit = document.getElementById("looplimit").value;
    document.getElementById("output").innerHTML = "";
    mem = new Mem(memlimit);
    mem.reset();
    
    pc = 0;
    loops = 0;
    execute();
}

function output(v){
    document.getElementById("output").innerHTML += v;
}

function Mem(size){
    this.size = size;
    this.mem = [];
    this.ptr = 0;
    
    this.reset = function(){
        this.ptr = 0;
        for(var i = 0;i < this.size;++i)
            this.mem[i] = false;
    };
    this.incPtr = function(a){
        this.ptr += a;
        if(this.ptr < 0 || this.ptr >= this.size){
            output("ERROR: MEM POINTER OUT OF BOUNDS");
            throw "ERROR: MEM POINTER OUT OF BOUNDS";
        }
    };
    this.setPtr = function(a){
        this.ptr = a;
    };
    this.get = function(){
        if(this.mem[this.ptr])
            return 1;
        return 0;
    };
    this.invert = function(){
        this.mem[this.ptr] = !this.mem[this.ptr];
    };
    this.getString = function(){
        return this.mem.toString();
    };
}

function outputbyte(){
    var val = "";
    for(var i = 0;i < 8;++i){
        val += mem.get();
        if(val.length != 8)
            mem.incPtr(1);
    }
    val = parseInt(val, 2);
    if(val == "10")//NEWLINE -> <BR> HTML
        output("<br>");
    else
        output(String.fromCharCode(val));
}

function printmem(){
    document.getElementById("mem").innerHTML = mem.getString();
}

function tokenize(v){
    var toks = [];
    var c;
    v = v.trim();
    for(var i = 0;i < v.length;++i){
        c = v.charAt(i);
        if(c != " " && c != "\n" && v.charAt(i) != "\t")
            toks.push(v.charAt(i));
    }
    return toks;
}