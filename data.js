/* ============================================================
   STM32 五天速通 · 数据文件
   由 build.mjs 内联进 template.html
   数据区：PLAN / COURSES / CSURV / REF / QUIZ
   ============================================================ */

/* ------------------------------------------------------------
   五日学习计划
   ------------------------------------------------------------ */
const PLAN = [
{
  id:'d1', no:'Day 1', title:'[2-2] 新建工程 + 工程架构',
  sub:'视频 42 分钟 · 目标：让灯亮起来',
  goal:'今天只干一件事：**把工程建起来，并成功烧录一个能闪灯的程序**。\n'
      +'没有 C 语言基础完全没关系——今天的代码是「照着抄 + 改参数」，你要理解的是**工程里有哪几类文件、编译烧录的流程长什么样**。',
  tasks:[
    {id:'d1t1', t:'装好三件套：Keil5 MDK + 器件支持包 + ST-Link 驱动',
     s:'课件 P3 / P14。Keil 的注册机只在自己的学习环境用，不要用于任何商业项目。'},
    {id:'d1t2', t:'看视频 [2-2] 新建工程（42 分钟），不跳进度，跟着建一遍',
     s:'这一集是纯操作课，看第二遍时再自己独立建一次。',
     tags:[{k:'',n:'[视频]'}]},
    {id:'d1t3', t:'建一个自己的空工程模板，命名 STM32-Template',
     s:'以后每个例程都从它「复制一份再改名」，这是省时间的关键习惯。',
     tags:[{k:'must',n:'必做'}]},
    {id:'d1t4', t:'用「课程」页对照《工程架构》一节，自问自答 4 个问题',
     s:'① 程序从哪个文件开始跑？② SystemInit() 是谁调用的？③ 库函数文件为什么要拷进工程？④ USE_STDPERIPH_DRIVER 和 stm32f10x_conf.h 是什么关系？',
     tags:[{k:'must',n:'必做'}]},
    {id:'d1t5', t:'把核心板测试程序（PC13 闪烁）编译 + 烧录，看灯真的闪',
     s:'路径：E:\\BaiduNetdiskDownload\\模块资料\\1-STM32F103C8T6核心板\\核心板测试程序(PC13闪烁)'},
    {id:'d1t6', t:'打开「急救」页，读完《没有 C 语言基础，今天你只需要看懂这些》',
     s:'30 分钟内读完，不要试图一次学会 C 语言。',
     tags:[{k:'must',n:'必做'}]},
    {id:'d1t7', t:'在「自测」页做 Day 1 的题（Q1–Q5）',
     s:'答错不要紧，看解析比答对更重要。'}
  ]
},
{
  id:'d2', no:'Day 2', title:'[3-1] GPIO 输出　[3-2] LED闪烁 & 蜂鸣器',
  sub:'视频 74 分钟 · 目标：掌握 GPIO 输出 + 库函数套路',
  goal:'今天你会写出第一个**自己写的** STM32 程序。\n'
      +'必须先背下来的套路：**开时钟 → 配置 GPIO → 改变电平**，也就是 '
      +'`RCC_APB2PeriphClockCmd` → `GPIO_Init` → `GPIO_SetBits`/`GPIO_ResetBits`。'
      +'这个三步顺序在 STM32 里会出现一万次，今天练熟，后面全靠它。',
  tasks:[
    {id:'d2t1', t:'看视频 [3-1] GPIO 输出（34 分钟）',
     s:'重点看 GPIO 的 8 种模式讲解，以及推挽输出为什么能直接驱动 LED。',
     tags:[{k:'',n:'[视频]'}]},
    {id:'d2t2', t:'手打 GPIO 初始化代码（不许复制粘贴）',
     s:'对着「课程」页的《GPIO 推挽输出·配置五步法》逐行敲。',
     tags:[{k:'must',n:'必做'}]},
    {id:'d2t3', t:'看视频 [3-2] LED闪烁 & LED流水灯 & 蜂鸣器（39 分钟）',
     tags:[{k:'',n:'[视频]'}]},
    {id:'d2t4', t:'做 LED 闪烁：GPIO_SetBits / GPIO_ResetBits + 延时',
     s:'想清楚一个问题：为什么 STM32 里点灯要先开时钟，51 单片机不用？'},
    {id:'d2t5', t:'做 LED 流水灯：用 for 循环 + 数组改写，而不是重复写 8 遍',
     s:'这一步是练 C 语言循环和数组，也是「急救」页第 4 节的应用。',
     tags:[{k:'must',n:'必做'}]},
    {id:'d2t6', t:'蜂鸣器：有源蜂鸣器直接 GPIO 输出即可（无源蜂鸣器需要 PWM）',
     s:'无源蜂鸣器要等到 [6-4] PWM 才做得了，今天标注 TODO 跳过就行。',
     tags:[{k:'skip',n:'可跳'}]},
    {id:'d2t7', t:'「课程」页复习 [3-1] 和 [3-2] 两节'},
    {id:'d2t8', t:'「自测」页做 Day 2 的题（Q6–Q11）'}
  ]
},
{
  id:'d3', no:'Day 3', title:'[3-3] GPIO 输入　[3-4] 按键 & 光敏传感器',
  sub:'视频 77 分钟 · 目标：按键、抖动、传感器输入',
  goal:'输出 → 输入的转折点。今天有一个**必须亲手做一遍**的对比实验：不消抖 vs 消抖。\n'
      +'按键抖动是嵌入式笔试、面试的高频题，你自己在串口/OLED 上看到抖动造成的错误触发，比背十遍定义都管用。',
  tasks:[
    {id:'d3t1', t:'看视频 [3-3] GPIO 输入（44 分钟）',
     s:'重点：上拉输入为什么适合按键、GPIO_ReadInputDataBit 怎么用。',
     tags:[{k:'',n:'[视频]'}]},
    {id:'d3t2', t:'手打按键初始化（上拉输入）+ 读电平的代码',
     tags:[{k:'must',n:'必做'}]},
    {id:'d3t3', t:'看视频 [3-4] 按键控制LED & 光敏传感器控制蜂鸣器（33 分钟）',
     tags:[{k:'',n:'[视频]'}]},
    {id:'d3t4', t:'按键控制 LED 翻转（用 GPIO_ReadInputDataBit 读按键）'},
    {id:'d3t5', t:'关键实验：不消抖 vs 延时 20ms 消抖，各跑一遍，说出区别',
     s:'用 OLED 或串口打印计数，你会看到不消抖时一次按下被数成好几次。',
     tags:[{k:'must',n:'必做'}]},
    {id:'d3t6', t:'光敏传感器控制蜂鸣器',
     s:'传感器模块的 DO 引脚接 GPIO 输入。资料：E:\\BaiduNetdiskDownload\\模块资料\\4-光敏电阻传感器',
     tags:[{k:'must',n:'必做'}]},
    {id:'d3t7', t:'「课程」页复习 [3-3] 和 [3-4] 两节，重读《按键消抖》'},
    {id:'d3t8', t:'「自测」页做 Day 3 的题（Q12–Q16）'}
  ]
},
{
  id:'d4', no:'Day 4', title:'[4-1] [4-2] OLED 调试　[5-1] EXTI 外部中断',
  sub:'视频 76 分钟，概念量最大 · 目标：调试工具 + 中断系统',
  goal:'今天的前半段（OLED）是给你一双**眼睛**，后半段（中断）是给你一套**神经反射系统**。\n'
      +'《中断系统》这节我写得比视频详细得多，它是 [5-1]、[5-2]、[6-*] 全部内容的地基，'
      +'**必须完整读完再去看 [5-1]**，否则你会听得云里雾里。',
  tasks:[
    {id:'d4t1', t:'看视频 [4-1] OLED调试工具（14 分钟）',
     s:'对比串口调试、显示屏调试、Keil 在线调试三种手段的适用场景。',
     tags:[{k:'',n:'[视频]'}]},
    {id:'d4t2', t:'看视频 [4-2] OLED显示屏（20 分钟）',
     s:'0.96 寸 OLED，128×64 分辨率，I2C 或 SPI 接口。',
     tags:[{k:'',n:'[视频]'}]},
    {id:'d4t3', t:'把 E 盘的中景园 OLED 例程移植到你的工程里跑通',
     s:'路径：E:\\BaiduNetdiskDownload\\模块资料\\8-OLED显示屏\\中景园电子0.96OLED显示屏测试程序'},
    {id:'d4t4', t:'用 OLED 显示一个递增数字，取代串口调试',
     s:'这一步做成之后，后面 5–6 章的实验会舒服很多。',
     tags:[{k:'must',n:'必做'}]},
    {id:'d4t5', t:'「课程」页精读《中断系统（[5-1] 前置知识）》★',
     s:'中断执行流程、NVIC 优先级分组、抢占优先级 vs 响应优先级、中断嵌套。',
     tags:[{k:'must',n:'必做'}]},
    {id:'d4t6', t:'合上屏幕，自己讲一遍：什么是中断？为什么需要 NVIC？两类优先级的区别是什么？',
     s:'讲不出来就回去重读 d4t5。这是本课程最重要的一节。',
     tags:[{k:'must',n:'必做'}]},
    {id:'d4t7', t:'看视频 [5-1] EXTI外部中断（42 分钟）',
     tags:[{k:'',n:'[视频]'}]},
    {id:'d4t8', t:'手打 EXTI 中断例程：按键触发中断 → 翻转 LED',
     s:'检查三处：中断函数名有没有写错、NVIC 优先级分组设了没、EXTI_Init 结构体四个成员填对没。',
     tags:[{k:'must',n:'必做'}]},
    {id:'d4t9', t:'「自测」页做 Day 4 的题（Q17–Q24）'}
  ]
},
{
  id:'d5', no:'Day 5', title:'[5-2] 编码器计次　[6-1] TIM定时中断　[6-2] 定时器定时中断 & 外部时钟',
  sub:'视频 137 分钟 · 目标：定时器时基单元彻底吃透',
  goal:'今天量最大（137 分钟视频），但性价比最高——**定时器是 STM32 最重要的外设，没有之一**。\n'
      +'`[6-1]` 的时基单元框图必须看懂（PSC / CNT / ARR 三者关系），`[6-2]` 的两个例程必须亲手算参数。\n'
      +'**如果时间不够，宁可放弃 [5-2] 的旋转编码器计次，也要把 [6-1] [6-2] 做完。**',
  tasks:[
    {id:'d5t1', t:'看视频 [5-2] 对射式红外传感器计次 & 旋转编码器计次（50 分钟）',
     s:'与 [6-7] 编码器接口的内容有重叠，重点是复习 EXTI 的中断计数用法。',
     tags:[{k:'skip',n:'可跳'}]},
    {id:'d5t2', t:'做对射式红外传感器计次（中断方式）',
     s:'资料：E:\\BaiduNetdiskDownload\\模块资料\\7-对射式红外传感器'},
    {id:'d5t3', t:'「课程」页精读《定时器时基单元（[6-1] 核心）》★',
     s:'PSC、CNT、ARR 三个寄存器，以及 PSC 时序图、ARR 有无预装的差别。',
     tags:[{k:'must',n:'必做'}]},
    {id:'d5t4', t:'看视频 [6-1] TIM定时中断（50 分钟）',
     tags:[{k:'',n:'[视频]'}]},
    {id:'d5t5', t:'手算参数：写一个 72MHz 下「1 秒一次」的定时中断程序',
     s:'自己算 PSC 和 ARR，不许抄视频里的参数。72MHz / (PSC+1) / (ARR+1) = 你想要的频率。',
     tags:[{k:'must',n:'必做'}]},
    {id:'d5t6', t:'看视频 [6-2] 定时器定时中断 & 定时器外部时钟（39 分钟）',
     tags:[{k:'',n:'[视频]'}]},
    {id:'d5t7', t:'做定时器外部时钟（ETR 外部引脚计数）',
     s:'可以用对射式红外传感器当外部时钟源，每挡一次光计一个数。',
     tags:[{k:'must',n:'必做'}]},
    {id:'d5t8', t:'用定时器中断驱动 OLED 数字刷新（每 1 秒 +1）',
     s:'把 Day 4 的 OLED 和今天的定时器串起来，你就有一个能展示的作品了。',
     tags:[{k:'pj',n:'项目'}]},
    {id:'d5t9', t:'「自测」页做 Day 5 的题（Q25–Q30）'},
    {id:'d5t10', t:'总复习：把五天所有例程从头编译一遍，确认全部能过',
     s:'编译不通过的，回去看对应章节。这一步能暴露你理解上的漏洞。',
     tags:[{k:'must',n:'必做'}]}
  ]
}
];

