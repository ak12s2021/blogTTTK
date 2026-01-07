---
title: "STM32-串口通信"
published: 2024-12-19
tags: []
category: "嵌入式STM32"
draft: false
---
<h1>串口通信</h1>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192135932.jpg" alt="a3e6cdd94ed49b187c214f5081d211c-20241017180818-mn3ybd2" />​</p>
<p>　　这是结构体</p>
<p>　　调用串口接收数据</p>
<p>　　‍</p>
<p>　　‍</p>
<p>　　‍</p>
<p>　　USARTRS</p>
<p>　　串口</p>
<p>　　TTL 只能在厘米之内</p>
<p>　　RS232 电平【+-12v】传输距离较远</p>
<p>　　RS485/422 用的是差分【距离长】1.5km</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192135245.png" alt="image-20241017181559-avk7swh" />​</p>
<p>　　串口初始化</p>
<p>　　什么是串口通信（一个结构体）--->面向对象</p>
<p>　　有三个部分；NVIC</p>
<p>　　‍</p>
<p>　　开机的输出、推挽式输出</p>
<p>　　浮空输入pc11</p>
<p>　　‍</p>
<p>　　‍</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192135308.png" alt="image-20241017182724-wyu8u0f" />​</p>
<p>　　PA9/10  数据1的发送/接收端</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192135621.png" alt="image-20241017182915-frp1u88" />​</p>
<p>　　‍</p>
<p>　　最基础就是GPIO</p>
<p>　　PA9：发送，tim1的ch3通道</p>
<p>　　PA10：接收，tim1的ch3通道</p>
<p>　　‍</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192135873.png" alt="image-20241017183355-ltts3km" />​</p>
<p>　　定义的3个结构体</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192135308.png" alt="image-20241017182724-wyu8u0f" />​</p>
<p>　　PA9/10  数据1的发送/接收端</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192135621.png" alt="image-20241017182915-frp1u88" />​</p>
<p>　　‍</p>
<p>　　最基础就是GPIO</p>
<p>　　PA9：发送，tim1的ch3通道</p>
<p>　　PA10：接收，tim1的ch3通道</p>
<p>　　‍</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192135873.png" alt="image-20241017183355-ltts3km" />​</p>
<p>　　定义的3个结构体</p>
<p>　　‍</p>
<p>　　定义了异步通信的结构体</p>
<pre><code class="language-c">typedef struct
{
  uint32_t USART_BaudRate;            /*!< This member configures the USART communication baud rate.
                                           The baud rate is computed using the following formula:
                                            - IntegerDivider = ((PCLKx) / (16 * (USART_InitStruct->USART_BaudRate)))
                                            - FractionalDivider = ((IntegerDivider - ((u32) IntegerDivider)) * 16) + 0.5 */

  uint16_t USART_WordLength;          /*!< Specifies the number of data bits transmitted or received in a frame.
                                           This parameter can be a value of @ref USART_Word_Length */

  uint16_t USART_StopBits;            /*!< Specifies the number of stop bits transmitted.
                                           This parameter can be a value of @ref USART_Stop_Bits */

  uint16_t USART_Parity;              /*!< Specifies the parity mode.
                                           This parameter can be a value of @ref USART_Parity
                                           @note When parity is enabled, the computed parity is inserted
                                                 at the MSB position of the transmitted data (9th bit when
                                                 the word length is set to 9 data bits; 8th bit when the
                                                 word length is set to 8 data bits). */
 
  uint16_t USART_Mode;                /*!< Specifies wether the Receive or Transmit mode is enabled or disabled.
                                           This parameter can be a value of @ref USART_Mode */

  uint16_t USART_HardwareFlowControl; /*!< Specifies wether the hardware flow control mode is enabled
                                           or disabled.
                                           This parameter can be a value of @ref USART_Hardware_Flow_Control */
} USART_InitTypeDef;

</code></pre>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192135111.png" alt="image-20241017184020-27i8t1d" />​</p>
<p>　　注意：</p>
<p>　　USART1在APB2总线上</p>
<p>　　USART2、3在APB1总线上</p>
<hr />
<p><img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192135429.png" alt="屏幕截图 2024-10-17 184200-20241017184251-h5jxc6b" />​</p>
<p>　　这样搜索通断号-37</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192135731.png" alt="image-20241017184318-w8eo5d5" />​</p>
<p>　　‍</p>
<p>　　‍</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192135970.png" alt="image-20241017184450-e4mokio" />​</p>
<p>　　这些都是外设库的，可以去查找</p>
<p>　　‍</p>
<p>　　​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192135204.png" alt="image-20241017184752-fq722i9" />在汇编里---->对应到37里</p>
<p>　　‍</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192135463.png" alt="image-20241017184948-skwz0mh" />​</p>
<p>　　把DR（数据寄存器）读出来</p>
<p>　　‍</p>
<p>​<img src="https://cbt567.oss-rg-china-mainland.aliyuncs.com/img/202412192135676.png" alt="image-20241017205412-zlnfjrf" />​</p>
<p>　　‍</p>
