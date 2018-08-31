
//
//    id 画布id
//    color 画布背景颜色
//    objUrl 加载的obj文件地址
//    time 画布重绘时间

DialogShow = function(id, color, objUrl, time, title){
    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.mesh = null;
    this.id = null;
    this.ms_Controls = null;

    this.showDialog = function(){
        $("#dialog").dialog({
            autoOpen : false,   // 是否自动弹出窗口
            modal : true,    // 设置为模态对话框
            resizable : true,
            title: title,
            width : 1000,   //弹出框宽度
            height : 600,   //弹出框高度
            position : "center"  //窗口显示的位置
        });
        $("#dialog").dialog("open");
        $("#dialog").css("display","flex");
    }
    this.init = function(){
        scope.renderer = new THREE.WebGLRenderer({//渲染器
            canvas: document.getElementById(id)//画布
        });
        scope.renderer.setClearColor(color);//画布颜色
        scope.scene = new THREE.Scene();//创建场景
        scope.camera = new THREE.PerspectiveCamera(45, 4/3, 1, 2000);
        scope.camera.position.set(0, 0, 1.5);
        scope.scene.add(scope.camera);//把相机添加到场景中
        var loader = new THREE.OBJLoader();//在init函数中，创建loader变量，用于导入模型
        loader.load(objUrl, obj => {//第一个表示模型路径，第二个表示完成导入后的回调函数，一般我们需要在这个回调函数中将导入的模型添加到场景中
            obj.traverse(function(child) {
                    if (child instanceof THREE.Mesh) {
                    child.material.side = THREE.DoubleSide;
                }
            });
            scope.mesh = obj;//储存到全局变量中
            scope.scene.add(obj);//将导入的模型添加到场景中
        });
        var light = new THREE.DirectionalLight(0xffffff);//光源颜色
        light.position.set(20, 10, 5);//光源位置
        scope.scene.add(light);//光源添加到场景中
        scope.id = setInterval(scope.draw, time);//每隔20s重绘一次
        scope.ms_Controls = new THREE.OrbitControls(scope.camera, scope.renderer.domElement);
        scope.ms_Controls.userPan = false;
        scope.ms_Controls.userPanSpeed = 0.0;
        scope.ms_Controls.minDistance = 0;
        scope.ms_Controls.maxDistance = 2000.0;
        scope.update();
    }
    this.update = function(){
        requestAnimationFrame(scope.update);
        scope.renderer.render(scope.scene, scope.camera);
        scope.ms_Controls.update();
    }
    this.draw = function(){
        scope.renderer.render(scope.scene, scope.camera);//调用WebGLRenderer的render函数刷新场景
        scope.mesh.rotation.y += 0.01;//添加动画
        if (scope.mesh.rotation.y > Math.PI * 2) {
            scope.mesh.rotation.y -= Math.PI * 2;
        }
    }
    //
	// internals
    //
    var scope = this;
}