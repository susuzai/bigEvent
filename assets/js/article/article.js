$(function() {
    // 加载layui 的form模块
    var form = layui.form;
    //刷新select选择框渲染
    form.render('select');

    // 获取文章列表接口所需的参数
    var data = {
        pagenum: 1,
        pagesize: 2,
        //文章分类的 Id
        // cate_id:
        // 	文章的状态
        // state:
    };

    // 1.一进入页面，发送ajax请求获取数据，进行渲染
    renderArticle();

    // 2.1 点击“删除”按钮(动态生成，委托注册)
    $('tbody').on('click', '.delete', function() {
        // 获取保存的自定义属性的id
        var id = $(this).attr('data-id');
        // 2.2 发送ajax请求
        $.ajax({
            type: 'GET',
            url: '/my/article/delete/' + id,
            success: function(backData) {
                if (backData.status === 0) {
                    layer.confirm('确定要删除吗?', { icon: 3, title: '提示' }, function(index) {
                        //do something
                        // 重新渲染页面
                        renderArticle();
                        layer.close(index);
                    });
                };
            }

        });
    });

    // 3.1 完成分页
    // 3.2 加载laypage模块
    var laypage = layui.laypage;


    // 4.1 完成  筛选 功能
    // 4.2 发送ajax请求，将文章分类渲染到下拉框
    $.ajax({
        type: 'GET',
        url: '/my/article/cates',
        success: function(backData) {
            if (backData.status === 0) {
                var html = template('tpl-cates', backData);
                $('.category').html(html);
                // 重新渲染select
                form.render('select');
            };
        }
    });
    // 4.3 给表单注册提交事件
    $('.search_form').on('submit', function(e) {
        // 4.3.1 阻止表单默认提交
        e.preventDefault();
        // 4.3.2 获取到分类、状态下拉框选中的值
        var cate_id = $('select[name="cate_id"]').val();
        var state = $('select[name="state"]').val();
        // console.log(cate_id, state);
        // 4.3.3 根据cate_id  state  的值，修改ajax请求数据中的参数
        data.cate_id = cate_id ? cate_id : null;
        data.state = state ? state : null;
        // 4.3.4 通过更改后的参数重新渲染页面
        renderArticle();
    });

    /**
     * @description:获取文章信息并渲染
     * @param {type} 
     * @return: 
     */
    function renderArticle() {
        // 1.发送ajax请求
        $.ajax({
            type: 'GET',
            url: '/my/article/list',
            data: data,
            success: function(backData) {
                // 返回的数据通过模板引擎渲染到页面
                if (backData.status === 0) {
                    var html = template('tpl-article', backData);
                    $('tbody').html(html);

                    // 调用分页功能(传入实参total)
                    showPage(backData.total);
                };
            }
        });
    };
    /**
     * @description:展示分页
     * @param {type} total   从服务端获取的文章条数 
     * @return: 
     */
    function showPage(total) {
        // 3.3 初始化分页
        laypage.render({
            // 注意，这里的 page 是 ID，不用加 # 号
            elem: 'page',
            // 数据总数，从服务端得到
            count: total,
            // 每页显示的条数
            limit: data.pagesize,
            // 每页条数的选择项。
            limits: [2, 3, 4, 5],
            // 起始页
            curr: data.pagenum,
            // 自定义排版。
            layout: ['limit', 'prev', 'page', 'skip', 'next', 'count'],
            // 切换分页的回调函数
            jump: function(obj, first) {
                // obj包含了当前分页的所有参数
                // console.log(obj);

                //首次不执行
                // first 第一次是true；之后都是 undefined
                if (!first) {
                    //do something
                    // 更改发送ajax请求参数（页码值）
                    data.pagenum = obj.curr;
                    // 更改发送ajax请求参数（每页显示多少条数据）
                    data.pagesize = obj.limit;
                    // 重新将文章列表信息渲染到页面
                    renderArticle();
                };
            }
        });
    };
});