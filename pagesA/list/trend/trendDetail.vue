<template>
	<page-meta><navigation-bar title="动态详情" title-align="center" background-color="#007AFF" /></page-meta>
	<view class="container">
		<u--text :text="trendObject.title" size="18" align="center" bold customStyle="margin-bottom:10px;color:#666;line-height:30px;"></u--text>
		<view style="display:flex;margin-top:6px;justify-content:flex-start;">
			<view style="margin-right:50px;">
				<u--text
					prefixIcon="calendar"
					iconStyle="color:#606266;font-size:14px;"
					size="12"
					color="#606266"
					mode="date"
					align="left"
					:text="trendObject.createTime"
				></u--text>
			</view>
			<view>
				<u--text prefixIcon="account" iconStyle="color:#606266;font-size:14px;margin-right:3px;" size="12" color="#606266" mode="name" :text="trendObject.author"></u--text>
			</view>
		</view>
		<u-line margin="5px 0 10px"></u-line>
		<view class="content"><rich-text :nodes="trendObject.content"></rich-text></view>
		<view><u--text v-if="isShow" text="暂无内容..." customStyle="margin:auto;"></u--text></view>
	</view>
</template>

<script>
import { getTrend } from '@/apis/modules/trend';
import projectConfig from '@/env.config.js';
export default {
	data() {
		return {
			newsId: '',
			trendObject: {
				createTime: '2022-01-01',
				author: ''
			},
			isShow: false
		};
	},
	onLoad: function(option) {
		this.newsId = option.newsId;
	},
	onShow() {
		this.getTrendFunc();
	},
	methods: {
		/**
		 * 转换富文本的图片最大为100%
		 * 转换行内样式的双引号问题
		 */
		formatRichText(html) {
			//控制小程序中图片大小
			let that = this;
			let baseurl = projectConfig.baseUrl.replace(/\/prod-api\//gi, '');
			console.log('baseurl', baseurl);
			// 双引号改为单引号
			let newContent = html.replace(/<img[^>]*>/gi, function(match, capture) {
				match = match.replace(/style="[^"]+"/gi, '').replace(/style='[^']+'/gi, '');
				match = match.replace(/width="[^"]+"/gi, '').replace(/width='[^']+'/gi, '');
				match = match.replace(/height="[^"]+"/gi, '').replace(/height='[^']+'/gi, '');
				return match;
			});
			// 限制元素最大宽度
			newContent = newContent.replace(/style="[^"]+"/gi, function(match, capture) {
				match = match.replace(/width:[^;]+;/gi, 'max-width:100%;').replace(/width:[^;]+;/gi, 'max-width:100%;');
				return match;
			});
			// 删除换行
			newContent = newContent.replace(/<br[^>]*\/>/gi, '');
			newContent = newContent.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function(matchs, capture) {
				return "<img style='max-width:100%;height:auto;border-radius:5px; display:block' src='" + baseurl + capture + "'/>";
			});
			
			// 替换为单引号
			var stylePattern = /style="[^=>]*"[\s+\w+=|>]/g;
			return newContent.replace(stylePattern, function(matches) {
				return matches.replace(/<["]*>/g, "'");
			});
		},
		getTrendFunc() {
			getTrend(this.newsId)
				.then(res => {
					this.trendObject = res.data;
					this.trendObject.content = this.formatRichText(this.trendObject.content);
					console.log('content:', this.trendObject.content);
					this.trendObject.imgUrl = projectConfig.baseUrl + this.trendObject.imgUrl;
					if (JSON.stringify(this.trendObject) == '{}') {
						this.isShow = true;
					} else {
						this.isshow = false;
					}
				})
				.catch(e => {
					console.log(e);
				});
		}
	}
};
</script>

<style>
.container {
	padding: 15px;
	padding-bottom: 100px;
}
.content {
	line-height: 26px;
	text-align: justify;
	color: #666;
}
.content img{
	max-width: 100%!important;
}
</style>
