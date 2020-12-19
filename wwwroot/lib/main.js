var using = {
	btn: {
		login: $("#btnLogin"), // 登陆
		signUp: $("#btnSignUp"), //注册
		forgot: $("#btnForgot"), //密码找回
		passWord: $("#btnPassWord"), //修改密码
		sendMSG: $("#sendMSG"), //发送验证码
		sendMSGs: $("#sendMSGs"), //再次发送验证码
		userInfo: $("#userInfo") //会员信息
	},
	value: {
		tel: $("#tel"), //手机号
		password: $("#password"), //密码
		onPassword: $("#onPassword"), //确认密码
		code: $("#code"), //手机验证码
		username: $("#username") //账号信息
	}
};

$("input").eq(0).focus();


var erweima = true;

$(".erweima").click(function () {

	if (erweima) {

		$(".qrlogin").hide();

		$(".erweima").removeClass("pc");
	} else {

		$(".qrlogin").show();

		$(".erweima").addClass("pc");
	}

	erweima = !erweima;
});


try {


	window.Enter = function ()
	{
		switch (location.pathname) {

			case "/User/Login":
				if (!erweima) using.btn.login.click();
				break;

			case "/User/signUp":
				using.btn.signUp.click();
				break;

			case "/User/Forgot":
				using.btn.forgot.click();
				break;

			case "/User/sendMsg":
				using.btn.sendMSG.click();
				break;

			case "/User/passWord":
				using.btn.passWord.click();
				break;

			case "/User/userInfo":
				using.btn.userInfo.click();
				break;

		}
	}

	using.btn.login.click(function () {

		var box = using.value;

		var uName = box.tel.val();
		var uPwd = box.password.val();

		if (!uName) return alertInfo("请输入用户名");
		if (!uPwd) return alertInfo("请输入密码");

		$(this).button('loading');

		$.post("./Checked", {
				uName: uName,
				uPwd: uPwd
		}, function (date) {

				if (date.status == 1) {

					window.location = date.jumpurl;

				} else {

					alertInfo("账号或密码错误，请检查后重新输入");

					using.btn.login.button('reset');
				}
		});

	});
} catch (e) {

}

try {
	using.btn.signUp.click(function () {


		var box = using.value;

		if (!box.tel.val()) {
			return alertInfo("请输入手机号码");
		}

		$(this).button('loading');

		$.post("/User/userSignUp", { tel: box.tel.val(), token: 10000 }, function (date) {
			userSignUpInfo(date);
			using.btn.signUp.button('reset');
		});

	});
} catch (e) {

}

try {
	using.btn.forgot.click(function () {
		var box = using.value;

		if (!box.tel.val()) {
			return alertInfo("请输入手机号码");
		}

		$(this).button('loading');

		$.post("/User/userSignUp", { tel: box.tel.val(), token: 10067 }, function (date) {
			userSignUpInfo(date);
			using.btn.forgot.button('reset');
		});

	});
} catch (e) {
	using.btn.forgot.button('reset');
}

function userSignUpInfo(date) {
	if (date.msg) {
		switch (date.bot) {
			case 101: return location.href = "/User/sendMsg";
			case 102: return alertInfo("短信发送失败，请刷新重试");
			case 103: return alertInfo("用户已存在，请直接登录");
			case 104: return alertInfo("用户不存在，请注册");
		}
	} else {
		alertInfo("手机号码不正确，请检查后重新输入");
	}
}

try {

	using.btn.sendMSG.click(function () {

		var box = using.value;

		if (!box.code.val()) {
			return alertInfo("请输入验证码");
		}

		$(this).button('loading');

		$.post("/User/verfiyMSG", { code: box.code.val() }, function (date) {
			if (date.verfiy) {
				switch (date.bot) {
					case 100:
						location.href = "/User/userInfo";
						break;
					case 1091:
						location.href = "/User/passWord";
						break;
				}
				//700396
			} else {
				using.btn.sendMSG.button('reset');
				alertInfo("验证码不正确，请检查后重新输入");
			}
		});

	});
} catch (e) {

}

try {
	using.btn.userInfo.click(function () {


		var box = using.value;

		var pass = box.password.val();

		if (pass.length < 6) {
			return alertInfo("密码最低6位，请检查后重新输入");
		}

		if (pass != box.onPassword.val()) {
			return alertInfo("两次输入密码不正确，请检查后重新输入");
		}

		$(this).button('loading');

		$.post("/User/AddUser", {
			userName: box.username.val(),
			userPass: box.password.val()
		}, function (date) {
			if (date.msg) {
				location.href = "/User/Login";
				//700396
			} else {
				alertInfo(date.info);
				using.btn.userInfo.button('reset');
			}
		});


	});
} catch (e) {
	using.btn.userInfo.button('reset');
}

try {
	using.btn.passWord.click(function () {

		var box = using.value;

		var pass = box.password.val();

		if (pass.length < 6) {
			return alertInfo("密码最低6位，请检查后重新输入");
		}

		if (pass != box.onPassword.val()) {
			return alertInfo("两次输入密码不正确，请检查后重新输入");
		}

		$(this).button('loading');

		$.post("/User/updatePassWord", {
			userPass: pass
		}, function (date) {
			if (date.msg) {
				location.href = "/User/Login";
				//700396
			} else {
				alertInfo(date.info);
				using.btn.passWord.button('reset');
			}
		});


	});
} catch (e) {

}

try { } catch (e) {

}


var countdown = 60;
function settime(obj) {
	if (countdown == 0) {
		obj.attr("disabled", false);
		obj.html("再次发送");
		countdown = 60;
		return;
	} else {
		obj.html("再次发送(" + countdown + ")");
		countdown--;
	}
	setTimeout(function () {
		settime(obj);
		obj.attr("disabled", true);
	}
	, 1000)
}

settime(using.btn.sendMSGs);


; (function () {


	'use strict';

	// Placeholder 
	var placeholderFunction = function () {
		$('input, textarea').placeholder({ customClass: 'my-placeholder' });
	}

	// Placeholder 
	var contentWayPoint = function () {
		var i = 0;
		$('.animate-box').waypoint(function (direction) {

			if (direction === 'down' && !$(this.element).hasClass('animated-fast')) {

				i++;

				$(this.element).addClass('item-animate');
				setTimeout(function () {

					$('body .animate-box.item-animate').each(function (k) {
						var el = $(this);
						setTimeout(function () {
							var effect = el.data('animate-effect');
							if (effect === 'fadeIn') {
								el.addClass('fadeIn animated-fast');
							} else if (effect === 'fadeInLeft') {
								el.addClass('fadeInLeft animated-fast');
							} else if (effect === 'fadeInRight') {
								el.addClass('fadeInRight animated-fast');
							} else {
								el.addClass('fadeInUp animated-fast');
							}

							el.removeClass('item-animate');
						}, k * 200, 'easeInOutExpo');
					});

				}, 100);

			}

		}, { offset: '85%' });
	};
	// On load
	$(function () {
		placeholderFunction();
		contentWayPoint();
	});

}());