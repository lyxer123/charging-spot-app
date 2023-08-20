<template>
	<page-meta><navigation-bar :title="title" title-align="center" background-color="#007AFF" /></page-meta>
	<view class="container">
		<!-- 注意，如果需要兼容微信小程序，最好通过setRules方法设置rules规则 -->
		<u--form labelPosition="left" :model="form" :rules="rules" ref="form" labelWidth="60" labelAlign="center">
			<u-form-item label="名称" prop="groupName" required borderBottom><u--input v-model="form.groupName" border="none" placeholder="请输入分组名称"></u--input></u-form-item>
			<u-form-item label="排序" prop="groupOrder" required borderBottom>
				<u--input v-model="form.groupOrder" type="number" border="none" placeholder="请输入分组排序"></u--input>
			</u-form-item>
			<u-form-item label="备注" prop="remark" borderBottom><u--input v-model="form.remark" border="none" placeholder="请输入内容"></u--input></u-form-item>
		</u--form>
		<view style="margin-top:10px;display:flex;">
			<u-button type="error" v-if="isUpdate" @tap="handleDelete()" customStyle="margin:10px;">删除</u-button>
			<u-button type="primary" @tap="submitForm" customStyle="margin:10px;">保存</u-button>
		</view>
	</view>
</template>

<script>
import { getGroup, delGroup,updateGroup,addGroup } from '@/apis/modules/group';
export default {
	data() {
		return {
			title: '添加分组',
			isUpdate: false,
			// 表单参数
			form: {
				groupName: null,
				groupOrder: 0,
				remark: null
			},
			// 表单校验
			rules: {
				groupName: [
					{
						required: true,
						message: '分组名称不能为空',
						trigger: ['blur', 'change']
					}
				]
			}
		};
	},
	onLoad(option) {
		if (option.groupId) {
			this.form.groupId = option.groupId;
			this.getInfo();
			this.title = '修改分组';
			this.isUpdate = true;
		}
	},
	methods: {
		getInfo() {
			getGroup(this.form.groupId).then(response => {
				this.form = response.data;
			});
		},
		// 删除
		handleDelete() {
			uni.showModal({
				title: '系统提示',
				content: '确定删除当前分组吗？',
				success: result => {
					if (result.confirm) {
						uni.showLoading({ title: '删除中...' });
						delGroup(this.form.groupId)
							.then(res => {
								if (res) {
									uni.showToast({
										icon: 'success',
										title: res.msg
									});
									setTimeout(() => {
										this.goBack();
									}, 1000);
									// 列表更新
									//this.getList();
								}
							})
							.finally(() => {
								uni.hideLoading();
							});
					}
				}
			});
		},
		submitForm() {
			this.$refs.form.validate().then(res => {
				uni.showLoading({ title: '提交中...' });
				if (this.form.groupId != null) {
					updateGroup(this.form)
						.then(response => {
							uni.showToast({ icon: 'success', title: '修改成功' });
							setTimeout(() => {
								this.goBack();
							}, 1000);
						})
						.finally(() => {
							uni.hideLoading();
						});
				} else {
					addGroup(this.form)
						.then(response => {
							uni.showToast({ icon: 'success', title: '新增成功' });
							setTimeout(() => {
								this.goBack();
							}, 1000);
						})
						.finally(() => {
							uni.hideLoading();
						});
				}
			});
		},
		goBack() {
			// 跳转主页,通过globalData传递参数
			getApp().globalData.operate = 'operate';
			uni.navigateBack({
				delta: 1
			});
		}
	}
};
</script>

<style>
page {
	background: #eef3f7;
}
.container {
	background: #ffffff;
	padding: 20px;
}
</style>
