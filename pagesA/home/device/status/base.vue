<template>
	<view class="container">
		<u-loading-page :loading="loading" bg-color="#eef3f7" loadingText="FastBee.cn"></u-loading-page>
		<view class="card" v-show="!loading">
			<view :style="bgStyle">
				<u--text prefixIcon="grid-fill" iconStyle="font-size: 16px;color:#fff;margin-right:5px;" :text="title"
					bold color="#fff"></u--text>
			</view>

			<view style="padding:10px;">
				<u--form labelPosition="left" labelWidth="100"
					:labelStyle="{ marginRight: '16px', lineHeight: '32px', width: '50px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }">
					<u-form-item label="设备升级" leftIcon="/static/upgrade.png">
						<u-row>
							<u-col span="8">
								<u--text :text="'Version' + deviceInfo.firmwareVersion"></u--text>
							</u-col>
							<u-col span="4">
								<u-modal title="设备固件升级" :show="show" :showCancelButton="true"
									:showConfirmButton="Object.keys(firmware).length !== 0 && deviceInfo.firmwareVersion < firmware.version"
									confirmText="升级" @confirm="confirmUpgrade" @cancel="cancelUpgrade">
									<view style="margin-top:10px;">
										<u--text
											v-if="Object.keys(firmware).length === 0 || deviceInfo.firmwareVersion >= firmware.version"
											lineHeight="80" align="center" prefixIcon="checkmark-circle"
											iconStyle="color:#5ac725;margin-right:5px;" type="info"
											text="已经是最新版本，不需要升级"></u--text>
										<u--form labelPosition="left" labelWidth="45"
											v-if="Object.keys(firmware).length !== 0 && deviceInfo.firmwareVersion < firmware.version">
											<u--text type="success" prefixIcon="checkmark-circle"
												iconStyle="color:#5ac725;margin-right:5px;" text="有新版本可以升级"></u--text>
											<u-form-item label="名称:">
												<u--text type="info" :text="firmware.firmwareName"></u--text>
											</u-form-item>
											<u-form-item label="版本:">
												<u--text type="info" :text="'Version ' + firmware.version"></u--text>
											</u-form-item>
											<u-form-item label="描述:">
												<u--text type="info" :text="firmware.remark"
													customStyle="font-size:14px;"></u--text>
											</u-form-item>
										</u--form>
									</view>
								</u-modal>
								<u-button :disabled="deviceInfo.status != 3" @click="selectUpgrade" type="success"
									text="检查更新" customStyle="width:60px;margin:0;" size="mini"></u-button>
							</u-col>
						</u-row>
					</u-form-item>

					<view v-for="item in deviceInfo.thingsModels" :key="item.id">
						<u-form-item v-if="item.datatype.type=='bool'" leftIcon="/static/switch.png" :label="item.name">
							<u-switch v-model="item.shadow" @change="mqttPublish(deviceInfo, item)"
								:disabled="(shadowUnEnable || item.isReadonly==1)" inactiveValue="0" activeValue="1"
								activeColor="#3c9cff" inactiveColor="#c4c6c9" customStyle="border-radius:3px;"
								size="24"></u-switch>
						</u-form-item>
						<u-form-item v-if="item.datatype.type=='enum'" leftIcon="list" :label="item.name">
							<view class="enum-button-wrap"
								v-if="item.datatype.showWay && item.datatype.showWay === 'button'">
								<view class="enum-button" v-for="subItem in item.datatype.enumList"
									:key="subItem.value">
									<u-button size="mini" :disabled="(shadowUnEnable || item.isReadonly === 1)"
										type="primary" :plain="true" :text="subItem.text"
										@click="enumButtonClick(deviceInfo, item, subItem.value)"></u-button>
								</view>
							</view>
							<uni-data-select v-else :class="(shadowUnEnable || item.isReadonly==1) ? 'disabled' : ''"
								:clear="false" v-model="item.shadow" :localdata="item.datatype.enumList"
								@change="dropdownChange(deviceInfo, item, $event)">
							</uni-data-select>
						</u-form-item>
						<u-form-item v-if="item.datatype.type=='string'" leftIcon="email" :label="item.name">
							<u-input v-model="item.shadow"
								:placeholder="'请输入字符串 '+(item.datatype.unit?'，单位：'+item.datatype.unit:'')"
								:disabled="(shadowUnEnable || item.isReadonly==1)">
								<!-- 小程序中  v-if 在 slot 无法使用 ， H5 不影响-->
								<u-button :disabled="(shadowUnEnable || item.isReadonly==1)"
									@click="mqttPublish(deviceInfo, item)" type="primary" text="发送" size="mini"
									slot="suffix"></u-button>
							</u-input>
						</u-form-item>
						<u-form-item v-if="item.datatype.type=='decimal'" leftIcon="email" :label="item.name">
							<u-input v-model="item.shadow"
								:placeholder="'请输入小数 '+(item.datatype.unit?'，单位：'+item.datatype.unit:'')"
								:disabled="shadowUnEnable || item.isReadonly==1">
								<u-button :disabled="(shadowUnEnable || item.isReadonly==1)"
									@click="mqttPublish(deviceInfo, item)" type="primary" text="发送" size="mini"
									slot="suffix"></u-button>
							</u-input>
						</u-form-item>
						<u-form-item v-if="item.datatype.type=='integer'" leftIcon="email" :label="item.name">
							<u-input v-model="item.shadow"
								:placeholder="'请输入整数 '+(item.datatype.unit?'，单位：'+item.datatype.unit:'')"
								:disabled="shadowUnEnable || item.isReadonly==1">
								<u-button :disabled="(shadowUnEnable || item.isReadonly==1)"
									@click="mqttPublish(deviceInfo, item)" type="primary" text="发送" size="mini"
									slot="suffix"></u-button>
							</u-input>
						</u-form-item>
						<u-form-item v-if="item.datatype.type === 'object'">
							<view class="object-wrap">
								<u--text class="object-title" prefixIcon="attach"
									iconStyle="font-size: 16px; margin-right: 4px" bold lineHeight="30"
									:text="item.name"></u--text>
								<view class="object-content">
									<u-form labelPosition="left" labelWidth="110"
										:labelStyle="{ lineHeight: '32px', width: '110px', overflow: 'hidden', textOverflow: 'ellipsis' }">
										<view v-for="param in item.datatype.params" :key="param.id">
											<u-form-item v-if="param.datatype.type === 'bool'" :label="param.name">
												<u-switch v-model="param.shadow"
													@change="mqttPublish(deviceInfo, param)"
													:disabled="(shadowUnEnable || param.isReadonly === 1)"
													inactiveValue="0" activeValue="1" activeColor="#3c9cff"
													inactiveColor="#c4c6c9" customStyle="border-radius:3px;" size="24">
												</u-switch>
											</u-form-item>
											<u-form-item v-if="param.datatype.type === 'enum'" :label="param.name">
												<view class="enum-button-wrap"
													v-if="param.datatype.showWay && param.datatype.showWay === 'button'">
													<view class="enum-button" v-for="subItem in param.datatype.enumList"
														:key="subItem.value">
														<u-button size="mini"
															:disabled="(shadowUnEnable || param.isReadonly === 1)"
															type="primary" :plain="true" :text="subItem.text"
															@click="enumButtonClick(deviceInfo, param, subItem.value)"></u-button>
													</view>
												</view>
												<uni-data-select v-else
													:class="(shadowUnEnable || param.isReadonly === 1) ? 'disabled' : ''"
													:clear="false" v-model="param.shadow"
													:localdata="param.datatype.enumList"
													@change="dropdownChange(deviceInfo, param, $event)">
												</uni-data-select>
											</u-form-item>
											<u-form-item v-if="param.datatype.type === 'string'" :label="param.name">
												<u-input v-model="param.shadow"
													:placeholder="'请输入字符串 '+(param.datatype.unit?'，单位：'+param.datatype.unit:'')"
													:disabled="(shadowUnEnable || param.isReadonly === 1)">
													<u-button :disabled="(shadowUnEnable || param.isReadonly === 1)"
														@click="mqttPublish(deviceInfo, param)" type="primary" text="发送"
														size="mini" slot="suffix"></u-button>
												</u-input>
											</u-form-item>
											<u-form-item v-if="param.datatype.type === 'decimal'" :label="param.name">
												<u-input v-model="param.shadow"
													:placeholder="'请输入小数 '+(param.datatype.unit?'，单位：'+param.datatype.unit:'')"
													:disabled="shadowUnEnable || param.isReadonly === 1">
													<u-button :disabled="(shadowUnEnable || param.isReadonly==1)"
														@click="mqttPublish(deviceInfo, param)" type="primary" text="发送"
														size="mini" slot="suffix"></u-button>
												</u-input>
											</u-form-item>
											<u-form-item v-if="param.datatype.type === 'integer'" :label="param.name">
												<u-input v-model="param.shadow"
													:placeholder="'请输入整数 '+(param.datatype.unit?'，单位：'+param.datatype.unit:'')"
													:disabled="shadowUnEnable || param.isReadonly === 1">
													<u-button :disabled="(shadowUnEnable || param.isReadonly === 1)"
														@click="mqttPublish(deviceInfo, param)" type="primary" text="发送"
														size="mini" slot="suffix"></u-button>
												</u-input>
											</u-form-item>
										</view>
									</u-form>
								</view>
							</view>
						</u-form-item>
						<u-form-item v-if="item.datatype.type === 'array'">
							<view class="object-wrap" v-if="item.datatype.arrayType !== 'object'">
								<u--text class="object-title" prefixIcon="order"
									iconStyle="font-size: 16px; margin-right: 4px" bold lineHeight="30"
									:text="item.name"></u--text>
								<view class="object-content">
									<u--form labelPosition="left" labelWidth="110"
										:labelStyle="{ lineHeight: '32px', width: '110px', overflow: 'hidden', textOverflow: 'ellipsis' }">
										<view v-for="(model,index) in item.datatype.arrayModel" :key="model.id">
											<u-form-item v-if="item.datatype.arrayType=='string'"
												:label="item.name+(index+1)">
												<u-input v-model="model.shadow" placeholder="请输入字符串"
													:disabled="(shadowUnEnable || item.isReadonly==1)">
													<u-button :disabled="(shadowUnEnable || item.isReadonly==1)"
														@click="mqttPublish(deviceInfo, model)" type="primary" text="发送"
														size="mini" slot="suffix"></u-button>
												</u-input>
											</u-form-item>
											<u-form-item v-if="item.datatype.arrayType=='decimal'"
												:label="item.name+(index+1)">
												<u-input v-model="model.shadow" placeholder="请输入小数"
													:disabled="(shadowUnEnable || item.isReadonly==1)">
													<u-button :disabled="(shadowUnEnable || item.isReadonly==1)"
														@click="mqttPublish(deviceInfo, model)" type="primary" text="发送"
														size="mini" slot="suffix"></u-button>
												</u-input>
											</u-form-item>
											<u-form-item v-if="item.datatype.arrayType=='integer'"
												:label="item.name+(index+1)">
												<u-input v-model="model.shadow" placeholder="请输入整数"
													:disabled="(shadowUnEnable || item.isReadonly==1)">
													<u-button :disabled="(shadowUnEnable || item.isReadonly==1)"
														@click="mqttPublish(deviceInfo, model)" type="primary" text="发送"
														size="mini" slot="suffix"></u-button>
												</u-input>
											</u-form-item>
										</view>
									</u--form>
								</view>
							</view>
							<view class="object-wrap" v-if="item.datatype.arrayType === 'object'">
								<u--text class="object-title" prefixIcon="order"
									iconStyle="font-size: 16px; margin-right: 4px" bold lineHeight="30"
									:text="item.name"></u--text>
								<view style="padding: 0px 4.5px;" class="object-content">
									<u-collapse :border="true">
										<u-collapse-item v-for="(arrayParam,index) in item.datatype.arrayParams"
											:key="item.id+(index+1)" :title="item.name+(index+1)"
											:name="item.id+(index+1)">
											<u--form labelPosition="left" labelWidth="110"
												:labelStyle="{ lineHeight: '32px', width: '110px', overflow: 'hidden', textOverflow: 'ellipsis' }">
												<view v-for="param in arrayParam" :key="param.id">
													<u-form-item v-if="param.datatype.type=='bool'" :label="param.name">
														<u-switch v-model="param.shadow"
															@change="mqttPublish(deviceInfo, param)"
															:disabled="(shadowUnEnable || param.isReadonly==1)"
															inactiveValue="0" activeValue="1" activeColor="#3c9cff"
															inactiveColor="#c4c6c9" customStyle="border-radius:3px;"
															size="24">
														</u-switch>
													</u-form-item>
													<u-form-item v-if="param.datatype.type === 'enum'"
														:label="param.name">
														<view class="enum-button-wrap"
															v-if="param.datatype.showWay && param.datatype.showWay === 'button'">
															<view class="enum-button"
																v-for="subItem in param.datatype.enumList"
																:key="subItem.value">
																<u-button size="mini"
																	:disabled="(shadowUnEnable || param.isReadonly === 1)"
																	type="primary" :plain="true" :text="subItem.text"
																	@click="enumButtonClick(deviceInfo, param, subItem.value)"></u-button>
															</view>
														</view>
														<uni-data-select v-else
															:class="(shadowUnEnable || param.isReadonly==1) ? 'disabled' : ''"
															:clear="false" v-model="param.shadow"
															:localdata="param.datatype.enumList"
															@change="dropdownChange(deviceInfo, param, $event)">
														</uni-data-select>
													</u-form-item>
													<u-form-item v-if="param.datatype.type=='string'"
														:label="param.name">
														<u-input v-model="param.shadow"
															:placeholder="'请输入字符串 '+(param.datatype.unit?'，单位：'+param.datatype.unit:'')"
															:disabled="(shadowUnEnable || param.isReadonly==1)">
															<u-button
																:disabled="(shadowUnEnable || param.isReadonly==1)"
																@click="mqttPublish(deviceInfo, param)" type="primary"
																text="发送" size="mini" slot="suffix">
															</u-button>
														</u-input>
													</u-form-item>
													<u-form-item v-if="param.datatype.type=='decimal'"
														:label="param.name">
														<u-input v-model="param.shadow"
															:placeholder="'请输入小数 '+(param.datatype.unit?'，单位：'+param.datatype.unit:'')"
															:disabled="shadowUnEnable || param.isReadonly==1">
															<u-button
																:disabled="(shadowUnEnable || param.isReadonly==1)"
																@click="mqttPublish(deviceInfo, param)" type="primary"
																text="发送" size="mini" slot="suffix">
															</u-button>
														</u-input>
													</u-form-item>
													<u-form-item v-if="param.datatype.type=='integer'"
														:label="param.name">
														<u-input v-model="param.shadow"
															:placeholder="'请输入整数 '+(param.datatype.unit?'，单位：'+param.datatype.unit:'')"
															:disabled="shadowUnEnable || param.isReadonly==1">
															<u-button
																:disabled="(shadowUnEnable || param.isReadonly==1)"
																@click="mqttPublish(deviceInfo, param)" type="primary"
																text="发送" size="mini" slot="suffix">
															</u-button>
														</u-input>
													</u-form-item>
												</view>
											</u--form>
										</u-collapse-item>
									</u-collapse>
								</view>
							</view>
						</u-form-item>
					</view>
				</u--form>
			</view>
		</view>

		<view class="card" :style="loading ? 'visibility:hidden' : 'visibility:visible'"
			v-if="monitorChart.length != 0">
			<view style="padding:10px;">
				<u--text prefixIcon="grid-fill" iconStyle="font-size: 16px; color: #606266; margin-right: 5px;"
					:text="'监测数据'" bold color="#606266"></u--text>
			</view>
			<view class="wrapper">
				<view class="item" v-for="(chart, index) in monitorChart" :key="index">
					<view class="dashboard">
						<qiun-data-charts type="gauge" :opts="chart.opts" :chartData="chart.data" :canvas2d="true" />
					</view>
				</view>
			</view>
		</view>

		<view class="card" v-if="!loading && deviceInfo.isShadow == 1 && deviceInfo.status != 3">
			<view style="padding:10px;">
				<u--text prefixIcon="grid-fill" iconStyle="font-size: 16px;color:#606266;margin-right:5px;"
					:text="'设备离线时状态'" bold color="#606266"></u--text>
			</view>
			<view style="background-color:#fff;padding:10px;">
				<u--form labelPosition="left" labelWidth="100"
					:labelStyle="{ marginRight: '16px', width: '50px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }">
					<view v-for="item in deviceInfo.thingsModels" :key="item.id">
						<u-form-item v-if="item.datatype.type=='bool'" leftIcon="/static/switch.png" :label="item.name">
							<u-switch v-model="item.value" @change="mqttPublish(deviceInfo, item)" inactiveValue="0"
								activeValue="1" activeColor="#3c9cff" inactiveColor="#c4c6c9"
								customStyle="border-radius:3px;" size="24" disabled></u-switch>
						</u-form-item>
						<u-form-item v-if="item.datatype.type=='enum'" leftIcon="list" :label="item.name">
							<view class="enum-button-wrap"
								v-if="item.datatype.showWay && item.datatype.showWay === 'button'">
								<view class="enum-button" v-for="subItem in item.datatype.enumList"
									:key="subItem.value">
									<u-button size="mini" :disabled="(shadowUnEnable || item.isReadonly === 1)"
										type="primary" :plain="true" :text="subItem.text"
										@click="enumButtonClick(deviceInfo, item, subItem.value)" disabled></u-button>
								</view>
							</view>
							<uni-data-select v-else class="disabled" :clear="false" v-model="item.value"
								:localdata="item.datatype.enumList" @change="dropdownChange(deviceInfo, item, $event)">
							</uni-data-select>
						</u-form-item>
						<u-form-item v-if="item.datatype.type=='string'" leftIcon="email" :label="item.name">
							<u-input v-model="item.value" :placeholder="'请输入字符串'" disabled>
							</u-input>
						</u-form-item>
						<u-form-item v-if="item.datatype.type=='decimal'" leftIcon="email" :label="item.name">
							<u-input v-model="item.value" :placeholder="'请输入小数'" disabled>
							</u-input>
						</u-form-item>
						<u-form-item v-if="item.datatype.type=='integer'" leftIcon="email" :label="item.name">
							<u-input v-model="item.value" :placeholder="'请输入整数'" disabled>
							</u-input>
						</u-form-item>
						<u-form-item v-if="item.datatype.type=='object'">
							<view class="object-wrap">
								<u--text class="object-title" prefixIcon="attach"
									iconStyle="font-size: 16px; margin-right: 4px" bold lineHeight="30"
									:text="item.name"></u--text>
								<view class="object-content">
									<u-form labelPosition="left" labelWidth="110"
										:labelStyle="{ lineHeight: '32px', width: '110px', overflow: 'hidden', textOverflow: 'ellipsis' }">
										<view v-for="param in item.datatype.params" :key="param.id">
											<u-form-item v-if="param.datatype.type=='bool'" :label="param.name">
												<u-switch v-model="param.value" @change="mqttPublish(deviceInfo, param)"
													inactiveValue="0" activeValue="1" activeColor="#3c9cff"
													inactiveColor="#c4c6c9" customStyle="border-radius:3px;" size="24"
													disabled>
												</u-switch>
											</u-form-item>
											<u-form-item v-if="param.datatype.type=='enum'" :label="param.name">
												<view class="enum-button-wrap"
													v-if="param.datatype.showWay && param.datatype.showWay === 'button'">
													<view class="enum-button" v-for="subItem in param.datatype.enumList"
														:key="subItem.value">
														<u-button size="mini"
															:disabled="(shadowUnEnable || param.isReadonly === 1)"
															type="primary" :plain="true" :text="subItem.text"
															@click="enumButtonClick(deviceInfo, param, subItem.value)"
															disabled></u-button>
													</view>
												</view>
												<uni-data-select v-else class="disabled" :clear="false"
													v-model="param.value" :localdata="param.datatype.enumList"
													@change="dropdownChange(deviceInfo, param, $event)">
												</uni-data-select>
											</u-form-item>
											<u-form-item v-if="param.datatype.type=='string'" :label="param.name">
												<u-input v-model="param.value" placeholder="请输入字符串" disabled>
												</u-input>
											</u-form-item>
											<u-form-item v-if="param.datatype.type=='decimal'" :label="param.name">
												<u-input v-model="param.value" placeholder="请输入小数" disabled>
												</u-input>
											</u-form-item>
											<u-form-item v-if="param.datatype.type=='integer'" :label="param.name">
												<u-input v-model="param.value" placeholder="请输入整数" disabled>
												</u-input>
											</u-form-item>
										</view>
									</u-form>
								</view>
							</view>
						</u-form-item>
						<u-form-item v-if="item.datatype.type=='array'">
							<view class="object-wrap" v-if="item.datatype.arrayType!='object'">
								<u--text class="object-title" prefixIcon="order"
									iconStyle="font-size: 16px; margin-right: 4px" bold lineHeight="30"
									:text="item.name"></u--text>
								<view class="object-content">
									<u--form labelPosition="left" labelWidth="110"
										:labelStyle="{ lineHeight: '32px', width: '110px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }">
										<view v-for="(model,index) in item.datatype.arrayModel" :key="model.id">
											<u-form-item v-if="item.datatype.arrayType=='string'"
												:label="item.name+(index+1)">
												<u-input v-model="model.value" placeholder="请输入字符串" disabled>
												</u-input>
											</u-form-item>
											<u-form-item v-if="item.datatype.arrayType=='decimal'"
												:label="item.name+(index+1)">
												<u-input v-model="model.value" placeholder="请输入小数" disabled>
												</u-input>
											</u-form-item>
											<u-form-item v-if="item.datatype.arrayType=='integer'"
												:label="item.name+(index+1)">
												<u-input v-model="model.value" placeholder="请输入整数" disabled>
												</u-input>
											</u-form-item>
										</view>
									</u--form>
								</view>
							</view>
							<view class="object-wrap" v-if="item.datatype.arrayType=='object'">
								<u--text class="object-title" prefixIcon="order"
									iconStyle="font-size: 16px; margin-right: 4px" bold lineHeight="30"
									:text="item.name"></u--text>
								<view style="padding: 0px 4.5px;" class="object-content">
									<u-collapse :border="true">
										<u-collapse-item v-for="(arrayParam,index) in item.datatype.arrayParams"
											:key="item.id+(index+1)" :title="item.name+(index+1)"
											:name="item.id+(index+1)">
											<u--form labelPosition="left" labelWidth="110"
												:labelStyle="{marginRight:'16px',lineHeight:'32px',width:'110px',overflow:'hidden',textOverflow:'ellipsis'}">
												<view v-for="param in arrayParam" :key="param.id">
													<u-form-item v-if="param.datatype.type=='bool'" :label="param.name">
														<u-switch v-model="param.value"
															@change="mqttPublish(deviceInfo, param)" inactiveValue="0"
															activeValue="1" activeColor="#3c9cff"
															inactiveColor="#c4c6c9" customStyle="border-radius:3px;"
															size="24" disabled>
														</u-switch>
													</u-form-item>
													<u-form-item v-if="param.datatype.type=='enum'" :label="param.name">
														<view class="enum-button-wrap"
															v-if="param.datatype.showWay && param.datatype.showWay === 'button'">
															<view class="enum-button"
																v-for="subItem in param.datatype.enumList"
																:key="subItem.value">
																<u-button size="mini"
																	:disabled="(shadowUnEnable || param.isReadonly === 1)"
																	type="primary" :plain="true" :text="subItem.text"
																	@click="enumButtonClick(deviceInfo, param, subItem.value)"
																	disabled></u-button>
															</view>
														</view>
														<uni-data-select v-else class="disabled" :clear="false"
															v-model="param.value" :localdata="param.datatype.enumList"
															@change="dropdownChange(deviceInfo, param, $event)">
														</uni-data-select>
													</u-form-item>
													<u-form-item v-if="param.datatype.type=='string'"
														:label="param.name">
														<u-input v-model="param.value" placeholder="请输入字符串" disabled>
														</u-input>
													</u-form-item>
													<u-form-item v-if="param.datatype.type=='decimal'"
														:label="param.name">
														<u-input v-model="param.value" placeholder="请输入小数" disabled>
														</u-input>
													</u-form-item>
													<u-form-item v-if="param.datatype.type=='integer'"
														:label="param.name">
														<u-input v-model="param.value" placeholder="请输入整数" disabled>
														</u-input>
													</u-form-item>
												</view>
											</u--form>
										</u-collapse-item>
									</u-collapse>
								</view>
							</view>
						</u-form-item>
					</view>
				</u--form>
			</view>
		</view>
	</view>
