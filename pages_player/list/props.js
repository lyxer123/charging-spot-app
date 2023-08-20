export default {
	props:{
		/*唯一标识*/
		refId:{
			type:String,
			default:''
		},
		/*其他配置项*/
		options:{
			type:[Object,Array],
			default:()=>{return {}}
		},
		/*引用jessibuca路径 */
		decoder:{
			type:String,
			default:''
		},
		/*true 视频画面做等比缩放后,高或宽对齐canvas区域,画面不被拉伸,但有黑边 false 视频画面完全填充canvas区域,画面会被拉伸*/
		isResize:{
			type:Boolean,
			default:true
		},
		/*是否开启声音*/
		isNotMute:{
			type:Boolean,
			default:false
		},
		/*加载过程中文案*/
		loadingText:{
			type:String,
			default:''
		},
		/*封面图*/
		poster:{
			type:String,
			default:''
		},
		/*背景图*/
		background:{
			type:String,
			default:"url(./uni_modules/jessibuca/static/img/bg.jpg)"
		},
		/*是否自动播放*/
		isAuto:{
			type:Boolean,
			default:false
		},
		/*组件样式*/
		mainStyle:{
			type:Object,
			default:()=>{return{}}
		},
		/*是否全屏*/
		// isFull:{
		// 	type:Boolean,
		// 	default:true
		// },
		/*
			screensJosn({name:filename, format:format, quality:quality,type:type})
			截图时参数
			filename: 可选参数, 保存的文件名, 默认 时间戳
			format : 可选参数, 截图的格式，可选png或jpeg或者webp ,默认 png
			quality: 可选参数, 当格式是jpeg或者webp时，压缩质量，取值0 ~ 1 ,默认 0.92
			type: 可选参数, 可选download或者base64或者blob，默认download
		*/
		screensJosn:{
			type:Object,
			default:()=>{return{}}
		},
		/*
			是否显示流状态统计
			buf: 当前缓冲区时长，单位毫秒,
			fps: 当前视频帧率,
			abps: 当前音频码率，单位bit,
			vbps: 当前视频码率，单位bit，
			ts:当前视频帧pts，单位毫秒
		*/
		screensStats:{
			type:Object,
			default:()=>{return{fps:true}}
		},
		/*是否显示标题栏*/
		isTabbar:{
			type:Boolean,
			default:false
		},
		/*
		录屏时的参数
		fileName: 可选，默认时间戳
		fileType: 可选，默认webm，支持webm 和mp4 格式
		*/
		screenJosn:{
			type:Object,
			default:()=>{return{fileName:new Date().getTime(),fileType:'webm'}}
		}
	}
}
