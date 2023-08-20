<template>
	<page-meta>
		<navigation-bar title="产品管理" title-align="center" background-color="#007AFF" />
	</page-meta>
	<view class="charge__wrapper">
		<view class="charge__container">
			<view class="charge__card" @click.native.stop="handleScanDevice(item.productId)" v-for="item in list" :key="item.productId">
				<u--text :text="item.productName" lines="1" :bold="true" :size="16"></u--text>
				<view class="other__wrapper">
					<u-row :gutter="10">
						<u-col :span="6">
							<u--text :text="`所属分类：${item.categoryName}`" lines="1" :size="12" color="#ccc"></u--text>
						</u-col>
					</u-row>
				</view>
			</view>
			<u-loadmore :status="status" />
		</view>
	</view>
</template>

<script>
import projectConfig from '@/env.config.js';
import {listProductShort} from '@/apis/modules/product.js';
export default {
	data() {
		return {
			status: 'loadmore',
			list: [],
			total: 0,
			url: projectConfig.baseUrl,
			iconStyle: {
				fontSize: '10px',
				color: '#007aff'
			},
			pager: {
				pageNum: 1,
				pageSize: 8
			}
		}
	},
	onLoad() {
		this.fetchProductList()
	},
	onReachBottom() {
		this.loadMore()
	},
	methods: {
		loadMore() {
			if (this.list.length >= this.total) return;
			this.status = 'loading'
			this.pager.pageNum = ++this.pager.pageNum;
			this.fetchProductList()
		},
		fetchProductList() {
			uni.showLoading({
				title: '加载中...'
			})
			listProductShort(this.pager)
				.then(res=> {
					if (res.code == 200) {
						this.total = res.total;
						this.list =  [...this.list, ...res.rows];
						if (this.list.length < this.total) {
							this.status = 'loadmore'
						} else if (this.list.length >= this.total) {
							this.status = 'nomore'
						}
					}
				}).finally(()=> {
					uni.hideLoading()
				})
		},
		handleGoDetail(id = '') {
			uni.$u.route(`/pages/tabBar/charge/detail?id=${id}`)
		},
		handleScanDevice(id) {
			uni.$u.route({
				url: `pages/common/device/index`,
				params: {
					productId: id
				}
			})
		},
		handleScanCode() {
			uni.scanCode({
				success(res) {
					console.log('扫码成功,',res)
					uni.showModal({
						title: '提示',
						content: '是否启动充电？',
						confirmText: '启动',
						confirmColor: '#007aff',
						success(res) {
							if (res.confirm) {
								
							} else if (res.cancel) {
								
							}
						}
					})
				}
			})
		}
	}
}
</script>

<style lang="scss" scoped>
	.other__wrapper {
		margin-top: 20rpx;
	}
	.line__wrapper {
		margin: 20rpx auto;
	}
	.date__wrapper {
		display: flex;
		justify-content: space-between;
	}
	.charge {
		&-title {
			flex: 1;
			margin-left: 20rpx;
		}
		&-top {
			margin-bottom: 20rpx;
			display: flex;
			align-items: flex-start;
			justify-content: flex-start;
		}
		&__wrapper {
			background: #eef3f7;
		}
		&__container {
			padding: 20rpx 30rpx;
		}
		&__card {
			padding: 20rpx;
			// height: 200rpx;
			margin-bottom: 20rpx;
			background-color: #fff;
			border-radius: 6rpx;
			// display: flex;
			// flex-direction: column;
			// justify-content: flex-start;
			// align-items: flex-start;
			box-shadow: 6rpx 6rpx 4rpx #eee;
			&:last-child {
				margin-bottom: 0;
			}
			.info__wrapper {
				width: 100%;
				padding-top: 10px;
				display: flex;
				justify-content: flex-end;
			}
		}
		&-title {
			
		}
		&-price {
			font-weight: 700;
			padding: 10rpx 0;
			color: $uni-color-primary;
		}
		
	}
</style>