</template>

<script>
	import { getLatestFirmware } from '@/apis/modules/device';
	import projectConfig from '@/env.config.js';

	export default {
		name: 'base-status',
		props: {
			device: {
				type: Object,
				default: null,
				required: true
			}
		},
		watch: {
			// 兼容小程序
			device: function (newVal, oldVal) {
				this.deviceInfo = newVal;
				this.updateDeviceStatus(this.deviceInfo);
				this.initChart();
			}
		},
		data () {
			return {
				// 设备升级模态窗
				show: false,
				// 固件
				firmware: {},
				// 加载图标
				loading: true,
				// 图表数据集合
				monitorChart: [{
					opts: {},
					data: {
						categories: [],
						series: [],
					},
					id: '',
				}],
				// 控制模块标题
				title: ' 设备控制 ',
				// 未启用设备影子
				shadowUnEnable: false,
				// 控制项标题背景
				statusColor: {
					background: '#67C23A',
					color: '#fff'
				},
				// 模块背景色
				bgStyle: '',
				// 设备信息
				deviceInfo: {
					chartList: [],
				}
			};
		},
		created () {
			// 获取设备状态(兼容H5和APP)
			if (this.device !== null && Object.keys(this.device).length !== 0) {
				this.deviceInfo = this.device;
				this.updateDeviceStatus(this.deviceInfo);
				this.initChart();
			};
			// 回调处理
			this.mqttCallback();
		},
		methods: {
			/* Mqtt回调处理 */
			mqttCallback () {
				this.$mqttTool.client.on('message', (topic, message, buffer) => {
					let topics = topic.split('/');
					let productId = topics[1];
					let deviceNum = topics[2];
					message = JSON.parse(message.toString());
					if (topics[3] == 'status') {
						console.log('接收到【设备状态-运行】主题：', topic);
						console.log('接收到【设备状态-运行】内容：', message);
						// 更新列表中设备的状态
						if (this.deviceInfo.serialNumber == deviceNum) {
							this.deviceInfo.status = message.status;
							this.deviceInfo.isShadow = message.isShadow;
							this.deviceInfo.rssi = message.rssi;
							this.updateDeviceStatus(this.deviceInfo);
						}
					}
					if (topics[3] == 'property' || topics[3] == 'function') {
						console.log('接收到【物模型】主题：', topic);
						console.log('接收到【物模型】内容：', message);
						// 更新列表中设备的属性
						if (this.deviceInfo.serialNumber == deviceNum) {
							for (let j = 0; j < message.length; j++) {
								let isComplete = false;
								// 设备状态
								for (let k = 0; k < this.deviceInfo.thingsModels.length && !isComplete; k++) {
									if (this.deviceInfo.thingsModels[k].id == message[j].id) {
										// 普通类型
										this.deviceInfo.thingsModels[k].shadow = message[j].value;
										isComplete = true;
										break;
									} else if (this.deviceInfo.thingsModels[k].datatype.type == "object") {
										// 对象类型
										for (let n = 0; n < this.deviceInfo.thingsModels[k].datatype.params
											.length; n++) {
											if (this.deviceInfo.thingsModels[k].datatype.params[n].id == message[j]
												.id) {
												this.deviceInfo.thingsModels[k].datatype.params[n].shadow =
													message[j].value;
												isComplete = true;
												break;
											}
										}
									} else if (this.deviceInfo.thingsModels[k].datatype.type == "array") {
										// 数组类型
										if (this.deviceInfo.thingsModels[k].datatype.arrayType == "object") {
											// 1.对象类型数组,id为数组中一个元素,例如：array_01_gateway_temperature
											if (String(message[j].id).indexOf("array_") == 0) {
												for (let n = 0; n < this.deviceInfo.thingsModels[k].datatype
													.arrayParams.length; n++) {
													for (let m = 0; m < this.deviceInfo.thingsModels[k].datatype
														.arrayParams[n].length; m++) {
														if (this.deviceInfo.thingsModels[k].datatype.arrayParams[n]
															[m].id == message[j].id) {
															this.deviceInfo.thingsModels[k].datatype.arrayParams[n]
																[m].shadow = message[j].value;
															isComplete = true;
															break;
														}
													}
													if (isComplete) {
														break;
													}
												}
											} else {
												// 2.对象类型数组，例如：gateway_temperature,消息ID添加前缀后匹配
												for (let n = 0; n < this.deviceInfo.thingsModels[k].datatype
													.arrayParams.length; n++) {
													for (let m = 0; m < this.deviceInfo.thingsModels[k].datatype
														.arrayParams[n].length; m++) {
														let index = n > 9 ? String(n) : '0' + k;
														let prefix = 'array_' + index + '_';
														if (this.deviceInfo.thingsModels[k].datatype.arrayParams[n]
															[m].id == prefix + message[j].id) {
															this.deviceInfo.thingsModels[k].datatype.arrayParams[n]
																[m].shadow = message[j].value;
															isComplete = true;
														}
													}
													if (isComplete) {
														break;
													}
												}
											}
										} else {
											// 整数、小数和字符串类型数组
											for (let n = 0; n < this.deviceInfo.thingsModels[k].datatype.arrayModel
												.length; n++) {
												if (this.deviceInfo.thingsModels[k].datatype.arrayModel[n].id ==
													message[j].id) {
													this.deviceInfo.thingsModels[k].datatype.arrayModel[n].shadow =
														message[j].value;
													isComplete = true;
													break;
												}
											}
										}
									}
								};
								// 监测数据
								for (let k = 0; k < this.deviceInfo.chartList.length && !isComplete; k++) {
									if (this.deviceInfo.chartList[k].id.indexOf("array_") == 0) {
										// 数组类型匹配,例如：array_00_gateway_temperature
										if (this.deviceInfo.chartList[k].id == message[j].id) {
											// let shadows = message[j].value.split(",");
											this.deviceInfo.chartList[k].shadow = message[j].value;
											// 更新图表
											for (let m = 0; m < this.chartList.length; m++) {
												if (this.deviceInfo.chartList[k].id == this.chartList[m].id) {
													// uchart中data取值范围0-1，需要最小数+监测值，然后除于区间值
													let value = (Number(message[j].shadow) + Math.abs(this
														.deviceInfo.chartList[k].datatype.min)) / (Math.abs(
															this.deviceInfo.chartList[k].datatype.min) + Math
														.abs(this.deviceInfo.chartList[k].datatype.max));
													this.monitorChart[m].data.series[0].data = value;
													this.monitorChart[m].opts.title.name = message[j].value + ' ' +
														this.deviceInfo.chartList[k].datatype.unit;
													break;
												}
											}
											isComplete = true;
											break;
										}
									} else {
										// 普通类型匹配
										if (this.deviceInfo.chartList[k].id == message[j].id) {
											this.deviceInfo.chartList[k].shadow = message[j].value;
											// 更新图表
											for (let m = 0; m < this.monitorChart.length; m++) {
												if (this.deviceInfo.chartList[k].id == this.monitorChart[m].id) {
													// uchart中data取值范围0-1，需要最小数+监测值，然后除于区间值
													let value = (Number(message[j].shadow) + Math.abs(this
														.deviceInfo.chartList[k].datatype.min)) / (Math.abs(
															this.deviceInfo.chartList[k].datatype.min) + Math
														.abs(this.deviceInfo.chartList[k].datatype.max));
													this.monitorChart[m].data.series[0].data = value;
													this.monitorChart[m].opts.title.name = message[j].value + ' ' +
														this.deviceInfo.chartList[k].datatype.unit;
													break;
												}
											}
											isComplete = true;
											break;
										}
									}
									if (isComplete) {
										break;
									}
								};
							}
						}
					}
				});
			},
			/**
			 * Mqtt发布消息
			 * @device 设备
			 * @model 物模型(id/name/type/name/isReadonly/value/shadow)，type 类型(1=属性，2=功能，3=OTA升级，4=实时监测)
			 * */
			mqttPublish (device, model) {
				let topic = "";
				let message = ""
				if (model.type == 1) {
					if (device.status == 3) {
						// 属性,在线模式
						topic = "/" + device.productId + "/" + device.serialNumber + "/property-online/get";
					} else if (device.isShadow) {
						// 属性,离线模式
						topic = "/" + device.productId + "/" + device.serialNumber + "/property-offline/post";
					}
					message = '[{"id":"' + model.id + '","value":"' + model.shadow + '"}]';
				} else if (model.type == 2) {
					if (device.status == 3) {
						// 功能,在线模式
						topic = "/" + device.productId + "/" + device.serialNumber + "/function-online/get";

					} else if (device.isShadow) {
						// 功能,离线模式
						topic = "/" + device.productId + "/" + device.serialNumber + "/function-offline/post";
					}
					message = '[{"id":"' + model.id + '","value":"' + model.shadow + '"}]';
				} else if (model.type == 3) {
					// OTA升级
					topic = "/" + device.productId + "/" + device.serialNumber + "/ota/get";
					message = '{"version":' + this.firmware.version + ',"downloadUrl":"' + this.getDownloadUrl(this
						.firmware.filePath) + '"}';
				} else {
					return;
				}
				if (topic !== "") {
					this.$mqttTool.publish(topic, message, model.name); // 发布
				}
			},
			// 获取下载路径前缀
			getDownloadUrl (path) {
				return projectConfig.baseUrl + path;
			},
			/** 检查升级 */
			selectUpgrade () {
				// 获取升级固件
				getLatestFirmware(this.deviceInfo.deviceId).then(response => {
					this.firmware = response.data;
					this.show = true;
				});
				this.show = true;
			},
			// 确认升级
			confirmUpgrade () {
				this.mqttPublish(3, this.deviceInfo, {
					name: '设备升级'
				});
				this.show = false;
			},
			// 取消升级
			cancelUpgrade () {
				this.show = false;
			},
			/** 更新设备状态 */
			updateDeviceStatus (device) {
				if (device.status === 3) {
					this.title = '设备在线';
					this.bgStyle =
						'background-color:#5ac725;border-top-left-radius:6px;border-top-right-radius:6px;padding:10px;';
					this.shadowUnEnable = false;
				} else {
					if (device.isShadow === 1) {
						this.bgStyle =
							'background-color:#3c9cff;border-top-left-radius:6px;border-top-right-radius:6px;padding:10px;';
						this.title = '影子模式';
						this.shadowUnEnable = false;
					} else {
						this.bgStyle =
							'background-color:#909399;border-top-left-radius:6px;border-top-right-radius:6px;padding:10px;';
						this.title = '设备离线';
						this.shadowUnEnable = true;
					}
				}
			},
			/** 下拉菜单改变事件*/
			dropdownChange (device, model, eventData) {
				model.shadow = eventData;
				// 防止uni-data-select在初始化的时候也触发change，产生不必要的错误
				if (eventData !== "") {
					// 发布物模型
					this.mqttPublish(device, model);
				}
			},
			/**监测图表*/
			initChart () {
				this.monitorChart = [];
				if (this.deviceInfo.chartList && this.deviceInfo.chartList.length !== 0) {
					for (let i = 0; i < this.deviceInfo.chartList.length; i++) {
						let data = {};
						let res = {
							categories: [{
								value: 0.2,
								color: '#409EFF'
							}, {
								value: 0.8,
								color: '#12d09f'
							}, {
								value: 1,
								color: '#F56C6C'
							}],
							series: [{
								name: this.deviceInfo.chartList[i].name,
								// uchart中data取值范围0-1，需要最小数+监测值，然后除于区间值
								data: (Number(this.deviceInfo.chartList[i].shadow) + Math.abs(this.deviceInfo
										.chartList[i].datatype.min)) /
									(Math.abs(this.deviceInfo.chartList[i].datatype.min) + Math.abs(this
										.deviceInfo
										.chartList[i].datatype.max))
							}]
						};
						data = JSON.parse(JSON.stringify(res));

						//这里的 opts 是图表类型 type="gauge" 的全部配置参数，您可以将此配置复制到 config-ucharts.js 文件中下标为 ['gauge'] 的节点中来覆盖全局默认参数。实际应用过程中 opts 只需传入与全局默认参数中不一致的【某一个属性】即可实现同类型的图表显示不同的样式，达到页面简洁的需求。
						let opts = {
							timing: 'easeOut',
							duration: 1000,
							rotate: false,
							rotateLock: false,
							color: ['#1890FF', '#91CB74', '#FAC858', '#EE6666', '#73C0DE', '#3CA272', '#FC8452',
								'#9A60B4',
								'#ea7ccc'
							],
							padding: undefined,
							fontSize: 13,
							fontColor: '#666666',
							dataLabel: true,
							dataPointShape: true,
							dataPointShapeType: 'solid',
							touchMoveLimit: 60,
							enableScroll: false,
							enableMarkLine: false,
							title: {
								name: this.deviceInfo.chartList[i].shadow + ' ' + this.deviceInfo.chartList[i]
									.datatype
									.unit,
								fontSize: 24,
								color: '#2fc25b',
								offsetY: 95,
								offsetX: 0
							},
							subtitle: {
								name: this.deviceInfo.chartList[i].name,
								fontSize: 14,
								color: '#333',
								offsetY: 10,
								offsetX: 0
							},
							extra: {
								gauge: {
									type: 'default',
									width: 10,
									labelColor: '#666666',
									startAngle: 0.75,
									endAngle: 0.25,
									startNumber: this.deviceInfo.chartList[i].datatype.min,
									endNumber: this.deviceInfo.chartList[i].datatype.max,
									format: 'dashboardKeepTwoDecimals',
									labelFormat: '',
									splitLine: {
										fixRadius: 0,
										splitNumber: 10,
										width: 30,
										color: '#FFFFFF',
										childNumber: 5,
										childWidth: 10
									},
									pointer: {
										width: 12,
										color: 'auto'
									},
									labelOffset: 16
								}
							}
						};
						this.monitorChart.push({
							opts: opts,
							data: data,
							id: this.deviceInfo.chartList[i].id
						});
					}
				};
				// 延时1秒执行
				setTimeout(x => {
					this.loading = false;
				}, 1000);
			},
			// 下拉刷新
			deviceStatusRefresh () {
				this.updateDeviceStatus(this.deviceInfo);
				this.chartList = [];
				this.initChart();
				uni.stopPullDownRefresh();
			},
			/** 枚举类型按钮单击 */
			enumButtonClick (device, model, value) {
				model.shadow = value;
				this.mqttPublish(device, model);
			},
		}
	};
</script>

<style lang="scss" scoped>
	.container {}

	.wrapper {
		display: flex;
		flex-direction: row;
		flex-wrap: wrap;
		align-content: flex-start;
		margin-bottom: 10px;
	}

	.wrapper .item {
		width: 100%;
		height: 250px;
		text-align: center;
		border-top: 1px solid #efefef;
	}

	.wrapper .item .dashboard {
		width: 60%;
		margin: auto;
	}

	.card {
		box-shadow: 0 1px 0px 0 rgba(0, 0, 0, 0.1);
		border-radius: 6px;
		background-color: #fff;
		margin: 10px;
		padding: 0;
	}

	.disabled {
		pointer-events: none;
		cursor: default;
		background-color: rgb(245, 247, 250);
	}

	.object-wrap {
		width: 100%;

		.object-title {}

		.object-content {
			// border: 1px #f1f3f4 solid;
			padding: 0px 18px;
			border-radius: 5px;

			/deep/ .u-line:first-child {
				border-bottom: transparent !important;
			}
		}
	}

	.enum-button-wrap {
		.enum-button {
			display: inline-block;
			margin-right: 10px;

			&:not(:first-child) {
				margin-top: 10px
			}
		}
	}
</style>