f=function(){
    return true;
};
g=function(){
    return false;
};
(function(){
    if(g && []==![]){
        f=function f(){
            return false;
        }
    }
})();
console.log(f());
var num=10;
var obj={
    num:8,
    inner:{
        num:6,
        print:function(){
            console.log(this.num);
        }
    }
};
num=888;
obj.inner.print();
var fn=obj.inner.print;
fn();
(obj.inner.print)();
//console.log(obj.inner.print);
(obj.inner.print=obj.inner.print)();
//console.log(obj.inner.print=obj.inner.print)
