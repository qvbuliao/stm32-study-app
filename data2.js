

/* ------------------------------------------------------------
   C 语言急救包（面向零基础）
   说明：正文统一使用 [[ ]] 表示行内代码、[[[ ]]] 表示代码块
   ------------------------------------------------------------ */
const CSURV = [
{open:true, t:'0. 没有 C 语言基础，今天你只需要看懂这些',
 body:`
先给你吃个定心丸：**STM32 入门阶段用到的 C 语言，只占 C 语言总量的 10% 左右**，
而且反复就那么几个套路。你不需要系统学完 C 语言再开始。

[h3] 一段真实的 STM32 代码，逐行翻译

\`\`\`
void LED_Init(void)                  // 定义一个函数，叫 LED_Init，没有返回值，没有参数
{                                    // 函数体从 { 开始
    GPIO_InitTypeDef GPIO_InitStructure;   // 声明一个变量，类型是 GPIO_InitTypeDef

    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);  // 调用别人写好的一函数，传两个参数

    GPIO_InitStructure.GPIO_Mode  = GPIO_Mode_Out_PP;      // 给变量的成员赋值
    GPIO_InitStructure.GPIO_Pin   = GPIO_Pin_1;
    GPIO_Init(GPIOA, &GPIO_InitStructure);                 // 调用函数，第二个参数是"地址"
}                                    // 函数体到 } 结束

int main(void)                       // 主函数，程序从这里开始跑
{
    LED_Init();                      // 调用上面那个函数
    while (1)                        // 死循环，条件 1 永远为真
    {
        GPIO_ResetBits(GPIOA, GPIO_Pin_1);
        Delay_ms(500);
        GPIO_SetBits(GPIOA, GPIO_Pin_1);
        Delay_ms(500);
    }
}
\`\`\`

看到没有——**整段代码里你真正要"理解"的，只有下面 6 个概念**。

[h3] 概念 1：函数 —— 一段可重复使用的代码

[[函数]]的基本形状：[[return类型 函数名(参数列表) { 代码 }]]

- 用**别人写好的**函数：[[GPIO_SetBits(GPIOA, GPIO_Pin_1);]] 直接调，括号里的东西叫参数
- 写**自己的**函数：[[void LED_Init(void)]] ，[[void]] 意思是"没有返回值"，[[(void)]] 意思是"没有参数"
- 函数名自己起，但**别人写好的函数名一个字母都不能改**

[h3] 概念 2：变量与类型 —— 数据的容器

[[uint16_t count = 0;   // 声明一个 16 位无符号整数，初值 0]]

- [[uint16_t]] 是类型，[[count]] 是变量名，[[= 0]] 是初始值
- 变量必须先**声明**（告诉编译器它是谁）再**使用**
- 声明在函数里面 = 局部变量（只有这个函数能用）
- 声明在所有函数外面 = 全局变量（所有函数都能用，**中断函数里改的变量必须是全局的**）

[h3] 概念 3：语句与分号

**每一条语句结尾必须有分号 [[;]]**。少一个分号是新手最高频的报错，
报错信息还常常指向下一行，让你找不到真正的位置。

[h3] 概念 4：{} 花括号 —— 把多条语句打包

\`\`\`
if (条件) {
    语句1;      // 这些语句属于 if
    语句2;
}
\`\`\`

\`\`\`
while (1) {
    语句1;      // 这些语句会被无限重复
}
\`\`\`

[h3] 概念 5：注释 —— 给人看的，编译器忽略

\`\`\`
// 这是单行注释，只在这一行有效
/* 这是
   多行注释 */
\`\`\`

[ok] **强烈建议：** 从今天开始，每写一段代码就写一行注释说明它在干什么。
三个月后你会感谢现在的自己。

[h3] 概念 6：库函数调用 = 拼积木

STM32 的编程方式，本质是「**把官方写好的函数按顺序排列起来**」。
所以入门阶段最重要的能力不是"写代码"，而是"**查手册、抄对函数名、填对参数**"。

下面 8 节把你会遇到的语法一次讲完。**今天只需要读到第 6 节，剩下的用到再回来看。**
`
},
{open:true, t:'1. 数据类型与 u8 / u16 / u32',
 body:`
课件 P32 的表，翻译成人话：

| 关键字 | 位数 | 表示范围 | stdint 写法 | ST 写法 | 什么时候用 |
|---|---|---|---|---|---|
| [[char]] | 8 | -128 ~ 127 | [[int8_t]] | [[s8]] | 很少用 |
| [[unsigned char]] | 8 | 0 ~ 255 | [[uint8_t]] | [[u8]] | **0~255 的小数字** |
| [[short]] | 16 | -32768 ~ 32767 | [[int16_t]] | [[s16]] | 有符号 16 位 |
| [[unsigned short]] | 16 | 0 ~ 65535 | [[uint16_t]] | [[u16]] | **GPIO 引脚掩码、计数** |
| [[int]] | 32 | -2147483648 ~ 2147483647 | [[int32_t]] | [[s32]] | 普通整数 |
| [[unsigned int]] | 32 | 0 ~ 4294967295 | [[uint32_t]] | [[u32]] | **寄存器值、大计数** |

**ST 官方库里的两套写法是等价的：**

\`\`\`
u8  a = 255;      // 就是 unsigned char，0~255
u16 b = 65535;    // 就是 unsigned short
u32 c = 0xFFFFFFFF;
uint8_t  d = 255; // 和 u8 完全一样
\`\`\`

[h3] 为什么需要"位数"这个概念

因为单片机里的数不是无穷大的。**8 位的变量装不下 256**：

\`\`\`
u8 i = 255;
i = i + 1;        // 结果不是 256，而是 0 ！这叫"溢出"
\`\`\`

这类 bug 极其隐蔽。常见场景：[[u8]] 类型的中断计数值，数到 255 就归零了，
你还在纳闷"为什么数到 255 就不涨了"。**计数变量建议直接用 [[u16]] 或 [[u32]]。**

[h3] 有符号与无符号

- [[unsigned]]（无符号）：只能表示 0 和正数，范围是 0 ~ 2^n - 1
- 不带 [[unsigned]]（有符号）：用最高位表示正负，所以正数范围减半，但能表示负数

**初学建议：数字类的变量一律先用 [[unsigned]] 开头**，除非你确定需要负数。

[h3] 十六进制的读法

STM32 里到处是 [[0x]] 开头的数字，这是十六进制：

- [[0x01]] = 1，[[0x0A]] = 10，[[0x10]] = 16，[[0x100]] = 256，[[0xFF]] = 255
- 规则：[[0x]] 后面每多一位，就是乘 16

为什么要用十六进制？因为它和二进制是 1 位对 4 位的整齐关系：
[[0xF]] = [[1111]]，[[0xFF]] = [[11111111]]。用十六进制写"哪些位是 1"特别直观，
这正是下面「位运算」一节要用的。
`},
{open:true, t:'2. 宏定义 #define —— 给数字起名字',
 body:`
**用途：用一个字符串代替一个数字**，便于理解、防止出错；也可以把经常出现的参数提取出来，方便统一修改。

\`\`\`
#define ABC 12345          // 定义：把 ABC 定义为 12345

int a = ABC;               // 引用：等效于 int a = 12345;
\`\`\`

**注意：[[#define]] 结尾没有分号！**（写了分号，分号也会被替换进去，这是经典坑）

[h3] 在 STM32 里你会看到它无处不在

\`\`\`
#define GPIO_Pin_0    ((uint16_t)0x0001)   // 官方库里的定义
#define RCC_APB2Periph_GPIOA  ((uint32_t)0x00000004)
\`\`\`

所以你写 [[GPIO_Pin_0]] 的时候，编译器看到的其实是 [[0x0001]]。
**这就解释了为什么 [[GPIO_Pin_0 | GPIO_Pin_1]] 能同时选中两个引脚**——
它们分别是 [[0x0001]] 和 [[0x0002]]，按位或起来就是 [[0x0003]]，第 0 位和第 1 位都是 1。

[h3] 自己定义宏的三个典型场景

\`\`\`
#define LED_GPIO_PORT   GPIOA       // 万一改板子，只改这一行
#define LED_GPIO_PIN    GPIO_Pin_1
#define DELAY_TIME      500         // 想调节奏，只改这一行

GPIO_ResetBits(LED_GPIO_PORT, LED_GPIO_PIN);
\`\`\`

[ok] **这是"好代码"和"能跑的代码"的区别。** 视频里教的例程常常直接把 [[GPIOA]] 写死，
你自己写的时候改成宏，之后换板子会轻松很多。
`},
{open:true, t:'3. typedef —— 给类型起别名',
 body:`
**用途：把一个比较长的变量类型名换个短名字**，便于使用。

\`\`\`
typedef unsigned char uint8_t;    // 定义：给 unsigned char 起别名 uint8_t

uint8_t a;                        // 引用：等效于 unsigned char a;
\`\`\`

[h3] 在 STM32 里的实际用途：让结构体用起来更舒服

\`\`\`
typedef struct {
    uint16_t GPIO_Pin;
    GPIOSpeed_TypeDef GPIO_Speed;
    GPIOMode_TypeDef  GPIO_Mode;
} GPIO_InitTypeDef;
\`\`\`

有了 [[typedef]]，你就可以直接写 [[GPIO_InitTypeDef GPIO_InitStructure;]]，
而不用写 [[struct { ... } GPIO_InitStructure;]]。

[ok] 一句话记法：**[[typedef]] = 起外号。[[struct]] = 打包。** 官方库几乎全是这两者组合。
`},
{open:true, t:'4. ★ 结构体 struct —— 数据打包（今天必须懂）',
 body:`
**用途：把不同类型的数据打包成一个整体。**

\`\`\`
struct {
    char  x;
    int   y;
    float z;
} StructName;              // StructName 是变量名

StructName.x = 'A';        // 用 . 访问成员
StructName.y = 66;
StructName.z = 1.23;
\`\`\`

[h3] ★ 这在 STM32 里为什么如此重要

因为 STM32 的库函数采用了「**先填表，再交货**」的编程风格：

\`\`\`
GPIO_InitTypeDef GPIO_InitStructure;                // 1. 拿来一张空表

GPIO_InitStructure.GPIO_Pin   = GPIO_Pin_1;         // 2. 逐项填写
GPIO_InitStructure.GPIO_Mode  = GPIO_Mode_Out_PP;
GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;

GPIO_Init(GPIOA, &GPIO_InitStructure);              // 3. 把整张表交给库函数
\`\`\`

**这就是 STM32 编程最核心的套路，没有之一。** 后面你学 EXTI、TIM、NVIC、USART……全都是这个模式：

| 外设 | 结构体类型 | 初始化函数 |
|---|---|---|
| GPIO | [[GPIO_InitTypeDef]] | [[GPIO_Init()]] |
| EXTI | [[EXTI_InitTypeDef]] | [[EXTI_Init()]] |
| NVIC | [[NVIC_InitTypeDef]] | [[NVIC_Init()]] |
| TIM | [[TIM_TimeBaseInitTypeDef]] | [[TIM_TimeBaseInit()]] |
| 串口 | [[USART_InitTypeDef]] | [[USART_Init()]] |

看明白这个表，你就懂了 STM32 库函数的结构。

[h3] 为什么成员的名字这么长（GPIO_InitStructure.GPIO_Pin）

因为 Keil 有**代码补全**：你打 [[GPIO_InitStructure.]] 就会弹出所有成员名让你选。
**用补全，不要背。** 视频里老师也是这么敲的。

[h3] [[.]] 和 [[->]] 的区别

\`\`\`
StructName.x = 'A';          // 直接用变量名，用 .
pStructName->x = 'A';        // 用指针变量（地址），用 ->
\`\`\`

新手阶段你只需要知道：**看到 [[->]] 说明左边是一个地址（指针）**。
`},
{open:true, t:'5. 枚举 enum —— 起名字的整数',
 body:`
**用途：定义一个取值受限制的整型变量**，也是宏定义的集合。

\`\`\`
enum { FALSE = 0, TRUE = 1 } EnumName;

EnumName = FALSE;      // 取值只能是 FALSE 或 TRUE
\`\`\`

[h3] 在 STM32 里的例子

\`\`\`
typedef enum { DISABLE = 0, ENABLE = !DISABLE } FunctionalState;
\`\`\`

所以你写 [[RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);]] 里的 [[ENABLE]]，
本质上就是数字 1。写成 [[ENABLE]] 而不是 [[1]]，是为了让代码能读懂。

[h3] 库函数参数里的那些「_Type」是什么

\`\`\`
GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;   // GPIO_Mode_Out_PP 是一个枚举值
EXTI_InitStructure.EXTI_Trigger = EXTI_Trigger_Falling;
TIM_TimeBaseInitStructure.TIM_CounterMode = TIM_CounterMode_Up;
\`\`\`

它们都是**枚举常量**，每个都对应一个数字。你不需要知道数字是多少，
只需要知道**用哪个**——这就是查速查表的意义。

[warn] 填错枚举值编译器会报错（这是好事，说明编译器帮你检查了）；
但如果填了一个**语法正确但语义错误**的值（比如该用 Falling 用了 Rising），编译器不会报错，
现象是"中断不触发"。所以**速查表要对着看，别凭记忆。**
`},
{open:true, t:'6. 数组、for 循环、if、while',
 body:`
[h3] 数组 —— 一次存放多个同类型的值

\`\`\`
uint16_t pins[8] = {GPIO_Pin_0, GPIO_Pin_1, GPIO_Pin_2, GPIO_Pin_3,
                    GPIO_Pin_4, GPIO_Pin_5, GPIO_Pin_6, GPIO_Pin_7};

pins[0]   // 第一个元素（下标从 0 开始，不是 1！）
pins[7]   // 第八个元素
pins[-1]  // 错误！会读到乱七八糟的内存
pins[8]   // 错误！越界，数组只有 8 个元素
\`\`\`

[h3] for 循环 —— 重复做 n 次

\`\`\`
uint8_t i;
for (i = 0; i < 8; i++)     // i 从 0 开始；i 小于 8 就继续；每轮 i 加 1
{
    GPIO_ResetBits(GPIOA, pins[i]);   // i 依次取 0,1,2,...,7
    Delay_ms(200);
}
\`\`\`

**拆解：** [[for (初始化; 继续条件; 每轮之后执行)]]。三部分都懂，for 循环就懂了。

[h3] if —— 判断

\`\`\`
if (key == 0)              // 注意：判断相等是两个等号！
{
    LED_Toggle();
}
else if (key == 1)
{
    LED_Off();
}
else
{
    LED_On();
}
\`\`\`

[bad] **[[=]] 是赋值，[[==]] 是判断相等。** 写成 [[if (key = 0)]] 编译器可能只给个警告或完全不报错，
然后你的判断永远不成立——这是 C 语言最著名的坑。

[h3] while —— 条件成立就一直重复

\`\`\`
while (1)                        // 死循环：主程序的标准结尾
{
}

while (GPIO_ReadInputDataBit(GPIOB, GPIO_Pin_1) == 0);   // 等待松手：注意结尾的分号
\`\`\`

第二种写法在按键消抖里非常常用：**程序停在这里循环，直到按键松开为止**。
`},
{open:false, t:'7. ★ 指针 —— 只需要懂一个符号：&',
 body:`
提到指针大家就害怕。但在 STM32 入门阶段，**你只需要理解一件事**：

\`\`\`
GPIO_Init(GPIOA, &GPIO_InitStructure);
//              ↑ 这个 & 是什么？
\`\`\`

[h3] & 是「取地址」

- 变量 [[GPIO_InitStructure]] 是一个**盒子**，里面装着你的配置
- [[&GPIO_InitStructure]] 是这个盒子的**门牌号（地址）**
- 库函数 [[GPIO_Init()]] 需要的是**门牌号**，而不是盒子本身

**为什么？** 因为结构体很大（好几个字段），如果整个复制一份传进去，浪费内存和时间。
传地址的话，函数可以直接去那个地址读数据，效率高。

[h3] 记忆规则

| 你看到的写法 | 意思 | 什么时候用 |
|---|---|---|
| [[GPIOA]] | 端口名，本身就是一个地址 | 所有 GPIO 函数第一个参数 |
| [[&变量]] | 取这个变量的地址 | 所有 [[xxx_Init()]] 的第二个参数 |
| [[*指针]] | 取这个地址里存的值 | 读寄存器（[15-1] 会学到） |

[h3] 记住这一条就够了

\`\`\`
GPIO_Init(GPIOA, &GPIO_InitStructure);        // 结构体 → 要加 &
GPIO_SetBits(GPIOA, GPIO_Pin_1);              // 普通数字 → 不加 &
USART_Init(USART1, &USART_InitStructure);     // 结构体 → 要加 &
TIM_TimeBaseInit(TIM2, &TIM_TimeBaseInitStructure);
\`\`\`

**规律：参数是结构体变量，就加 [[&]]；参数是数字或常量，就不加。**
初期忘了加 [[&]]，编译器会报「参数类型不兼容」，照着提示加上就行。
`},
{open:false, t:'8. ★ 位运算 —— GPIO_Pin_0 | GPIO_Pin_1 什么意思',
 body:`
STM32 里到处是 [[|]]、[[&]]、[[~]]、[[<<]]，它们都是**位运算**，也就是"按二进制位一个一个地算"。

[h3] 四个运算符

| 运算符 | 名称 | 作用 |
|---|---|---|
| [[\\|]] | 按位或 | 两个位里**有一个是 1**，结果就是 1。用来**置位** |
| [[&]] | 按位与 | 两个位**都是 1**，结果才是 1。用来**取值/清零** |
| [[~]] | 按位取反 | 1 变 0，0 变 1。用来**构造掩码** |
| [[<<]] | 左移 | 整体向左挪 n 位。用来**构造位掩码** |

[h3] 理解 [[GPIO_Pin_0 | GPIO_Pin_1]]

\`\`\`
GPIO_Pin_0 = 0x0001 = 0000 0000 0000 0001
GPIO_Pin_1 = 0x0002 = 0000 0000 0000 0010
                     按位或 ↓
             0x0003 = 0000 0000 0000 0011   ← 第 0 位和第 1 位都是 1
\`\`\`

所以 [[GPIO_Pin_0 | GPIO_Pin_1]] 表示"同时操作 PA0 和 PA1"。
**这就是为什么 GPIO_Pin_x 的定义必须是 0x0001、0x0002、0x0004…… 每个引脚占一个二进制位。**

[h3] 典型用法

\`\`\`
// 同时开两个时钟（GPIOB 和 AFIO）
RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB | RCC_APB2Periph_AFIO, ENABLE);

// 左移构造位掩码：1 << 3 = 0x0008 = 第 3 位是 1
uint16_t mask = 1 << 3;

// 用 & 判断某一位是不是 1
if (GPIO_ReadInputData(GPIOB) & GPIO_Pin_1) { /* PB1 是高电平 */ }
\`\`\`

[h3] 后面才会用到的两个复合运算符（先认识一下）

\`\`\`
reg |= 0x01;    // 等效于 reg = reg | 0x01;   置位（把某位置 1）
reg &= ~0x01;   // 等效于 reg = reg & (~0x01); 清零（把某位置 0）
\`\`\`

[ok] 为什么用这种写法？因为**直接改寄存器时，你只想改其中一位，不想影响其他位**。
这种"读—改—写"的位操作在整个嵌入式开发里随处可见，[15-1] 学 FLASH 时会大量出现。
`},
{open:false, t:'9. .h 和 .c 文件的关系',
 body:`
这是新手最困惑的问题之一：为什么每个外设都有两个文件？

| 文件 | 放什么 | 谁来用 |
|---|---|---|
| [[xxx.h]]（头文件） | **声明**：函数长什么样（名字、参数、返回值）、类型定义、宏定义 | 给别人 [[#include]] 用 |
| [[xxx.c]]（源文件） | **定义**：函数具体怎么实现的代码 | 被编译成机器码 |

[h3] 为什么要分开

假设没有头文件：你想用 [[GPIO_SetBits()]]，就得先自己写一遍 [[void GPIO_SetBits(...);]] 告诉编译器它存在。
有了 [[stm32f10x_gpio.h]]，你只要 [[#include "stm32f10x_gpio.h"]] 就全都有了。

[h3] 你自己的代码也应该这样组织

\`\`\`
// LED.h
#ifndef __LED_H                 // 防止重复包含（固定套路，照抄）
#define __LED_H
#include "stm32f10x.h"          // 用到 uint16_t 等类型，所以要包含
void LED_Init(void);            // 函数声明，以分号结尾
#endif

// LED.c
#include "LED.h"
void LED_Init(void)             // 函数定义，没有分号，后面直接跟函数体
{
    // 具体代码
}

// main.c
#include "LED.h"                // 包含头文件后就能用 LED_Init()
int main(void) { LED_Init(); while(1){} }
\`\`\`

[ok] 这就是视频里老师组织代码的方式：**每个模块一个 [[.h]] + 一个 [[.c]]**。
你在 [2-2] 建好的工程模板里，[[User]] 文件夹就是放这些文件的地方。
`},
{open:false, t:'10. 常见编译报错的中文对照表',
 body:`
Keil 的报错是英文的，新手看到一屏红字就慌了。其实**90% 的报错就这几种**：

| 报错关键词 | 真实原因 | 怎么修 |
|---|---|---|
| [[error: #5: cannot open source input file "xxx.h"]] | 找不到头文件 | Include Paths 里没加这个文件夹 |
| [[undefined symbol GPIO_Init]] (L6218E) | 函数找不到实现 | 对应的 [[.c]] 文件没加到工程分组里 |
| [[error: #20: identifier "xxx" is undefined]] | 变量或类型没有声明 | 拼错了，或者没 [[#include]] 对应头文件 |
| [[expected a ";"]] | 上一行少了分号 | 看**报错的上一行** |
| [[error: #147: declaration is incompatible]] | 参数类型不对 | 常见原因：结构体忘了加 [[&]] |
| [[warning: #223-D: function "xxx" declared implicitly]] | 用了未声明的函数 | 忘了 [[#include]] 头文件，**警告也要修，别忽略** |
| [[Error: Flash Download failed - "Cortex-M3"]] | 烧录失败 | 检查 ST-Link 接线、Debug 设置、芯片读保护 |

[h3] 排查顺序（照这个顺序走，能解决 95% 的问题）

1. **看第一个 error，不看最后一个。** 后面的报错往往是被第一个带出来的连锁反应
2. 报错行号如果是 [[main.c]] 里面的，看**这一行和上一行**
3. 如果是 [[.c]] 文件报 undefined，去工程左侧看**这个文件有没有被加进分组**
4. 全都不对，就回到 [2-2] 那六步，检查 Include Paths 和 Define

[warn] **一条铁律：先让"昨天能跑的代码"编译通过，再开始写今天的新代码。**
很多时间是被"改坏了回不去"浪费掉的。这也是为什么 Day 1 要你先建好一个**空模板**。
`}
];

