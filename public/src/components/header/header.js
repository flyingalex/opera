;(function($){

	var	userMail = "",
	    userName = "",
	    userPassword = "";


    //用户登录成功之后
    function online(imgUrl,userN) {

    	$("#user_head").attr("src"," ").attr("src",imgUrl);
    	$("#user_id").text(userN);

    	$("#login_container, #page_cover").fadeOut(400);
    	$("#login_success").fadeIn(400);
    	$("#login_success_btn").click(function (){
    		$("#login_success,# page_cover").fadeOut(400);
    	});

    }
	
	//登录数据页面
	var upload_login = function () {
		var name = $("#user_name").val();
		var password = $("#user_pswd").val();
		var verify_code = $("#verify_input").val();
		if(name.length == 0){
			alert("请输入用户名");
			$("#user_name").focus();
			return;
		}
		if(password.length < 6 || password.length > 20){
			alert("请输入6-20位的密码");
			$("#user_pswd").focus();
			return;
		}
		if(verify_code.length == 0){
			alert("请输入验证码");
			$("#verify_input").focus();
			return;
		}
		$.ajax({
			url:'/user/login',
			type:'POST',
			dataType:'json',
			data:{
				username: name,
				password: password,
				captcha: verify_code
			},
			timeout:10000,
			success:function (data){
				if(data['errCode'] == 0){
					// console.log(data['user']['avatar']);
					window.location.href = window.location.href;
					// online(data['user']['avatar'],data['user']['username']);

					// console.log(data['user']['avatar']);
					// console.log(getCookie("opera_userImg"));
					
				}
				else{
					alert(data['message']);
				}
			},
			error:function(){}
		});
	}

	//用户登出
	var logout = function (){

		$.ajax({
			url: '/user/logout',
			type: 'get',
			data: {},
			dataType: 'json',
			timeout: 10000,
			success: function (data){

				if (data['errCode'] == 0){

					alert("退出成功");
					
					window.location.href = "/";

					// console.log(data['errCode'] + "." + data['message']);

				}
			},
			error: function (data){
				alert(data['message']);
			}
		});

	}

	//加载验证码
	var change_codes = (function () {
		$("#authcode-img").attr('src', ' ').attr('src', '/user/captcha' + '?id=' + Math.random(12));
	});



	//用户注册信息页面
	var upload_register = function (){

		var name = $("#reg_user_name").val();
		var mail = $("#reg_user_mail").val();
		var password = $("#reg_user_pswd").val();
		var re_password = $("#reg_confirm_pswd").val();

		if(name.length == 0) {
			alert("请填写用户名");
			return;
		}
		if(!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(mail)) {
			alert("请填写正确的邮箱");
			return;
		}
		if(password.length < 6 || password.length > 20) {
			alert("请输入6-20位的密码");
			return;
		}
		if(password.length !== re_password.length) {
			alert("确认密码有误");
			return;
		}

		userMail = mail;
		userName = name;
		userPassword = password;

		$.ajax({
			url: '/user/register',
			type: 'POST',
			dataType: 'json',
			data: {
				username:name,
				email:mail,
				password:password,
				re_password:re_password
			},
			timeout: 10000,
			success: function(data){
				var data = eval(data);
				console.log(data['errCode'] + "、" + data['message']);
				if(data['errCode'] == 0){

					$("#register_container").hide();
					$("#verify_container").fadeIn(400,function(){
						count();
					});
					
					$("#user_mailbox").text(mail);

				}
				else{

					alert(data['message']);

				}
			},
			error: function(){
				alert("注册失败");
			}
		});
	} 

	change_codes();

	$("#login_submit").on("click",function(e){
		upload_login();
	});

	$("#login_change_codes").on("click",function(){
		change_codes();
	});


	
	$("#login_btn").click(function(){
		$(".cover-box").hide();
		$("#page_cover,#login_container").fadeIn(300);
		// $("#page_cover,#login_findpsd").fadeIn(300);
	});

	$("#register_btn").click(function(){

		// $("#page_cover,#verify_container").fadeIn(300);
		// count();
		$("#page_cover,#register_container").fadeIn(300);
	});

	$("#register_confirm_btn").click(upload_register);

	//-------取消点击登录框和注册框的冒泡事件 START---------
	$(".cover-box").click(function(){
		return false;
	});
	//-------取消点击登录框和注册框的冒泡事件 END---------

	$("#page_cover").click(function(){
		$("#page_cover,.cover-box").fadeOut(400);
	});

	//////////
	// 计时器 //
	//////////
	function count(num){
		$("#send_verify_code").addClass("disabled").removeClass("active");
		$("#send_verify_code").text("60秒后可重新操作");

		if(!num){
			num=60;
		}

		clearInterval(setTime);

		var setTime=setInterval(function(){
			--num;
			$("#send_verify_code").text(num+"秒后可重新操作");
			if(num<0){
				$("#send_verify_code").text("发送验证码").removeClass("disabled").addClass("active");
				clearInterval(setTime);
				return;
			}
		},1000);
	}

	////////////////
	// 点击发送验证码按钮 //
	////////////////
	$("#send_verify_code").click(function(){
		if(!$(this).hasClass("active")){


			return;
		}
		
		$.post('/user/resend_checkcode',{email:userMail},function (data){

			console.log(data["message"]);
			
		},'json');

		count();
		$("#send_verify_code").addClass("disabled").removeClass("active");
	});


    /////////////
    // 验证码确定按钮 //
    /////////////
	$("#verify_suc_btn").click(function(){

		$.ajax({
			url: '/user/check_captcha',
			type: 'POST',
			dataType: 'json',
			data: {captcha: $("#user_verify_code").val(),email: userMail},
			timeout: 10000,
			success: function (data){
				if(data['errCode']==0){

					alert("注册成功");

					$("#verify_code_container").hide();
					$("#register_success").fadeIn(400);

				}
				else{
					alert(data['message']);
				}
			},
			error:function(){}
		});
		
	});

	////////////////////
	// 注册成功之后的“登录”按钮 //
	////////////////////
	$("#register_login").click(function(){

		$("#verify_container").fadeOut(400);
		$("#login_container").fadeIn(400);

		$("#user_name").val(userName);
		$("#user_pswd").val(userPassword);

	});

	///////////
	// 用户登出 //
	///////////
    $("#logout").click(logout);


    //////////////
    // 点击“忘记密码” //
    //////////////
    $(".login-tips").click(function() {

    	$("#login_container").fadeOut(400);
    	$("#login_findpsd").fadeIn(300);

    });

	$("#login_find_btn").click(function(){
		var mail = $("#find_input").val(),
			_this = $(this);

		if(!/^(\w-*\.*)+@(\w-?)+(\.\w{2,})+$/.test(mail)) {
			$("#find_input").focus();
			alert("请填写正确的邮箱");
			return;
		}

		_this.hide();
		$("#login_find_tips").fadeIn(800);

		$.post("/user/post_remind",{
			email: mail
		},function(data) {
			if(data["errCode"] == 0){

				// _this.fadeIn(800);
				// $("#login_find_tips").hide();

				alert("邮件发送成功");
				window.location.href = window.location.href;
			}
    		else{

    			alert(data["message"]);
    			
    			_this.fadeIn(800);
    			$("#login_find_tips").hide();
    		}
		},"json");
	});


})(jQuery);