/* ------------------------------------------------------------
   课程详解（按视频分 P 对应）
   ------------------------------------------------------------ */
const COURSES = [
{
p:'2-2', short:'新建工程',
link:'https://www.bilibili.com/video/BV1th411z7sn?p=4',
items:[
 {id:'c22', no:'1', t:'为什么「新建工程」这么难（以及它到底在干什么）',
  body:`
很多人都卡在 [[[2-2]]]，因为这一集要你手动**组织文件、配置编译器**，全是名词，看着很枯燥。
但它做的事其实只有一句话：**把 ST 官方的固件库，和你的代码，拼成一个 Keil 能认的工程。**

为什么不能像 51 单片机那样直接新建就写？因为 STM32 太复杂了：一个芯片有几十个外设、
几百个寄存器。ST 提供了「标准外设库」（Standard Peripheral Library，简称固件库），
里面是已经写好的函数，比如 [[GPIO_SetBits()]]、[[TIM_Cmd()]]。
你用这些函数，就不用去查寄存器地址了。代价是：**你得先把库文件放进工程**。
`},
 {id:'c22b', no:'2', t:'工程架构：五个文件的分工',
  body:`
这是 [2-2] 最该记住的图（课件 P17）：

| 文件 | 作用 |
|---|---|
| [[startup_stm32f10x_md.s]] | 启动文件，**芯片上电后执行的第一段代码**，汇编写的 |
| [[system_stm32f10x.c/.h]] | 定义 [[SystemInit()]]，负责把主频配置成 72MHz |
| [[main.c]] | 你写代码的地方，定义 [[main()]] |
| [[stm32f10x_it.c/.h]] | 存放**中断服务函数**，比如 [[EXTI0_IRQHandler()]] |
| [[stm32f10x.h]] | 外设寄存器描述（把所有寄存器的地址用 C 语言定义出来） |
| [[core_cm3.c/.h]] | Cortex-M3 内核寄存器描述 |
| [[stm32f10x_xxx.c/.h]] | 各外设的库函数，比如 [[stm32f10x_gpio.c]]、[[stm32f10x_tim.c]] |
| [[misc.c/.h]] | NVIC 相关配置的函数（中断优先级用的） |
| [[stm32f10x_conf.h]] | 库函数的「总开关」，决定哪些外设库文件参与编译 |

**启动文件做的事（程序真正开始的地方）：**

\`\`\`
启动文件：复位中断 → 调用 SystemInit() → 调用 __main → 调用 main()
\`\`\`

所以：[[main()]] 不是第一个执行的函数，[[SystemInit()]] 才是。这一点在 [2-2] 视频里会讲，
但很容易听过就忘，被问起来答不上来。
`},
 {id:'c22c', no:'3', t:'新建工程的六步（背下来，以后每次建工程都用）',
  body:`
**第一步：建工程文件夹，用 Keil 新建工程，选型号**
型号选 [[STM32F103C8]]（不是 C6T6 / R8T6），Keil 会自动问你要不要拷贝启动文件，选**是**。

**第二步：在工程文件夹里建立 Start、Library、User 三个文件夹**
- [[Start]]：放启动文件 [[startup_stm32f10x_md.s]]、[[core_cm3.c/.h]]、[[stm32f10x.h]]、[[system_stm32f10x.c/.h]]
- [[Library]]：放 [[misc.c/.h]] 和所有 [[stm32f10x_xxx.c/.h]] 库文件
- [[User]]：放你自己的 [[main.c]]，以及从 Library 拷来的 [[stm32f10x_conf.h]]、[[stm32f10x_it.c/.h]]

**第三步：在 Keil 里建立同名的分组，把文件添加进去**
分组名字必须和文件夹名字一样，不然以后找文件会疯。
记住一条：**Keil 工程里的「分组」只是显示用的目录，不改变文件在硬盘上的位置。**

**第四步：工程选项 → C/C++ → Include Paths 声明头文件所在的所有文件夹**
把 [[Start]]、[[Library]]、[[User]] 三个文件夹都加进去。
这一条不填，编译时报「cannot open source input file」或者「undefined identifier」。

**第五步：工程选项 → C/C++ → Define 定义 [[USE_STDPERIPH_DRIVER]]**
这是给 [[stm32f10x.h]] 看的开关：只有定义了这个宏，它才会去 [[#include "stm32f10x_conf.h"]]。

**第六步：工程选项 → Debug → 选 ST-Link Debugger → Settings → Flash Download → 勾选 Reset and Run**
勾了「Reset and Run」，烧录完芯片会自动复位运行，不用手动按复位键。

[ok] 这六步做完，你的工程就是一个「空模板」。之后每学一节新课，
**复制一份这个模板再改名**，比每次重新建工程快十倍。
`},
 {id:'c22d', no:'4', t:'三个最容易踩的坑',
  body:`
[bad] **坑 1：编译报错 [[cannot open source input file "stm32f10x.h"]]**
Include Paths 没加全，或者文件夹名字拼错了。

[bad] **坑 2：编译报一堆 [[undefined symbol GPIO_Init]]**
库文件 [[stm32f10x_gpio.c]] 没添加到 Library 分组里。Keil 只编译你添加进工程的文件。

[bad] **坑 3：烧录时报 [[No target connected]] / [[Cannot access target]]**
- ST-Link 的 SWDIO / SWCLK / GND / 3.3V 四根线接错（对照课件 P11 引脚定义）
- Keil 里 Debug 没选 ST-Link Debugger
- 芯片被设置了读保护，需要用 ST-Link Utility 解除

[warn] 还有一个隐藏坑：**ST-Link 驱动必须先装**，否则 Keil 的 Debug 设置里根本选不到设备。
E 盘资料：[[E:\\BaiduNetdiskDownload\\模块资料\\2-STLINK下载器]]
`}
]
},
{
p:'3-1', short:'GPIO输出',
link:'https://www.bilibili.com/video/BV1th411z7sn?p=5',
items:[
 {id:'c31a', no:'1', t:'GPIO 是什么，为什么要点灯',
  body:`
GPIO = **General Purpose Input Output**（通用输入输出口）。它是 STM32 和外界沟通最基础的通道。

- 引脚电平只有两种：**0V（低电平，逻辑 0）** 和 **3.3V（高电平，逻辑 1）**
- 部分引脚可以容忍 5V 输入（课件 P11 引脚定义里带 FT 标记的）
- 输出模式下可以控制引脚高低电平 → 驱动 LED、控制蜂鸣器、模拟通信协议时序
- 输入模式下可以读取引脚电平 → 读按键、读传感器模块输出、读通信数据

STM32F103C8T6 有 **GPIOA、GPIOB、GPIOC** 三组端口（LQFP48 封装下实际引出的引脚有限，
PA0–PA15、PB0–PB15、PC13–PC15 的部分）。每一组端口有 16 个引脚，PA0–PA15。

[ok] **为什么第一课一定是点灯？** 因为它是唯一一个「输出正确 + 硬件正确」就能立刻用眼睛看到结果的实验。
它验证了你整条链路：**Keil 工程 → 编译 → 烧录 → 芯片运行**。这条链路不通，后面学什么都是空谈。
`},
 {id:'c31b', no:'2', t:'8 种 GPIO 模式（PPT 上的核心表格）',
  body:`
| 模式 | 性质 | 特征 | 什么时候用 |
|---|---|---|---|
| 浮空输入 | 数字输入 | 可读引脚电平，悬空时电平不确定 | 外部已有上下拉电阻时 |
| 上拉输入 | 数字输入 | 内部接上拉电阻，悬空默认高电平 | **按键输入（按键接地）** |
| 下拉输入 | 数字输入 | 内部接下拉电阻，悬空默认低电平 | 按键输入（按键接电源） |
| 模拟输入 | 模拟输入 | GPIO 数字功能无效，引脚直连内部 ADC | **ADC 采集电压** |
| 开漏输出 | 数字输出 | 只能输出低电平，高电平为高阻态 | **I2C 的 SCL/SDA** |
| 推挽输出 | 数字输出 | 高电平接 VDD，低电平接 VSS，能主动输出两种电平 | **LED、蜂鸣器、普通输出** |
| 复用开漏输出 | 数字输出 | 由片上外设控制，特性同开漏 | 复用为 I2C 时 |
| 复用推挽输出 | 数字输出 | 由片上外设控制，特性同推挽 | 复用为 PWM、串口、SPI 时 |

**怎么记：** 先问「输入还是输出」→ 再问「模拟还是要数字」→ 输出再看「要不要主动输出高电平」。
- 推挽 = 两个管子一推一挽，能主动拉高也能拉低
- 开漏 = 只有下面那个管子，高电平得靠外部上拉电阻

[warn] **复用**这个词的意思是：这个引脚本来归 GPIO 管，现在「借给」片上的某个外设（定时器、串口）用，
所以叫复用功能。你在 [6-3] 学 PWM 输出时就要用**复用推挽输出**。
`},
 {id:'c31c', no:'3', t:'★ GPIO 推挽输出：配置五步法（必须背下来）',
  body:`
以「点亮 PA0 上的 LED」为例。**这五步是 STM32 所有外设配置的通用套路：**

**第一步：开时钟** —— 任何外设用之前都要开它的时钟，不开就完全没反应

\`\`\`
RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);   // GPIOA 挂在 APB2 总线上
\`\`\`

**第二步：定义并填充初始化结构体**

\`\`\`
GPIO_InitTypeDef GPIO_InitStructure;              // 定义一个结构体变量
GPIO_InitStructure.GPIO_Pin   = GPIO_Pin_0;       // 选择引脚 PA0
GPIO_InitStructure.GPIO_Mode  = GPIO_Mode_Out_PP; // 推挽输出 PP = Push-Pull
GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz; // 输出速度，点灯用 50MHz 都行
\`\`\`

**第三步：把结构体交给 GPIO_Init**

\`\`\`
GPIO_Init(GPIOA, &GPIO_InitStructure);            // 注意是 &，取地址
\`\`\`

**第四步：设置输出电平**

\`\`\`
GPIO_SetBits(GPIOA, GPIO_Pin_0);      // 输出高电平（3.3V）
GPIO_ResetBits(GPIOA, GPIO_Pin_0);    // 输出低电平（0V）
\`\`\`

**第五步（可选，更省事）：直接读写整个端口**

\`\`\`
GPIO_WriteBit(GPIOA, GPIO_Pin_0, Bit_SET);   // 单个引脚，不用区分函数名
GPIO_Write(GPIOA, 0x0001);                   // 一次写 16 个引脚
\`\`\`

[h3] 为什么 LED 通常是「低电平点亮」

因为核心板上的 LED 是这么接的：

\`\`\`
3.3V ──[限流电阻]──[LED]──→ PA1

\`\`\`
电流从 3.3V 流经 LED 到 PA1。只有当 PA1 输出**低电平（0V）**时，两端才有电压差，LED 才亮。
所以点灯的代码是 [[GPIO_ResetBits()]]，灭灯是 [[GPIO_SetBits()]]。

[warn] 这不是「反了」，是硬件决定的。看代码前先看你板子的原理图
（E 盘：[[1-STM32F103C8T6核心板\\STM32F103C8T6核心板原理图.pdf]]）。
`},
 {id:'c31d', no:'4', t:'LED 闪烁的完整程序（逐行注释版）',
  body:`
\`\`\`
#include "stm32f10x.h"        // 头文件，所有库函数和寄存器定义都在里面
#include "Delay.h"            // 自己写的延时函数

void LED_Init(void)           // 习惯：每个外设写一个 Init 函数
{
    GPIO_InitTypeDef GPIO_InitStructure;                       // 定义一个结构体变量

    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);      // 1. 开 GPIOA 时钟

    GPIO_InitStructure.GPIO_Mode  = GPIO_Mode_Out_PP;          // 2. 推挽输出
    GPIO_InitStructure.GPIO_Pin   = GPIO_Pin_1;                //    用 PA1
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;          //    50MHz 速度
    GPIO_Init(GPIOA, &GPIO_InitStructure);                     // 3. 初始化生效
}

int main(void)
{
    LED_Init();               // 先初始化 GPIO
    while (1)                 // 主循环，程序永远停在这里
    {
        GPIO_ResetBits(GPIOA, GPIO_Pin_1);   // LED 亮（低电平）
        Delay_ms(500);                       // 延时 500 毫秒
        GPIO_SetBits(GPIOA, GPIO_Pin_1);     // LED 灭（高电平）
        Delay_ms(500);
    }
}
\`\`\`

[h3] 三个新手必问

**Q：为什么 while(1) 死循环？**
因为单片机没有操作系统。[[main()]] 一旦返回，程序就跑到未定义的地方去了。
所有 STM32 程序的 [[main()]] 最后一定是 [[while(1)]]。

**Q：延时为什么不用 [[for]] 循环？**
[3-2] 视频里用了一个 [[Delay_ms()]] 函数（用 [[SysTick]] 或者空循环实现）。
用 for 循环写的延时不精确，而且编译器优化等级一改，延时时间就变了。

**Q：为什么 [[GPIO_Pin]] 可以用 [[|]] 组合？**
因为 [[GPIO_Pin_0]] 到 [[GPIO_Pin_15]] 定义的是 [[0x0001]]、[[0x0002]]、[[0x0004]]……
每个引脚占一个二进制位，所以 [[GPIO_Pin_0 | GPIO_Pin_1]] 就是同时选两个引脚。
这就是「急救」页里讲的**位运算**的实际用途。
`}
]
},
{
p:'3-2', short:'LED闪烁&蜂鸣器',
link:'https://www.bilibili.com/video/BV1th411z7sn?p=6',
items:[
 {id:'c32a', no:'1', t:'LED 流水灯（用数组 + 循环，别写 8 遍）',
  body:`
最笨的写法是把点灯代码复制 8 遍，改一下引脚号。正确的写法：

\`\`\`
int main(void)
{
    LED_Init();
    uint16_t pins[8] = {GPIO_Pin_0, GPIO_Pin_1, GPIO_Pin_2, GPIO_Pin_3,
                        GPIO_Pin_4, GPIO_Pin_5, GPIO_Pin_6, GPIO_Pin_7};
    uint8_t i;

    while (1)
    {
        for (i = 0; i < 8; i++)                    // 遍历数组
        {
            GPIO_ResetBits(GPIOA, pins[i]);        // 点亮第 i 个
            Delay_ms(200);
            GPIO_SetBits(GPIOA, pins[i]);          // 熄灭第 i 个
        }
    }
}
\`\`\`

这里用到的 C 语言知识（「急救」页第 4 节）：
- [[uint16_t pins[8]]] 是**数组**：一次存放 8 个值
- [[pins[i]]] 是**下标访问**：i 从 0 数到 7
- [[for (i = 0; i < 8; i++)]] 是**循环**：i 从 0 开始，每次加 1，到 8 就停

[ok] 你能把这个数组写法讲清楚，说明你已经跨过「只会抄代码」的阶段了。
`},
 {id:'c32b', no:'2', t:'有源蜂鸣器 vs 无源蜂鸣器',
  body:`
| 类型 | 内部有没有振荡源 | 驱动方式 | 频率 |
|---|---|---|---|
| **有源蜂鸣器** | 有 | 接上直流电压就响，GPIO 输出低/高电平即可 | 固定，不可调 |
| **无源蜂鸣器** | 没有 | 必须由控制器提供**振荡脉冲** | 由你给的脉冲频率决定 |

**有源蜂鸣器（今天就能做）：**

\`\`\`
void Buzzer_Init(void)
{
    GPIO_InitTypeDef GPIO_InitStructure;
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB, ENABLE);
    GPIO_InitStructure.GPIO_Pin   = GPIO_Pin_12;
    GPIO_InitStructure.GPIO_Mode  = GPIO_Mode_Out_PP;
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOB, &GPIO_InitStructure);
}
// 响：GPIO_ResetBits(GPIOB, GPIO_Pin_12);   灭：GPIO_SetBits(GPIOB, GPIO_Pin_12);
\`\`\`

**无源蜂鸣器（要等 [6-4]）：** 需要用 PWM 输出一个频率的方波，改变频率就能改音调。
所以你听到的「哆来咪」，本质是一串不同频率的 PWM。

[warn] 如果蜂鸣器接上不响，先确认：模块是有源还是无源（看模块背面有没有一个黑色小圆柱 = 有源）、
是低电平触发还是高电平触发。
`},
 {id:'c32c', no:'3', t:'今天必须搞懂的一个问题：为什么要开时钟',
  body:`
这是新手最容易忽略、但面试官最爱问的问题。

STM32 的外设（GPIO、定时器、串口……）都**挂在总线**上（APB1、APB2、AHB）。
每个外设都有一个「时钟使能位」，默认是**关闭**的。

[bad] 你调用 [[GPIO_Init()]] 的时候，其实只是往寄存器里写了配置值。
如果时钟没开，写进去也没用——外设根本没有时钟驱动，寄存器不工作，引脚一点反应都没有。
现象就是：**代码看起来完全正确，但灯就是不亮，而且不报任何错。**

所以就成了一条铁律：

\`\`\`
用任何外设之前，先开它的时钟。
GPIOA / GPIOB / GPIOC → RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOx, ENABLE)
\`\`\`

查总线归属的方法：课件 P8 的「片上资源」表，或者任何时候直接查参考手册。
初学者记住这个就够了：**F103 上 GPIO、EXTI、ADC1、USART1、SPI1、TIM1 在 APB2；
USART2/3、I2C、TIM2/3/4 在 APB1。**
`}
]
},
{
p:'3-3', short:'GPIO输入',
link:'https://www.bilibili.com/video/BV1th411z7sn?p=7',
items:[
 {id:'c33a', no:'1', t:'GPIO 输入模式怎么选',
  body:`
输入模式下 GPIO **不再控制引脚**，而是去**读取**引脚当前的电平。

| 模式 | 内部电阻 | 悬空时读到什么 | 典型用途 |
|---|---|---|---|
| 浮空输入 | 无 | **不确定**（随电压漂移，可能是0也可能是1） | 外部电路已有上下拉电阻时 |
| 上拉输入 | 接 3.3V | 高电平（1） | **按键（按键另一端接 GND）** |
| 下拉输入 | 接 GND | 低电平（0） | 按键（按键另一端接 3.3V） |
| 模拟输入 | 无，直连 ADC | — | ADC 采集电压 |

**按键为什么用上拉输入：** 按键一端接引脚、另一端接 GND。松手时引脚什么都不接（悬空），
如果没有内部上拉电阻，读到的电平是**随机的**；有了上拉电阻，松手读到 1，按下被拉到 GND 读到 0。

[warn] 反过来，如果按键另一端接的是 3.3V，就选**下拉输入**。选错模式的现象是：
**按键怎么按都读不到变化，或者一直是按下的状态。**
`},
 {id:'c33b', no:'2', t:'读引脚电平：GPIO_ReadInputDataBit',
  body:`
\`\`\`
void Key_Init(void)
{
    GPIO_InitTypeDef GPIO_InitStructure;
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB, ENABLE);

    GPIO_InitStructure.GPIO_Pin  = GPIO_Pin_1;
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IPU;   // IPU = Input Pull-Up 上拉输入
    GPIO_Init(GPIOB, &GPIO_InitStructure);
}

// 读取单个引脚：
uint8_t KeyNum = GPIO_ReadInputDataBit(GPIOB, GPIO_Pin_1);   // 返回 0 或 1

// 读取整个端口（16 位）：
uint16_t portVal = GPIO_ReadInputData(GPIOB);
\`\`\`

对比一下输出，命名很有规律：

| 读输入 | 写输出 |
|---|---|
| [[GPIO_ReadInputDataBit(GPIOx, pin)]] | [[GPIO_WriteBit(GPIOx, pin, val)]] |
| [[GPIO_ReadInputData(GPIOx)]] | [[GPIO_Write(GPIOx, val)]] |
| [[GPIO_ReadOutputDataBit()]] （读输出寄存器的值） | [[GPIO_SetBits]] / [[GPIO_ResetBits]] |

[warn] [[GPIO_ReadOutputData()]] 读的是**输出数据寄存器**，不是引脚实际电平。
想读引脚真实电平，只能用 [[GPIO_ReadInputDataBit()]]。
`},
 {id:'c33c', no:'3', t:'★ 按键抖动与消抖（高频考点）',
  body:`
**抖动是什么：** 按键内部是机械弹簧片，按下和松手的瞬间，金属片不会干净地一次接触，
而是在几十微秒内**反复通断好几次**。这个现象叫**按键抖动（bounce）**。

**后果：** 你写「按一次，LED 翻转一次」，结果按一下 LED 翻转了 3 次。
在屏幕上表现为数字跳了好几个，在中断方式下表现为中断触发了多次。

**抖动的时间：** 一般是 **5~20ms**（机械按键典型值，视频里讲 5~10ms）。

[h3] 软件消抖（最常用）

思路：检测到电平变化后，**延时 20ms 再读一次**，两次都是按下状态才认为是真的按下。

\`\`\`
uint8_t Key_GetNum(void)
{
    uint8_t KeyNum = 0;

    if (GPIO_ReadInputDataBit(GPIOB, GPIO_Pin_1) == 0)   // 第一次检测到按下
    {
        Delay_ms(20);                                    // 延时 20ms 跳过抖动期
        while (GPIO_ReadInputDataBit(GPIOB, GPIO_Pin_1) == 0);  // 等待松手，避免连发（这行才是关键）
        Delay_ms(20);                                    // 松手也消抖
        KeyNum = 1;
    }
    return KeyNum;
}
\`\`\`

[warn] [[while (GPIO_ReadInputDataBit(...) == 0);]] 这一行容易被漏掉。
漏掉它，按住按键不放时，主循环每转一圈都会返回一次「按下」，数字疯狂递增。
加上它，程序会**卡在 while 里等松手**，一次按下只算一次。

[h3] 硬件消抖

在按键两端并联一个 **0.1µF 电容**，利用电容充放电把抖动滤掉。成本高一点，但软件更简单。

[ok] **自己动手做这个对比实验：** 先写一版不消抖的代码，用 OLED 或串口打印计数，
按一下看数字涨了几个；再加上消抖，看是不是每次只涨 1。这个实验做一遍，
比背十遍「按键抖动定义」有用得多。
`},
]
},
{
p:'3-4', short:'按键&传感器',
link:'https://www.bilibili.com/video/BV1th411z7sn?p=8',
items:[
 {id:'c33d', no:'1', t:'传感器模块：DO 和 AO 的区别',
  body:`
光敏电阻、热敏电阻、红外传感器这些模块，本质都一样：

\`\`\`
传感器元件（电阻随外界变化） ──┐
                              ├── 分压 → 模拟电压 ──→ 电压比较器 ──┬─→ DO（数字输出，0或1）
定值电阻 ─────────────────────┘                                   └─→ AO（模拟输出，连续电压）
\`\`\`

| 引脚 | 输出 | 接哪里 | 用途 |
|---|---|---|---|
| **DO** | 数字量（0/1） | 普通 GPIO **输入** | 判断「亮/暗」「有/无遮挡」 |
| **AO** | 模拟量（连续电压） | **ADC 输入** | 测出具体的亮度/温度数值 |
| VCC / GND | 电源 | 3.3V / GND | 供电 |

[3-4] 这一节用的是 DO，所以接普通 GPIO 上拉/浮空输入即可，代码和按键完全一样。

**模块上通常还有一个蓝色电位器**，用来调节电压比较器的阈值——
转它就能改变「多暗算暗」的分界点。调不出效果时，先怀疑这个旋钮的位置。

E 盘资料：[[4-光敏电阻传感器]]、[[5-热敏电阻传感器]]、[[6-反射式红外传感器]]

[warn] AO 要等到 [7-1] [7-2] 学 ADC 才会用。今天只要接 DO 就够了。
`},
]
},
{
p:'4-1', short:'OLED调试工具',
link:'https://www.bilibili.com/video/BV1th411z7sn?p=9',
items:[
 {id:'c41a', no:'1', t:'为什么需要调试工具',
  body:`
单片机不像电脑程序，出了错没有弹窗报错。你只能「看到」它现在的状态。三种手段：

| 方式 | 原理 | 优点 | 缺点 |
|---|---|---|---|
| **串口调试** | 通过 USART 把信息发到电脑，用串口助手显示 | 信息量大、可长时间记录 | 需要接线，要装 CH340 驱动，需要电脑 |
| **显示屏调试** | 把 OLED 直接接到单片机，信息打印在屏幕上 | **脱离电脑**，现场就能看 | 屏幕小，显示的信息量有限 |
| **Keil 调试模式** | 用 ST-Link 在线调试，单步运行、设断点、看寄存器和变量 | 能看最底层的东西（寄存器、内存） | 必须连着电脑，看不了长时的运行状态 |

[ok] **实战建议：** 日常开发用**显示屏调试**（因为不用插电脑），
排查疑难问题用 **Keil 调试模式**（看寄存器的值到底对不对）。
[4-1] 就是教你搭好这个"眼睛"。

[4-1] 只有 14 分钟，但**价值极高**——强烈建议今天一定要把 OLED 跑通，
因为 [5-*] 和 [6-*] 的所有实验都会用到它。
`},
]
},
{
p:'4-2', short:'OLED显示屏',
link:'https://www.bilibili.com/video/BV1th411z7sn?p=10',
items:[
 {id:'c42a', no:'1', t:'0.96 寸 OLED 模块基础',
  body:`
| 项目 | 参数 |
|---|---|
| 名称 | OLED（Organic Light Emitting Diode，有机发光二极管） |
| 尺寸 | 0.96 寸，分辨率 **128 × 64**（横向 128 列，纵向 64 行） |
| 供电 | 3V ~ 5.5V |
| 通信协议 | **I2C**（4 针）或 **SPI**（7 针） |
| 驱动方式 | 自发光，不需要背光，功耗低、对比度高 |

**坐标系统：** [[OLED_ShowString(1, 1, "Hello")]] 里的两个 1 不是像素坐标，
而是**字符的行号和列号**：

- 第 1 个参数：行号，范围 **1~4**（因为 64 行 ÷ 每字符 16 行高 = 4 行）
- 第 2 个参数：列号，范围 **1~16**（因为 128 列 ÷ 每字符 8 列宽 = 16 列）

所以一块 128×64 的屏，最多显示 **4 行 × 16 列 = 64 个字符**。

[h3] 常用驱动函数（课件 P40）

| 函数 | 作用 |
|---|---|
| [[OLED_Init()]] | 初始化（必须先调，否则屏幕全黑） |
| [[OLED_Clear()]] | 清屏 |
| [[OLED_ShowChar(1, 1, 'A')]] | 显示一个字符 |
| [[OLED_ShowString(1, 3, "HelloWorld!")]] | 显示字符串 |
| [[OLED_ShowNum(2, 1, 12345, 5)]] | 显示十进制数字，最后一位是显示位数 |
| [[OLED_ShowSignedNum(2, 7, -66, 2)]] | 显示有符号十进制 |
| [[OLED_ShowHexNum(3, 1, 0xAA55, 4)]] | 显示十六进制 |
| [[OLED_ShowBinNum(4, 1, 0xAA55, 16)]] | 显示二进制 |

**移植步骤（用 E 盘的例程）：**
1. 把 [[OLED.c]] / [[OLED.h]] 和字体文件拷到你的工程的 [[User]] 文件夹和 Code 分组
2. 把 OLED 的驱动文件（[[OLED_Font.h]] 字库）一起拷，否则显示不了字
3. 把工程里的 [[OLED.c]] 中的引脚定义改成你实际接的引脚
4. 在 [[main()]] 里先调 [[OLED_Init()]]，再调显示函数

E 盘路径：[[8-OLED显示屏\\中景园电子0.96OLED显示屏测试程序]]

[warn] 如果屏幕全黑：① 忘了调 [[OLED_Init()]]；② 引脚接错；
③ I2C 地址不对（一般是 0x78）；④ 供电没接。这四个原因覆盖 95% 的「屏幕不亮」问题。
`},
]
},
{
p:'5-1', short:'EXTI外部中断',
link:'https://www.bilibili.com/video/BV1th411z7sn?p=11',
items:[
 {id:'c51a', no:'1', t:'★ 中断系统（[5-1] 前置知识，全课程最重要的地基）',
  body:`
[h3] 什么是中断

**中断（Interrupt）**：在主程序运行过程中，出现了特定的**中断触发条件（中断源）**，
使得 CPU **暂停当前正在运行的程序**，转而去处理**中断程序**，
处理完成后又**返回原来被暂停的位置继续运行**。

打个比方：你在写作业（主程序），电话响了（中断源），你放下笔去接电话（中断程序），
接完回来接着写（返回断点）。电话就是中断源，你放笔的位置就是断点。

[h3] 中断执行流程

\`\`\`
主程序 ──┬──────────────┬──────────→
         │ 中断请求      │ 继续执行
         ↓              ↑
      中断程序 ─────────┘（返回断点）
\`\`\`

[h3] STM32 的中断资源

STM32F103C8T6 有 **68 个可屏蔽中断通道**，包含 EXTI、TIM、ADC、USART、SPI、I2C 等外设的中断。
中断太多，CPU 忙不过来，所以有了下面的调度器。

[h3] NVIC：嵌套向量中断控制器

NVIC 是内核里的一个外设，负责**管理所有中断的优先级和调度**。它的核心是**优先级**：

\`\`\`
CPU ──── NVIC ──┬── EXTI（优先级 0）
                ├── TIM （优先级 1）
                ├── ADC （优先级 2）
                └── USART（优先级 3）
\`\`\`

**优先级数字越小的优先级越高**（注意！不是越大越高）。

[h3] ★ NVIC 优先级分组（最容易搞混的一节）

NVIC 的优先级由优先级寄存器的 **4 位（取值 0~15）** 决定。这 4 位可以被切分成两部分：

\`\`\`
            4 位优先级寄存器
  ┌──────────────┬──────────────┐
  │ 高 n 位       │ 低 (4-n) 位    │
  │ 抢占优先级     │ 响应优先级      │
  └──────────────┴──────────────┘
\`\`\`

| 分组 | 抢占优先级位数 | 响应优先级位数 | 抢占优先级取值范围 | 响应优先级取值范围 |
|---|---|---|---|---|
| NVIC_PriorityGroup_0 | 0 位 | 4 位 | 无 | 0~15 |
| NVIC_PriorityGroup_1 | 1 位 | 3 位 | 0~1 | 0~7 |
| **NVIC_PriorityGroup_2** | **2 位** | **2 位** | **0~3** | **0~3** |
| NVIC_PriorityGroup_3 | 3 位 | 1 位 | 0~7 | 0~1 |
| NVIC_PriorityGroup_4 | 4 位 | 0 位 | 0~15 | 无 |

[ok] **初学者直接用 NVIC_PriorityGroup_2**（每组各 2 位，各 4 个等级），够用了。

[h3] 抢占优先级 vs 响应优先级（区别必须记住）

| | 抢占优先级（Preemption） | 响应优先级（Sub） |
|---|---|---|
| 作用 | 决定**能不能打断**正在执行的中断 | 决定**同时到来时谁先执行** |
| 高的一方 | 可以打断低的一方，形成**中断嵌套** | **不能**打断正在执行的中断，只能等它执行完 |
| 同时触发 | 抢占优先级高的先执行 | 抢占相同时，响应优先级高的先执行 |
| 都相同时 | —— | 按**中断号**（IRQ 编号）小的先执行 |

[warn] 记忆口诀：**抢占优先级决定「插不插队」，响应优先级决定「排队顺序」。**

[h3] 一个例子

中断 A：抢占 2，响应 0；中断 B：抢占 1，响应 3。当前 A 正在执行，B 来了。
→ B 的抢占优先级（1）比 A（2）高，**B 可以打断 A**，形成中断嵌套，B 执行完再回到 A。

如果 A：抢占 1、响应 0；B：抢占 1、响应 1。A 正在执行，B 来了。
→ 抢占优先级相同，**B 不能打断 A**，只能排队等 A 执行完。

[h3] 中断服务函数（ISR）怎么写

中断发生时，CPU 会自动跳到对应名字的函数去执行。**函数名是固定的，不能自己起名**：

\`\`\`
void EXTI0_IRQHandler(void)          // 函数名固定！对应 EXTI 线路 0
{
    if (EXTI_GetITStatus(EXTI_Line0) == SET)   // 判断是不是这条线路触发的中断
    {
        // 在这里写你要干的事，比如翻转 LED

        EXTI_ClearITPendingBit(EXTI_Line0);    // ★ 必须清除中断标志位！
    }
}
\`\`\`

[bad] **忘了 [[EXTI_ClearITPendingBit()]] 会怎样？**
中断标志位不清除，CPU 认为中断还在，会**无限重复进入这个中断函数**，程序就卡死在这里了，
主程序再也不运行。这是新手最常见的「程序卡死」原因之一。
`},
 {id:'c51b', no:'2', t:'EXTI 外部中断：基本结构',
  body:`
**EXTI（Extern Interrupt）外部中断**：监测指定 GPIO 口的电平信号，产生电平变化时，
立即向 NVIC 发出中断申请，经过 NVIC 裁决后中断 CPU 主程序。

| 特性 | 内容 |
|---|---|
| 支持的触发方式 | **上升沿** / **下降沿** / **双边沿** / **软件触发** |
| 支持的 GPIO | 所有 GPIO 口，但**相同的 Pin 不能同时触发中断** |
| 通道数 | 16 个 GPIO_Pin + PVD 输出、RTC 闹钟、USB 唤醒、以太网唤醒 |
| 触发响应方式 | 中断响应 / 事件响应 |

[warn] **「相同的 Pin 不能同时触发中断」**是什么意思？
EXTI 按**引脚号**分组：PA0、PB0、PC0 共用 **EXTI0**。所以你不能同时用 PA0 和 PB0 做外部中断。
配置 PB0 会覆盖 PA0 的 EXTI 配置。这是个很隐蔽的坑。

[h3] 触发方式怎么选

- **上升沿**：电平从低变高时触发。例如按键**松手**瞬间（上拉输入的按键）
- **下降沿**：电平从高变低时触发。例如按键**按下**瞬间、红外传感器被遮挡
- **双边沿**：两种都触发。例如旋转编码器的 A/B 相计次

注意：课件 P48 的 **AFIO** 是「复用 IO 口」，EXTI 的引脚选择要经过 AFIO，
所以配置 EXTI 时也必须开 **AFIO 的时钟**（[[RCC_APB2Periph_AFIO]]）。

[h3] 配置 EXTI 的完整步骤

\`\`\`
void CountSensor_Init(void)
{
    GPIO_InitTypeDef GPIO_InitStructure;
    EXTI_InitTypeDef EXTI_InitStructure;         // ★ 多了一个结构体
    NVIC_InitTypeDef NVIC_InitStructure;         // ★ 还要配 NVIC

    // 1. 开时钟：GPIOB + AFIO
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB | RCC_APB2Periph_AFIO, ENABLE);

    // 2. 配置 GPIO 为输入（这里用上拉输入）
    GPIO_InitStructure.GPIO_Pin  = GPIO_Pin_14;
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IPU;
    GPIO_Init(GPIOB, &GPIO_InitStructure);

    // 3. 把 GPIO 引脚映射到 EXTI 线路（走 AFIO）
    GPIO_EXTILineConfig(GPIO_PortSourceGPIOB, GPIO_PinSource14);

    // 4. 配置 EXTI
    EXTI_InitStructure.EXTI_Line    = EXTI_Line14;
    EXTI_InitStructure.EXTI_Mode    = EXTI_Mode_Interrupt;   // 中断模式（不是事件）
    EXTI_InitStructure.EXTI_Trigger = EXTI_Trigger_Falling;  // 下降沿触发
    EXTI_InitStructure.EXTI_LineCmd = ENABLE;
    EXTI_Init(&EXTI_InitStructure);

    // 5. 配置 NVIC（中断优先级）
    NVIC_PriorityGroupConfig(NVIC_PriorityGroup_2);          // 整个工程设置一次即可
    NVIC_InitStructure.NVIC_IRQChannel = EXTI15_10_IRQn;     // 注意是 15_10，不是 14！
    NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 1;// 抢占优先级
    NVIC_InitStructure.NVIC_IRQChannelSubPriority        = 1;// 响应优先级
    NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE;
    NVIC_Init(&NVIC_InitStructure);
}
\`\`\`

[bad] **最容易错的地方：中断通道号和中断函数名。**
EXTI 线路 10~15 共用同一个中断通道：[[EXTI15_10_IRQn]]，函数名是 [[EXTI15_10_IRQHandler()]]。
你写了 [[EXTI14_IRQHandler()]] 也**不会报错**，但中断永远不会被调用。
同样，线路 5~9 共用 [[EXTI9_5_IRQn]]；线路 0~4 是各自独立的 [[EXTI0_IRQn]] ~ [[EXTI4_IRQn]]。

[h3] 中断函数里判断具体是哪条线路

因为 15 和 10 共用一个通道，函数里要判断：

\`\`\`
void EXTI15_10_IRQHandler(void)
{
    if (EXTI_GetITStatus(EXTI_Line14) == SET)     // 确认是 Line14
    {
        CountSensor_Count ++;                     // 计次
        EXTI_ClearITPendingBit(EXTI_Line14);      // ★ 清除标志
    }
}
\`\`\`
`}
]
},
{
p:'5-2', short:'编码器计次',
link:'https://www.bilibili.com/video/BV1th411z7sn?p=12',
items:[
 {id:'c52a', no:'1', t:'对射式红外传感器计次（EXTI 计数）',
  body:`
「对射式」= 发射管和接收管分开装在两侧，中间**挡住就改变电平**。
用途：测速（转盘上有小孔）、计件、限位检测。

做法就是 [5-1] 那套 EXTI 代码，只不过中断函数里做的事从「翻转 LED」变成「计数 +1」：

\`\`\`
uint16_t CountSensor_Count = 0;   // 计数值要用全局变量

void EXTI15_10_IRQHandler(void)
{
    if (EXTI_GetITStatus(EXTI_Line14) == SET)
    {
        CountSensor_Count ++;
        EXTI_ClearITPendingBit(EXTI_Line14);
    }
}
\`\`\`

[warn] 计数值定义在 [[main.c]] 里（全局变量），在中断函数里改它。
如果定义成局部变量，main 里读到的一直是 0——**中断函数访问不到局部变量的作用域**。
`},
 {id:'c52b', no:'2', t:'旋转编码器简介',
  body:`
**旋转编码器**：用来测量位置、速度或旋转方向的装置。旋转时输出端输出**与旋转速度和方向对应的方波信号**，
读取方波信号的**频率和相位信息**即可得知旋转轴的速度和方向。

**类型：** 机械触点式 / 霍尔传感器式 / 光栅式。

它和普通电位器的区别：旋转编码器**可以无限圈旋转**，可以测方向和转速，而电位器只能转

有限的机械行程。

**[5-2] 用的是软件中断计次法**（配置两个 EXTI，分别数 A 相和 B 相的边沿）；
**[6-7] [6-8] 会用硬件编码器接口**（定时器的 Encoder Interface 自动计数，不用中断）。
硬件方式更省 CPU，也更快——**这也是为什么 [5-2] 是可跳的**：
它在功能上被 [6-7] 覆盖了，先学它只是为了理解「旋转编码器是什么」。

E 盘资料：[[11-旋转编码器\\旋转编码器模块使用说明.png]]
`}
]
},
{
p:'6-1', short:'TIM定时中断',
link:'https://www.bilibili.com/video/BV1th411z7sn?p=13',
items:[
 {id:'c61a', no:'1', t:'定时器是什么，STM32F103 有几个',
  body:`
**TIM（Timer）定时器**：对输入的时钟进行计数，并在计数值达到设定值时**触发中断**。

\`\`\`
时钟源 ──→ [预分频器 PSC] ──→ [计数器 CNT] ──→ 计到 ARR 值 ──→ 产生中断
                                  ↑                    │
                             计一个数加一          自动重装
\`\`\`

**STM32F103C8T6 的定时器资源：TIM1、TIM2、TIM3、TIM4**

| 类型 | 编号 | 总线 | 功能 |
|---|---|---|---|
| **高级定时器** | TIM1 | APB2 | 通用功能 + 死区生成、互补输出、重复计数器、刹车输入 |
| **通用定时器** | TIM2、TIM3、TIM4 | **APB1** | 基本定时 + 输入捕获、输出比较、编码器接口、主从触发 |
| **基本定时器** | TIM6、TIM7（F103C8T6 没有） | APB1 | 只有最基本的定时中断 |

[warn] **开时钟时注意：** TIM1 在 APB2，[[RCC_APB2PeriphClockCmd(RCC_APB2Periph_TIM1, ENABLE)]]；
TIM2/3/4 在 APB1，[[RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM2, ENABLE)]]。
写错总线，现象就是「定时器完全不工作」。
`},
 {id:'c61b', no:'2', t:'★ 时基单元：PSC / CNT / ARR 三者关系（本节核心）',
  body:`
**时基单元**是定时器的心脏，由三个寄存器组成：

| 寄存器 | 名称 | 作用 |
|---|---|---|
| **PSC** | 预分频器（Prescaler） | 把输入时钟**降频**，16 位，取值 0~65535 |
| **CNT** | 计数器（Counter） | 每个时钟周期加 1，16 位，取值 0~65535 |
| **ARR** | 自动重装寄存器（Auto-Reload Register） | CNT 数到这个值就**溢出**，产生中断，并把 CNT 归零重新开始 |

[h3] 频率计算公式（背下来）

\`\`\`
计数频率      CK_CNT    = CK_PSC / (PSC + 1)
溢出频率(中断频率) CK_CNT_OV = CK_CNT / (ARR + 1)
                          = CK_PSC / (PSC + 1) / (ARR + 1)
\`\`\`

其中 [[CK_PSC]] 是定时器的输入时钟。以 TIM2 为例（挂 APB1，但因为有倍频，实际是 72MHz）：
[[CK_PSC = 72MHz]]。

[h3] ★ 经典题目：要 1 秒一次中断，PSC 和 ARR 填多少？

\`\`\`
72MHz / (PSC+1) / (ARR+1) = 1Hz
→ (PSC+1) × (ARR+1) = 72,000,000
\`\`\`

配对方案（选一个即可）：

| PSC | PSC+1 | ARR | ARR+1 | 乘积 | 结果 |
|---|---|---|---|---|---|
| **7199** | 7200 | **9999** | 10000 | 72,000,000 | **1Hz（1 秒）** ✔ |
| 7199 | 7200 | 19999 | 20000 | 144,000,000 | 0.5Hz（2 秒） |
| 0 | 1 | 65535 | 65536 | 65,536 | ≈1.1kHz |

[ok] 视频和课件里常用的就是 **PSC = 7200-1、ARR = 10000-1**，正好 1 秒。
注意代码里填的是 **减 1 后的值**（因为硬件会自动 +1）。

[h3] 为什么分母要「+1」

因为硬件设计上：写 0 表示 1 分频（不分频），写 1 表示 2 分频。
所以实际分频系数 = 寄存器值 + 1。这个细节写错，定时时间就差一倍。

[h3] 最大定时时间

课件 P52 提到：16 位 PSC 和 ARR 都最多 65535，
所以最大分频 = 65536 × 65536，在 72MHz 下最大定时约 **59.65 秒**。
超过这个时间就得用「中断里再累加计数」的办法。
`},
 {id:'c61c', no:'3', t:'定时中断的配置步骤（六步）',
  body:`
\`\`\`
void Timer_Init(void)
{
    TIM_TimeBaseInitTypeDef TIM_TimeBaseInitStructure;
    NVIC_InitTypeDef NVIC_InitStructure;

    // 1. 开 TIM2 的时钟（注意 APB1）
    RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM2, ENABLE);

    // 2. 选择时基单元的时钟源（默认就是内部时钟，这行可以省略，但写上更清楚）
    TIM_InternalClockConfig(TIM2);

    // 3. 配置时基单元
    TIM_TimeBaseInitStructure.TIM_ClockDivision     = TIM_CKD_DIV1;   // 时钟分频（和时基无关，一般 DIV1）
    TIM_TimeBaseInitStructure.TIM_CounterMode       = TIM_CounterMode_Up;  // 向上计数
    TIM_TimeBaseInitStructure.TIM_Period            = 10000 - 1;      // ★ ARR，注意 -1
    TIM_TimeBaseInitStructure.TIM_Prescaler         = 7200  - 1;      // ★ PSC，注意 -1
    TIM_TimeBaseInitStructure.TIM_RepetitionCounter = 0;              // 高级定时器才用，通用定时器填 0
    TIM_TimeBaseInit(TIM2, &TIM_TimeBaseInitStructure);

    // 4. 清除初始化后立刻产生的更新中断标志（否则会一开机就进一次中断）
    TIM_ClearFlag(TIM2, TIM_FLAG_Update);

    // 5. 使能更新中断
    TIM_ITConfig(TIM2, TIM_IT_Update, ENABLE);

    // 6. 配置 NVIC
    NVIC_PriorityGroupConfig(NVIC_PriorityGroup_2);
    NVIC_InitStructure.NVIC_IRQChannel = TIM2_IRQn;
    NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 2;
    NVIC_InitStructure.NVIC_IRQChannelSubPriority        = 1;
    NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE;
    NVIC_Init(&NVIC_InitStructure);

    // 7. 启动定时器（很多人忘了这步）
    TIM_Cmd(TIM2, ENABLE);
}

// 中断函数名固定
void TIM2_IRQHandler(void)
{
    if (TIM_GetITStatus(TIM2, TIM_IT_Update) == SET)
    {
        // 每 1 秒执行一次，比如让计数变量 +1

        TIM_ClearITPendingBit(TIM2, TIM_IT_Update);   // ★ 必须清标志
    }
}
\`\`\`

[warn] **三个高频错误：**
1. 忘了 [[TIM_Cmd(TIM2, ENABLE)]] → 定时器根本不启动，中断永远不来
2. 忘了 [[TIM_ClearITPendingBit()]] → 卡在中断里出不来
3. TIM2 挂在 APB1 却写了 [[RCC_APB2PeriphClockCmd]] → 不工作
`},
]
},
{
p:'6-2', short:'定时器外部时钟',
link:'https://www.bilibili.com/video/BV1th411z7sn?p=14',
items:[
 {id:'c62a', no:'1', t:'定时器外部时钟（ETR）',
  body:`
前面用的是**内部时钟**（RCC 提供的 72MHz）。定时器还可以用**外部时钟源**，
这就是 [6-2] 的第二个例程。

**外部时钟的几个来源（见课件 P57 的框图）：**

| 来源 | 说明 |
|---|---|
| **ETR**（External Trigger） | 从外部引脚输入脉冲，**每个脉冲计一个数** |
| ITRx | 来自其他定时器的输出（定时器级联） |
| TIx | 来自捕获通道的输入 |
| 内部时钟 | RCC 提供的默认时钟 |

[h3] 配置外部时钟的关键一句

\`\`\`
TIM_ETRClockMode2Config(TIM2,
                        TIM_ExtTRGPSC_OFF,      // 外部触发预分频：不分频
                        TIM_ExtTRGPolarity_NonInverted,  // 不反相
                        0x0F);                  // 滤波器
\`\`\`

这一句替换掉 [[TIM_InternalClockConfig(TIM2)]]。之后 ETR 引脚上每来一个脉冲，
CNT 就加 1，累计到 ARR 值就触发中断。

[h3] 典型用途

用对射式红外传感器接在 ETR 引脚上，**每挡一次光计一个数**——
这是硬件计数器，比用 EXTI 中断计数**精确得多**，而且**完全不占 CPU**。
因为中断方式是「每次边沿都要进一次中断函数」，而外部时钟是「硬件自己数，数够了再通知你」。

[ok] 这是理解「硬件外设替 CPU 干活」这个概念的第一个例子。
后面 [7-2] 的 ADC + DMA、[6-8] 的编码器接口，都是同一个思路。
`}
]
},
];

/*__TAIL__*/
/*__TAIL__*/