/* ------------------------------------------------------------
   速查表
   ------------------------------------------------------------ */
const REF = [
{open:true, t:'★ 库函数通用套路（所有外设都长这样）',
 body:`
记住这五步，STM32 里任何一个外设的配置你都能看懂：

\`\`\`
1. 开时钟       RCC_APBxPeriphClockCmd(RCC_APBxPeriph_xxx, ENABLE);
2. 填结构体     xxx_InitTypeDef xxx_InitStructure;
                xxx_InitStructure.成员 = 值;
3. 初始化       xxx_Init(xxx, &xxx_InitStructure);
4. 配 NVIC      NVIC_InitTypeDef + NVIC_Init()      （需要中断时）
5. 使能         xxx_Cmd(xxx, ENABLE);               （定时器、串口等）
\`\`\`

[h3] 可复制的最小骨架

\`\`\`
#include "stm32f10x.h"

void My_Init(void)
{
    GPIO_InitTypeDef  GPIO_InitStructure;      // 需要几个就定义几个
    EXTI_InitTypeDef  EXTI_InitStructure;
    NVIC_InitTypeDef  NVIC_InitStructure;

    // 1. 开时钟
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB | RCC_APB2Periph_AFIO, ENABLE);

    // 2. 配置 GPIO
    GPIO_InitStructure.GPIO_Pin   = GPIO_Pin_14;
    GPIO_InitStructure.GPIO_Mode  = GPIO_Mode_IPU;
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOB, &GPIO_InitStructure);
}

int main(void)
{
    My_Init();
    while (1)
    {
    }
}
\`\`\`
`
},
{open:false, t:'GPIO 库函数速查',
 body:`
[h3] 开时钟（最容易忘）

\`\`\`
RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);   // A/B/C 和 AFIO 都在 APB2
RCC_APB2PeriphClockCmd(RCC_APB2Periph_AFIO,  ENABLE);   // 用 EXTI 时必须开
\`\`\`

[h3] 输出相关

| 函数 | 作用 |
|---|---|
| [[GPIO_SetBits(GPIOx, pin)]] | 引脚置 1（高电平） |
| [[GPIO_ResetBits(GPIOx, pin)]] | 引脚置 0（低电平） |
| [[GPIO_WriteBit(GPIOx, pin, Bit_SET/Bit_RESET)]] | 用一个函数搞定上面两个 |
| [[GPIO_Write(GPIOx, 0x0001)]] | 一次写整个端口 16 位 |
| [[GPIO_SetBits(GPIOA, GPIO_Pin_0 \\| GPIO_Pin_1)]] | 一次操作多个引脚 |

[h3] 输入相关

| 函数 | 作用 |
|---|---|
| [[GPIO_ReadInputDataBit(GPIOx, pin)]] | **读引脚真实电平**，返回 0 或 1 |
| [[GPIO_ReadInputData(GPIOx)]] | 读整个端口 16 位 |
| [[GPIO_ReadOutputDataBit(GPIOx, pin)]] | 读输出寄存器的值（不是引脚电平） |

[h3] 模式枚举值

| 枚举值 | 含义 |
|---|---|
| [[GPIO_Mode_AIN]] | 模拟输入（ADC 用） |
| [[GPIO_Mode_IN_FLOATING]] | 浮空输入 |
| [[GPIO_Mode_IPD]] | 下拉输入 |
| [[GPIO_Mode_IPU]] | **上拉输入（按键）** |
| [[GPIO_Mode_Out_OD]] | 开漏输出 |
| [[GPIO_Mode_Out_PP]] | **推挽输出（LED）** |
| [[GPIO_Mode_AF_OD]] | 复用开漏（I2C 用） |
| [[GPIO_Mode_AF_PP]] | **复用推挽（PWM / 串口 / SPI）** |

速度枚举：[[GPIO_Speed_10MHz]]、[[GPIO_Speed_2MHz]]、[[GPIO_Speed_50MHz]]
`
},
{open:false, t:'EXTI / NVIC 速查 + 中断通道对照表',
 body:`
[h3] EXTI 配置五要素

\`\`\`
RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB | RCC_APB2Periph_AFIO, ENABLE); // 别忘了 AFIO
GPIO_EXTILineConfig(GPIO_PortSourceGPIOB, GPIO_PinSource14);               // 引脚 → EXTI 线

EXTI_InitStructure.EXTI_Line    = EXTI_Line14;
EXTI_InitStructure.EXTI_Mode    = EXTI_Mode_Interrupt;    // Interrupt 中断 / Event 事件
EXTI_InitStructure.EXTI_Trigger = EXTI_Trigger_Falling;   // Rising/Falling/Rising_Falling
EXTI_InitStructure.EXTI_LineCmd = ENABLE;
EXTI_Init(&EXTI_InitStructure);
\`\`\`

[h3] 触发方式

| 枚举值 | 含义 | 典型场景 |
|---|---|---|
| [[EXTI_Trigger_Rising]] | 上升沿（低→高） | 按键松手 |
| [[EXTI_Trigger_Falling]] | 下降沿（高→低） | **按键按下、传感器遮挡** |
| [[EXTI_Trigger_Rising_Falling]] | 双边沿 | 编码器 A/B 相 |

[h3] ★ 中断通道号与中断函数名对照（最容易写错）

| EXTI 线路 | NVIC 通道枚举 | 中断函数名 |
|---|---|---|
| Line0 | [[EXTI0_IRQn]] | [[EXTI0_IRQHandler()]] |
| Line1 | [[EXTI1_IRQn]] | [[EXTI1_IRQHandler()]] |
| Line2 | [[EXTI2_IRQn]] | [[EXTI2_IRQHandler()]] |
| Line3 | [[EXTI3_IRQn]] | [[EXTI3_IRQHandler()]] |
| Line4 | [[EXTI4_IRQn]] | [[EXTI4_IRQHandler()]] |
| Line5~9 | [[EXTI9_5_IRQn]] | [[EXTI9_5_IRQHandler()]] |
| **Line10~15** | **[[EXTI15_10_IRQn]]** | **[[EXTI15_10_IRQHandler()]]** |

[warn] **没有 [[EXTI14_IRQn]] 这个东西！** 线路 10~15 共用一个通道。
写了不存在的函数名，代码不报错但中断永远不触发。

[h3] 中断函数标准写法

\`\`\`
void EXTI15_10_IRQHandler(void)
{
    if (EXTI_GetITStatus(EXTI_Line14) == SET)     // 判断具体是哪条线
    {
        // 干活

        EXTI_ClearITPendingBit(EXTI_Line14);      // ★ 必须清除标志
    }
}
\`\`\`

[h3] NVIC 优先级

\`\`\`
NVIC_PriorityGroupConfig(NVIC_PriorityGroup_2);   // 工程里设置一次即可

NVIC_InitStructure.NVIC_IRQChannel = EXTI15_10_IRQn;
NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 1;   // 抢占优先级
NVIC_InitStructure.NVIC_IRQChannelSubPriority        = 1;   // 响应优先级
NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE;
NVIC_Init(&NVIC_InitStructure);
\`\`\`

| 分组 | 抢占优先级范围 | 响应优先级范围 |
|---|---|---|
| Group_0 | 无 | 0~15 |
| Group_1 | 0~1 | 0~7 |
| **Group_2** | **0~3** | **0~3** |
| Group_3 | 0~7 | 0~1 |
| Group_4 | 0~15 | 无 |

**优先级数字越小 = 优先级越高。**
`
},
{open:false, t:'TIM 定时器速查 + 参数计算',
 body:`
[h3] 时钟与总线

\`\`\`
RCC_APB2PeriphClockCmd(RCC_APB2Periph_TIM1, ENABLE);   // TIM1 在 APB2
RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM2, ENABLE);   // TIM2/3/4 在 APB1
\`\`\`

[h3] 时基单元配置

\`\`\`
TIM_InternalClockConfig(TIM2);                                  // 内部时钟（默认）
TIM_TimeBaseInitStructure.TIM_ClockDivision     = TIM_CKD_DIV1;
TIM_TimeBaseInitStructure.TIM_CounterMode       = TIM_CounterMode_Up;
TIM_TimeBaseInitStructure.TIM_Period            = 10000 - 1;    // ARR
TIM_TimeBaseInitStructure.TIM_Prescaler         = 7200  - 1;    // PSC
TIM_TimeBaseInitStructure.TIM_RepetitionCounter = 0;
TIM_TimeBaseInit(TIM2, &TIM_TimeBaseInitStructure);

TIM_ClearFlag(TIM2, TIM_FLAG_Update);          // 清掉初始化时的更新标志
TIM_ITConfig(TIM2, TIM_IT_Update, ENABLE);     // 使能更新中断
TIM_Cmd(TIM2, ENABLE);                         // ★ 启动定时器
\`\`\`

[h3] ★ 频率公式

\`\`\`
中断频率 = 72,000,000 / (PSC + 1) / (ARR + 1)      // TIM2~TIM4 输入时钟 72MHz
定时时间 = 1 / 中断频率
\`\`\`

[h3] 常用参数对照

| 想要的周期 | PSC | ARR | 中断频率 |
|---|---|---|---|
| 1 秒 | 7200-1 (7199) | 10000-1 (9999) | 1 Hz |
| 0.5 秒 | 7200-1 | 5000-1 | 2 Hz |
| 0.1 秒 | 7200-1 | 1000-1 | 10 Hz |
| 1 毫秒 | 72-1 | 1000-1 | 1000 Hz |
| 10 微秒 | 72-1 | 10-1 | 100 kHz |

**推导方法：先把 72000000 拆成 7200 × 10000，7200 给 PSC，剩下的给 ARR。**

[h3] 外部时钟（ETR）

\`\`\`
TIM_ETRClockMode2Config(TIM2, TIM_ExtTRGPSC_OFF,
                        TIM_ExtTRGPolarity_NonInverted, 0x0F);
// 替代 TIM_InternalClockConfig()，之后 ETR 引脚每来一个脉冲 CNT 加 1
\`\`\`

[h3] 中断函数

\`\`\`
void TIM2_IRQHandler(void)
{
    if (TIM_GetITStatus(TIM2, TIM_IT_Update) == SET)
    {
        // 干活
        TIM_ClearITPendingBit(TIM2, TIM_IT_Update);   // ★ 必须清
    }
}
\`\`\`
`
},
{open:false, t:'引脚 / 总线归属 / 硬件接线速查',
 body:`
[h3] STM32F103C8T6 关键资源

| 项目 | 内容 |
|---|---|
| 内核 | ARM Cortex-M3，72MHz |
| RAM | 20K SRAM |
| ROM | 64K Flash |
| 封装 | LQFP48 |
| GPIO | GPIOA、GPIOB、GPIOC（PC13/14/15 可用） |
| 定时器 | TIM1（高级）、TIM2/3/4（通用） |
| USART | USART1、USART2、USART3 |
| ADC | ADC1、ADC2，10 个外部通道 |
| I2C / SPI | I2C1、I2C2 / SPI1、SPI2 |

[h3] 总线归属（开时钟别搞错）

| 总线 | 定时器/外设 |
|---|---|
| **APB2** | GPIOA/B/C、AFIO、**TIM1**、ADC1、USART1、SPI1、EXTI |
| **APB1** | **TIM2/3/4**、USART2/3、I2C1/2、SPI2、PWR、BKP |

[h3] 核心板常用引脚（以 E 盘原理图为准）

| 引脚 | 常见用途 |
|---|---|
| PC13 | 板载 LED（低电平点亮） |
| PA0~PA7 | 通用 IO，常接 LED / 按键 / 传感器 |
| PA9 / PA10 | USART1 TX / RX（接 CH340 就能连电脑） |
| PB0~PB15 | 通用 IO |
| SWDIO / SWCLK | 接 ST-Link V2 的 PA13 / PA14 |

[h3] ST-Link V2 接线（四根线）

\`\`\`
ST-Link          STM32 核心板
3.3V  ────────  3V3
GND   ────────  GND
SWDIO ────────  PA13 (SWDIO)
SWCLK ────────  PA14 (SWCLK)
\`\`\`

[h3] 接线注意

- LED：核心板 LED 常接在 3.3V → 电阻 → LED → 引脚，所以**低电平点亮**
- 按键：一端接引脚，一端接 GND → 用**上拉输入**
- 传感器 DO：直接接普通 GPIO 输入
- 蜂鸣器：注意模块是**高电平触发还是低电平触发**
`
},
{open:false, t:'E 盘资料索引（配合本课程使用）',
 body:`
你 E 盘里的模块资料和这个教程的章节几乎一一对应：

| 视频章节 | E 盘文件夹 |
|---|---|
| [2-1] 软件安装 | [[2-STLINK下载器\\ST-LINK+V2使用说明.pdf]] |
| [3-1] [3-2] 点灯 | [[1-STM32F103C8T6核心板\\核心板测试程序(PC13闪烁)]] |
| [3-4] 光敏传感器 | [[4-光敏电阻传感器]] |
| [4-2] OLED | [[8-OLED显示屏\\中景园电子0.96OLED显示屏测试程序]] |
| [5-2] 对射式红外 | [[7-对射式红外传感器]] |
| [5-2] 旋转编码器 | [[11-旋转编码器\\旋转编码器模块使用说明.png]] |
| [6-4] 舵机 / 电机 | [[10-SG90舵机]]、[[9-TB6612电机驱动]] |
| [10-*] MPU6050 | [[13-MPU6050 陀螺仪加速度计]] |
| [11-*] W25Q64 | [[14-W25QXX Flash闪存]] |
| 串口调试 | [[12-CH340 USB转串口\\CH340G模块驱动\\CH341SER.EXE]] |

根目录：[[E:\\BaiduNetdiskDownload\\模块资料]]

[ok] **重要：** [[12-CH340 USB转串口]] 里的 CH340 驱动建议**提前装好**。
到 [9-*] 学串口时你会需要它，那时再折腾驱动会影响心情。
`
}
];

