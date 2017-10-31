/**
 * Created by caoyinghang on 2017/8/25.
 */
//require ("jquery-3.2.1.min.js");
function createPKG() {
    var ele = document.getElementById("upPic");
     console.log("begin");
    document.getElementById("loadingtext").style.display="block";
     // var objShell;
     // objShell = new ActiveXObject("WScript.Shell");
     // var iBuildCode = objShell.Run("buildScript.sh",0,true);
  $.get("do_it",function (result) {
      console.log(result+"testtest");
      document.getElementById("loadingtext").style.display="none";
      document.getElementById("downloadurl").style.display="block";
      if(result.indexOf("打包成功啦")){
           alert("打包成功啦！！！");
      }
  });

  $.ajax({
      url:"do_it_one",
      type:"post",
      data:{
          version:1,
          name:"test",
          file:ele
      },
      success:function (data) {
          console.log(data);
      },
      error:function (e) {
          console.log(e);
      }
  })
}

function handleFiles(obj) {
    window.URL = window.URL || window.webkitURL;
    var fileElem = document.getElementById("appicon"),
        fileList = document.getElementById("fileList");
       // fileList.style.alignContent = "center";
        //fileList.clearData();
   // function handleFiles(obj) {
        var files = obj.files,
            img = new Image();
            img.name = "test.png";
        if(window.URL){
            //File API
            alert(files[0].name + "," + files[0].size + " bytes");

            img.src = window.URL.createObjectURL(files[0]); //创建一个object URL，并不是你的本地路径
            img.width = 60;
            img.onload = function(e) {
                window.URL.revokeObjectURL(this.src); //图片加载后，释放object URL
            };
            fileList.appendChild(img);
        }else if(window.FileReader){
            //opera不支持createObjectURL/revokeObjectURL方法。我们用FileReader对象来处理
            var reader = new FileReader();
            reader.readAsDataURL(files[0]);
            reader.onload = function(e){
                alert(files[0].name + "," +e.total + " bytes");
                img.src = this.result;
                img.width = 60;
                fileList.appendChild(img);
            }
        }else{
            //ie
            obj.select();
            obj.blur();
            var nfile = document.selection.createRange().text;
            document.selection.empty();
            img.src = nfile;
            img.width = 60;
            img.onload=function(){
                alert(nfile+","+img.fileSize + " bytes");
            };
            fileList.appendChild(img);
        }
   // }
}
