// 入口函数
$(function() {
    // 1.登录页面点击 “去注册”
    $('.goto-reg').on('click', function() {
        // 1.1当前登录界面隐藏，注册界面显示
        $('.login').hide().next().show();
    });

    // 2.注册页面点击 “去登陆”
    $('.goto-login').on('click', function() {
        // 2.1当前注册界面隐藏，登陆界面显示
        $('.register').hide().prev().show();
    });

    // 3.给 form 表单注册提交事件(注册页)
    $('.register form').on('submit', function(e) {
        // 3.1阻止submit默认提交行为
        e.preventDefault();
        // 3.2获取用户输入的用户名和密码
        // 通过serilize()获取（注意检查表单中的name属性，要与接口参数一致）
        var data = $(this).serialize();
        // console.log(data);//得到参数拼接的字符串
        // 3.3发送ajax请求
        $.ajax({
            type: 'POST',
            url: "http://www.liulongbin.top:3007/api/reguser",
            data: data,
            success: function(backData) {
                // 3.4根据接口返回的数据做出相应提示
                layer.msg(backData.message);
                if (backData.status === 0) {
                    // 让登陆界面显示，当前界面隐藏
                    $('.login').show().next().hide();
                }
            }
        });
    });

    // 表单验证
    // 第一步：实例化layui的form对象
    var form = layui.form;
    // 第二步：自定义验证需求
    form.verify({
        // 自定义验证
        // len: [/^[\S]{6,12}$/, '用户名、密码6-12位'],
        // value 是用户输入的值
        len: function(value) {
            if (value.trim().length < 6 || value.trim().length > 12) {
                return '用户名、密码6-12位';
            }
        },
        // 第三步：将自定义的验证写到HTML页面(已写)
        // 密码与确认密码一致 验证
        same: function(value) {
            // value 确认密码的内容
            // 获取密码框内容
            var password = $('.pwd').val();
            if (password !== value) {
                return '两次密码不一致';
            };
        }
    });

    // 4.给form表单注册表单提交事件（登录页）
    $('.login form').on('submit', function(e) {
        // 4.1阻止submit默认提交行为
        e.preventDefault();
        // 4.2获取表单的用户名和密码
        var data = $(this).serialize();
        // 4.3发送ajax请求
        $.ajax({
            type: 'post',
            url: 'http://www.liulongbin.top:3007/api/login',
            data: data,
            success: function(backData) {
                // 无论成功与否提示
                layer.msg(backData.message);
                // 登录成功
                if (backData.status === 0) {
                    // 存储token（这是需要进入有权限（接口）的令牌）
                    localStorage.setItem('token', backData.token);
                    // 跳转页面（首页）
                    // window.location.href = '/index.html';
                };
            }
        });
    });
});