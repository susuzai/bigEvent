// 入口函数
$(function() {
    // 1.一进入页面发送ajax请求，渲染用户信息到页面
    getUserInfo();

    // 2.给表单注册提交事件，更新信息
    $('form').on('submit', function(e) {
        // 2.1阻止默认提交行为
        e.preventDefault();
        // 2.2发送ajax请求
        $.ajax({
            type: 'POST',
            url: 'http://www.liulongbin.top:3007/my/userinfo',
            data: $(this).serialize(), //检查form的name属性
            headers: {
                // 携带token
                'Authorization': localStorage.getItem('token')
            },
            complete: function(backData) {
                // 拥有假token或者没有token情况
                if (backData.responseJSON.status === 1 && backData.responseJSON.message === '身份认证失败！') {
                    // 清除token
                    localStorage.removeItem('token');
                    // 跳转到login页面
                    window.parent.location.href = '/login.html';
                };
            },
            success: function(backData) {
                // 给出相应提示
                layer.msg(backData.message);
                if (backData.status === 0) {
                    // 重新渲染头像区域显示昵称
                    window.parent.getUserData();
                };
            }
        });
    });

    // 3.点击“重置”按钮
    $('button[type="reset"]').on('click', function(e) {
        e.preventDefault();
        // 重新调用获取用户信息功能
        getUserInfo();
    });
});
/**
 * @description:封装一进入页面渲染用户信息到页面
 * @param {type} 
 * @return: 
 */
function getUserInfo() {
    // 1.发送ajax请求
    $.ajax({
        type: 'GET',
        url: 'http://www.liulongbin.top:3007/my/userinfo',
        headers: {
            // 携带token
            'Authorization': localStorage.getItem('token')
        },
        complete: function(backData) {
            // 拥有假token或者没有token情况
            if (backData.responseJSON.status === 1 && backData.responseJSON.message === '身份认证失败！') {
                // 清除token
                localStorage.removeItem('token');
                // 跳转到login页面
                window.parent.location.href = '/login.html';
            };
        },
        success: function(backData) {
            if (backData.status === 0) {
                // 加载form对象
                var form = layui.form;
                // 调用val()方法为表单赋值
                form.val('info', backData.data);
            };
        }
    });
};