// 入口函数
$(function() {
    // 优化需要写headers/complete
    // $.ajaxPrefilter() 
    // 这个方法是在发送ajax的时候拦截的方法
    $.ajaxPrefilter(function(option) {
        // 重写 url headers complete
        option.url = "http://www.liulongbin.top:3007" + option.url;
        option.headers = {
            'Authorization': localStorage.getItem('token')
        };
        option.complete = function(backData) {
            if (backData.responseJSON.status === 1 && backData.responseJSON.message === '身份认证失败！') {
                // 清除假token
                localStorage.removeItem('token');
                // 跳转到login页面
                window.parent.location.href = '/login.html';
            };
            // console.dir(backData);
        };
    });
});