// 入口函数
$(function() {
    // 1.表单验证
    // 1.1加载layui的form对象
    var form = layui.form;
    // 1.2调用verify方法，自定义验证方法
    form.verify({
        // 1.2.1验证输入密码长度
        length: function(val) {
            if (val.trim().length < 6 || val.trim().length > 12) {
                return '密码要在6-12位之间，不得有空格';
            }
        },
        // 1.2.2验证新密码与原密码不一致
        diff: function(val) {
            // val 表示新密码的值
            // 获取原密码的值
            var oldpwd = $('.oldpwd').val();
            // 把新密码的值与原密码进行比较
            if (val === oldpwd) {
                return '新密码不能和原密码相同';
            };
        },
        // 1.2.3验证确认密码要与新密码一致
        same: function(val) {
            // val 表示确认密码的值
            // 获取新密码的值
            var newpwd = $('.newpwd').val();
            // 验证两次密码是否一致
            if (val !== newpwd) {
                return '确认密码与新密码不一致';
            };
        }
    });

    // 2.发送ajax请求更新密码
    // 2.1给表单注册提交事件
    $('form').on('submit', function(e) {
        // 2.2阻止默认提交事件
        e.preventDefault();
        // 2.3发送ajax请求
        $.ajax({
            type: 'POST',
            url: 'http://www.liulongbin.top:3007/my/updatepwd',
            data: $(this).serialize(), //检查form表单name属性
            success: function(backData) {
                // 无论修改成功与否给出提示
                layer.msg(backData.message);
                if (backData.status === 0) {
                    // 将表单清空
                    // 调用DOM对象的 reset()方法
                    $('form')[0].reset();
                }
            },
            // 设置请求头（携带token）
            headers: {
                'Authorization': localStorage.getItem('token')
            },
            // 发送ajax完成后执行
            complete: function(backData) {
                // 携带假token或者没有token的情况
                if (backData.responseJSON.status === 1) {
                    // 清除token
                    localStorage.removeItem('token');
                    // 跳转到login页面
                    window.parent.location.href = '/login.html';
                };
            }
        });

    });
});