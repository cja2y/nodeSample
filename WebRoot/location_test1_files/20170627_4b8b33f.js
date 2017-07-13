require.config(requireConfig);
require(["jquery", "fastClick", "lucky-card", "ct", "bridge", "juicer", "marquee", "number"], function ($, fastClick, LuckyCard, ct, Bridge, juicer, liMarquee, number) {
    var oMask = $(".mask");

    var oP = Object.create(ct.Prompt);
    oP.create().build();

    var oM = Object.create(ct.Mask);
    oM.create().build();

    var local = ct.Tool.local();

    ct.Tool.buryPoint();

    var myDay = new Date().getDay();
    var app = null;
    var oUrl = null;
    var oType = "";
    var oMsg = "";
    var run = {
        start: function () {
            var _this = this;

            /*解决移动端click点击300延迟*/
            fastClick.attach(document.body);

            /*设置HTML的font-size*/
            ct.Tool.setFont();
            ct.Tool.handleBottomStatusBar();
            window.addEventListener("resize", ct.Tool.debounce(ct.Tool.setFont));
            window.addEventListener("resize", ct.Tool.debounce(ct.Tool.handleBottomStatusBar));

            /*整体预加载动画*/
            var oPreLoading = Object.create(ct.PreLodingUi);
            oPreLoading.create({
                preLoadingCls: "loading-bg-color", // 自定义加载动画颜色
                loadingEleCls: "loading-ele-color"
            }).build();

            app = ct.Tool.userAgent();

            /*图片预加载*/
            ct.Tool.imgPreLoad({
                callback: function () {
                    this.hintLog("图片加载完成");
                    var timer = null;
                    clearTimeout(timer);
                    timer = setTimeout(function () {
                        oPreLoading.hide();
                        _this.init();
                    }, 500)
                }
            })

            $.ajax({
                type: "POST",
                dataType: "JSON",
                url: ct.Tool.url("/app/request/activity"),
                data: JSON.stringify({
                    place_cid: ct.Tool.userAgent().isGjj ? 1 : 0,
                    tag: "进入页面" + projectName
                }),
                success: function (d) {
                    if (d.success == true) {

                    }
                }
            })
        },
        init: function () {
            var _this = this;
            $(".wp").removeClass("hide");
            _this.render();
            _this.openRule();
            _this.closeRule();
            _this.receive();
        },

        // 打开规则
        openRule: function () {
            $(".content").on("click", ".rule-btn", function () {
                oM.show();
                $(".rule").fadeIn();
            })
        },

        // 关闭规则
        closeRule: function () {
            $("body").on("click", ".btn-close", function () {
                $(".rule").fadeOut(function () {
                    oM.hide();
                })
            })
        },
        render() {
            $.ajax({
                type: "POST",
                dataType: "JSON",
                // url: "test.php",
                url: "/act/act170627/get_judge",
                success: function (d) {
                    if (!!d.succ) {
                        if (d.res.light == true) {
                            $(".prize").css("color", "#2e2e2e");
                            $(".content").append('<div class="seal30"></div><div class="seal50"></div><div class="seal70"></div>');
                        }
                    } else {
                        oP.show(d.msg || "出错请重试");
                    }
                }
            })
        },
        receive: function () {
            var _this = this;
            var timer = null;
            clearTimeout(timer);
            $('.wp .content').on('click', '.receive', function () {
                $.ajax({
                    type: "POST",
                    dataType: "JSON",
                    // url: "test.php",
                    url: "/act/act170627/get_status",
                    success: function (d) {
                        if (!!d.succ) {
                            if (d.res.is_weChat == true) {
                                timer = setTimeout(function () {
                                    oP.show("已成功参加活动，立即享受优惠");
                                    timer = setTimeout(function () {
                                        window.location.href = d.res.url;
                                    }, 1000)
                                }, 200)
                            } else {
                                if (d.res.login == false) {
                                    if (Bridge) {
                                        Bridge.action("login");
                                    }
                                } else {
                                    if (d.res.type == 1) {
                                        timer = setTimeout(function () {
                                            oP.show("您已有金e贷优惠券，先去使用吧");
                                            timer = setTimeout(function () {
                                                window.location.href = d.res.url;
                                            }, 1000)
                                        }, 200)
                                    } else if (d.res.type == 2) {
                                        timer = setTimeout(function () {
                                            oP.show("已成功参加活动，立即享受优惠");
                                            timer = setTimeout(function () {
                                                window.location.href = d.res.url;
                                            }, 1000)
                                        }, 200)
                                    } else if (d.res.type == 3) {
                                        timer = setTimeout(function () {
                                            oP.show("您已申请过，看看其他");
                                            timer = setTimeout(function () {
                                                window.location.href = d.res.url;
                                            }, 1000)
                                        }, 200)
                                    } else if (d.res.type == 4) {
                                        timer = setTimeout(function () {
                                            $(".prize").css("color", "#2e2e2e");
                                            $(".content").append('<div class="seal30"></div><div class="seal50"></div><div class="seal70"></div>')
                                            timer = setTimeout(function () {
                                                window.location.href = d.res.url;
                                            }, 1000)
                                        }, 200)
                                    } else if (d.res.type == 5) {
                                        timer = setTimeout(function () {
                                            oP.show("已成功参加活动，立即享受优惠");
                                            timer = setTimeout(function () {
                                                window.location.href = d.res.url;
                                            }, 1000)
                                        }, 200)
                                    } else {
                                        oP.show(d.msg || "出错请重试");
                                    }
                                }
                            }
                        } else {
                            oP.show(d.msg || "出错请重试");
                        }
                    }
                })
            })
        },
    }
    run.start();
})