/* ------------------------------------------------------------
   自测题库（30 题，覆盖 [2-2] ~ [6-2]）
   ------------------------------------------------------------ */
const QUIZ = [
// ——— Day 1 [2-2] ———
{q:'芯片复位后，启动文件（startup_stm32f10x_md.s）首先调用的是哪个函数？',
 o:['main()','SystemInit()','GPIO_Init()','LED_Init()'], a:1,
 e:'正确顺序是：启动文件 → 调用 **SystemInit()**（配置时钟到 72MHz）→ 调用 **__main** → 调用 **main()**。所以 main 不是第一个跑的。'},
{q:'Keil 工程选项里的 Define 栏定义了 USE_STDPERIPH_DRIVER，它的作用是什么？',
 o:['告诉编译器使用 C99 标准','让 stm32f10x.h 包含 stm32f10x_conf.h，从而启用标准外设库',
   '声明芯片型号是 STM32F103','开启编译优化'], a:1,
 e:'这是给 [[stm32f10x.h]] 看的开关：只有定义了这个宏，它才会 [[#include "stm32f10x_conf.h"]]，库函数才会真正参与编译。'},
{q:'编译时报 undefined symbol GPIO_Init（L6218E），最可能的原因是什么？',
 o:['GPIO_Init 这个名字拼错了','stm32f10x_gpio.c 没有添加到工程分组里',
   '忘了开 GPIOA 的时钟','芯片型号选错了'], a:1,
 e:'Keil 只编译**你添加进工程的文件**。库文件在硬盘上放着但没加进工程，函数就没有实现，链接阶段就会报 undefined。'},
{q:'新建工程时，在 Include Paths 里声明 Start、Library、User 三个文件夹，是为了解决什么问题？',
 o:['缩小编译后文件体积','告诉编译器去哪里找 #include 的头文件',
   '加快编译速度','让烧录能成功'], a:1,
 e:'不填 Include Paths，编译时就会报 [[cannot open source input file "xxx.h"]]。'},
{q:'下面哪个文件是用来存放中断服务函数（如 EXTI0_IRQHandler）的？',
 o:['main.c','startup_stm32f10x_md.s','stm32f10x_it.c','system_stm32f10x.c'], a:2,
 e:'工程架构的惯例：[[main.c]] 放主程序，[[stm32f10x_it.c]] 放中断服务函数，[[system_stm32f10x.c]] 负责 SystemInit。'
},

// ——— Day 2 [3-1] [3-2] ———
{q:'调用 GPIO_Init() 之前必须先开时钟，根本原因是什么？',
 o:['不开时钟会编译报错','不开时钟 GPIO 引脚会被锁死',
   '不开时钟外设没有时钟驱动，寄存器写了也不工作，表现为"代码正确但没反应"','开时钟可以省电'], a:2,
 e:'这是 STM32 的一条铁律：**用任何外设之前先开它的时钟**。现象是代码看起来完全正确但不报错、没效果，最难排查。'},
{q:'核心板上的 LED 接法是 3.3V → 电阻 → LED → PA1，要让 LED 点亮，PA1 应该输出什么？',
 o:['高电平，用 GPIO_SetBits','低电平，用 GPIO_ResetBits','不用配置，接上就亮','输出方波'], a:1,
 e:'电流从 3.3V 经 LED 流向 PA1，只有 PA1 是**低电平（0V）**时两端才有电压差，LED 才亮。这是硬件决定的，看原理图确认。'},
{q:'推挽输出和开漏输出的本质区别是什么？',
 o:['推挽速度快，开漏速度慢','推挽能主动输出高、低两种电平；开漏只能拉低，高电平要靠外部上拉电阻',
   '开漏只能用于输入','两者完全相同'], a:1,
 e:'推挽 = 上下两个管子一推一挽，两种电平都能主动输出。开漏 = 只有下面那个管子，所以 I2C 需要外部上拉电阻。'},
{q:'有源蜂鸣器和无源蜂鸣器的区别是什么？',
 o:['有源的声音更大','有源内部自带振荡源，给直流电压就响且频率固定；无源必须由控制器提供振荡脉冲，频率可调',
   '无源的需要直流电','有源的必须用 PWM 驱动'], a:1,
 e:'无源蜂鸣器要靠 PWM 提供振荡脉冲，改频率就能改音调。所以它要等到 [6-4] 学 PWM 才能做。'},
{q:'GPIO_Pin_0 | GPIO_Pin_1 为什么能同时选中两个引脚？',
 o:['这是两个参数的简写','GPIO_Pin_x 的定义让每个引脚占一个二进制位（0x0001、0x0002…），按位或就选中了多个位',
   '这是 Keil 的特殊功能','它其实只选中了 GPIO_Pin_0'], a:1,
 e:'[[GPIO_Pin_0]] = 0x0001、[[GPIO_Pin_1]] = 0x0002，按位或得 0x0003，第 0、1 位都是 1。这就是位运算的实际用途。'},
{q:'GPIO_InitStructure.GPIO_Speed 设置的是 GPIO 的输出速度，它实际影响的是什么？',
 o:['LED 的亮度','引脚电平翻转的最大频率（信号上升/下降沿的快慢）','代码的执行速度','引脚的输出电压'], a:1,
 e:'它不是"引脚翻转的快慢"由 CPU 控制，而是**允许的最大翻转速率**，主要是为了抑制高速信号时的噪声，点灯用 50MHz 无所谓。'
},

// ——— Day 3 [3-3] [3-4] ———
{q:'按键一端接引脚、另一端接 GND，GPIO 应该配置成什么模式？',
 o:['浮空输入','上拉输入','下拉输入','推挽输出'], a:1,
 e:'按键接 GND 用**上拉输入**：松手时内部上拉电阻把引脚拉到高电平（读到 1），按下被拉到 GND（读到 0）。若按键接 3.3V 则用下拉输入。'},
{q:'机械按键的抖动时间大约是多久？',
 o:['约 1 微秒','约 5~20 毫秒','约 5 秒','不会抖动'], a:1,
 e:'机械弹簧片在通断瞬间会反复接触，抖动典型值 5~20ms（视频里讲 5~10ms）。软件消抖常延时 20ms。<br>记忆：**毫秒级**。'},
{q:'下面这段按键消抖代码里，哪一行是防止"按住不放时计数疯狂递增"的关键？'+
  '\\n```c\\nif (GPIO_ReadInputDataBit(GPIOB, GPIO_Pin_1) == 0) {\\n'
  +'    Delay_ms(20);\\n'
  +'    while (GPIO_ReadInputDataBit(GPIOB, GPIO_Pin_1) == 0);\\n'
  +'    Delay_ms(20);\\n'
  +'    KeyNum = 1;\\n}\\n```',
 o:['Delay_ms(20) 那一行','while (...) ; 等待松手那一行','KeyNum = 1; 那一行','if 判断那一行'], a:1,
 e:'[[while (...);]] 让程序**卡在那里等按键松开**。没有它，主循环每转一圈都认为"又按了一次"，计数就会疯狂递增。'},
{q:'要读取引脚上的**实际电平**，应该用哪个函数？',
 o:['GPIO_ReadOutputDataBit()','GPIO_ReadInputDataBit()','GPIO_SetBits()','GPIO_Write()'], a:1,
 e:'[[GPIO_ReadOutputData()]] 读的是**输出数据寄存器的值**（你写进去的），不是引脚真实电平。想读引脚只能用 [[GPIO_ReadInputDataBit()]]。'},
{q:'传感器模块上的 DO 和 AO 两个引脚，分别应该接到哪里？',
 o:['DO 接 ADC，AO 接普通 GPIO','DO 接普通 GPIO 输入（0/1），AO 接 ADC（连续电压量）',
   '两个都接 ADC','两个都接普通 GPIO'], a:1,
 e:'模块内部用电压比较器把模拟量二值化后从 **DO** 输出，所以 DO 直接当普通输入读即可；**AO** 是未经比较的模拟电压，要 [[7-1]] 学 ADC 才会用。'
},

// ——— Day 4 [4-1] [4-2] [5-1] ———
{q:'串口调试、显示屏调试、Keil 调试模式三种手段里，哪一种不需要连接电脑？',
 o:['串口调试','显示屏调试','Keil 调试模式','都需要电脑'], a:1,
 e:'显示屏调试把 OLED 直接接在单片机上，**脱离电脑**，现场就能看，所以是日常开发的首选。代价是屏幕小、信息量有限。'},
{q:'0.96 寸 OLED 模块（128×64）用 OLED_ShowString 显示字符时，行列号的范围是？',
 o:['行 1~8，列 1~32','行 1~4，列 1~16','行 0~63，列 0~127','行 1~16，列 1~4'], a:1,
 e:'128×64 的屏，每个字符占 8 列 × 16 行，所以最多 **4 行 × 16 列 = 64 个字符**。参数不是像素坐标，是字符行列号。'},
{q:'关于中断，下面说法正确的是？',
 o:['中断就是让程序一直重复执行某段代码','中断是：出现中断触发条件后，CPU 暂停主程序去处理中断程序，处理完返回原位置继续运行',
   '中断只能由按键触发','中断会结束主程序的运行'], a:1,
 e:'关键词：**暂停 → 处理 → 返回断点**。它不终止主程序，处理完还会回去继续跑。'},
{q:'NVIC 中，中断优先级的数值与优先级高低的关系是？',
 o:['数值越大优先级越高','数值越小优先级越高','没有关系','只有 0 有意义'], a:1,
 e:'这是最容易记反的一点：**数字越小的优先级越高**（0 是最高优先级）。'},
{q:'抢占优先级和响应优先级的区别是什么？',
 o:['两者作用相同','抢占优先级决定能不能打断正在执行的中断（形成嵌套）；响应优先级只在同时到来时决定排队顺序，不能打断',
   '响应优先级可以打断中断','抢占优先级只在没有中断执行时起作用'], a:1,
 e:'口诀：**抢占决定"插不插队"，响应决定"排队顺序"**。抢占优先级高的能打断正在执行的低抢占中断。'},
{q:'EXTI 中断服务函数里，为什么必须调用 EXTI_ClearITPendingBit() 清除标志位？',
 o:['为了让代码更整洁','不清除标志位，CPU 认为中断还在，会无限重复进入中断函数，程序卡死',
   '为了释放内存','为了重新使能时钟'], a:1,
 e:'这是新手"程序卡死"最常见的原因之一。中断处理完必须清标志，否则会立刻再次进入同一个中断。'},
{q:'PA0、PB0、PC0 这三个引脚做外部中断时，下面说法正确的是？',
 o:['可以各自独立触发三个中断','它们共用 EXTI0 线路，不能同时使用',
   '只能用 PA0','需要把 GPIO 时钟开三次'], a:1,
 e:'EXTI 按**引脚号**分组：所有 Port 的 Pin0 共用 EXTI0。所以配置 PB0 会覆盖 PA0 的配置。这是个很隐蔽的坑。'},
{q:'EXTI 线路 14 对应的 NVIC 中断通道和中断函数名是什么？',
 o:['EXTI14_IRQn / EXTI14_IRQHandler()','EXTI15_10_IRQn / EXTI15_10_IRQHandler()',
   'EXTI9_5_IRQn / EXTI9_5_IRQHandler()','EXTI_IRQn / EXTI_IRQHandler()'], a:1,
 e:'线路 10~15 **共用**一个通道 [[EXTI15_10_IRQn]]。写成 [[EXTI14_IRQn]] 不会报错，但中断永远不触发——这是极高频的踩坑点。'}
,

// ——— Day 5 [6-1] [6-2] ———
{q:'TIM2、TIM3、TIM4 挂在哪条总线上？开时钟要用哪个函数？',
 o:['APB2，RCC_APB2PeriphClockCmd','APB1，RCC_APB1PeriphClockCmd',
   'AHB，RCC_AHBPeriphClockCmd','不需要开时钟'], a:1,
 e:'TIM2/3/4 在 **APB1**，TIM1 在 APB2。写错总线会导致定时器完全不工作。',
 },
{q:'72MHz 时钟下，要让 TIM2 每 1 秒产生一次中断，PSC 和 ARR 应该填什么？',
 o:['PSC = 7200, ARR = 10000','PSC = 7199, ARR = 9999',
   'PSC = 72, ARR = 1000','PSC = 72000000, ARR = 1'], a:1,
 e:'公式：72,000,000 / (PSC+1) / (ARR+1) = 1，所以 (PSC+1)(ARR+1) = 72,000,000 = 7200 × 10000。**代码里要填减 1 后的值**，所以是 7199 和 9999。'},
{q:'为什么 PSC 和 ARR 填的值要减 1？',
 o:['为了留出余量','因为硬件设计上写 0 表示 1 分频，实际分频系数 = 寄存器值 + 1',
   '减 1 是 Keil 的要求','不减 1 会溢出'], a:1,
 e:'硬件规定：寄存器写 n 表示 (n+1) 分频。所以想得到 7200 分频，就要填 7199。搞错这个，定时时间会差一倍。'},
{q:'定时器中断的配置代码里，如果漏掉了 TIM_Cmd(TIM2, ENABLE) 会怎样？',
 o:['编译报错','定时器不启动，中断永远不会来','定时器会以默认参数运行','没有影响'], a:1,
 e:'这是新手漏得最多的三件事之一（另两件：忘了清中断标志、时钟开错总线）。配置完必须 [[TIM_Cmd(xxx, ENABLE)]] 启动。'},
{q:'用定时器外部时钟（ETR）对外部脉冲计数，相比用 EXTI 中断计数有什么优势？',
 o:['精度更低但代码简单','计数器由硬件自动完成，完全不占用 CPU；EXTI 方式是每个边沿都要进一次中断',
   'ETR 可以计数更大的值','两者没有区别'], a:1,
 e:'这就是"**硬件外设替 CPU 干活**"的思路。后面 [[7-2]] 的 ADC+DMA、[[6-8]] 的编码器接口都是同一个理念。'},
{q:'STM32F103 的定时器在 72MHz 下，用 16 位 PSC 和 16 位 ARR 能达到的最大定时时间大约是？',
 o:['约 1 秒','约 59.65 秒','约 65535 秒','没有上限'], a:1,
 e:'最大分频 = 65536 × 65536，在 72MHz 下约 **59.65 秒**。需要更长的时间，就要在中断里再累加计数。'}
];

/*__TAIL__*/
