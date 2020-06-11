// 定义全局变量存储弹出层的index
var addIndex;
var exitIndex;

// 入口函数
$(function() {
    // 1.一进入页面发送ajax请求，使用模板引擎将返回的数据渲染到页面
    renderCategory();

    // 2.点击“添加类别”
    // 2.1注册单击事件
    $('.addCategory').on('click', function() {
        // 2.2弹出添加对话框
        addIndex = layer.open({
            type: 1,
            title: '添加文章分类',
            area: ['500px', '240px'],
            content: $('#tpl-add').html()
        });
    });

    // 3.给添加文章类别，注册表单提交事件(委托注册)
    $('body').on('submit', '.add-form', function(e) {
        // 3.1阻止默认提交事件
        e.preventDefault();
        // 3.2发送ajax请求，添加
        $.ajax({
            type: 'POST',
            url: '/my/article/addcates',
            data: $(this).serialize(),
            success: function(backData) {
                // 给出提示
                layer.msg(backData.message);
                // 添加成功
                if (backData.status === 0) {
                    // 重新渲染到页面
                    renderCategory();
                    // 关闭弹出层
                    layer.close(addIndex);
                };
            }
        });
    });

    // 4.点击“删除”按钮（动态生成，委托注册）
    $('tbody').on('click', '.delete', function() {
        // 获取发送ajax需要带的参数  id
        var id = $(this).attr('data-id');
        // console.log(id);
        layer.confirm('确认要删除嘛?', { icon: 3, title: '提示' }, function(index) {
            // 4.1发送ajax，删除当前行分类
            $.ajax({
                type: 'GET',
                url: '/my/article/deletecate/' + id,
                success: function(backData) {
                    // 给出提示
                    layer.msg(backData.message);
                    // 删除成功，重新渲染页面
                    if (backData.status === 0) {
                        renderCategory();
                    };
                }
            });

            layer.close(index);
        });
    });

    // 5.点击“编辑”按钮（动态生成，委托注册）
    $('tbody').on('click', '.exit', function() {
        // 获取id、name、alias的自定义值
        var data = this.dataset;
        // console.log(data);
        // 加载layui  的form对象
        var form = layui.form;
        // 5.1弹出编辑层
        exitIndex = layer.open({
            type: 1,
            title: '修改文章分类',
            area: ['500px', '240px'],
            content: $('#tpl-exit').html(),
            // 层弹出后的成功回调函数
            // 数据回填
            success: function() {
                form.val('exit-form', JSON.parse(JSON.stringify(data)));
            }
        });

    });

    // 6.给表单提交事件(委托注册)
    $('body').on('submit', '.exit-form', function(e) {
        // 阻止默认提交事件
        e.preventDefault();
        // 获取数据(form表单中name属性要与接口参数一致)
        var data = $(this).serializeArray();
        // 修改下标为0，id  ->  Id
        data[0].name = "Id";
        // console.log(data);
        // 发送ajax请求
        $.ajax({
            type: 'POST',
            url: '/my/article/updatecate',
            data: data,
            success: function(backData) {
                layer.msg(backData.message);
                if (backData.status === 0) {
                    // 重新渲染页面
                    renderCategory();
                    // 关闭弹层
                    layer.close(exitIndex);
                };
            }
        });
    })
});
/**
 * @description:将文章分类渲染到页面
 * @param {type} 
 * @return: 
 */
function renderCategory() {
    // 1.发送ajax请求
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        success: function(backData) {
            // 1.2通过模板引擎渲染到页面
            var html = template('tpl-category', backData);
            // 1.3添加到tbody中
            $('tbody').html(html);
        }
    });
};