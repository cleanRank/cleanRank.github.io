//字数控制，多余显示省略号
const wordCut=(num,val)=>{
   let length=val.length;
   let str='';
   let obj={
     flag:false,
     str:''
   };
   if(length>num){
     for(let i in val){
       if(i<num){
         obj.str+=val[i]
       }
     }
     obj.str += "...";
     obj.flag=true;
     return obj;
   }else{
     obj.str=val;
     obj.flag = false;
     return obj;
   }
}
module.exports = {
  wordCut
}