/**
 * User: zhouyunlong
 * Date: 15-6-12
 * Time: 上午11:38
 */
$(function(){
	var sel_array = [['images/0/1.png','images/0/2.png'],
					 ['images/1/1.png','images/1/2.png'],
					 ['images/2/1.png','images/2/2.png'],
					 ['images/3/1.png'],
					 ['images/4/1.png']]; 
	var startX, startY, moveEndX, moveEndY, X, Y;
	var isOff = false;
	var numTime = 0 ;
	share_hero = '我玩《格斗江湖》撕开了妹纸…';
/*
	$.getScript('http://event.vxinyou.net/wechat/JsApi/openid?mp_name=gedoujh&random=' + Math.random(), function(script, textStatus) {
        // JS脚本加载成功
        if (textStatus == 'success'){
            // 没有open_id则跳转到微信自动授权页面
            wechat_open_id == '' ? location.href = wechat_login_url :  open_id = wechat_open_id ;
    */  
			open_id ="oIv2Rjk7D4jhkI40yOGoNthbGDjM";
			// 页面浏览统计 
			$.get("http://event.vxinyou.net/activity/wx_count/view", {"count_id":16, 'openid':open_id}, function(response) {
				if (response.success){
					
				}else{
					alert(response.message)
				}
			},"jsonp");
			
            $.get("http://event.vxinyou.net/activity/super_hero/set_config", {"sh_id":4, "openid":open_id}, function(response) {
                if (response.success)
                {
                    if(response.is_draw){     //"is_draw":// 1 不可以抽奖，0 可以抽奖					
						isOff = true;
                        //$("#End").show();						
                    }

                    if(response.mobile){
						$('#inputTel').hide();	
					}
					///////////////
                }else{
                    alert(response.message)
                }
            },"jsonp");
   /*
        }	
        else{
            alert('加载微信用户open_id接口失败');
        }
    });
    */
	 
	$(window).on('scroll.elasticity', function (e) {
		e.preventDefault();
	}).on('touchmove.elasticity', function (e) {
		e.preventDefault();
	});
	
	
	$(".close").on("touchstart",function(e){
		$(".pop").hide();
	});

	
	$("#explain").on("touchstart",function(){
		$("#expShow").show();
	});
	
	
	$("#share").on("touchstart",function(){
		$("#result").hide();
		$(".down").hide();
		$("#sharePop").show();
	});
	
	$(".again,.my_award").on("touchstart",function(){
		$("#result").hide();
		$(".down").hide();
		Generate();
	});	
	
	$("#close2,#share").on("touchstart",function(e){
		e.preventDefault();
		$("#result").hide();
		$(".down").hide();
		$("#start").show();
	});

	$("#start").on("touchstart",function(){
		$(this).hide();
		Generate();
	});
	
	
	function Generate(){
		var num = Math.floor(Math.random() * 5);
		$("#belle").empty();
		$("#belle").append('<img src=images/' + num + '/r.png>');
		$("#userImg").empty();
		$("#userImg").append('<img src=images/r' + num + '.jpg>');;
		var clothes = sel_array[num];
		for(var i=0;i < clothes.length; i++){
			$("#gown").append('<li><img src=' + clothes[i] + '></li>');			 
		}
	}
	Generate();
	 
	
	$("#gown").on('touchstart',function(e){
		$(".down").hide();
		e=e.originalEvent.touches[0];//获取对应触摸对象
		var sy=0;
		sy=e.pageY;
		$(this).on('touchend',function(e){
			e=e.originalEvent.changedTouches[0];//获取对应触摸对象
			if((sy-e.pageY)>50){//如果滑动距离大于50px就认为是要触发上滑动事件了
				
				 $.get("http://event.vxinyou.net/activity/super_hero/set_config", {"sh_id":4, "openid":open_id}, function(response) {
							if (response.success)
							{
								if(response.is_draw){     //"is_draw":// 1 不可以抽奖，0 可以抽奖					
									//isOff = true;
									$("#End").show();
									$(".down").show();
									$("#result").hide();	
								}else{
									Effect();
								}
							}else{
								alert(response.message)
							}
						},"jsonp");
						
			}
			$(this).unbind('touchend');
		});
	});

	

	function Effect(){
		
		$("#gown").each(function(){				
			var y = $(this).children().last();
			y.addClass('remove_gown');
			setTimeout(function(){
				y.remove();
				//console.log($("#gown li").length);
				if($("#gown li").length == 0){		
					setTimeout(function(){						
						$("#result").show();
						$(".down").show();
						WinningTxt();
			
					},1000);					
				}				
			},300);			
		})			
	}
	
	//中奖信息
	function WinningTxt(){
		$.get("http://event.vxinyou.net/activity/super_hero/submit", {"sh_id":4,"openid":open_id}, function(response){
			if (response.success){
				numTime ++;
				share_hero = '我玩《格斗江湖》撕开了' + (numTime + 1) + '名妹纸…';
				wxshare();
				console.log(response.message)
				console.log(response.gift_msg)
				$(".point").html(response.message);
				$(".myt").html('');
				$(".myt").html(response.gift_msg);
				//$("#userImg").attr({'src': 'images/'+response.role_pic});
				if(response.win){
					$("#prize_img").show();
				}else{
					$("#prize_img").hide();
				}
			}else{
				//$("#End").show();
				console.log(response.message)
			}
		},"jsonp");
	}
	
	

	
	//我的奖品
    $('#prize, .my_award').on("touchstart",function(){
        $("#result").hide();
        $("#PrizeShow").show();
        $.get("http://event.vxinyou.net/activity/super_hero/my_prize", {"sh_id":4, "openid":open_id}, function(response){
            if (response.success){				
				$("#prizeList").html('');
				if(response.list != ''){
					$.each(response.list, function(i,n){
						$("#prizeList").append("<li><span class='t'>"+ n.day +"</span><span  class='p'>"+ n.title +"</span></li>");
					});	
					if($("#prizeList li").length > 10){
						$(".page_btn").show();
					}
				}else{					
					$("#prizeList").append("<p style='padding: 1.2rem 1rem; text-align:center; font-size:1.6rem;'>您还没有获得奖品哦~</p>");					
				}
				
            }else{
				console.log(response.message);
				$("#prizeList").html('');
				$("#prizeList").append("<p style='padding: 1.2rem 1rem; text-align:center; font-size:1.6rem;'>" + response.message + "~</p>");
			}			
        },"jsonp");
        
    });
	
	
	$("#prizeList li:gt(9)").hide();//初始化，前面4条数据显示，其他的数据隐藏。
	var total_q=$("#prizeList li").index()+1;//总数据
	var current_page=10;//每页显示的数据
	var current_num=1;//当前页数
	var next=$(".next");//下一页
	var prev=$(".prev");//上一页
	$(".current_page").text(current_num);//当前的页数
								  
	//下一页
	$(".next").click(function(){
		if(current_num==3){
				return false;//如果大于总页数就禁用下一页
			}
			else{
				$(".current_page").text(++current_num);//点击下一页的时候当前页数的值就加1
				$.each($('#prizeList li'),function(index,item){
					var start = current_page* (current_num-1);//起始范围
					var end = current_page * current_num;//结束范围
					if(index >= start && index < end){//如果索引值是在start和end之间的元素就显示，否则就隐
						$(this).show();
					}else {
						$(this).hide();
					}
				});
			}
	});
	//上一页方法
	$(".prev").click(function(){
		if(current_num==1){
			return false;
		}else{
			$(".current_page").text(--current_num);
			$.each($('#prizeList li'),function(index,item){
				var start = current_page* (current_num-1);//起始范围
				var end = current_page * current_num;//结束范围
				if(index >= start && index < end){//如果索引值是在start和end之间的元素就显示，否则就隐藏
					$(this).show();
				}else {
					$(this).hide();
				}
			});    
		}
	})
	
	
	
	// 请输入手机号码
    $('#submit').on("touchstart",function(){
		var telNum = $.trim($("#tel").val());
		if(/^(1)\d{10}$/.test(telNum)){
			$.get("http://event.vxinyou.net/activity/super_hero/set_mobile", {"sh_id":4, 'mobile':telNum, "openid":open_id}, function(response) {
				if (response.success)
				{
					$("#inputTel").hide();
					//$("#container").show();
				}else{
					alert(response.message)
				}
			},"jsonp");
		} else {
			alert("请输入正确的手机号码");
			return false;
		}        
    });
	
	
	
	function wxshare(){
	
	// 加上随机参数以解决安卓缓存问题
		$.getScript('http://event.vxinyou.net/wechat/JsApi/share?mp_name=gedoujh&random=' + Math.random(), function() {
			/**
			 * 把相关接口的回调放在wx.ready中以确保正常执行。
			 */
			wx.ready(function () {
			
				// 分享到朋友圈
				wx.onMenuShareTimeline({
					title: share_hero, // 分享标题
					link: 'http://gdjh.vxinyou.com/zt/yuezhan/', // 分享链接
					imgUrl: 'http://gdjh.vxinyou.com/zt/yuezhan/images/logo.png', // 分享图标
					success: function () { 
						// 用户确认分享后执行的回调函数
						share();
					},
					cancel: function () { 
						// 用户取消分享后执行的回调函数
					}
				});
				 
				// 分享给朋友
				wx.onMenuShareAppMessage({
					title: share_hero, // 分享标题
					desc: '撕开名牌！约战校花！', // 分享描述
					link: 'http://gdjh.vxinyou.com/zt/yuezhan/', // 分享链接
					imgUrl: 'http://gdjh.vxinyou.com/zt/yuezhan/images/logo.png', // 分享图标
					type: '', // 分享类型,music、video或link，不填默认为link
					dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
					success: function () { 
						// 用户确认分享后执行的回调函数
						share();
					},
					cancel: function () { 
						// 用户取消分享后执行的回调函数
					}
				});
			
			});
		});
	 }
	//分享回调  统计
	function share(){ 
		$.get("http://event.vxinyou.net/activity/wx_count/share", {"count_id":16, 'openid':open_id}, function(response) {
			if (response.success)
			{
				window.location.reload();
			}else{
				alert(response.message);
			}
		},"jsonp");  
	}

});	


